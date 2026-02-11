// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Faucet {
    receive() external payable {}

    function withdraw(address payable to) external {
        uint256 amount = 0.01 ether;
        require(address(this).balance >= amount, "Insufficient balance");

        to.transfer(amount);
    }
}

// (bool sent, ) = to.call{value: amount}("");
// (bool sent, ) = to.call{value: amount, gas: 5000}("");
