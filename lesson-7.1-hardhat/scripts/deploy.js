import { network } from "hardhat";

const { ethers, networkName } = await network.connect('sepolia');
// const { ethers, networkName } = await network.connect();

console.log(`Deploying to ${networkName}...`);

const hello = await ethers.deployContract("HelloWorld");
await hello.waitForDeployment();
console.log("HelloWorld deployed to:", await hello.getAddress());

const counter = await ethers.deployContract("Counter");
await counter.waitForDeployment();
console.log("Counter deployed to:", await counter.getAddress());

const owned = await ethers.deployContract("Owned");
await owned.waitForDeployment();
console.log("Owned deployed to:", await owned.getAddress());
