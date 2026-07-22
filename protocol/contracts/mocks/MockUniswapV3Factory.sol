// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Deterministic mock factory for unit tests without a mainnet fork.
contract MockUniswapV3Factory {
    mapping(bytes32 => address) public pools;
    event PoolCreated(address indexed tokenA, address indexed tokenB, uint24 fee, address pool);

    function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool) {
        bytes32 key = keccak256(abi.encode(tokenA, tokenB, fee));
        require(pools[key] == address(0), "pool exists");
        pool = address(uint160(uint256(keccak256(abi.encode(key, block.chainid)))));
        pools[key] = pool;
        emit PoolCreated(tokenA, tokenB, fee, pool);
    }
}
