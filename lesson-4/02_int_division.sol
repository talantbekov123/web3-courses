// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IntDivisionBug {
    // Suppose you want to pay out "1%" of some amount.
    function onePercent(uint256 amount) public pure returns (uint256) {
        // BUG: if amount < 100, this returns 0.
        // Example: amount = 99 => 99 / 100 = 0
        return amount / 100;
    }

    // Another common pattern: computing shares.
    function userShare(uint256 userBalance, uint256 totalBalance, uint256 rewardPool)
        public
        pure
        returns (uint256)
    {
        // BUG: if userBalance < totalBalance, userBalance / totalBalance may become 0
        // causing payout 0 even when they should get something.
        return (userBalance / totalBalance) * rewardPool;
    }
}
