import { createPublicClient, http, formatEther, parseEther } from 'viem';
import { bsc } from 'viem/chains';
import LandshareBuySaleArtifact from '../src/abis/LandshareBuySale.json';

const LandshareBuySaleAbi = LandshareBuySaleArtifact.abi;
const LANDSHARE_BUY_SALE_CONTRACT = '0xFEE6682D1889E66717F0958E6d43b3a30783e9a6';
const USDC_ADDRESS = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';

async function testBuyTokenView() {
  const client = createPublicClient({
    chain: bsc,
    transport: http('https://binance.llamarpc.com/')
  });

  console.log('=== Testing buyTokenView ===\n');

  const testAmounts = [1, 10, 100, 1000];

  for (const amount of testAmounts) {
    try {
      const result = await client.readContract({
        address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
        abi: LandshareBuySaleAbi,
        functionName: 'buyTokenView',
        args: [parseEther(amount.toString()), USDC_ADDRESS as `0x${string}`]
      }) as any;

      console.log(`✅ Buying ${amount} RWA tokens:`);
      console.log(`   USDC needed: ${formatEther(result[0])} USDC`);
      console.log(`   LAND fee: ${formatEther(result[1])} LAND`);
      console.log(`   RWA received: ${formatEther(result[2])} RWA`);
      console.log();
    } catch (error: any) {
      console.error(`❌ Failed for ${amount} RWA:`, error.message);
      console.log();
    }
  }
}

testBuyTokenView().catch(console.error);
