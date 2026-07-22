// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";

interface IIndexOracle {
    function getPrice() external view returns (uint256);
}

/**
 * @title EnergyFutures
 * @notice Simplified perpetual futures on a resource index (kWh-style), GMX-lite MVP.
 * @dev Collateral and PnL settled in `quoteToken` (e.g. USDC). Max leverage 10x.
 *      Trading fee 0.1% on open/close notional. Funding exchanged every 8 hours.
 */
contract EnergyFutures is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    uint256 public constant FEE_BPS = 10; // 0.1%
    uint256 public constant BPS = 10_000;
    uint256 public constant MAX_LEVERAGE = 10;
    uint256 public constant FUNDING_INTERVAL = 8 hours;
    uint256 public constant MAINTENANCE_BPS = 500; // 5% of notional
    uint256 public constant MAX_FUNDING_BPS = 10; // 0.1% of notional per interval at full skew
    uint256 public constant MAX_MARGIN = 1_000_000 ether;
    uint256 public constant MAX_OPEN_INTEREST = 50_000_000 ether;

    IERC20 public quoteToken;
    IIndexOracle public oracle;
    address public treasury;

    uint256 public longOpenInterest;
    uint256 public shortOpenInterest;
    uint256 public lastFundingTime;
    /// @dev Cumulative funding index (1e18). Positive => longs pay shorts.
    int256 public fundingIndex;

    uint256 public totalLiquidity;
    uint256 public totalShares;
    mapping(address => uint256) public lpShares;

    struct Position {
        bool open;
        bool isLong;
        uint256 margin;
        uint256 size; // notional in quote units
        uint256 entryPrice; // 1e18
        int256 entryFundingIndex;
    }

    mapping(address => Position) public positions;
    uint256 public protocolFeesAccrued;

    event LiquidityAdded(address indexed provider, uint256 amount, uint256 shares);
    event LiquidityRemoved(address indexed provider, uint256 amount, uint256 shares);
    event PositionOpened(
        address indexed trader,
        bool isLong,
        uint256 margin,
        uint256 size,
        uint256 leverage,
        uint256 entryPrice,
        uint256 fee
    );
    event PositionClosed(
        address indexed trader,
        int256 pnl,
        uint256 fee,
        uint256 payout
    );
    event FundingSettled(int256 fundingIndex, uint256 longOI, uint256 shortOI, uint256 timestamp);
    event Liquidated(address indexed trader, address indexed liquidator, int256 pnl, uint256 fee);
    event TreasuryUpdated(address indexed treasury);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address owner_,
        address quoteToken_,
        address oracle_,
        address treasury_
    ) external initializer {
        require(
            owner_ != address(0) && quoteToken_ != address(0) && oracle_ != address(0) && treasury_ != address(0),
            "EnergyFutures: zero"
        );
        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();
        quoteToken = IERC20(quoteToken_);
        oracle = IIndexOracle(oracle_);
        treasury = treasury_;
        lastFundingTime = block.timestamp;
    }

    function setTreasury(address treasury_) external onlyOwner {
        require(treasury_ != address(0), "EnergyFutures: zero treasury");
        treasury = treasury_;
        emit TreasuryUpdated(treasury_);
    }

    function setOracle(address oracle_) external onlyOwner {
        require(oracle_ != address(0), "EnergyFutures: zero oracle");
        oracle = IIndexOracle(oracle_);
    }

    // -------------------------------------------------------------------------
    // Liquidity
    // -------------------------------------------------------------------------

    function addLiquidity(uint256 amount) external whenNotPaused nonReentrant returns (uint256 shares) {
        require(amount > 0, "EnergyFutures: zero amount");
        quoteToken.safeTransferFrom(msg.sender, address(this), amount);
        if (totalShares == 0 || totalLiquidity == 0) {
            shares = amount;
        } else {
            shares = (amount * totalShares) / totalLiquidity;
        }
        require(shares > 0, "EnergyFutures: zero shares");
        lpShares[msg.sender] += shares;
        totalShares += shares;
        totalLiquidity += amount;
        emit LiquidityAdded(msg.sender, amount, shares);
    }

    function removeLiquidity(uint256 shares) external whenNotPaused nonReentrant returns (uint256 amount) {
        require(shares > 0 && lpShares[msg.sender] >= shares, "EnergyFutures: shares");
        amount = (shares * totalLiquidity) / totalShares;
        lpShares[msg.sender] -= shares;
        totalShares -= shares;
        totalLiquidity -= amount;
        quoteToken.safeTransfer(msg.sender, amount);
        emit LiquidityRemoved(msg.sender, amount, shares);
    }

    // -------------------------------------------------------------------------
    // Trading
    // -------------------------------------------------------------------------

    /**
     * @notice Open a leveraged long/short. Pulls margin + 0.1% fee on notional.
     * @param isLong True for long, false for short
     * @param margin Collateral deposited
     * @param leverage Integer 1..10
     */
    function openPosition(bool isLong, uint256 margin, uint256 leverage)
        external
        whenNotPaused
        nonReentrant
    {
        require(!positions[msg.sender].open, "EnergyFutures: already open");
        require(margin > 0 && margin <= MAX_MARGIN && leverage >= 1 && leverage <= MAX_LEVERAGE, "EnergyFutures: bad params");
        _settleFunding();

        uint256 size = margin * leverage;
        require(
            (isLong ? longOpenInterest : shortOpenInterest) + size <= MAX_OPEN_INTEREST,
            "EnergyFutures: OI cap"
        );
        uint256 fee = (size * FEE_BPS) / BPS;
        uint256 pull = margin + fee;
        quoteToken.safeTransferFrom(msg.sender, address(this), pull);
        if (fee > 0) {
            quoteToken.safeTransfer(treasury, fee);
        }

        uint256 price = oracle.getPrice();
        require(price > 0, "EnergyFutures: bad price");

        positions[msg.sender] = Position({
            open: true,
            isLong: isLong,
            margin: margin,
            size: size,
            entryPrice: price,
            entryFundingIndex: fundingIndex
        });

        if (isLong) longOpenInterest += size;
        else shortOpenInterest += size;

        emit PositionOpened(msg.sender, isLong, margin, size, leverage, price, fee);
    }

    function closePosition() external whenNotPaused nonReentrant {
        Position memory pos = positions[msg.sender];
        require(pos.open, "EnergyFutures: no position");
        _settleFunding();
        pos = positions[msg.sender]; // refresh funding entry may stay; index settled

        (int256 pnl, uint256 fee, uint256 payout) = _closeInternal(msg.sender, pos);
        emit PositionClosed(msg.sender, pnl, fee, payout);
    }

    function liquidate(address trader) external whenNotPaused nonReentrant {
        Position memory pos = positions[trader];
        require(pos.open, "EnergyFutures: no position");
        _settleFunding();
        pos = positions[trader];

        int256 equity = int256(pos.margin) + _unrealizedPnl(pos) + _fundingPnl(pos);
        uint256 maintenance = (pos.size * MAINTENANCE_BPS) / BPS;
        require(equity < int256(maintenance), "EnergyFutures: healthy");

        (int256 pnl, uint256 fee, ) = _closeInternal(trader, pos);
        emit Liquidated(trader, msg.sender, pnl, fee);
    }

    // -------------------------------------------------------------------------
    // Funding
    // -------------------------------------------------------------------------

    function settleFunding() external whenNotPaused {
        _settleFunding();
    }

    function _settleFunding() internal {
        if (block.timestamp < lastFundingTime + FUNDING_INTERVAL) return;
        uint256 periods = (block.timestamp - lastFundingTime) / FUNDING_INTERVAL;
        lastFundingTime += periods * FUNDING_INTERVAL;

        uint256 totalOI = longOpenInterest + shortOpenInterest;
        if (totalOI == 0) {
            emit FundingSettled(fundingIndex, longOpenInterest, shortOpenInterest, block.timestamp);
            return;
        }

        // Skew in [-1e18, 1e18]
        int256 skew = (int256(longOpenInterest) - int256(shortOpenInterest)) * 1e18 / int256(totalOI);
        // funding delta per period = skew * MAX_FUNDING_BPS / BPS (scaled 1e18)
        int256 deltaPerPeriod = (skew * int256(MAX_FUNDING_BPS)) / int256(BPS);
        fundingIndex += deltaPerPeriod * int256(periods);
        emit FundingSettled(fundingIndex, longOpenInterest, shortOpenInterest, block.timestamp);
    }

    // -------------------------------------------------------------------------
    // Views
    // -------------------------------------------------------------------------

    function getMarkPrice() external view returns (uint256) {
        return oracle.getPrice();
    }

    function previewPnl(address trader) external view returns (int256 equity, int256 upnl, int256 funding) {
        Position memory pos = positions[trader];
        if (!pos.open) return (0, 0, 0);
        upnl = _unrealizedPnl(pos);
        funding = _fundingPnl(pos);
        equity = int256(pos.margin) + upnl + funding;
    }

    // -------------------------------------------------------------------------
    // Internal
    // -------------------------------------------------------------------------

    function _unrealizedPnl(Position memory pos) internal view returns (int256) {
        uint256 mark = oracle.getPrice();
        if (mark == pos.entryPrice) return 0;
        // pnl = size * (mark - entry) / entry  (long); inverse for short
        int256 diff = int256(mark) - int256(pos.entryPrice);
        int256 raw = (int256(pos.size) * diff) / int256(pos.entryPrice);
        return pos.isLong ? raw : -raw;
    }

    function _fundingPnl(Position memory pos) internal view returns (int256) {
        int256 delta = fundingIndex - pos.entryFundingIndex;
        // Positive fundingIndex move => longs pay => long pnl negative
        int256 payment = (int256(pos.size) * delta) / 1e18;
        return pos.isLong ? -payment : payment;
    }

    function _closeInternal(address trader, Position memory pos)
        internal
        returns (int256 pnl, uint256 fee, uint256 payout)
    {
        pnl = _unrealizedPnl(pos) + _fundingPnl(pos);
        fee = (pos.size * FEE_BPS) / BPS;

        if (pos.isLong) longOpenInterest -= pos.size;
        else shortOpenInterest -= pos.size;

        // Trader losses increase LP equity; trader gains are paid from the LP vault.
        if (pnl > 0) {
            require(totalLiquidity >= uint256(pnl), "EnergyFutures: LP insolvency");
            totalLiquidity -= uint256(pnl);
        } else if (pnl < 0) {
            totalLiquidity += uint256(-pnl);
        }

        int256 settle = int256(pos.margin) + pnl - int256(fee);
        delete positions[trader];

        if (fee > 0) {
            quoteToken.safeTransfer(treasury, fee);
        }

        if (settle > 0) {
            payout = uint256(settle);
            quoteToken.safeTransfer(trader, payout);
        } else {
            // Residual dust after fee stays with LPs.
            if (settle < 0) {
                totalLiquidity += uint256(-settle);
            }
            payout = 0;
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
