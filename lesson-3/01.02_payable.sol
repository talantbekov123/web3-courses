// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RandomWithdraw {
    address[] public players;
    address public lastWinner;

    event Paid(address indexed from, uint256 amount);
    event WinnerSelected(address indexed winner, uint256 amount);

    // Automatically called when ETH is sent with empty calldata
    receive() external payable {
        require(msg.value > 0, "Send ETH");
        players.push(msg.sender);
        emit Paid(msg.sender, msg.value);
    }

    // Pick random winner, pay, and reset for next round
    function pickWinner() external {
        require(players.length > 0, "No players");

        // Use block.timestamp modulo number of players
        uint256 randomIndex = block.timestamp % players.length;

        address winner = players[randomIndex];
        uint256 amount = address(this).balance;

        // ✅ Reset state BEFORE transfer (reentrancy-safe)
        delete players;

        payable(winner).transfer(amount);

        emit WinnerSelected(winner, amount);
    }
}
