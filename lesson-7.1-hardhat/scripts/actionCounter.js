import { network } from "hardhat";

const { viem, networkName } = await network.connect("sepolia");
console.log(`Interacting on ${networkName}...`);

const address = "0x319b550b42021F430b6B9a7aAb8d569ec733f557";
const counter = await viem.getContractAt("Counter", address);

console.log("Count:", (await counter.read.count()).toString());

await counter.write.increment();
console.log("Incremented!");

await counter.write.increment();
console.log("Incremented again!");

console.log("Count:", (await counter.read.count()).toString());

await counter.write.decrement();
console.log("Decremented!");

console.log("Final count:", (await counter.read.count()).toString());
