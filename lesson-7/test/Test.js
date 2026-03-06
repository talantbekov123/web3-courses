import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("HelloWorld", function () {
  it("should return default message", async function () {
    const hello = await ethers.deployContract("HelloWorld");
    expect(await hello.getMessage()).to.equal("Hello, World!");
  });

  it("should set a new message", async function () {
    const hello = await ethers.deployContract("HelloWorld");
    await hello.setMessage("Hey!");
    expect(await hello.getMessage()).to.equal("Hey!");
  });
});

describe("Counter", function () {
  it("should increment and decrement", async function () {
    const counter = await ethers.deployContract("Counter");
    await counter.increment();
    await counter.increment();
    expect(await counter.count()).to.equal(2);
    await counter.decrement();
    expect(await counter.count()).to.equal(1);
  });
});
