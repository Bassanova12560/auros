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
 * @title ResourceLendingPool
 * @notice Simplified Aave-style pool: deposit resource as collateral, borrow quote (or vice versa).
 * @dev Dynamic borrow rate from utilization. Protocol takes 10% of interest as reserve.
 */
contract ResourceLendingPool is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    uint256 public constant BPS = 10_000;
    uint256 public constant PROTOCOL_SHARE_BPS = 1_000; // 10% of interest
    uint256 public constant BASE_RATE_BPS = 200; // 2% APR base
    uint256 public constant SLOPE_BPS = 2_000; // +20% at full util (simplified)
    uint256 public constant MAX_BORROW = 1_000_000 ether;

    IERC20 public resourceToken;
    IERC20 public quoteToken;
    address public treasury;

    uint256 public totalResourceLiquidity;
    uint256 public totalQuoteLiquidity;
    uint256 public totalResourceBorrowed;
    uint256 public totalQuoteBorrowed;

    mapping(address => uint256) public resourceDeposit;
    mapping(address => uint256) public quoteDeposit;
    mapping(address => uint256) public resourceDebt;
    mapping(address => uint256) public quoteDebt;

    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event Borrowed(address indexed user, address indexed token, uint256 amount);
    event Repaid(address indexed user, address indexed token, uint256 amount, uint256 interest, uint256 protocolFee);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address owner_,
        address resource_,
        address quote_,
        address treasury_
    ) external initializer {
        require(owner_ != address(0) && resource_ != address(0) && quote_ != address(0) && treasury_ != address(0), "zero");
        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();
        resourceToken = IERC20(resource_);
        quoteToken = IERC20(quote_);
        treasury = treasury_;
    }

    function depositResource(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "zero");
        resourceToken.safeTransferFrom(msg.sender, address(this), amount);
        resourceDeposit[msg.sender] += amount;
        totalResourceLiquidity += amount;
        emit Deposited(msg.sender, address(resourceToken), amount);
    }

    function depositQuote(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "zero");
        quoteToken.safeTransferFrom(msg.sender, address(this), amount);
        quoteDeposit[msg.sender] += amount;
        totalQuoteLiquidity += amount;
        emit Deposited(msg.sender, address(quoteToken), amount);
    }

    /// @notice Borrow quote against resource collateral (LTV 50% MVP: borrow <= deposit/2).
    function borrowQuote(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0 && amount <= MAX_BORROW, "bad amount");
        require(resourceDeposit[msg.sender] / 2 >= quoteDebt[msg.sender] + amount, "LTV");
        require(totalQuoteLiquidity >= amount, "liquidity");
        quoteDebt[msg.sender] += amount;
        totalQuoteBorrowed += amount;
        totalQuoteLiquidity -= amount;
        quoteToken.safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, address(quoteToken), amount);
    }

    /// @notice Borrow resource (kWh) against quote collateral (LTV 50%).
    function borrowResource(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0 && amount <= MAX_BORROW, "bad amount");
        require(quoteDeposit[msg.sender] / 2 >= resourceDebt[msg.sender] + amount, "LTV");
        require(totalResourceLiquidity >= amount, "liquidity");
        resourceDebt[msg.sender] += amount;
        totalResourceBorrowed += amount;
        totalResourceLiquidity -= amount;
        resourceToken.safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, address(resourceToken), amount);
    }

    function repayQuote(uint256 principal) external whenNotPaused nonReentrant {
        require(principal > 0 && quoteDebt[msg.sender] >= principal, "debt");
        uint256 interest = _interest(principal, _quoteUtil());
        uint256 protocolFee = (interest * PROTOCOL_SHARE_BPS) / BPS;
        uint256 total = principal + interest;
        quoteToken.safeTransferFrom(msg.sender, address(this), total);
        if (protocolFee > 0) quoteToken.safeTransfer(treasury, protocolFee);
        quoteDebt[msg.sender] -= principal;
        totalQuoteBorrowed -= principal;
        totalQuoteLiquidity += principal + (interest - protocolFee);
        emit Repaid(msg.sender, address(quoteToken), principal, interest, protocolFee);
    }

    function repayResource(uint256 principal) external whenNotPaused nonReentrant {
        require(principal > 0 && resourceDebt[msg.sender] >= principal, "debt");
        uint256 interest = _interest(principal, _resourceUtil());
        uint256 protocolFee = (interest * PROTOCOL_SHARE_BPS) / BPS;
        uint256 total = principal + interest;
        resourceToken.safeTransferFrom(msg.sender, address(this), total);
        if (protocolFee > 0) resourceToken.safeTransfer(treasury, protocolFee);
        resourceDebt[msg.sender] -= principal;
        totalResourceBorrowed -= principal;
        totalResourceLiquidity += principal + (interest - protocolFee);
        emit Repaid(msg.sender, address(resourceToken), principal, interest, protocolFee);
    }

    function borrowRateBps(bool quoteSide) external view returns (uint256) {
        return BASE_RATE_BPS + (_util(quoteSide) * SLOPE_BPS) / BPS;
    }

    function _quoteUtil() internal view returns (uint256) {
        uint256 supply = totalQuoteLiquidity + totalQuoteBorrowed;
        if (supply == 0) return 0;
        return (totalQuoteBorrowed * BPS) / supply;
    }

    function _resourceUtil() internal view returns (uint256) {
        uint256 supply = totalResourceLiquidity + totalResourceBorrowed;
        if (supply == 0) return 0;
        return (totalResourceBorrowed * BPS) / supply;
    }

    function _util(bool quoteSide) internal view returns (uint256) {
        return quoteSide ? _quoteUtil() : _resourceUtil();
    }

    /// @dev One-shot interest model for MVP (not continuous compounding).
    function _interest(uint256 principal, uint256 utilBps) internal pure returns (uint256) {
        uint256 rate = BASE_RATE_BPS + (utilBps * SLOPE_BPS) / BPS;
        return (principal * rate) / BPS / 12; // ~monthly slice
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
