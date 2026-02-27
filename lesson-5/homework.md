Homework: Telegram Wallet Bot (Sepolia)
Stack: viem + Telegram Bot API (telegraf or node-telegram-bot-api)
Goal: Build a Telegram bot that acts as a simple crypto wallet on the Sepolia testnet. Each user gets one wallet, stored persistently, and can manage it through bot commands.

Requirements
Wallet Generation

On first /start or /wallet command, generate a wallet for the user (private key + address)
Store the wallet persistently (file, SQLite, JSON — student's choice)
If the user already has a wallet, show the address — never generate a new one

Commands to implement:
CommandDescription/walletShow the user's wallet address/balanceFetch and display ETH balance on Sepolia/send <address> <amount>Send ETH to a given address

Technical Notes

Use viem for all blockchain interactions (wallet generation, balance, sending transactions)
Use Sepolia testnet (https://sepolia.infura.io/v3/... or any public RPC)
Private keys must be stored server-side — the user never sees it (or optionally shown once on creation)
Use privateKeyToAccount and createWalletClient from viem


Evaluation Criteria

Wallet is generated once per user and persists between bot restarts
Balance and send commands work correctly on Sepolia
No crashes on bad input (wrong address, insufficient funds, etc.)


Tips

Get free Sepolia ETH from a faucet (sepoliafaucet.com)
Keep it simple — a flat JSON file for storage is totally fine


Looks like a solid assignment to me. It covers real concepts (key management, signing transactions, RPC calls) without being overwhelming. The "one wallet per user" constraint is a nice guardrail that forces students to think about persistence. You might also consider making /send confirmation-based (bot asks "are you sure?") as a bonus challenge. Sonnet 4.6