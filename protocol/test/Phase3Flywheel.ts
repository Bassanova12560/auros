import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Phase 3 flywheel", function () {
  async function base() {
    const [owner, user, lp, treasury, seller] = await ethers.getSigners();
    const Mock = await ethers.getContractFactory("MockERC20");
    const usdc = await Mock.deploy("USDC", "USDC");
    const resource = await Mock.deploy("akWh", "akWh");
    const Oracle = await ethers.getContractFactory("MockIndexOracle");
    const oracle = await upgrades.deployProxy(
      Oracle,
      [owner.address, "kwh-france", ethers.parseEther("0.12")],
      { kind: "uups" }
    );
    const mint = ethers.parseEther("1000000");
    for (const a of [user, lp, seller, treasury]) {
      await usdc.mint(a.address, mint);
      await resource.mint(a.address, mint);
    }
    return { owner, user, lp, treasury, seller, usdc, resource, oracle };
  }

  it("ResourceOptions: write, buy (0.2% fee), settle ITM call", async function () {
    const { owner, user, seller, treasury, usdc, oracle } = await base();
    const Options = await ethers.getContractFactory("ResourceOptions");
    const opts = await upgrades.deployProxy(
      Options,
      [owner.address, await usdc.getAddress(), await oracle.getAddress(), treasury.address],
      { kind: "uups" }
    );
    const premium = ethers.parseEther("100");
    const margin = ethers.parseEther("1000");
    const size = ethers.parseEther("1000");
    const strike = ethers.parseEther("0.12");
    const expiry = (await time.latest()) + 3600;

    await usdc.connect(seller).approve(await opts.getAddress(), margin);
    const id = await opts
      .connect(seller)
      .writeOption.staticCall(0, strike, expiry, premium, margin, size);
    await opts.connect(seller).writeOption(0, strike, expiry, premium, margin, size);

    const fee = (premium * 20n) / 10_000n;
    const treasuryBefore = await usdc.balanceOf(treasury.address);
    await usdc.connect(user).approve(await opts.getAddress(), premium);
    await opts.connect(user).buyOption(id);
    expect(await usdc.balanceOf(treasury.address)).to.equal(treasuryBefore + fee);

    await oracle.setPrice(ethers.parseEther("0.15"));
    await time.increaseTo(expiry + 1);
    await opts.settleExpired(id);
    expect((await opts.options(id)).settled).to.equal(true);
  });

  it("ResourceLendingPool: deposit resource, borrow quote, repay with protocol share", async function () {
    const { owner, user, lp, treasury, usdc, resource } = await base();
    const Pool = await ethers.getContractFactory("ResourceLendingPool");
    const pool = await upgrades.deployProxy(
      Pool,
      [owner.address, await resource.getAddress(), await usdc.getAddress(), treasury.address],
      { kind: "uups" }
    );

    await usdc.connect(lp).approve(await pool.getAddress(), ethers.parseEther("50000"));
    await pool.connect(lp).depositQuote(ethers.parseEther("50000"));

    await resource.connect(user).approve(await pool.getAddress(), ethers.parseEther("10000"));
    await pool.connect(user).depositResource(ethers.parseEther("10000"));
    await pool.connect(user).borrowQuote(ethers.parseEther("4000"));

    const debt = await pool.quoteDebt(user.address);
    const treasuryBefore = await usdc.balanceOf(treasury.address);
    await usdc.connect(user).approve(await pool.getAddress(), ethers.parseEther("10000"));
    await pool.connect(user).repayQuote(debt);
    expect(await usdc.balanceOf(treasury.address)).to.be.gt(treasuryBefore);
  });

  it("AgentMarginAccount: deposit, borrow, liquidate underwater", async function () {
    const { owner, user, treasury, usdc } = await base();
    const Margin = await ethers.getContractFactory("AgentMarginAccount");
    const margin = await upgrades.deployProxy(
      Margin,
      [owner.address, await usdc.getAddress(), treasury.address],
      { kind: "uups" }
    );
    // Seed vault liquidity for borrows
    await usdc.mint(await margin.getAddress(), ethers.parseEther("100000"));
    await usdc.connect(user).approve(await margin.getAddress(), ethers.parseEther("1000"));
    await margin.connect(user).deposit(ethers.parseEther("1000"));
    await margin.connect(user).borrow(ethers.parseEther("4000"));
    const treasuryBefore = await usdc.balanceOf(treasury.address);
    await margin.liquidate(user.address);
    expect(await usdc.balanceOf(treasury.address)).to.be.gt(treasuryBefore);
  });

  it("ParametricInsurance: premium commission + claim on shortfall", async function () {
    const { owner, user, lp, treasury, usdc } = await base();
    const Ins = await ethers.getContractFactory("ParametricInsurance");
    const ins = await upgrades.deployProxy(
      Ins,
      [owner.address, await usdc.getAddress(), treasury.address],
      { kind: "uups" }
    );
    await usdc.connect(lp).approve(await ins.getAddress(), ethers.parseEther("20000"));
    await ins.connect(lp).provideCapital(ethers.parseEther("20000"));

    const premium = ethers.parseEther("1000");
    const coverage = ethers.parseEther("5000");
    await usdc.connect(user).approve(await ins.getAddress(), premium);
    const treasuryBefore = await usdc.balanceOf(treasury.address);
    const id = await ins
      .connect(user)
      .buyPolicy.staticCall(user.address, premium, coverage, 1000n, 3600);
    await ins.connect(user).buyPolicy(user.address, premium, coverage, 1000n, 3600);
    expect(await usdc.balanceOf(treasury.address)).to.equal(
      treasuryBefore + (premium * 1500n) / 10_000n
    );

    await ins.reportProduction(id, 100n); // shortfall vs 1000
    await time.increase(3601);
    const userBefore = await usdc.balanceOf(user.address);
    await ins.settleClaim(id);
    expect(await usdc.balanceOf(user.address)).to.equal(userBefore + coverage);
  });

  it("ComputeResource + ComputeFutures mint and trade", async function () {
    const { owner, user, lp, treasury, usdc, oracle } = await base();
    const Compute = await ethers.getContractFactory("ComputeResource");
    const flop = await upgrades.deployProxy(Compute, [owner.address], { kind: "uups" });
    await flop.mint(user.address, ethers.parseEther("10"), ethers.id("job-1"));
    expect(await flop.balanceOf(user.address)).to.equal(ethers.parseEther("10"));

    await oracle.setPriceForced(ethers.parseEther("1.25"));
    const CF = await ethers.getContractFactory("ComputeFutures");
    const cf = await upgrades.deployProxy(
      CF,
      [owner.address, await usdc.getAddress(), await oracle.getAddress(), treasury.address],
      { kind: "uups" }
    );
    await usdc.connect(lp).approve(await cf.getAddress(), ethers.parseEther("50000"));
    await cf.connect(lp).addLiquidity(ethers.parseEther("50000"));
    await usdc.connect(user).approve(await cf.getAddress(), ethers.parseEther("10000"));
    await cf.connect(user).openPosition(true, ethers.parseEther("1000"), 3n);
    await oracle.setPrice(ethers.parseEther("1.40"));
    await cf.connect(user).closePosition();
    expect((await cf.positions(user.address)).open).to.equal(false);
  });
});
