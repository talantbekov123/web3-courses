import { network } from "hardhat";

const { ethers, networkName } = await network.connect("sepolia");
console.log(`Interacting on ${networkName}...`);

const address = "0x319b550b42021F430b6B9a7aAb8d569ec733f557";
const counter = await ethers.getContractAt("Counter", address);

// Read current count
console.log("Count:", (await counter.count()).toString());

// Increment twice
let tx = await counter.increment();
await tx.wait();
console.log("Incremented!");

tx = await counter.increment();
await tx.wait();
console.log("Incremented again!");

console.log("Count:", (await counter.count()).toString());

// Decrement once
tx = await counter.decrement();
await tx.wait();
console.log("Decremented!");

console.log("Final count:", (await counter.count()).toString());