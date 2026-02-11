import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const client = createPublicClient({
    chain: sepolia,
    transport: http(),
})

const balance = await client.getBalance({
    address: '0xaeF33e76972C08b8AC19221cB6e7d2fa4054af43',
})

console.log(balance)
