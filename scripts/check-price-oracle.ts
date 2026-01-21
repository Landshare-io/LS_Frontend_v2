import { createPublicClient, http } from 'viem';
import { bsc } from 'viem/chains';

const PRICE_ORACLE = '0x4e9651AD369d8F986935852C945338F76b5fb360';
const USDC_ADDRESS = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
const LAND_ADDRESS = '0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C';

// Price Oracle ABI (minimal needed functions)
const priceOracleAbi = [
  {
    "inputs": [{"name": "token", "type": "address"}],
    "name": "getStableCoinInfo",
    "outputs": [
      {"name": "coinTicker", "type": "string"},
      {"name": "coinAddress", "type": "address"},
      {"name": "coinPrice", "type": "uint256"},
      {"name": "priceDecimals", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "token", "type": "address"}],
    "name": "getCoinPrice",
    "outputs": [
      {"name": "price", "type": "uint256"},
      {"name": "priceDecimals", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function checkPriceOracle() {
  const client = createPublicClient({
    chain: bsc,
    transport: http('https://binance.llamarpc.com/')
  });

  console.log('=== Checking Price Oracle ===\n');
  console.log('Price Oracle:', PRICE_ORACLE);
  console.log('USDC:', USDC_ADDRESS);
  console.log('LAND:', LAND_ADDRESS);
  console.log();

  try {
    // Check USDC info
    console.log('1. Checking USDC price info...');
    const usdcInfo = await client.readContract({
      address: PRICE_ORACLE as `0x${string}`,
      abi: priceOracleAbi,
      functionName: 'getStableCoinInfo',
      args: [USDC_ADDRESS as `0x${string}`]
    }) as any;

    console.log('   Ticker:', usdcInfo[0]);
    console.log('   Address:', usdcInfo[1]);
    console.log('   Price:', usdcInfo[2].toString());
    console.log('   Price Decimals:', usdcInfo[3].toString());
    console.log();

  } catch (error: any) {
    console.error('   ❌ Failed to get USDC info:', error.message);
    console.log();
  }

  try {
    // Check LAND price
    console.log('2. Checking LAND price...');
    const landPrice = await client.readContract({
      address: PRICE_ORACLE as `0x${string}`,
      abi: priceOracleAbi,
      functionName: 'getCoinPrice',
      args: [LAND_ADDRESS as `0x${string}`]
    }) as any;

    console.log('   Price:', landPrice[0].toString());
    console.log('   Price Decimals:', landPrice[1].toString());
    console.log();

  } catch (error: any) {
    console.error('   ❌ Failed to get LAND price:', error.message);
    console.log();
  }
}

checkPriceOracle().catch(console.error);
