import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("DeviceRegistry", function () {
  it("registers and revokes devices", async function () {
    const [owner, device] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("DeviceRegistry");
    const registry = await upgrades.deployProxy(Registry, [owner.address], { kind: "uups" });
    await expect(registry.registerDevice(device.address, true))
      .to.emit(registry, "DeviceRegistered")
      .withArgs(device.address, true);
    expect(await registry.isAuthorized(device.address)).to.equal(true);
    await registry.registerDevice(device.address, false);
    expect(await registry.isAuthorized(device.address)).to.equal(false);
  });

  it("rejects unauthorized registration and zero addresses", async function () {
    const [owner, outsider] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("DeviceRegistry");
    const registry = await upgrades.deployProxy(Registry, [owner.address], { kind: "uups" });
    await expect(registry.connect(outsider).registerDevice(outsider.address, true)).to.be.reverted;
    await expect(registry.registerDevice(ethers.ZeroAddress, true)).to.be.revertedWith("zero device");
  });
});
