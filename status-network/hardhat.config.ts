import "dotenv/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";

const statusRpcUrl = process.env.STATUS_RPC_URL;
const statusPrivateKey = process.env.PRIVATE_KEY;
const statusChainId = process.env.STATUS_CHAIN_ID
  ? Number(process.env.STATUS_CHAIN_ID)
  : undefined;

if (!statusRpcUrl || !statusPrivateKey || !statusChainId) {
  console.warn("STATUS network env vars are missing; statusTestnet network will be unavailable until they are set.");
}

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
        settings: {
          evmVersion: "paris"
        }
      },
      production: {
        version: "0.8.28",
        settings: {
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    statusTestnet: {
      type: "http",
      chainType: "op",
      chainId: statusChainId ?? 1660990954,
      url: statusRpcUrl ?? "https://public.sepolia.rpc.status.network",
      accounts: [statusPrivateKey ?? "0x"],
    },
  },
});
