import { artifacts, network } from 'hardhat'

async function main() {
  const { viem } = await network.connect({
    network: 'statusTestnet',
    chainType: 'op'
  })

  const publicClient = await viem.getPublicClient()
  const [walletClient] = await viem.getWalletClients()

  console.log('Deploying with:', walletClient.account.address)

  const artifact = await artifacts.readArtifact('StatusCredential')

  try {
    const hash = await walletClient.deployContract({
      abi: artifact.abi,
      bytecode: artifact.bytecode as `0x${string}`,
      args: [walletClient.account.address],
      maxFeePerGas: 0n,
      maxPriorityFeePerGas: 0n
    })

    console.log('Deployment tx hash:', hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('StatusCredential deployed at:', receipt.contractAddress)
  } catch (error) {
    console.error('Deployment failed:', error)
    if (error?.shortMessage) {
      console.error('Short message:', error.shortMessage)
    }
    if (error?.details) {
      console.error('Details:', error.details)
    }
    throw error
  }
}

main()
