import {
  Address,
  createPublicClient,
  http,
  parseEther,
} from 'viem'
import { mainnet } from 'viem/chains'

// Basic config
const RPC_URL =
  process.env.ETH_RPC_URL ?? 'https://mainnet.infura.io/v3/YOUR_KEY'

const POLL_INTERVAL_MS = 15_000
const AMOUNT_IN_ETH = 1n
const AMOUNT_IN_WEI = parseEther(AMOUNT_IN_ETH.toString())

// Mainnet addresses
const UNISWAP_V2_ROUTER: Address =
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const SUSHISWAP_V2_ROUTER: Address =
  '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'

const WETH: Address = '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2'
const USDT: Address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

// Minimal Uniswap V2 router ABI
const uniswapV2RouterAbi = [
  {
    type: 'function',
    stateMutability: 'view',
    name: 'getAmountsOut',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'path', type: 'address[]' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
  },
  {
    type: 'function',
    stateMutability: 'payable',
    name: 'swapExactETHForTokens',
    inputs: [
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'path', type: 'address[]' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
  },
] as const

type DexId = 'Uniswap V2' | 'SushiSwap'

const client = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL),
})

function nowIso() {
  return new Date().toISOString()
}

async function fetchPrices() {
  const results = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        address: UNISWAP_V2_ROUTER,
        abi: uniswapV2RouterAbi,
        functionName: 'getAmountsOut',
        args: [AMOUNT_IN_WEI, [WETH, USDT]],
      },
      {
        address: SUSHISWAP_V2_ROUTER,
        abi: uniswapV2RouterAbi,
        functionName: 'getAmountsOut',
        args: [AMOUNT_IN_WEI, [WETH, USDT]],
      },
    ],
  })

  const [uniOut, sushiOut] = results as readonly [readonly bigint[], readonly bigint[]]

  const uniUsdtOut = uniOut[1]
  const sushiUsdtOut = sushiOut[1]

  const uniPrice =
    Number(uniUsdtOut) / 10 ** 6 / Number(AMOUNT_IN_ETH) // USDT has 6 decimals
  const sushiPrice =
    Number(sushiUsdtOut) / 10 ** 6 / Number(AMOUNT_IN_ETH)

  return { uniPrice, sushiPrice, uniUsdtOut, sushiUsdtOut }
}

async function simulateBuyOnDex(dex: DexId) {
  const router =
    dex === 'Uniswap V2' ? UNISWAP_V2_ROUTER : SUSHISWAP_V2_ROUTER

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10)
  const recipient: Address =
    '0x0000000000000000000000000000000000000001'

  await client.simulateContract({
    address: router,
    abi: uniswapV2RouterAbi,
    functionName: 'swapExactETHForTokens',
    args: [0n, [WETH, USDT], recipient, deadline],
    value: AMOUNT_IN_WEI,
    account: recipient,
  })
}

async function main() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const { uniPrice, sushiPrice } = await fetchPrices()
      const timestamp = nowIso()

      const spreadPct =
        (Math.abs(uniPrice - sushiPrice) /
          Math.min(uniPrice, sushiPrice)) *
        100

      console.log(
        `[${timestamp}] Uniswap: $${uniPrice.toFixed(
          2,
        )} | Sushi: $${sushiPrice.toFixed(
          2,
        )} | Spread: ${spreadPct.toFixed(2)}%`,
      )

      if (spreadPct > 1) {
        const buyOn: DexId =
          uniPrice < sushiPrice ? 'Uniswap V2' : 'SushiSwap'
        const sellOn: DexId =
          buyOn === 'Uniswap V2' ? 'SushiSwap' : 'Uniswap V2'

        const buyPrice = buyOn === 'Uniswap V2' ? uniPrice : sushiPrice
        const sellPrice = buyOn === 'Uniswap V2' ? sushiPrice : uniPrice

        const estProfitUsd =
          (sellPrice - buyPrice) * Number(AMOUNT_IN_ETH)

        console.log(
          `[${timestamp}] 🟢 ARBITRAGE: spread ${spreadPct.toFixed(
            2,
          )}% → simulating swap...`,
        )

        try {
          await simulateBuyOnDex(buyOn)
          console.log(
            `[${timestamp}] 🟢 ARBITRAGE FOUND: Buy on ${buyOn}, Sell on ${sellOn} | Spread: ${spreadPct.toFixed(
              2,
            )}% | Est. profit: $${estProfitUsd.toFixed(2)}`,
          )
        } catch (error) {
          console.error(
            `[${timestamp}] Simulation reverted or failed on ${buyOn}`,
            error,
          )
        }
      }
    } catch (error) {
      console.error(`[${nowIso()}] Error during price check`, error)
    }

    await new Promise((resolve) =>
      setTimeout(resolve, POLL_INTERVAL_MS),
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

