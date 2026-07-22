import { ethers, upgrades } from "hardhat";

async function proxy(name: string, args: unknown[]) {
  const contract = await upgrades.deployProxy(await ethers.getContractFactory(name), args, { kind: "uups" });
  await contract.waitForDeployment();
  return contract;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const owner = deployer.address;
  const Mock = await ethers.getContractFactory("MockERC20");
  const reserve = await Mock.deploy("Mock Auros Reserve", "mRES");
  const Factory = await ethers.getContractFactory("MockUniswapV3Factory");
  const factory = await Factory.deploy();
  const Manager = await ethers.getContractFactory("MockNonfungiblePositionManager");
  const manager = await Manager.deploy();
  await Promise.all([reserve.waitForDeployment(), factory.waitForDeployment(), manager.waitForDeployment()]);

  const resource = await proxy("ResourceToken", ["Auros Energy Resource", "AENERGY", "ENERGY", owner]);
  const devices = await proxy("DeviceRegistry", [owner]);
  const oracle = await proxy("ResourceOracle", [await resource.getAddress(), owner]);
  await (await resource.setOracle(await oracle.getAddress())).wait();
  await (await oracle.setDeviceRegistry(await devices.getAddress())).wait();
  const watt = await proxy("WattCoin", [owner]);
  await (await watt.setEnergyToken(await resource.getAddress(), true)).wait();
  const aur = await proxy("AurosGovernanceToken", [owner, ethers.parseEther("100000000")]);
  const bridge = await proxy("ResourceBridge", [owner, owner]);
  await (await resource.grantRole(await resource.RESOURCE_ORACLE(), await bridge.getAddress())).wait();
  const liquidity = await proxy("LiquidityBootstrapper", [owner, await factory.getAddress(), await manager.getAddress(), await reserve.getAddress()]);
  const agents = await proxy("AgentRegistry", [owner, await aur.getAddress(), await watt.getAddress(), owner]);
  const fees = await proxy("ProtocolFees", [owner, await aur.getAddress(), await watt.getAddress()]);
  const waterRight = await proxy("WaterRightNFT", [owner]);
  const water = await proxy("WaterToken", [owner]);
  await (await waterRight.setWaterToken(await water.getAddress())).wait();
  await (await water.setWaterRightContract(await waterRight.getAddress())).wait();

  const Timelock = await ethers.getContractFactory("TimelockController");
  const timelock = await Timelock.deploy(172800, [], [], owner);
  await timelock.waitForDeployment();
  const Governor = await ethers.getContractFactory("AurosGovernance");
  const governance = await Governor.deploy(await aur.getAddress(), await timelock.getAddress());
  await governance.waitForDeployment();
  await (await timelock.grantRole(await timelock.PROPOSER_ROLE(), await governance.getAddress())).wait();
  await (await timelock.grantRole(await timelock.EXECUTOR_ROLE(), ethers.ZeroAddress)).wait();

  console.log(JSON.stringify({
    ResourceToken: await resource.getAddress(), ResourceOracle: await oracle.getAddress(),
    DeviceRegistry: await devices.getAddress(), WattCoin: await watt.getAddress(),
    AurosGovernanceToken: await aur.getAddress(), ResourceBridge: await bridge.getAddress(),
    LiquidityBootstrapper: await liquidity.getAddress(), AgentRegistry: await agents.getAddress(),
    ProtocolFees: await fees.getAddress(), WaterRightNFT: await waterRight.getAddress(),
    WaterToken: await water.getAddress(), TimelockController: await timelock.getAddress(),
    AurosGovernance: await governance.getAddress(),
  }, null, 2));
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
  const deviceRegistry = await upgrades.deployProxy(DeviceRegistry, [deployer.address], {
    kind: "uups",
  });
  await deviceRegistry.waitForDeployment();

  const ResourceToken = await ethers.getContractFactory("ResourceToken");
  const resourceToken = await upgrades.deployProxy(
    ResourceToken,
    ["Auros Energy kWh", "akWh", "kwh", deployer.address],
    { kind: "uups" }
  );
  await resourceToken.waitForDeployment();

  const ResourceOracle = await ethers.getContractFactory("ResourceOracle");
  const oracle = await upgrades.deployProxy(
    ResourceOracle,
    [await resourceToken.getAddress(), deployer.address],
    { kind: "uups" }
  );
  await oracle.waitForDeployment();

  await (await resourceToken.setOracle(await oracle.getAddress())).wait();
  await (await oracle.registerOracle(deployer.address, true)).wait();
  await (await oracle.setDeviceRegistry(await deviceRegistry.getAddress())).wait();

  const WattCoin = await ethers.getContractFactory("WattCoin");
  const watt = await upgrades.deployProxy(WattCoin, [deployer.address], { kind: "uups" });
  await watt.waitForDeployment();
  await (await watt.setEnergyToken(await resourceToken.getAddress(), true)).wait();

  const AUR = await ethers.getContractFactory("AurosGovernanceToken");
  const aur = await upgrades.deployProxy(
    AUR,
    [deployer.address, ethers.parseEther("100000000")],
    { kind: "uups" }
  );
  await aur.waitForDeployment();

  const MockFactory = await ethers.getContractFactory("MockUniswapV3Factory");
  const factory = await MockFactory.deploy();
  await factory.waitForDeployment();

  const MockNPM = await ethers.getContractFactory("MockNonfungiblePositionManager");
  const npm = await MockNPM.deploy();
  await npm.waitForDeployment();

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const quote = await MockERC20.deploy("Mock USD", "mUSD");
  await quote.waitForDeployment();

  const Bootstrapper = await ethers.getContractFactory("LiquidityBootstrapper");
  const bootstrapper = await upgrades.deployProxy(
    Bootstrapper,
    [deployer.address, await factory.getAddress(), await npm.getAddress(), await quote.getAddress()],
    { kind: "uups" }
  );
  await bootstrapper.waitForDeployment();

  const Bridge = await ethers.getContractFactory("ResourceBridge");
  const bridge = await upgrades.deployProxy(Bridge, [deployer.address, deployer.address], {
    kind: "uups",
  });
  await bridge.waitForDeployment();

  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agents = await upgrades.deployProxy(
    AgentRegistry,
    [deployer.address, await aur.getAddress(), ethers.parseEther("10"), 30 * 24 * 3600],
    { kind: "uups" }
  );
  await agents.waitForDeployment();

  const ProtocolFees = await ethers.getContractFactory("ProtocolFees");
  const fees = await upgrades.deployProxy(
    ProtocolFees,
    [deployer.address, await aur.getAddress(), await quote.getAddress()],
    { kind: "uups" }
  );
  await fees.waitForDeployment();

  const WaterRightNFT = await ethers.getContractFactory("WaterRightNFT");
  const waterRight = await upgrades.deployProxy(WaterRightNFT, [deployer.address], {
    kind: "uups",
  });
  await waterRight.waitForDeployment();

  const addresses = {
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
    mockFactory: await factory.getAddress(),
    mockQuote: await quote.getAddress(),
  };

  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
