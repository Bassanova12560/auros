// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";

interface IIndexOracle {
    function getPrice() external view returns (uint256);
}

/**
 * @title ResourceOptions
 * @notice European call/put options on a resource index. Premium in quote; seller posts margin.
 * @dev Platform fee = 0.2% of premium. Keeper calls settleExpired(optionId) after expiry.
 */
contract ResourceOptions is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    uint256 public constant FEE_BPS = 20; // 0.2%
    uint256 public constant BPS = 10_000;
    uint256 public constant MAX_EXPIRY_WINDOW = 365 days;
    uint256 public constant MAX_SIZE = 10_000_000 ether;
    uint256 public constant MAX_PREMIUM = 1_000_000 ether;

    IERC20 public quoteToken;
    IIndexOracle public oracle;
    address public treasury;
    uint256 public nextId;

    enum OptionType {
        Call,
        Put
    }

    struct Option {
        address buyer;
        address seller;
        OptionType optionType;
        uint256 strike; // 1e18
        uint256 expiry;
        uint256 premium;
        uint256 margin;
        uint256 size; // notional quote units
        bool settled;
        bool open;
    }

    mapping(uint256 => Option) public options;

    event OptionWritten(
        uint256 indexed id,
        address indexed seller,
        OptionType optionType,
        uint256 strike,
        uint256 expiry,
        uint256 premium,
        uint256 margin,
        uint256 size
    );
    event OptionBought(uint256 indexed id, address indexed buyer, uint256 premium, uint256 fee);
    event OptionSettled(uint256 indexed id, int256 payoff, address winner);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_, address quote_, address oracle_, address treasury_) external initializer {
        require(owner_ != address(0) && quote_ != address(0) && oracle_ != address(0) && treasury_ != address(0), "zero");
        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();
        quoteToken = IERC20(quote_);
        oracle = IIndexOracle(oracle_);
        treasury = treasury_;
        nextId = 1;
    }

    /**
     * @notice Seller lists an option by posting margin. Buyer later pays premium.
     */
    function writeOption(
        OptionType optionType,
        uint256 strike,
        uint256 expiry,
        uint256 premium,
        uint256 margin,
        uint256 size
    ) external whenNotPaused nonReentrant returns (uint256 id) {
        require(strike > 0 && premium > 0 && premium <= MAX_PREMIUM && margin > 0 && size > 0 && size <= MAX_SIZE, "bad params");
        require(expiry > block.timestamp && expiry <= block.timestamp + MAX_EXPIRY_WINDOW, "expiry");
        quoteToken.safeTransferFrom(msg.sender, address(this), margin);
        id = nextId++;
        options[id] = Option({
            buyer: address(0),
            seller: msg.sender,
            optionType: optionType,
            strike: strike,
            expiry: expiry,
            premium: premium,
            margin: margin,
            size: size,
            settled: false,
            open: true
        });
        emit OptionWritten(id, msg.sender, optionType, strike, expiry, premium, margin, size);
    }

    function buyOption(uint256 id) external whenNotPaused nonReentrant {
        Option storage o = options[id];
        require(o.open && o.buyer == address(0) && !o.settled, "unavailable");
        require(msg.sender != o.seller, "self-trade");
        require(block.timestamp < o.expiry, "expired");
        uint256 fee = (o.premium * FEE_BPS) / BPS;
        uint256 toSeller = o.premium - fee;
        quoteToken.safeTransferFrom(msg.sender, address(this), o.premium);
        if (fee > 0) quoteToken.safeTransfer(treasury, fee);
        quoteToken.safeTransfer(o.seller, toSeller);
        o.buyer = msg.sender;
        emit OptionBought(id, msg.sender, o.premium, fee);
    }

    /**
     * @notice Keeper/anyone settles after expiry. Intrinsic value paid from seller margin.
     */
    function settleExpired(uint256 id) external whenNotPaused nonReentrant {
        Option storage o = options[id];
        require(o.open && !o.settled, "done");
        require(o.buyer != address(0), "no buyer");
        require(block.timestamp >= o.expiry, "not expired");

        uint256 mark = oracle.getPrice();
        uint256 intrinsic; // payoff in quote units for the option size
        if (o.optionType == OptionType.Call && mark > o.strike) {
            intrinsic = (o.size * (mark - o.strike)) / o.strike;
        } else if (o.optionType == OptionType.Put && mark < o.strike) {
            intrinsic = (o.size * (o.strike - mark)) / o.strike;
        }
        if (intrinsic > o.margin) intrinsic = o.margin;

        o.settled = true;
        o.open = false;

        uint256 remainder = o.margin - intrinsic;
        if (intrinsic > 0) quoteToken.safeTransfer(o.buyer, intrinsic);
        if (remainder > 0) quoteToken.safeTransfer(o.seller, remainder);

        emit OptionSettled(id, int256(intrinsic), intrinsic > 0 ? o.buyer : o.seller);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
