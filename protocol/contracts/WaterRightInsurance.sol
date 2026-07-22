// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title WaterRightInsurance
 * @notice Cover for WaterRightNFT volume cuts (regulatory). Payout when remaining volume reduced.
 */
contract WaterRightInsurance is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    uint256 public constant COMMISSION_BPS = 1_500;
    uint256 public constant BPS = 10_000;

    IERC20 public quoteToken;
    address public treasury;
    uint256 public nextId;
    uint256 public poolLiquidity;

    struct Cover {
        address insured;
        address nft;
        uint256 tokenId;
        uint256 premium;
        uint256 coverage;
        uint256 baselineRemaining;
        uint256 periodEnd;
        bool active;
        bool claimed;
    }

    mapping(uint256 => Cover) public covers;

    event CoverBought(uint256 indexed id, address indexed insured, address nft, uint256 tokenId, uint256 coverage);
    event RegulatoryCutReported(uint256 indexed id, uint256 newRemaining);
    event CoverPaid(uint256 indexed id, uint256 payout);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_, address quote_, address treasury_) external initializer {
        require(owner_ != address(0) && quote_ != address(0) && treasury_ != address(0), "zero");
        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();
        quoteToken = IERC20(quote_);
        treasury = treasury_;
        nextId = 1;
    }

    function fundPool(uint256 amount) external whenNotPaused nonReentrant {
        quoteToken.safeTransferFrom(msg.sender, address(this), amount);
        poolLiquidity += amount;
    }

    function buyCover(
        address nft,
        uint256 tokenId,
        uint256 premium,
        uint256 coverage,
        uint256 baselineRemaining,
        uint256 duration
    ) external whenNotPaused nonReentrant returns (uint256 id) {
        require(IERC721(nft).ownerOf(tokenId) == msg.sender, "not owner");
        require(premium > 0 && coverage > 0 && poolLiquidity >= coverage, "bad");
        quoteToken.safeTransferFrom(msg.sender, address(this), premium);
        uint256 commission = (premium * COMMISSION_BPS) / BPS;
        if (commission > 0) quoteToken.safeTransfer(treasury, commission);
        poolLiquidity += premium - commission;

        id = nextId++;
        covers[id] = Cover({
            insured: msg.sender,
            nft: nft,
            tokenId: tokenId,
            premium: premium,
            coverage: coverage,
            baselineRemaining: baselineRemaining,
            periodEnd: block.timestamp + duration,
            active: true,
            claimed: false
        });
        emit CoverBought(id, msg.sender, nft, tokenId, coverage);
    }

    /// @notice Owner/oracle reports new remaining volume after regulatory cut.
    function reportCut(uint256 id, uint256 newRemaining) external onlyOwner {
        Cover storage c = covers[id];
        require(c.active && !c.claimed, "closed");
        emit RegulatoryCutReported(id, newRemaining);
        if (newRemaining < c.baselineRemaining && block.timestamp <= c.periodEnd) {
            c.claimed = true;
            c.active = false;
            uint256 payout = c.coverage;
            require(poolLiquidity >= payout, "insolvent");
            poolLiquidity -= payout;
            quoteToken.safeTransfer(c.insured, payout);
            emit CoverPaid(id, payout);
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
