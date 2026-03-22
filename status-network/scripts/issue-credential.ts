import { network } from "hardhat";

const contractAddress = process.env.STATUS_CONTRACT_ADDRESS ?? process.argv[2];

if (!contractAddress) {
  throw new Error("STATUS_CONTRACT_ADDRESS env var or CLI arg is required");
}

async function main() {
  const xp = BigInt(process.env.STATUS_XP ?? "1000");
  const proofUri = process.env.STATUS_PROOF_URI ?? "https://statusnetcred.demo/status/proof/demo";

  const { viem } = await network.connect({
    network: "statusTestnet",
    chainType: "op",
  });

  const publicClient = await viem.getPublicClient();
  const [walletClient] = await viem.getWalletClients();
  const contract = await viem.getContractAt("StatusCredential", contractAddress as `0x${string}`);

  const learner = (process.env.STATUS_LEARNER ?? walletClient.account.address) as `0x${string}`;

  console.log(`Issuing credential to ${learner} with ${xp} XP`);

  const hash = await contract.write.issueCredential([
    learner,
    xp,
    proofUri,
  ]);

  console.log("Issue tx hash:", hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Credential issuance confirmed in block", receipt.blockNumber);
}

main();
