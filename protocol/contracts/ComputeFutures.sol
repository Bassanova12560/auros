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
 * @title ComputeFutures
 * @notice Perpetuals on FLOP compute index — same economics as EnergyFutures (0.1% fee, ≤10x).
 */
contract ComputeFutures is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    uint256 public constant FEE_BPS = 10;
    uint256 public constant BPS = 10_000;
    uint256 public constant MAX_LEVERAGE = 10;

    IERC20 public quoteToken;
    IIndexOracle public oracle;
    address public treasury;
    uint256 public totalLiquidity;

    struct Position {
        bool open;
        bool isLong;
        uint256 margin;
        uint256 size;
        uint256 entryPrice;
    }

    mapping(address => Position) public positions;

    event PositionOpened(address indexed trader, bool isLong, uint256 margin, uint256 size, uint256 fee);
    event PositionClosed(address indexed trader, int256 pnl, uint256 fee, uint256 payout);
    event LiquidityAdded(address indexed provider, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_, address quote_, address oracle_, address treasury_) external initializer {
        require(owner_ != address(0) && quote_ != address(0) && oracle_ != address(0) && treasury_ != address(0), "zero");
        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();
        quoteToken = IERC20(quote_);
        oracle = IIndexOracle(oracle_);
        treasury = treasury_;
    }

    function addLiquidity(uint256 amount) external whenNotPaused nonReentrant {
        quoteToken.safeTransferFrom(msg.sender, address(this), amount);
        totalLiquidity += amount;
        emit LiquidityAdded(msg.sender, amount);
    }

    function openPosition(bool isLong, uint256 margin, uint256 leverage) external whenNotPaused nonReentrant {
        require(!positions[msg.sender].open, "open");
        require(margin > 0 && leverage >= 1 && leverage <= MAX_LEVERAGE, "params");
        uint256 size = margin * leverage;
        uint256 fee = (size * FEE_BPS) / BPS;
        quoteToken.safeTransferFrom(msg.sender, address(this), margin + fee);
        if (fee > 0) quoteToken.safeTransfer(treasury, fee);
        positions[msg.sender] = Position(true, isLong, margin, size, oracle.getPrice());
        emit PositionOpened(msg.sender, isLong, margin, size, fee);
    }

    function closePosition() external whenNotPaused nonReentrant {
        Position memory pos = positions[msg.sender];
        require(pos.open, "none");
        uint256 mark = oracle.getPrice();
        int256 diff = int256(mark) - int256(pos.entryPrice);
        int256 pnl = (int256(pos.size) * diff) / int256(pos.entryPrice);
        if (!pos.isLong) pnl = -pnl;
        uint256 fee = (pos.size * FEE_BPS) / BPS;
        if (pnl > 0) {
            require(totalLiquidity >= uint256(pnl), "vault");
            totalLiquidity -= uint256(pnl);
        } else if (pnl < 0) {
            totalLiquidity += uint256(-pnl);
        }
        int256 settle = int256(pos.margin) + pnl - int256(fee);
        delete positions[msg.sender];
        if (fee > 0) quoteToken.safeTransfer(treasury, fee);
        uint256 payout = settle > 0 ? uint256(settle) : 0;
        if (payout > 0) quoteToken.safeTransfer(msg.sender, payout);
        emit PositionClosed(msg.sender, pnl, fee, payout);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
