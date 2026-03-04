// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AutomationCompatibleInterface} from
    "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract TimeBasedUpkeep is AutomationCompatibleInterface {
    uint256 public counter;
    uint256 public immutable interval;
    uint256 public lastTimeStamp;
    bool public stopped;

    event UpkeepPerformed(uint256 newCounter, uint256 timestamp);
    event Stopped();
    event Started();

    constructor(uint256 _intervalSeconds) {
        interval = _intervalSeconds;
        lastTimeStamp = block.timestamp;
    }

    function stop() external {
        stopped = true;
        emit Stopped();
    }

    function start() external {
        stopped = false;
        lastTimeStamp = block.timestamp; // reset interval
        emit Started();
    }

    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (stopped) {
            return (false, "");
        }

        upkeepNeeded = (block.timestamp - lastTimeStamp) >= interval;
        performData = "";
    }

    function performUpkeep(bytes calldata) external override {
        if (stopped) return;

        if ((block.timestamp - lastTimeStamp) < interval) return;

        lastTimeStamp = block.timestamp;
        counter += 1;

        emit UpkeepPerformed(counter, block.timestamp);
    }
}

// https://automation.chain.link