// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Owned {
    address public owner;

    constructor() {
        owner = 0xaeF33e76972C08b8AC19221cB6e7d2fa4054af43;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function doOwnerThing() public onlyOwner {
        // owner-only logic here
    }
}
