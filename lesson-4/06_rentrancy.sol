// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    // ✅ Allows users to deposit ETH
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // ✅ Allows contract to receive ETH directly
    receive() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        // ❌ Reentrancy vulnerability still exists here
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }
}
