// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title WattCoin Energy Stablecoin
/// @notice One-to-one redeemable token backed by approved 18-decimal energy tokens.
contract WattCoin is Initializable, ERC20Upgradeable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;

    mapping(address => bool) public authorizedEnergyTokens;

    event EnergyTokenAuthorized(address indexed token, bool authorized);
    event CollateralMinted(address indexed account, address indexed token, uint256 amount);
    event CollateralRedeemed(address indexed account, address indexed token, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }

    function initialize(address owner_) external initializer {
        require(owner_ != address(0), "zero owner");
        __ERC20_init("WattCoin Energy Stablecoin", "WATT");
        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();
    }

    function setEnergyToken(address token, bool authorized) external onlyOwner {
        require(token != address(0), "zero token");
        authorizedEnergyTokens[token] = authorized;
        emit EnergyTokenAuthorized(token, authorized);
    }

    function mintWithCollateral(address energyToken, uint256 amount) external whenNotPaused nonReentrant {
        require(authorizedEnergyTokens[energyToken], "unauthorized collateral");
        require(amount > 0, "zero amount");
        IERC20(energyToken).safeTransferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
        emit CollateralMinted(msg.sender, energyToken, amount);
    }

    function redeem(address energyToken, uint256 amount) external whenNotPaused nonReentrant {
        require(authorizedEnergyTokens[energyToken], "unauthorized collateral");
        require(amount > 0, "zero amount");
        _burn(msg.sender, amount);
        IERC20(energyToken).safeTransfer(msg.sender, amount);
        emit CollateralRedeemed(msg.sender, energyToken, amount);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
