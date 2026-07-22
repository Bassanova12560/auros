// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
/// @title Protocol Fees
/// @notice Collects 0.1 percent fees for AUR stakers.
contract ProtocolFees is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    uint256 public constant FEE_BPS = 10; uint256 private constant PRECISION = 1e24;
    IERC20 public aurToken; IERC20 public feeToken; uint256 public totalStaked; uint256 public rewardPerShare; uint256 public undistributedFees;
    mapping(address => uint256) public staked; mapping(address => uint256) public rewardDebt; mapping(address => uint256) public pendingRewards;
    event FeeCollected(address indexed payer, uint256 fee); event Staked(address indexed account, uint256 amount);
    event Unstaked(address indexed account, uint256 amount); event Claimed(address indexed account, uint256 amount);
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }
    function initialize(address owner_, address aur_, address fees_) external initializer {
        require(owner_ != address(0) && aur_ != address(0) && fees_ != address(0), "zero address");
        __Ownable_init(owner_); __Pausable_init(); __ReentrancyGuard_init(); aurToken = IERC20(aur_); feeToken = IERC20(fees_);
    }
    function collectFee(address payer, uint256 gross) external whenNotPaused nonReentrant returns (uint256 fee) {
        fee = gross * FEE_BPS / 10_000; require(fee > 0, "fee rounds to zero"); feeToken.safeTransferFrom(payer, address(this), fee);
        if (totalStaked == 0) undistributedFees += fee; else rewardPerShare += fee * PRECISION / totalStaked; emit FeeCollected(payer, fee);
    }
    function stake(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "zero amount"); _accrue(msg.sender); aurToken.safeTransferFrom(msg.sender, address(this), amount);
        staked[msg.sender] += amount; totalStaked += amount;
        if (undistributedFees > 0) { rewardPerShare += undistributedFees * PRECISION / totalStaked; undistributedFees = 0; }
        rewardDebt[msg.sender] = staked[msg.sender] * rewardPerShare / PRECISION; emit Staked(msg.sender, amount);
    }
    function unstake(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0 && staked[msg.sender] >= amount, "invalid amount"); _accrue(msg.sender); staked[msg.sender] -= amount; totalStaked -= amount;
        rewardDebt[msg.sender] = staked[msg.sender] * rewardPerShare / PRECISION; aurToken.safeTransfer(msg.sender, amount); emit Unstaked(msg.sender, amount);
    }
    function claim() external whenNotPaused nonReentrant {
        _accrue(msg.sender); uint256 reward = pendingRewards[msg.sender]; require(reward > 0, "nothing to claim");
        pendingRewards[msg.sender] = 0; feeToken.safeTransfer(msg.sender, reward); emit Claimed(msg.sender, reward);
    }
    function _accrue(address account) internal { uint256 earned = staked[account] * rewardPerShare / PRECISION; if (earned > rewardDebt[account]) pendingRewards[account] += earned - rewardDebt[account]; rewardDebt[account] = earned; }
    function pause() external onlyOwner { _pause(); } function unpause() external onlyOwner { _unpause(); }
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
