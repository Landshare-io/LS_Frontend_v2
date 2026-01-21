import { createPublicClient, http } from 'viem';
import { bsc } from 'viem/chains';

const TX_HASHES = [
  '0x1e2ff7a7ba5fc29c64342750d3c40e607cd50b06a70f01e778ba54082cf556ef', // Price Oracle update
  '0x346ff49a0a636ba684887db7c0818f1849bb250a52a67061d948351ba5d236f3'  // LAND Percent update
];

async function checkTransactions() {
  const client = createPublicClient({
    chain: bsc,
    transport: http('https://binance.llamarpc.com/')
  });

  console.log('=== Checking Transaction Status ===\n');

  for (const hash of TX_HASHES) {
    try {
      const receipt = await client.getTransactionReceipt({ hash: hash as `0x${string}` });
      console.log(`Transaction: ${hash}`);
      console.log(`  Status: ${receipt.status === 'success' ? '✅ SUCCESS' : '❌ FAILED'}`);
      console.log(`  Block: ${receipt.blockNumber}`);
      console.log(`  Gas Used: ${receipt.gasUsed.toString()}`);
      console.log();
    } catch (error: any) {
      console.error(`Transaction: ${hash}`);
      console.error(`  Error: ${error.message}`);
      console.log();
    }
  }
}

checkTransactions().catch(console.error);
