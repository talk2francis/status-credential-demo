import { formatEther } from 'viem'
import { network } from 'hardhat'

async function main() {
  const { viem } = await network.connect({
    network: 'statusTestnet',
    chainType: 'op'
  })

  const [walletClient] = await viem.getWalletClients()
  const publicClient = await viem.getPublicClient()
  const balance = await publicClient.getBalance({ address: walletClient.account.address })

  console.log('Address:', walletClient.account.address)
  console.log('Balance:', formatEther(balance))
}

main()
