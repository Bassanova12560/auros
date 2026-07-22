import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("EnergyValidatorStaking", function () {
  it("bonds AUR with capacity and unbonds", async function () {
    const [owner, val] = await ethers.getSigners();
    const Mock = await ethers.getContractFactory("MockERC20");
    const aur = await Mock.deploy("AUR", "AUR");
    const Staking = await ethers.getContractFactory("EnergyValidatorStaking");
    const staking = await upgrades.deployProxy(
      Staking,
      [owner.address, await aur.getAddress(), ethers.parseEther("1000")],
      { kind: "uups" }
    );
    await aur.mint(val.address, ethers.parseEther("5000"));
    await aur.connect(val).approve(await staking.getAddress(), ethers.parseEther("5000"));
    await staking.connect(val).bond(ethers.parseEther("1000"), 5000n, "https://val.example");
    expect(await staking.totalCapacityKw()).to.equal(5000n);
    await staking.connect(val).unbond();
    expect((await staking.validators(val.address)).active).to.equal(false);
  });
});
