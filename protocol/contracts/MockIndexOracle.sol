// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title MockIndexOracle
 * @notice Owner-settable price feed with circuit-breaker on max deviation per update.
 */
contract MockIndexOracle is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public price;
    string public indexId;
    /// @notice Max |Δprice|/price per setPrice, in BPS (default 50%).
    uint256 public maxDeviationBps;
    uint256 public constant BPS = 10_000;

    event PriceUpdated(uint256 price, string indexId);
    event MaxDeviationUpdated(uint256 bps);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_, string memory indexId_, uint256 initialPrice) external initializer {
        require(owner_ != address(0) && initialPrice > 0, "MockIndexOracle: bad init");
        __Ownable_init(owner_);
        indexId = indexId_;
        price = initialPrice;
        maxDeviationBps = 5_000; // 50%
        emit PriceUpdated(initialPrice, indexId_);
    }

    function setMaxDeviationBps(uint256 bps) external onlyOwner {
        require(bps > 0 && bps <= BPS, "MockIndexOracle: bps");
        maxDeviationBps = bps;
        emit MaxDeviationUpdated(bps);
    }

    function setPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "MockIndexOracle: zero");
        uint256 old = price;
        uint256 diff = newPrice > old ? newPrice - old : old - newPrice;
        require((diff * BPS) / old <= maxDeviationBps, "MockIndexOracle: circuit breaker");
        price = newPrice;
        emit PriceUpdated(newPrice, indexId);
    }

    /// @notice Emergency / test escape hatch — still owner-only.
    function setPriceForced(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "MockIndexOracle: zero");
        price = newPrice;
        emit PriceUpdated(newPrice, indexId);
    }

    function getPrice() external view returns (uint256) {
        return price;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
