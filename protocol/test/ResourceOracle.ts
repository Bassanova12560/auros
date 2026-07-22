import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("ResourceOracle", function () {
  async function fixture() {
    const [owner, oracleSigner, user, badSigner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ResourceToken");
    const token = await upgrades.deployProxy(
      Token,
      ["Auros Energy", "AENG", "ENERGY", owner.address],
      { kind: "uups" },
    );
    const Registry = await ethers.getContractFactory("DeviceRegistry");
    const registry = await upgrades.deployProxy(Registry, [owner.address], { kind: "uups" });
    const Oracle = await ethers.getContractFactory("ResourceOracle");
    const oracle = await upgrades.deployProxy(
      Oracle,
      [await token.getAddress(), owner.address],
      { kind: "uups" },
    );
    await token.setOracle(await oracle.getAddress());
    await oracle.registerOracle(oracleSigner.address, true);
    return { owner, oracleSigner, user, badSigner, token, registry, oracle };
  }

  async function signatureFor(signer: any, user: string, amount: bigint) {
    const hash = ethers.solidityPackedKeccak256(["address", "uint256"], [user, amount]);
    return signer.signMessage(ethers.getBytes(hash));
  }

  it("verifies a registered signer and rejects proof replay", async function () {
    const { oracleSigner, user, token, oracle } = await fixture();
    const signature = await signatureFor(oracleSigner, user.address, 25n);
    await expect(oracle.reportMint(user.address, 25n, signature)).to.emit(oracle, "ProofVerified");
    expect(await token.balanceOf(user.address)).to.equal(25n);
    await expect(oracle.reportMint(user.address, 25n, signature)).to.be.revertedWith("proof already used");
  });

  it("rejects bad signatures and unauthorized devices", async function () {
    const { owner, oracleSigner, user, badSigner, registry, oracle } = await fixture();
    const badSignature = await signatureFor(badSigner, user.address, 10n);
    await expect(oracle.reportMint(user.address, 10n, badSignature)).to.be.revertedWith("invalid oracle");
    await oracle.connect(owner).setDeviceRegistry(await registry.getAddress());
    const signature = await signatureFor(oracleSigner, user.address, 11n);
    await expect(oracle.reportMint(user.address, 11n, signature)).to.be.revertedWith("device not authorized");
    await registry.connect(owner).registerDevice(oracleSigner.address, true);
    await expect(oracle.reportMint(user.address, 11n, signature)).to.emit(oracle, "ProofVerified");
  });

  it("blocks reports while paused", async function () {
    const { owner, oracleSigner, user, oracle } = await fixture();
    const signature = await signatureFor(oracleSigner, user.address, 1n);
    await oracle.connect(owner).pause();
    await expect(oracle.reportMint(user.address, 1n, signature)).to.be.reverted;
  });
});
