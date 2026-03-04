// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80,
            int256 answer,
            uint256,
            uint256,
            uint80
        );

    function decimals() external view returns (uint8);
}

contract EthPriceOracle {
    AggregatorV3Interface public priceFeed;

    // ETH/USD price feed (Sepolia testnet)
    constructor() {
        priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    // Returns ETH price in USD (18 decimals)
    function getEthPrice() public view returns (uint256) {
        (, int256 price,,,) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();

        return uint256(price) * (10 ** (18 - decimals));
    }
}
