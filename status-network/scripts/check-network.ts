import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect({
    network: "statusTestnet",
    chainType: "op",
  });

  const publicClient = await viem.getPublicClient();
  const block = await publicClient.getBlockNumber();
  console.log(`Status Network testnet reachable. Latest block: ${block}`);
}

main();
