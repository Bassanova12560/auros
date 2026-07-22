// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Mock position manager that custody-transfers supplied liquidity.
contract MockNonfungiblePositionManager {
    using SafeERC20 for IERC20;
    uint256 public nextTokenId = 1;

    event PositionMinted(uint256 indexed tokenId, address indexed recipient, uint128 liquidity);

    function mint(address token0, address token1, uint256 amount0, uint256 amount1, address recipient)
        external
        returns (uint256 tokenId, uint128 liquidity)
    {
        IERC20(token0).safeTransferFrom(msg.sender, address(this), amount0);
        IERC20(token1).safeTransferFrom(msg.sender, address(this), amount1);
        tokenId = nextTokenId++;
        uint256 combined = amount0 + amount1;
        require(combined <= type(uint128).max, "liquidity overflow");
        liquidity = uint128(combined);
        emit PositionMinted(tokenId, recipient, liquidity);
    }
}
