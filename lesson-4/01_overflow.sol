// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Counter {
    uint8 public count;

    function setCount(uint8 value) public {
        count = value;
    }

    function increment() public {
        count += 1;
    }

    function decrement() public {
        require(count > 0, "Below zero");
        count -= 1;
    }
}
