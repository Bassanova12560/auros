// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title EnergyValidatorStaking
 * @notice Phase 4 scaffold: validators stake AUR + declare energy capacity (Proof-of-Resource mock).
 * @dev Not a full consensus client — bonding curve for future Auros Chain validator set.
 */
contract EnergyValidatorStaking is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;

    IERC20 public aur;
    uint256 public minStake;
    uint256 public totalStaked;
    uint256 public totalCapacityKw;

    struct Validator {
        bool active;
        uint256 aurStaked;
        uint256 capacityKw;
        string endpoint;
    }

    mapping(address => Validator) public validators;
    address[] public validatorList;

    event ValidatorBonded(address indexed validator, uint256 aurAmount, uint256 capacityKw);
    event ValidatorUnbonded(address indexed validator);
    event CapacityUpdated(address indexed validator, uint256 capacityKw);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_, address aur_, uint256 minStake_) external initializer {
        require(owner_ != address(0) && aur_ != address(0), "zero");
        __Ownable_init(owner_);
        aur = IERC20(aur_);
        minStake = minStake_;
    }

    function bond(uint256 aurAmount, uint256 capacityKw, string calldata endpoint) external {
        require(aurAmount >= minStake && capacityKw > 0, "params");
        aur.safeTransferFrom(msg.sender, address(this), aurAmount);
        Validator storage v = validators[msg.sender];
        if (!v.active) {
            v.active = true;
            validatorList.push(msg.sender);
        }
        v.aurStaked += aurAmount;
        v.capacityKw = capacityKw;
        v.endpoint = endpoint;
        totalStaked += aurAmount;
        totalCapacityKw += capacityKw;
        emit ValidatorBonded(msg.sender, aurAmount, capacityKw);
    }

    function updateCapacity(uint256 capacityKw) external {
        require(validators[msg.sender].active, "inactive");
        uint256 old = validators[msg.sender].capacityKw;
        totalCapacityKw = totalCapacityKw - old + capacityKw;
        validators[msg.sender].capacityKw = capacityKw;
        emit CapacityUpdated(msg.sender, capacityKw);
    }

    function unbond() external {
        Validator storage v = validators[msg.sender];
        require(v.active, "inactive");
        uint256 amount = v.aurStaked;
        uint256 cap = v.capacityKw;
        v.active = false;
        v.aurStaked = 0;
        v.capacityKw = 0;
        totalStaked -= amount;
        totalCapacityKw -= cap;
        aur.safeTransfer(msg.sender, amount);
        emit ValidatorUnbonded(msg.sender);
    }

    function validatorCount() external view returns (uint256) {
        return validatorList.length;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
