import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("EnergyFutures", function () {
  async function fixture() {
    const [owner, trader, lp, treasury] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const usdc = await MockERC20.deploy("Mock USDC", "mUSDC");

    const Oracle = await ethers.getContractFactory("MockIndexOracle");
    const oracle = await upgrades.deployProxy(
      Oracle,
      [owner.address, "kwh-france", ethers.parseEther("0.12")],
      { kind: "uups" }
    );

    const Futures = await ethers.getContractFactory("EnergyFutures");
    const futures = await upgrades.deployProxy(
      Futures,
      [owner.address, await usdc.getAddress(), await oracle.getAddress(), treasury.address],
      { kind: "uups" }
    );

    const mintAmt = ethers.parseEther("1000000");
    await usdc.mint(trader.address, mintAmt);
    await usdc.mint(lp.address, mintAmt);
    await usdc.connect(lp).approve(await futures.getAddress(), mintAmt);
    await usdc.connect(trader).approve(await futures.getAddress(), mintAmt);

    await futures.connect(lp).addLiquidity(ethers.parseEther("100000"));

    return { owner, trader, lp, treasury, usdc, oracle, futures };
  }

  it("opens and closes a long with 0.1% fees to treasury", async function () {
    const { trader, treasury, usdc, oracle, futures } = await fixture();
    const margin = ethers.parseEther("1000");
    const leverage = 5n;
    const size = margin * leverage;
    const openFee = (size * 10n) / 10_000n;

    const treasuryBefore = await usdc.balanceOf(treasury.address);
    await expect(futures.connect(trader).openPosition(true, margin, leverage))
      .to.emit(futures, "PositionOpened");

    expect(await usdc.balanceOf(treasury.address)).to.equal(treasuryBefore + openFee);

    const pos = await futures.positions(trader.address);
    expect(pos.open).to.equal(true);
    expect(pos.isLong).to.equal(true);
    expect(pos.size).to.equal(size);

    // Price +10% → long profits
    await oracle.setPrice(ethers.parseEther("0.132"));
    const traderBefore = await usdc.balanceOf(trader.address);
    await futures.connect(trader).closePosition();
    const traderAfter = await usdc.balanceOf(trader.address);
    expect(traderAfter).to.be.gt(traderBefore);
    expect((await futures.positions(trader.address)).open).to.equal(false);
  });

  it("rejects leverage above 10x and second open", async function () {
    const { trader, futures } = await fixture();
    await expect(futures.connect(trader).openPosition(true, 100n, 11n)).to.be.revertedWith(
      "EnergyFutures: bad params"
    );
    await futures.connect(trader).openPosition(false, ethers.parseEther("100"), 3n);
    await expect(
      futures.connect(trader).openPosition(true, ethers.parseEther("50"), 2n)
    ).to.be.revertedWith("EnergyFutures: already open");
  });

  it("settles funding after 8h when OI is skewed", async function () {
    const { trader, usdc, futures } = await fixture();
    await futures.connect(trader).openPosition(true, ethers.parseEther("1000"), 5n);

    const signers = await ethers.getSigners();
    const shortTrader = signers[4]!;
    await usdc.mint(shortTrader.address, ethers.parseEther("100000"));
    await usdc.connect(shortTrader).approve(await futures.getAddress(), ethers.parseEther("100000"));
    await futures.connect(shortTrader).openPosition(false, ethers.parseEther("200"), 5n);

    await time.increase(8 * 3600 + 1);
    await expect(futures.settleFunding()).to.emit(futures, "FundingSettled");
    expect(await futures.fundingIndex()).to.not.equal(0n);
  });

  it("liquidates an underwater position", async function () {
    const { trader, oracle, futures } = await fixture();
    await futures.connect(trader).openPosition(true, ethers.parseEther("100"), 10n);
    // Crash price 50% → long wiped
    await oracle.setPrice(ethers.parseEther("0.06"));
    await expect(futures.liquidate(trader.address)).to.emit(futures, "Liquidated");
    expect((await futures.positions(trader.address)).open).to.equal(false);
  });

  it("allows LP deposit and withdraw", async function () {
    const { lp, usdc, futures } = await fixture();
    const shares = await futures.lpShares(lp.address);
    const before = await usdc.balanceOf(lp.address);
    await futures.connect(lp).removeLiquidity(shares / 2n);
    expect(await usdc.balanceOf(lp.address)).to.be.gt(before);
  });
});
