import { createPublicClient, http } from 'viem';
import { bsc } from 'viem/chains';
import LandshareSaleAbi from '../src/abis/LandshareSale.json';

const LANDSHARE_SALE_CONTRACT = '0x8B7dE9EcF1669800ECa1AF2441FcBEbcF6c4E5ea';

async function getPriceOracle() {
  const client = createPublicClient({
    chain: bsc,
    transport: http('https://binance.llamarpc.com/')
  });

  console.log('Fetching saleExchangeRate (Price Oracle) from LandshareSale contract...\n');

  const priceOracle = await client.readContract({
    address: LANDSHARE_SALE_CONTRACT as `0x${string}`,
    abi: LandshareSaleAbi,
    functionName: 'saleExchangeRate'
  });

  console.log('LandshareSale Contract:', LANDSHARE_SALE_CONTRACT);
  console.log('Price Oracle Address:', priceOracle);
}

getPriceOracle().catch(console.error);
