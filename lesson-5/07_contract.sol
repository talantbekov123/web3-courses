// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PGADemo {
    address public winner;
    uint public highestGasPrice;

    // Only the tx with highest gas price "wins"
    function claim() external {
        require(tx.gasprice > highestGasPrice, "Outbid");
        highestGasPrice = tx.gasprice;
        winner = msg.sender;
    }
}
