// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Counter.sol";

contract ActionCounterScript is Script {
    uint256 constant PRIVATE_KEY = 0xc33e01cfe5c969db44510a9118a9de88f54bffd1e0c740d9ac05a8e6c27bc197;

    function run() external {
        address target = 0x319b550b42021F430b6B9a7aAb8d569ec733f557;
        Counter counter = Counter(target);

        console.log("Count:", counter.count());

        vm.startBroadcast(PRIVATE_KEY);
        counter.increment();
        console.log("Incremented!");

        counter.increment();
        console.log("Incremented again!");

        console.log("Count:", counter.count());

        counter.decrement();
        console.log("Decremented!");
        vm.stopBroadcast();

        console.log("Final count:", counter.count());
    }
}
