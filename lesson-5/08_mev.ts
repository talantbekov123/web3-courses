import { parseGwei } from 'viem'

const tx = await walletClient.writeContract({
  address: contractAddress,
  abi: erc20Abi,
  functionName: 'transfer',
  args: [
    '0xEaBd3817A605F7c633c71A91Bac8Dd82B27D6567',
    parseEther('0.1'),
  ],
  // 🔥 Increased gas fees
  maxPriorityFeePerGas: parseGwei('3'), // tip to validator (default ~1–2)
  maxFeePerGas: parseGwei('40'),        // total max fee
})
