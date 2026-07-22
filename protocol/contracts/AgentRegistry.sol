// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title AgentRegistry
 * @notice Registers AI/IoT agents allowed to use the machine API; subscription fees in AUR or stablecoin.
 */
contract AgentRegistry is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    struct Agent {
        bool active;
        string label;
        uint256 subscribedUntil;
        address payer;
    }

    IERC20 public feeToken;
    uint256 public subscriptionFee;
    uint256 public subscriptionPeriod;

    mapping(address => Agent) public agents;
    address[] public agentList;

    event AgentRegistered(address indexed agent, string label);
    event AgentSubscribed(address indexed agent, uint256 until);
    event FeeConfigUpdated(address feeToken, uint256 fee, uint256 period);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address owner_,
        address feeToken_,
        uint256 subscriptionFee_,
        uint256 subscriptionPeriod_
    ) external initializer {
        require(owner_ != address(0) && feeToken_ != address(0), "AgentRegistry: zero");
        __Ownable_init(owner_);
        __ReentrancyGuard_init();
        feeToken = IERC20(feeToken_);
        subscriptionFee = subscriptionFee_;
        subscriptionPeriod = subscriptionPeriod_;
    }

    function setFeeConfig(address feeToken_, uint256 fee, uint256 period) external onlyOwner {
        require(feeToken_ != address(0), "AgentRegistry: zero");
        feeToken = IERC20(feeToken_);
        subscriptionFee = fee;
        subscriptionPeriod = period;
        emit FeeConfigUpdated(feeToken_, fee, period);
    }

    function registerAgent(address agent, string calldata label) external onlyOwner {
        require(agent != address(0), "AgentRegistry: zero");
        if (!agents[agent].active && agents[agent].payer == address(0)) {
            agentList.push(agent);
        }
        agents[agent].active = true;
        agents[agent].label = label;
        emit AgentRegistered(agent, label);
    }

    function subscribe(address agent) external nonReentrant {
        require(agents[agent].active, "AgentRegistry: not registered");
        feeToken.safeTransferFrom(msg.sender, address(this), subscriptionFee);
        uint256 base = agents[agent].subscribedUntil > block.timestamp
            ? agents[agent].subscribedUntil
            : block.timestamp;
        agents[agent].subscribedUntil = base + subscriptionPeriod;
        agents[agent].payer = msg.sender;
        emit AgentSubscribed(agent, agents[agent].subscribedUntil);
    }

    function isSubscribed(address agent) external view returns (bool) {
        return agents[agent].active && agents[agent].subscribedUntil >= block.timestamp;
    }

    function withdrawFees(address to) external onlyOwner {
        uint256 bal = feeToken.balanceOf(address(this));
        feeToken.safeTransfer(to, bal);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
