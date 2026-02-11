import { createPublicClient, createWalletClient, erc20Abi, http, parseEther, formatEther } from 'viem'
import { sepolia } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

const mnemonic = 'share chief zebra worth love smoke joy mystery dumb vessel critic alcohol'

const account = mnemonicToAccount(mnemonic)

const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
})

const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
})

const contractAddress = '0x419d708DDD4B68DF3e0f43cacDe52F3C0b48F79e'

// Check balance first
const balance = await publicClient.readContract({
    address: contractAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account.address],
})

console.log(`Current balance: ${formatEther(balance)} tokens`)

// Transfer a small amount (0.1 tokens) instead of 10
const tx = await walletClient.writeContract({
    address: contractAddress,
    abi: erc20Abi,
    functionName: 'transfer',
    args: ['0xEaBd3817A605F7c633c71A91Bac8Dd82B27D6567', parseEther('0.1')],
})

console.log('Transaction hash:', tx)