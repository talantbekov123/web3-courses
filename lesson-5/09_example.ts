import {
  Address,
  createPublicClient,
  http,
  parseEther,
} from 'viem'
import { mainnet } from 'viem/chains'

const RPC_URL = 'https://ethereum-rpc.publicnode.com'
const TARGET_PRICE_USDT = 2000
const POLL_INTERVAL_MS = 1_000
const AMOUNT_IN_ETH = 1n
const AMOUNT_IN_WEI = parseEther(AMOUNT_IN_ETH.toString())

// Same router & tokens as example 09
const UNISWAP_V2_ROUTER: Address =
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'
const WETH: Address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const USDT: Address = '0xdac17f958d2ee523a2206206994597c13d831ec7'

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
] as const

const client = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL),
})

function nowIso() {
  return new Date().toISOString()
}

async function fetchEthUsdtPrice(): Promise<number> {
  const amounts = (await client.readContract({
    address: UNISWAP_V2_ROUTER,
    abi: uniswapV2RouterAbi,
    functionName: 'getAmountsOut',
    args: [AMOUNT_IN_WEI, [WETH, USDT]],
  })) as bigint[]

  const usdtOut = amounts[1]
  const price = Number(usdtOut) / 10 ** 6 / Number(AMOUNT_IN_ETH)
  return price
}

async function main() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const price = await fetchEthUsdtPrice()
      const ts = nowIso()

      console.log(
        `[${ts}] ETH/USDT (Uniswap V2): $${price.toFixed(2)}`,
      )

      if (price > TARGET_PRICE_USDT) {
        console.log(
          `[${ts}] 🟢 ALERT: ETH price above $${TARGET_PRICE_USDT} (current: $${price.toFixed(
            2,
          )})`,
        )
      }
    } catch (error) {
      console.error(`[${nowIso()}] Error fetching price`, error)
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
