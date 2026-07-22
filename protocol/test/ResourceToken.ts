import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("ResourceToken", function () {
  async function fixture() {
    const [owner, oracle, user, outsider] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ResourceToken");
    const token = await upgrades.deployProxy(
      Token,
      ["Auros Water", "AWTR", "WATER", owner.address],
      { kind: "uups" },
    );
    await token.waitForDeployment();
    await token.setOracle(oracle.address);
    return { owner, oracle, user, outsider, token };
  }

  it("allows only the configured oracle to mint and burn", async function () {
    const { token, oracle, user, outsider } = await fixture();
    await expect(token.connect(oracle).mint(user.address, 100n))
      .to.emit(token, "ResourceMinted")
      .withArgs(user.address, 100n);
    await expect(token.connect(outsider).mint(user.address, 1n)).to.be.reverted;
    await token.connect(oracle).burn(user.address, 40n);
    expect(await token.balanceOf(user.address)).to.equal(60n);
  });

  it("revokes the previous oracle and enforces expiration", async function () {
    const { token, owner, oracle, user, outsider } = await fixture();
    await token.connect(owner).setOracle(outsider.address);
    await expect(token.connect(oracle).mint(user.address, 1n)).to.be.reverted;
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    await token.connect(owner).setExpiration(true, now + 10);
    await ethers.provider.send("evm_increaseTime", [11]);
    await expect(token.connect(outsider).mint(user.address, 1n)).to.be.revertedWith("resource expired");
  });
});
