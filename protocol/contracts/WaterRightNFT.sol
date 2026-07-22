// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
interface IWaterFractionToken { function mint(address account, uint256 amount) external; function burnFromRight(address account, uint256 amount) external; }
/// @title Water Right NFT
/// @notice Expiring right to consume a bounded water volume.
contract WaterRightNFT is Initializable, ERC721Upgradeable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    struct WaterRight { bytes32 waterSourceId; uint256 maxVolumeLiters; uint256 fractionalizedLiters; uint256 consumedLiters; uint64 expirationDate; string location; }
    uint256 public nextTokenId; IWaterFractionToken public waterToken; mapping(uint256 => WaterRight) public waterRights;
    event WaterRightIssued(uint256 indexed tokenId, address indexed owner, bytes32 indexed source, uint256 maxVolumeLiters);
    event WaterConsumed(uint256 indexed tokenId, address indexed consumer, uint256 volumeLiters);
    event Fractionalized(uint256 indexed tokenId, address indexed recipient, uint256 volumeLiters);
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }
    function initialize(address owner_) external initializer {
        __ERC721_init("Auros Water Right", "AWR"); __Ownable_init(owner_); __Pausable_init(); __ReentrancyGuard_init();
    }
    function setWaterToken(address token) external onlyOwner { require(token != address(0), "zero token"); waterToken = IWaterFractionToken(token); }
    function issue(address recipient, bytes32 source, uint256 maxLiters, uint64 expiry, string calldata location) external onlyOwner returns (uint256 id) {
        require(recipient != address(0) && maxLiters > 0 && expiry > block.timestamp, "invalid right"); id = nextTokenId++;
        waterRights[id] = WaterRight(source, maxLiters, 0, 0, expiry, location); _safeMint(recipient, id); emit WaterRightIssued(id, recipient, source, maxLiters);
    }
    function fractionalize(uint256 id, address recipient, uint256 liters) external whenNotPaused {
        require(_isAuthorized(ownerOf(id), msg.sender, id), "not authorized"); WaterRight storage right = waterRights[id];
        require(block.timestamp < right.expirationDate && liters > 0 && right.fractionalizedLiters + liters <= right.maxVolumeLiters, "volume exceeded");
        right.fractionalizedLiters += liters; waterToken.mint(recipient, liters * 1 ether); emit Fractionalized(id, recipient, liters);
    }
    function consume(uint256 id, uint256 liters) external whenNotPaused nonReentrant {
        WaterRight storage right = waterRights[id]; require(block.timestamp < right.expirationDate && liters > 0 && right.consumedLiters + liters <= right.fractionalizedLiters, "volume exceeded");
        right.consumedLiters += liters; waterToken.burnFromRight(msg.sender, liters * 1 ether); emit WaterConsumed(id, msg.sender, liters);
    }
    function pause() external onlyOwner { _pause(); } function unpause() external onlyOwner { _unpause(); }
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
/// @title Water Token
/// @notice ERC20 water-right fractions controlled by the NFT.
contract WaterToken is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    address public waterRightContract;
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }
    function initialize(address owner_) external initializer { __ERC20_init("Auros Fractional Water", "WATER"); __Ownable_init(owner_); }
    function setWaterRightContract(address right) external onlyOwner { require(right != address(0), "zero right"); waterRightContract = right; }
    function mint(address account, uint256 amount) external { require(msg.sender == waterRightContract, "not water right"); _mint(account, amount); }
    function burnFromRight(address account, uint256 amount) external { require(msg.sender == waterRightContract, "not water right"); _burn(account, amount); }
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
