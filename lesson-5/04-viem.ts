import { createWalletClient, http, parseEther } from 'viem'
import { sepolia } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

const mnemonic = 'share chief zebra worth love smoke joy mystery dumb vessel critic poem'

const account = mnemonicToAccount(mnemonic)

const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
})

const tx = await walletClient.sendTransaction({
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    value: parseEther('0.001'),
})

console.log(tx)