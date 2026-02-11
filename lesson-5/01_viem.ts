import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const client = createPublicClient({
    chain: sepolia,
    transport: http(),
})

const blockNumber = await client.getBlockNumber()
console.log(Number(blockNumber))
