// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Owned.sol";

contract ActionOwnedScript is Script {
    uint256 constant PRIVATE_KEY = 0xc33e01cfe5c969db44510a9118a9de88f54bffd1e0c740d9ac05a8e6c27bc197;

    function run() external {
        address target = 0x5eCc049e43AC9fEB12c1407F4Bb69e850C2700E7;
        Owned owned = Owned(target);

        address currentOwner = owned.owner();
        console.log("Contract owner:", currentOwner);

        vm.startBroadcast(PRIVATE_KEY);
        try owned.doOwnerThing() {
            console.log("doOwnerThing() succeeded!");
        } catch Error(string memory reason) {
            console.log("doOwnerThing() failed:", reason);
        }
        vm.stopBroadcast();
    }
}
