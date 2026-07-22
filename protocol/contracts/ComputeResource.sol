// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title ComputeResource
 * @notice FLOP token — 1 token ≈ 1 standardized GPU-hour (e.g. 1 TFLOPS·h). Oracle mints/burns.
 */
contract ComputeResource is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant COMPUTE_ORACLE = keccak256("COMPUTE_ORACLE");
    mapping(address => bool) public isOracle;

    event ComputeMinted(address indexed to, uint256 amount, bytes32 jobId);
    event ComputeBurned(address indexed from, uint256 amount, bytes32 jobId);
    event OracleUpdated(address indexed oracle, bool allowed);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_) external initializer {
        require(owner_ != address(0), "zero");
        __ERC20_init("Auros Compute FLOP", "FLOP");
        __Ownable_init(owner_);
        __Pausable_init();
        isOracle[owner_] = true;
    }

    function setOracle(address oracle, bool allowed) external onlyOwner {
        require(oracle != address(0), "zero");
        isOracle[oracle] = allowed;
        emit OracleUpdated(oracle, allowed);
    }

    function mint(address to, uint256 amount, bytes32 jobId) external whenNotPaused {
        require(isOracle[msg.sender], "not oracle");
        _mint(to, amount);
        emit ComputeMinted(to, amount, jobId);
    }

    function burn(address from, uint256 amount, bytes32 jobId) external whenNotPaused {
        require(isOracle[msg.sender], "not oracle");
        _burn(from, amount);
        emit ComputeBurned(from, amount, jobId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
