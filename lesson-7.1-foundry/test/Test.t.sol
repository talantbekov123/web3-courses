// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/HelloWorld.sol";
import "../src/Counter.sol";

contract HelloWorldTest is Test {
    HelloWorld hello;

    function setUp() public {
        hello = new HelloWorld();
    }

    function test_defaultMessage() public view {
        assertEq(hello.getMessage(), "Hello, World!");
    }

    function test_setMessage() public {
        hello.setMessage("Hey!");
        assertEq(hello.getMessage(), "Hey!");
    }
}

contract CounterTest is Test {
    Counter counter;

    function setUp() public {
        counter = new Counter();
    }

    function test_incrementAndDecrement() public {
        counter.increment();
        counter.increment();
        assertEq(counter.count(), 2);
        counter.decrement();
        assertEq(counter.count(), 1);
    }
}
