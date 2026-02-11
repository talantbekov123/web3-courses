// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Airdrop {
    address[] public users;

    function addUser(address user) external {
        users.push(user);
    }

    function distribute() external {
        for (uint i = 0; i < users.length; i++) {
            payable(users[i]).transfer(0.001 ether);
        }
    }

    // Allow the contract to receive ETH
    receive() external payable {}
}
