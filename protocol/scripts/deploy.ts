import { ethers, upgrades } from "hardhat";

async function proxy(name: string, args: unknown[]) {
  const factory = await ethers.getContractFactory(name);
  const contract = await upgrades.deployProxy(factory, args, { kind: "uups" });
  await contract.waitForDeployment();
  return contract;
}

/**
 * Full ARL core deploy: ResourceToken + Oracle + Watt + AUR + registries.
 * Run: npm run deploy:localhost (after `npm run node`).
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const owner = deployer.address;
  console.log("Deployer:", owner);

  const deviceRegistry = await proxy("DeviceRegistry", [owner]);
  const resourceToken = await proxy("ResourceToken", [
    "Auros Energy kWh",
    "akWh",
    "kwh",
    owner,
  ]);
  const oracle = await proxy("ResourceOracle", [await resourceToken.getAddress(), owner]);
  await (await resourceToken.setOracle(await oracle.getAddress())).wait();
  await (await oracle.registerOracle(owner, true)).wait();
  await (await oracle.setDeviceRegistry(await deviceRegistry.getAddress())).wait();

  const watt = await proxy("WattCoin", [owner]);
  await (await watt.setEnergyToken(await resourceToken.getAddress(), true)).wait();

  const aur = await proxy("AurosGovernanceToken", [owner, ethers.parseEther("100000000")]);

  const MockFactory = await ethers.getContractFactory("MockUniswapV3Factory");
  const factory = await MockFactory.deploy();
  await factory.waitForDeployment();

  const MockNPM = await ethers.getContractFactory("MockNonfungiblePositionManager");
  const npm = await MockNPM.deploy();
  await npm.waitForDeployment();

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const quote = await MockERC20.deploy("Mock USD", "mUSD");
  await quote.waitForDeployment();

  const bootstrapper = await proxy("LiquidityBootstrapper", [
    owner,
    await factory.getAddress(),
    await npm.getAddress(),
    await quote.getAddress(),
  ]);

  const bridge = await proxy("ResourceBridge", [owner, owner]);
  await (
    await resourceToken.grantRole(await resourceToken.RESOURCE_ORACLE(), await bridge.getAddress())
  ).wait();

  const agents = await proxy("AgentRegistry", [
    owner,
    await aur.getAddress(),
    ethers.parseEther("10"),
    30 * 24 * 3600,
  ]);

  const fees = await proxy("ProtocolFees", [
    owner,
    await aur.getAddress(),
    await quote.getAddress(),
  ]);

  const waterRight = await proxy("WaterRightNFT", [owner]);
  const water = await proxy("WaterToken", [owner]);
  await (await waterRight.setWaterToken(await water.getAddress())).wait();
  await (await water.setWaterRightContract(await waterRight.getAddress())).wait();

  const indexOracle = await proxy("MockIndexOracle", [owner, "kwh-france", ethers.parseEther("0.12")]);
  const futures = await proxy("EnergyFutures", [
    owner,
    await quote.getAddress(),
    await indexOracle.getAddress(),
    owner,
  ]);

  const addresses = {
    network: (await ethers.provider.getNetwork()).name,
    deployer: owner,
    deviceRegistry: await deviceRegistry.getAddress(),
    resourceToken: await resourceToken.getAddress(),
    resourceOracle: await oracle.getAddress(),
    wattCoin: await watt.getAddress(),
    aur: await aur.getAddress(),
    liquidityBootstrapper: await bootstrapper.getAddress(),
    resourceBridge: await bridge.getAddress(),
    agentRegistry: await agents.getAddress(),
    protocolFees: await fees.getAddress(),
    waterRightNFT: await waterRight.getAddress(),
    waterToken: await water.getAddress(),
    mockQuote: await quote.getAddress(),
    indexOracle: await indexOracle.getAddress(),
    energyFutures: await futures.getAddress(),
  };

  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
