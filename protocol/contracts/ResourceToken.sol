// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title ResourceToken
 * @notice ERC-20 for one physical resource unit (1 token = 1 kWh / litre / etc.).
 */
contract ResourceToken is
    Initializable,
    ERC20Upgradeable,
    AccessControlUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant RESOURCE_ORACLE = keccak256("RESOURCE_ORACLE");

    string public resourceType;
    address public currentOracle;
    bool public expirationEnabled;
    uint256 public expiresAt;

    event ResourceMinted(address indexed to, uint256 amount);
    event ResourceBurned(address indexed from, uint256 amount);
    event OracleUpdated(address indexed previousOracle, address indexed newOracle);
    event ExpirationUpdated(bool enabled, uint256 expiresAt);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        string memory resourceType_,
        address owner_
    ) external initializer {
        require(owner_ != address(0), "ResourceToken: zero owner");
        __ERC20_init(name_, symbol_);
        __AccessControl_init();
        __Ownable_init(owner_);
        __Pausable_init();
        resourceType = resourceType_;
        _grantRole(DEFAULT_ADMIN_ROLE, owner_);
    }

    function setOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "ResourceToken: zero oracle");
        address previous = currentOracle;
        if (previous != address(0)) {
            _revokeRole(RESOURCE_ORACLE, previous);
        }
        currentOracle = newOracle;
        _grantRole(RESOURCE_ORACLE, newOracle);
        emit OracleUpdated(previous, newOracle);
    }

    function setExpiration(bool enabled, uint256 expiresAt_) external onlyOwner {
        expirationEnabled = enabled;
        expiresAt = expiresAt_;
        emit ExpirationUpdated(enabled, expiresAt_);
    }

    function mint(address to, uint256 amount) external onlyRole(RESOURCE_ORACLE) whenNotPaused {
        require(!_isExpired(), "resource expired");
        _mint(to, amount);
        emit ResourceMinted(to, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(RESOURCE_ORACLE) whenNotPaused {
        _burn(from, amount);
        emit ResourceBurned(from, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _isExpired() internal view returns (bool) {
        return expirationEnabled && block.timestamp > expiresAt;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
