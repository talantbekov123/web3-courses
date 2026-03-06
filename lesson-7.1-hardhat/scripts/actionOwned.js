import { network } from "hardhat";

const { viem, networkName } = await network.connect("sepolia");
console.log(`Interacting on ${networkName}...`);

const address = "0x5eCc049e43AC9fEB12c1407F4Bb69e850C2700E7";
const owned = await viem.getContractAt("Owned", address);

const owner = await owned.read.owner();
console.log("Contract owner:", owner);

try {
  await owned.write.doOwnerThing();
  console.log("doOwnerThing() succeeded!");
} catch (err) {
  console.log("doOwnerThing() failed:", err.shortMessage || err.message);
}
