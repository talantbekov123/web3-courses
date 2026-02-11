import abi from "./03_abi.json";
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const client = createPublicClient({
    chain: sepolia,
    transport: http(),
})

const tokenBalance = await client.readContract({
    address: '0x67d15d88F7C597364E21795fFAB86cE03128EB4F',
    abi: abi,
    functionName: 'balanceOf',
    args: ['0xaeF33e76972C08b8AC19221cB6e7d2fa4054af43'],
})

console.log(tokenBalance)
