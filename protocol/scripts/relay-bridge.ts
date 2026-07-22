import { ethers } from "hardhat";
async function main() {
  const { BRIDGE_ADDRESS, BRIDGE_TOKEN, BRIDGE_RECIPIENT, BRIDGE_AMOUNT, BRIDGE_NONCE } = process.env;
  if (!BRIDGE_ADDRESS || !BRIDGE_TOKEN || !BRIDGE_RECIPIENT || !BRIDGE_AMOUNT || !BRIDGE_NONCE) {
    throw new Error("Set all BRIDGE_* values from .env.example");
  }
  const chain = await ethers.provider.getNetwork();
  const id = ethers.solidityPackedKeccak256(
    ["uint256", "address", "address", "uint256", "uint256"],
    [chain.chainId, BRIDGE_TOKEN, BRIDGE_RECIPIENT, BRIDGE_AMOUNT, BRIDGE_NONCE],
  );
  const bridge = await ethers.getContractAt("ResourceBridge", BRIDGE_ADDRESS);
  const transaction = await bridge.relayMint(id, BRIDGE_TOKEN, BRIDGE_RECIPIENT, BRIDGE_AMOUNT);
  await transaction.wait();
  console.log(`Relayed ${id} in ${transaction.hash}`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
