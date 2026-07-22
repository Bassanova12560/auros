import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("ARL security guards", function () {
  it("oracle circuit-breaker rejects >50% jumps by default", async function () {
    const [owner] = await ethers.getSigners();
    const Oracle = await ethers.getContractFactory("MockIndexOracle");
    const oracle = await upgrades.deployProxy(
      Oracle,
      [owner.address, "kwh", ethers.parseEther("1")],
      { kind: "uups" }
    );
    await expect(oracle.setPrice(ethers.parseEther("2"))).to.be.revertedWith(
      "MockIndexOracle: circuit breaker"
    );
    await oracle.setPrice(ethers.parseEther("1.4"));
    expect(await oracle.getPrice()).to.equal(ethers.parseEther("1.4"));
  });

  it("options reject self-trade", async function () {
    const [owner, seller, treasury] = await ethers.getSigners();
    const Mock = await ethers.getContractFactory("MockERC20");
    const usdc = await Mock.deploy("USDC", "USDC");
    const Oracle = await ethers.getContractFactory("MockIndexOracle");
    const oracle = await upgrades.deployProxy(
      Oracle,
      [owner.address, "kwh", ethers.parseEther("0.12")],
      { kind: "uups" }
    );
    const Options = await ethers.getContractFactory("ResourceOptions");
    const opts = await upgrades.deployProxy(
      Options,
      [owner.address, await usdc.getAddress(), await oracle.getAddress(), treasury.address],
      { kind: "uups" }
    );
    await usdc.mint(seller.address, ethers.parseEther("100000"));
    await usdc.connect(seller).approve(await opts.getAddress(), ethers.parseEther("100000"));
    const expiry = (await ethers.provider.getBlock("latest"))!.timestamp + 3600;
    await opts
      .connect(seller)
      .writeOption(0, ethers.parseEther("0.12"), expiry, ethers.parseEther("10"), ethers.parseEther("100"), ethers.parseEther("100"));
    await expect(opts.connect(seller).buyOption(1n)).to.be.revertedWith("self-trade");
  });
});
