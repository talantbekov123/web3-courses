import { network } from "hardhat";

const { viem, networkName } = await network.connect("sepolia");
console.log(`Interacting on ${networkName}...`);

const address = "0xDD6c3DA68123C3944650B5A5C94086fAd3F2A981";
const hello = await viem.getContractAt("HelloWorld", address);

const current = await hello.read.getMessage();
console.log("Current message:", current);

await hello.write.setMessage(["Hello from Hardhat!"]);
console.log("Message updated!");

const updated = await hello.read.getMessage();
console.log("New message:", updated);
