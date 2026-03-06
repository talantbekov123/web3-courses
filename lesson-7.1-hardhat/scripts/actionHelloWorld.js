import { network } from "hardhat";

const { ethers, networkName } = await network.connect("sepolia");
console.log(`Interacting on ${networkName}...`);

const address = "0xDD6c3DA68123C3944650B5A5C94086fAd3F2A981";
const hello = await ethers.getContractAt("HelloWorld", address);

// Read current message
const current = await hello.getMessage();
console.log("Current message:", current);

// Set a new message
const tx = await hello.setMessage("Hello from Hardhat!");
await tx.wait();
console.log("Message updated!");

// Read again
const updated = await hello.getMessage();
console.log("New message:", updated);