// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/HelloWorld.sol";

contract ActionHelloWorldScript is Script {
    uint256 constant PRIVATE_KEY = 0xc33e01cfe5c969db44510a9118a9de88f54bffd1e0c740d9ac05a8e6c27bc197;

    function run() external {
        address target = 0xDD6c3DA68123C3944650B5A5C94086fAd3F2A981;
        HelloWorld hello = HelloWorld(target);

        string memory current = hello.getMessage();
        console.log("Current message:", current);

        vm.startBroadcast(PRIVATE_KEY);
        hello.setMessage("Hello from Foundry!");
        vm.stopBroadcast();

        console.log("Message updated!");

        string memory updated = hello.getMessage();
        console.log("New message:", updated);
    }
}
