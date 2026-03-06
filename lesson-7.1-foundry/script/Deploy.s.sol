// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/HelloWorld.sol";
import "../src/Counter.sol";
import "../src/Owned.sol";

contract DeployScript is Script {
    uint256 constant PRIVATE_KEY = 0xc33e01cfe5c969db44510a9118a9de88f54bffd1e0c740d9ac05a8e6c27bc197;

    function run() external {
        vm.startBroadcast(PRIVATE_KEY);

        HelloWorld hello = new HelloWorld();
        console.log("HelloWorld deployed to:", address(hello));

        Counter counter = new Counter();
        console.log("Counter deployed to:", address(counter));

        Owned owned = new Owned();
        console.log("Owned deployed to:", address(owned));

        vm.stopBroadcast();
    }
}
