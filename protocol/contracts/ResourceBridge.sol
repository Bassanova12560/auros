// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
interface IBridgeMintable { function mint(address user, uint256 amount) external; }
/// @title Resource Bridge
/// @notice Minimal lock-and-mint bridge for a trusted test relayer.
contract ResourceBridge is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    address public trustedRelayer; uint256 public nextNonce; mapping(bytes32 => bool) public relayedMessages;
    event Bridged(address indexed token, address indexed sender, address indexed recipient, uint256 amount, uint256 destinationChainId, uint256 nonce);
    event BridgeMinted(bytes32 indexed messageId, address indexed token, address indexed recipient, uint256 amount);
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }
    function initialize(address owner_, address relayer_) external initializer {
        require(owner_ != address(0) && relayer_ != address(0), "zero address");
        __Ownable_init(owner_); __Pausable_init(); __ReentrancyGuard_init(); trustedRelayer = relayer_;
    }
    function setTrustedRelayer(address relayer) external onlyOwner { require(relayer != address(0), "zero relayer"); trustedRelayer = relayer; }
    function lock(address token, uint256 amount, address recipient, uint256 chainId) external whenNotPaused nonReentrant {
        require(amount > 0 && recipient != address(0), "invalid bridge"); uint256 nonce = nextNonce++;
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount); emit Bridged(token, msg.sender, recipient, amount, chainId, nonce);
    }
    function relayMint(bytes32 id, address token, address recipient, uint256 amount) external whenNotPaused nonReentrant {
        require(msg.sender == trustedRelayer, "not relayer"); require(!relayedMessages[id], "already relayed"); relayedMessages[id] = true;
        IBridgeMintable(token).mint(recipient, amount); emit BridgeMinted(id, token, recipient, amount);
    }
    function pause() external onlyOwner { _pause(); } function unpause() external onlyOwner { _unpause(); }
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
