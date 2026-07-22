// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title ParametricInsurance
 * @notice Production shortfall cover: if reported production < threshold, payout from pool.
 * @dev Auros takes 15% of each premium. LPs deposit quote into the pool.
 */
contract ParametricInsurance is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    uint256 public constant COMMISSION_BPS = 1_500; // 15%
    uint256 public constant BPS = 10_000;

    IERC20 public quoteToken;
    address public treasury;
    uint256 public nextPolicyId;
    uint256 public poolLiquidity;
    uint256 public totalLpShares;
    mapping(address => uint256) public lpShares;

    struct Policy {
        address insured;
        address device;
        uint256 premium;
        uint256 coverage;
        uint256 thresholdProduction; // minimum acceptable mint volume
        uint256 periodEnd;
        uint256 reportedProduction;
        bool active;
        bool claimed;
    }

    mapping(uint256 => Policy) public policies;

    event PoolDeposited(address indexed lp, uint256 amount, uint256 shares);
    event PolicyBought(
        uint256 indexed id,
        address indexed insured,
        address device,
        uint256 premium,
        uint256 coverage,
        uint256 thresholdProduction,
        uint256 periodEnd
    );
    event ProductionReported(uint256 indexed id, uint256 production);
    event ClaimPaid(uint256 indexed id, uint256 payout);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_, address quote_, address treasury_) external initializer {
        require(owner_ != address(0) && quote_ != address(0) && treasury_ != address(0), "zero");
        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();
        quoteToken = IERC20(quote_);
        treasury = treasury_;
        nextPolicyId = 1;
    }

    function provideCapital(uint256 amount) external whenNotPaused nonReentrant returns (uint256 shares) {
        require(amount > 0, "zero");
        quoteToken.safeTransferFrom(msg.sender, address(this), amount);
        shares = totalLpShares == 0 || poolLiquidity == 0 ? amount : (amount * totalLpShares) / poolLiquidity;
        lpShares[msg.sender] += shares;
        totalLpShares += shares;
        poolLiquidity += amount;
        emit PoolDeposited(msg.sender, amount, shares);
    }

    function buyPolicy(
        address device,
        uint256 premium,
        uint256 coverage,
        uint256 thresholdProduction,
        uint256 duration
    ) external whenNotPaused nonReentrant returns (uint256 id) {
        require(device != address(0) && premium > 0 && coverage > 0 && duration > 0, "bad");
        require(poolLiquidity >= coverage, "pool");
        quoteToken.safeTransferFrom(msg.sender, address(this), premium);
        uint256 commission = (premium * COMMISSION_BPS) / BPS;
        if (commission > 0) quoteToken.safeTransfer(treasury, commission);
        poolLiquidity += premium - commission;

        id = nextPolicyId++;
        policies[id] = Policy({
            insured: msg.sender,
            device: device,
            premium: premium,
            coverage: coverage,
            thresholdProduction: thresholdProduction,
            periodEnd: block.timestamp + duration,
            reportedProduction: 0,
            active: true,
            claimed: false
        });
        emit PolicyBought(id, msg.sender, device, premium, coverage, thresholdProduction, block.timestamp + duration);
    }

    /// @notice Oracle/keeper reports cumulative production for the policy period.
    function reportProduction(uint256 id, uint256 production) external onlyOwner {
        Policy storage p = policies[id];
        require(p.active && !p.claimed, "closed");
        p.reportedProduction = production;
        emit ProductionReported(id, production);
    }

    function settleClaim(uint256 id) external whenNotPaused nonReentrant {
        Policy storage p = policies[id];
        require(p.active && !p.claimed, "closed");
        require(block.timestamp >= p.periodEnd, "period");
        p.claimed = true;
        p.active = false;

        uint256 payout;
        if (p.reportedProduction < p.thresholdProduction) {
            payout = p.coverage;
            require(poolLiquidity >= payout, "insolvent");
            poolLiquidity -= payout;
            quoteToken.safeTransfer(p.insured, payout);
        }
        emit ClaimPaid(id, payout);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
