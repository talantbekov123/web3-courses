import {
  Address,
  createWalletClient,
  http,
  parseGwei,
} from 'viem'
import { sepolia } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

// Demo account (same style as 05-viem.ts)
const mnemonic =
  'share chief zebra worth love smoke joy mystery dumb vessel critic alcohol'

const account = mnemonicToAccount(mnemonic)

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
})

// Replace with your deployed PGADemo address on Sepolia
const pgaDemoAddress: Address =
  '0x0000000000000000000000000000000000000000'

// Minimal ABI for PGADemo.claim()
const pgaDemoAbi = [
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'claim',
    inputs: [],
    outputs: [],
  },
] as const

// Send a tx to PGADemo.claim with higher gas price (PGA race)
const txHash = await walletClient.writeContract({
  address: pgaDemoAddress,
  abi: pgaDemoAbi,
  functionName: 'claim',
  maxPriorityFeePerGas: parseGwei('3'), // tip to validator
  maxFeePerGas: parseGwei('40'),
})

console.log('PGADemo.claim tx hash:', txHash)
