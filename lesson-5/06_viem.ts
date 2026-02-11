import { createPublicClient, http } from 'viem'
import { sepolia, bsc } from 'viem/chains'

const client = createPublicClient({
  chain: bsc,
  transport: http(),
})

const tokenAddress = '0xba2ae424d960c26247dd6c32edc70b295c744c43'

import { parseAbiItem } from 'viem'

const transferEvent = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)'
)

const logs = await client.getLogs({
  address: tokenAddress,
  event: transferEvent,
  fromBlock: 5_000_000n,
  toBlock: 'latest',
})

console.log(logs)
