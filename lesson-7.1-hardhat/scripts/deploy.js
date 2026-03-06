import { network } from "hardhat";

const { viem, networkName } = await network.connect('sepolia');
// const { viem, networkName } = await network.connect();

console.log(`Deploying to ${networkName}...`);

const hello = await viem.deployContract("HelloWorld");
console.log("HelloWorld deployed to:", hello.address);

const counter = await viem.deployContract("Counter");
console.log("Counter deployed to:", counter.address);

const owned = await viem.deployContract("Owned");
console.log("Owned deployed to:", owned.address);
