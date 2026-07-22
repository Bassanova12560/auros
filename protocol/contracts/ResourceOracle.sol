// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import {ResourceToken} from "./ResourceToken.sol";
import {DeviceRegistry} from "./DeviceRegistry.sol";

/**
 * @title ResourceOracle
 * @notice Verifies ECDSA Proof-of-Resource signatures then mints ResourceToken.
 */
contract ResourceOracle is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    ResourceToken public resourceToken;
    DeviceRegistry public deviceRegistry;

    mapping(address => bool) public isOracle;
    mapping(bytes32 => bool) public usedProofs;

    event OracleRegistered(address indexed oracle, bool allowed);
    event DeviceRegistryUpdated(address indexed registry);
    event ProofVerified(address indexed user, uint256 amount, address indexed signer);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address resourceToken_, address owner_) external initializer {
        require(owner_ != address(0) && resourceToken_ != address(0), "ResourceOracle: zero");
        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();
        resourceToken = ResourceToken(resourceToken_);
    }

    function setDeviceRegistry(address registry) external onlyOwner {
        deviceRegistry = DeviceRegistry(registry);
        emit DeviceRegistryUpdated(registry);
    }

    function setOracle(address oracle, bool allowed) external onlyOwner {
        require(oracle != address(0), "ResourceOracle: zero oracle");
        isOracle[oracle] = allowed;
        emit OracleRegistered(oracle, allowed);
    }

    function registerOracle(address oracle, bool authorized) external onlyOwner {
        require(oracle != address(0), "ResourceOracle: zero oracle");
        isOracle[oracle] = authorized;
        emit OracleRegistered(oracle, authorized);
    }

    function reportMint(address user, uint256 amount, bytes calldata signature)
        external
        whenNotPaused
        nonReentrant
    {
        require(user != address(0) && amount > 0, "ResourceOracle: bad args");

        bytes32 digest = keccak256(abi.encodePacked(user, amount));
        require(!usedProofs[digest], "proof already used");
        bytes32 ethSigned = MessageHashUtils.toEthSignedMessageHash(digest);
        address signer = ECDSA.recover(ethSigned, signature);
        require(isOracle[signer], "invalid oracle");

        if (address(deviceRegistry) != address(0)) {
            require(
                deviceRegistry.isAuthorized(signer) || deviceRegistry.isAuthorized(msg.sender),
                "device not authorized"
            );
        }

        usedProofs[digest] = true;
        resourceToken.mint(user, amount);
        emit ProofVerified(user, amount, signer);
    }

    function reportMintFromDevice(
        address user,
        uint256 amount,
        address deviceId,
        bytes calldata signature
    ) external whenNotPaused nonReentrant {
        require(user != address(0) && amount > 0 && deviceId != address(0), "ResourceOracle: bad args");
        if (address(deviceRegistry) != address(0)) {
            require(deviceRegistry.isAuthorized(deviceId), "device not authorized");
        }

        bytes32 digest = keccak256(abi.encodePacked(user, amount, deviceId));
        require(!usedProofs[digest], "proof already used");
        bytes32 ethSigned = MessageHashUtils.toEthSignedMessageHash(digest);
        address signer = ECDSA.recover(ethSigned, signature);
        require(signer == deviceId || isOracle[signer], "invalid oracle");

        usedProofs[digest] = true;
        resourceToken.mint(user, amount);
        emit ProofVerified(user, amount, signer);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
