// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title DeviceRegistry
 * @notice Allowlist of IoT devices authorized for Proof-of-Resource minting.
 */
contract DeviceRegistry is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    mapping(address => bool) private _authorized;
    mapping(address => string) public deviceType;
    mapping(address => string) public metadata;

    event DeviceRegistered(address indexed device, bool authorized);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_) external initializer {
        require(owner_ != address(0), "zero owner");
        __Ownable_init(owner_);
    }

    function registerDevice(address device, bool authorized) external onlyOwner {
        require(device != address(0), "zero device");
        _authorized[device] = authorized;
        emit DeviceRegistered(device, authorized);
    }

    function registerDevice(
        address deviceAddress,
        string calldata deviceType_,
        string calldata metadata_
    ) external onlyOwner {
        require(deviceAddress != address(0), "zero device");
        _authorized[deviceAddress] = true;
        deviceType[deviceAddress] = deviceType_;
        metadata[deviceAddress] = metadata_;
        emit DeviceRegistered(deviceAddress, true);
    }

    function isAuthorized(address device) external view returns (bool) {
        return _authorized[device];
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
