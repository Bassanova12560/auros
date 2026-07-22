// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "./utils/ReentrancyGuardUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
interface IUniswapV3Factory { function createPool(address tokenA, address tokenB, uint24 fee) external returns (address); }
interface INonfungiblePositionManager {
    function mint(address token0, address token1, uint256 amount0, uint256 amount1, address recipient) external returns (uint256, uint128);
}
/// @title Liquidity Bootstrapper
/// @notice Seeds resource/reserve liquidity through mock-compatible interfaces.
contract LiquidityBootstrapper is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    IUniswapV3Factory public factory; INonfungiblePositionManager public positionManager; address public liquidityReserveToken;
    event LiquidityBootstrapped(address indexed token, address indexed pool, uint256 amount0, uint256 amount1, uint256 positionId);
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }
    function initialize(address owner_, address factory_, address manager_, address reserve_) external initializer {
        require(owner_ != address(0) && factory_ != address(0) && manager_ != address(0) && reserve_ != address(0), "zero address");
        __Ownable_init(owner_); __Pausable_init(); __ReentrancyGuard_init();
        factory = IUniswapV3Factory(factory_); positionManager = INonfungiblePositionManager(manager_); liquidityReserveToken = reserve_;
    }
    function bootstrap(address token, uint256 amount0, uint256 amount1) external whenNotPaused nonReentrant returns (address pool, uint256 id) {
        require(token != address(0) && token != liquidityReserveToken && amount0 > 0 && amount1 > 0, "invalid liquidity");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount0); IERC20(liquidityReserveToken).safeTransferFrom(msg.sender, address(this), amount1);
        IERC20(token).forceApprove(address(positionManager), amount0); IERC20(liquidityReserveToken).forceApprove(address(positionManager), amount1);
        pool = factory.createPool(token, liquidityReserveToken, 3000); (id,) = positionManager.mint(token, liquidityReserveToken, amount0, amount1, owner());
        emit LiquidityBootstrapped(token, pool, amount0, amount1, id);
    }
    function pause() external onlyOwner { _pause(); } function unpause() external onlyOwner { _unpause(); }
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
