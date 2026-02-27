import {
  Address,
  createPublicClient,
  parseEther,
  webSocket,
} from 'viem'
import { mainnet } from 'viem/chains'

// === Config ===
const TARGET_PRICE = 2000 // trigger threshold in USDC
const AMOUNT_IN_ETH = 1n // simulated buy size
const AMOUNT_IN = parseEther(AMOUNT_IN_ETH.toString())
const POOL_ADDRESS: Address =
  '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8' // ETH/USDC 0.3%

const WS_URL =
  process.env.ETH_WS_URL ?? 'wss://mainnet.infura.io/ws/v3/YOUR_KEY'

// Uniswap V3 SwapRouter
const UNISWAP_V3_ROUTER: Address =
  '0xE592427A0AEce92De3Edee1F18E0157C05861564'

// Pool tokens (USDC / WETH9)
const TOKEN0_USDC: Address =
  '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const TOKEN1_WETH: Address =
  '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2'
const FEE_TIER = 3000

const DECIMALS_USDC = 6
const DECIMALS_WETH = 18

// Minimal Uniswap V3 pool ABI (Swap event only)
const uniswapV3PoolAbi = [
  {
    type: 'event',
    name: 'Swap',
    inputs: [
      { name: 'sender', type: 'address', indexed: true },
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'amount0', type: 'int256', indexed: false },
      { name: 'amount1', type: 'int256', indexed: false },
      { name: 'sqrtPriceX96', type: 'uint160', indexed: false },
      { name: 'liquidity', type: 'uint128', indexed: false },
      { name: 'tick', type: 'int24', indexed: false },
    ],
  },
] as const

// Minimal Uniswap V3 SwapRouter ABI (exactInputSingle)
const swapRouterAbi = [
  {
    type: 'function',
    stateMutability: 'payable',
    name: 'exactInputSingle',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
      },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
] as const

const client = createPublicClient({
  chain: mainnet,
  transport: webSocket(WS_URL),
})

function nowIso() {
  return new Date().toISOString()
}

function decodeEthPriceFromSqrtPriceX96(sqrtPriceX96: bigint): number {
  const sqrtPrice = Number(sqrtPriceX96) / 2 ** 96
  const priceToken1InToken0 =
    sqrtPrice * sqrtPrice * 10 ** (DECIMALS_USDC - DECIMALS_WETH)
  return priceToken1InToken0
}

async function simulateBuy() {
  const account: Address =
    '0x0000000000000000000000000000000000000002'

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10)

  await client.simulateContract({
    address: UNISWAP_V3_ROUTER,
    abi: swapRouterAbi,
    functionName: 'exactInputSingle',
    args: [
      {
        tokenIn: TOKEN1_WETH,
        tokenOut: TOKEN0_USDC,
        fee: FEE_TIER,
        recipient: account,
        deadline,
        amountIn: AMOUNT_IN,
        amountOutMinimum: 0n,
        sqrtPriceLimitX96: 0n,
      },
    ],
    account,
  })
}

async function main() {
  console.log(
    `[${nowIso()}] Subscribing to Uniswap V3 Swap events on pool ${POOL_ADDRESS}...`,
  )

  const unwatch = client.watchContractEvent({
    address: POOL_ADDRESS,
    abi: uniswapV3PoolAbi,
    eventName: 'Swap',
    onLogs: async (logs) => {
      for (const log of logs) {
        const sqrtPriceX96 = log.args.sqrtPriceX96 as bigint
        const price = decodeEthPriceFromSqrtPriceX96(sqrtPriceX96)
        const ts = nowIso()

        if (price < TARGET_PRICE) {
          console.log(
            `[${ts}] 🟢 BUY SIGNAL: Price $${price.toFixed(
              2,
            )} < $${TARGET_PRICE} | Simulating buy...`,
          )

          try {
            await simulateBuy()
            console.log(
              `[${ts}] 🟢 BUY SIGNAL: Price $${price.toFixed(
                2,
              )} < $${TARGET_PRICE} | Simulated buy OK`,
            )
          } catch (error) {
            console.error(
              `[${ts}] Simulation reverted or failed`,
              error,
            )
          }
        } else {
          console.log(
            `[${ts}] ⏳ Price $${price.toFixed(2)} — waiting...`,
          )
        }
      }
    },
    onError: (error) => {
      console.error(`[${nowIso()}] watchContractEvent error`, error)
    },
  })

  process.on('SIGINT', () => {
    console.log(`[${nowIso()}] Caught SIGINT, shutting down watcher...`)
    unwatch()
    setTimeout(() => {
      process.exit(0)
    }, 500)
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

