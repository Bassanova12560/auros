import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("WattCoin", function () {
  async function fixture() {
    const [owner, user] = await ethers.getSigners();
    const Collateral = await ethers.getContractFactory("MockERC20");
    const collateral = await Collateral.deploy("Energy", "NRG");
    const Watt = await ethers.getContractFactory("WattCoin");
    const watt = await upgrades.deployProxy(Watt, [owner.address], { kind: "uups" });
    await collateral.mint(user.address, ethers.parseEther("100"));
    return { owner, user, collateral, watt };
  }

  it("mints one-to-one against approved collateral and redeems", async function () {
    const { owner, user, collateral, watt } = await fixture();
    const amount = ethers.parseEther("10");
    await watt.connect(owner).setEnergyToken(await collateral.getAddress(), true);
    await collateral.connect(user).approve(await watt.getAddress(), amount);
    await expect(watt.connect(user).mintWithCollateral(await collateral.getAddress(), amount))
      .to.emit(watt, "CollateralMinted");
    expect(await watt.balanceOf(user.address)).to.equal(amount);
    await watt.connect(user).redeem(await collateral.getAddress(), amount);
    expect(await watt.balanceOf(user.address)).to.equal(0n);
    expect(await collateral.balanceOf(user.address)).to.equal(ethers.parseEther("100"));
  });

  it("rejects unauthorized collateral and paused minting", async function () {
    const { owner, user, collateral, watt } = await fixture();
    await expect(watt.connect(user).mintWithCollateral(await collateral.getAddress(), 1n))
      .to.be.revertedWith("unauthorized collateral");
    await watt.connect(owner).setEnergyToken(await collateral.getAddress(), true);
    await watt.connect(owner).pause();
    await expect(watt.connect(user).mintWithCollateral(await collateral.getAddress(), 1n)).to.be.reverted;
  });
});
