import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Signer, Wallet } from "ethers";

async function signMint(signer: Wallet, user: string, amount: bigint) {
  const digest = ethers.solidityPackedKeccak256(["address", "uint256"], [user, amount]);
  return signer.signMessage(ethers.getBytes(digest));
}

describe("ARL integration", function () {
  let owner: Signer;
  let user: Signer;
  let oracleWallet: Wallet;
  let resourceToken: any;
  let oracle: any;
  let deviceRegistry: any;
  let watt: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    oracleWallet = ethers.Wallet.createRandom().connect(ethers.provider);
    await owner.sendTransaction({ to: oracleWallet.address, value: ethers.parseEther("1") });

    const DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
    deviceRegistry = await upgrades.deployProxy(DeviceRegistry, [await owner.getAddress()], {
      kind: "uups",
    });

    const ResourceToken = await ethers.getContractFactory("ResourceToken");
    resourceToken = await upgrades.deployProxy(
      ResourceToken,
      ["Auros Energy kWh", "akWh", "kwh", await owner.getAddress()],
      { kind: "uups" }
    );

    const ResourceOracle = await ethers.getContractFactory("ResourceOracle");
    oracle = await upgrades.deployProxy(
      ResourceOracle,
      [await resourceToken.getAddress(), await owner.getAddress()],
      { kind: "uups" }
    );

    await resourceToken.setOracle(await oracle.getAddress());
    await oracle.registerOracle(oracleWallet.address, true);
    await oracle.setDeviceRegistry(await deviceRegistry.getAddress());

    const WattCoin = await ethers.getContractFactory("WattCoin");
    watt = await upgrades.deployProxy(WattCoin, [await owner.getAddress()], { kind: "uups" });
    await watt.setEnergyToken(await resourceToken.getAddress(), true);
  });

  it("mints via signed oracle report after device registration", async function () {
    await deviceRegistry["registerDevice(address,string,string)"](
      oracleWallet.address,
      "meter",
      "solar-1"
    );
    const amount = ethers.parseEther("1.5");
    const userAddr = await user.getAddress();
    const sig = await signMint(oracleWallet, userAddr, amount);
    await expect(oracle.reportMint(userAddr, amount, sig)).to.emit(oracle, "ProofVerified");
    expect(await resourceToken.balanceOf(userAddr)).to.equal(amount);
  });

  it("rejects invalid signature", async function () {
    await deviceRegistry["registerDevice(address,bool)"](oracleWallet.address, true);
    const bad = ethers.Wallet.createRandom();
    const amount = 100n;
    const userAddr = await user.getAddress();
    const digest = ethers.solidityPackedKeccak256(["address", "uint256"], [userAddr, amount]);
    const sig = await bad.signMessage(ethers.getBytes(digest));
    await expect(oracle.reportMint(userAddr, amount, sig)).to.be.revertedWith("invalid oracle");
  });

  it("WattCoin mint/redeem 1:1", async function () {
    await resourceToken.setOracle(await owner.getAddress());
    const amt = ethers.parseEther("10");
    const userAddr = await user.getAddress();
    await resourceToken.mint(userAddr, amt);
    await resourceToken.connect(user).approve(await watt.getAddress(), amt);
    await watt.connect(user).mintWithCollateral(await resourceToken.getAddress(), amt);
    expect(await watt.balanceOf(userAddr)).to.equal(amt);
    await watt.connect(user).redeem(await resourceToken.getAddress(), amt);
    expect(await resourceToken.balanceOf(userAddr)).to.equal(amt);
  });

  it("bootstraps mock Uniswap liquidity", async function () {
    const MockFactory = await ethers.getContractFactory("MockUniswapV3Factory");
    const factory = await MockFactory.deploy();
    const MockNPM = await ethers.getContractFactory("MockNonfungiblePositionManager");
    const npm = await MockNPM.deploy();
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const quote = await MockERC20.deploy("USD", "USD");

    await resourceToken.setOracle(await owner.getAddress());
    const amt = ethers.parseEther("100");
    await resourceToken.mint(await owner.getAddress(), amt);
    await quote.mint(await owner.getAddress(), amt);

    const Bootstrapper = await ethers.getContractFactory("LiquidityBootstrapper");
    const boot = await upgrades.deployProxy(
      Bootstrapper,
      [
        await owner.getAddress(),
        await factory.getAddress(),
        await npm.getAddress(),
        await quote.getAddress(),
      ],
      { kind: "uups" }
    );

    await resourceToken.approve(await boot.getAddress(), amt);
    await quote.approve(await boot.getAddress(), amt);
    await expect(boot.bootstrap(await resourceToken.getAddress(), amt, amt)).to.emit(
      boot,
      "LiquidityBootstrapped"
    );
  });
});
