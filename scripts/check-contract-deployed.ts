import { createPublicClient, http } from 'viem';
import { bsc } from 'viem/chains';

const address = '0xFEE6682D1889E66717F0958E6d43b3a30783e9a6';

async function checkContract() {
  const client = createPublicClient({
    chain: bsc,
    transport: http('https://binance.llamarpc.com/')
  });

  const code = await client.getBytecode({ address: address as `0x${string}` });
  
  if (code && code !== '0x') {
    console.log('✅ Contract deployed successfully');
    console.log('Code length:', code.length, 'bytes');
  } else {
    console.log('❌ No contract code at this address');
  }
}

checkContract();
