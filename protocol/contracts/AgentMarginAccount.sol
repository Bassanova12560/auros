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
 * @title AgentMarginAccount
 * @notice Per-agent margin vault: deposit, internal borrow for trading, liquidation at 1% fee.
 */
contract AgentMarginAccount is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    uint256 public constant LIQ_FEE_BPS = 100;
    uint256 public constant BPS = 10_000;
    uint256 public constant MAX_LEVERAGE_BPS = 50_000; // 5x equity

    IERC20 public quoteToken;
    address public treasury;

    mapping(address => uint256) public equity;
    mapping(address => uint256) public debt;

    event Deposited(address indexed agent, uint256 amount);
    event Withdrawn(address indexed agent, uint256 amount);
    event Borrowed(address indexed agent, uint256 amount);
    event Repaid(address indexed agent, uint256 amount);
    event Liquidated(address indexed agent, uint256 fee, address liquidator);

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
    }

    function deposit(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "zero");
        quoteToken.safeTransferFrom(msg.sender, address(this), amount);
        equity[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "zero");
        require(_freeCollateral(msg.sender) >= amount, "collateral");
        equity[msg.sender] -= amount;
        quoteToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function borrow(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "zero");
        require((equity[msg.sender] * MAX_LEVERAGE_BPS) / BPS >= debt[msg.sender] + amount, "leverage");
        debt[msg.sender] += amount;
        quoteToken.safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0 && debt[msg.sender] >= amount, "debt");
        quoteToken.safeTransferFrom(msg.sender, address(this), amount);
        debt[msg.sender] -= amount;
        emit Repaid(msg.sender, amount);
    }

    function liquidate(address agent) external whenNotPaused nonReentrant {
        require(debt[agent] > 0, "no debt");
        // Liquidatable when debt > equity (simplified underwater check)
        require(debt[agent] > equity[agent], "healthy");
        uint256 fee = (equity[agent] * LIQ_FEE_BPS) / BPS;
        uint256 seized = equity[agent];
        equity[agent] = 0;
        debt[agent] = 0;
        if (fee > 0) quoteToken.safeTransfer(treasury, fee);
        uint256 rest = seized > fee ? seized - fee : 0;
        if (rest > 0) quoteToken.safeTransfer(treasury, rest);
        emit Liquidated(agent, fee, msg.sender);
    }

    function freeCollateral(address agent) external view returns (uint256) {
        return _freeCollateral(agent);
    }

    function _freeCollateral(address agent) internal view returns (uint256) {
        uint256 locked = (debt[agent] * BPS) / MAX_LEVERAGE_BPS;
        if (equity[agent] <= locked) return 0;
        return equity[agent] - locked;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
