import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("HelloWorld", async function () {
  const { viem } = await network.connect();

  it("should return default message", async function () {
    const hello = await viem.deployContract("HelloWorld");
    assert.equal(await hello.read.getMessage(), "Hello, World!");
  });

  it("should set a new message", async function () {
    const hello = await viem.deployContract("HelloWorld");
    await hello.write.setMessage(["Hey!"]);
    assert.equal(await hello.read.getMessage(), "Hey!");
  });
});

describe("Counter", async function () {
  const { viem } = await network.connect();

  it("should increment and decrement", async function () {
    const counter = await viem.deployContract("Counter");
    await counter.write.increment();
    await counter.write.increment();
    assert.equal(await counter.read.count(), 2n);
    await counter.write.decrement();
    assert.equal(await counter.read.count(), 1n);
  });
});
