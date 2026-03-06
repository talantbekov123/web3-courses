import { network } from "hardhat";

const { ethers, networkName } = await network.connect("sepolia");
console.log(`Interacting on ${networkName}...`);

const address = "0x5eCc049e43AC9fEB12c1407F4Bb69e850C2700E7";
const owned = await ethers.getContractAt("Owned", address);

// Check owner
const owner = await owned.owner();
console.log("Contract owner:", owner);

// Try calling owner-only function
try {
  const tx = await owned.doOwnerThing();
  await tx.wait();
  console.log("doOwnerThing() succeeded!");
} catch (err) {
  console.log("doOwnerThing() failed:", err.reason || err.message);
}