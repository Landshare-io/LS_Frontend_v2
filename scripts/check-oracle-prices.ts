import { createPublicClient, http, formatEther } from 'viem';
import { bsc } from 'viem/chains';

const PRICE_ORACLE = '0x4e9651AD369d8F986935852C945338F76b5fb360';
const USDC = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
const LAND = '0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C';

const abi = [
  {
    "inputs": [{"name": "fiatForPrice", "type": "uint256"}, {"name": "targetCoin", "type": "address"}, {"name": "relatedCoin", "type": "address"}],
    "name": "getCoinPrice",
    "outputs": [{"name": "priceProvided", "type": "bool"}, {"name": "price", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "defaultDecimals",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function checkOracle() {
  const client = createPublicClient({
    chain: bsc,
    transport: http('https://bsc-dataseed1.binance.org/')
  });

  console.log('=== Checking Price Oracle ===\n');

  try {
    const decimals = await client.readContract({
      address: PRICE_ORACLE as `0x${string}`,
      abi,
      functionName: 'defaultDecimals'
    });
    console.log('Default Decimals:', decimals.toString());
    console.log();

    // USD = 840
    const [usdcProvided, usdcPrice] = await client.readContract({
      address: PRICE_ORACLE as `0x${string}`,
      abi,
      functionName: 'getCoinPrice',
      args: [840, USDC as `0x${string}`, '0x0000000000000000000000000000000000000000' as `0x${string}`]
    }) as [boolean, bigint];

    console.log('USDC Price:');
    console.log('  Provided:', usdcProvided);
    console.log('  Price:', usdcPrice.toString());
    console.log();

    const [landProvided, landPrice] = await client.readContract({
      address: PRICE_ORACLE as `0x${string}`,
      abi,
      functionName: 'getCoinPrice',
      args: [840, LAND as `0x${string}`, '0x0000000000000000000000000000000000000000' as `0x${string}`]
    }) as [boolean, bigint];

    console.log('LAND Price:');
    console.log('  Provided:', landProvided);
    console.log('  Price:', landPrice.toString());

  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

checkOracle();
