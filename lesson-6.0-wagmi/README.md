Homework
https://clicker-pi-flame.vercel.app/

Web3 Clicker App - Homework Assignment
Build a Web3 clicker game where users earn on-chain tokens by clicking a button.

What the app does
A minimal web3 game with two pages:
Game Page (index) - A large clickable button in the center. Each click increments a local (pending) counter. When the user is ready, they call a mint() function on an ERC-20 smart contract to mint CLK tokens equal to their pending click count. Stats shown: on-chain score, pending clicks, and CLK token balance.
Leaderboard Page - Reads on-chain data and displays a ranked list of wallet addresses by total clicks/tokens minted.

Tech Stack Requirements

Frontend framework: Any (React recommended)
Wallet connection & transactions: wagmi + RainbowKit
Smart contract interaction: Call a mint(uint256 amount) function on a deployed ERC-20 contract

Core Features

Connect/disconnect wallet via RainbowKit
Click button → accumulates pending clicks locally
"Mint" button → sends transaction to mint ERC-20 tokens
Display: on-chain balance, pending count, CLK token balance
Leaderboard reading balances from the contract