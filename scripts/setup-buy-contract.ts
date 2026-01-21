import { createWalletClient, http, publicActions } from 'viem';
import { bsc } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import LandshareBuySaleAbi from '../src/abis/LandshareBuySale.json';
import { 
  LANDSHARE_BUY_SALE_CONTRACT_ADDRESS, 
  USDC_ADDRESS,
  API_CONSUMER_CONTRACT_ADDRESS 
} from '../src/config/constants/environments';

// Set your private key as environment variable: PRIVATE_KEY=0x...
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ Error: PRIVATE_KEY environment variable not set');
  console.log('Usage: PRIVATE_KEY=0xyour_private_key npm run setup-buy-contract');
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
const contractAddress = LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[56];
const usdcAddress = USDC_ADDRESS[56];
const priceOracleAddress = API_CONSUMER_CONTRACT_ADDRESS[56]; // Using API Consumer as price oracle

console.log('🚀 Setting up LandshareBuySale contract...');
console.log('📝 Contract:', contractAddress);
console.log('👤 Account:', account.address);
console.log('💵 USDC:', usdcAddress);
console.log('🔮 Price Oracle:', priceOracleAddress);
console.log('');

const client = createWalletClient({
  account,
  chain: bsc,
  transport: http('https://binance.llamarpc.com/')
}).extend(publicActions);

async function main() {
  try {
    // Step 1: Check current allowed stablecoins
    console.log('📋 Checking current allowed stablecoins...');
    const allowedCoins = await client.readContract({
      address: contractAddress,
      abi: LandshareBuySaleAbi,
      functionName: 'getAllowedStableCoins'
    }) as string[];
    
    console.log('Current allowed coins:', allowedCoins);
    
    // Step 2: Check current price oracle
    console.log('\n🔍 Checking current price oracle...');
    const currentOracle = await client.readContract({
      address: contractAddress,
      abi: LandshareBuySaleAbi,
      functionName: 'PRICE_ORACLE'
    });
    
    console.log('Current price oracle:', currentOracle);
    
    // Step 3: Add USDC as allowed token if not already added
    if (!allowedCoins.some(coin => coin.toLowerCase() === usdcAddress.toLowerCase())) {
      console.log('\n➕ Adding USDC as allowed token...');
      const hash1 = await client.writeContract({
        address: contractAddress,
        abi: LandshareBuySaleAbi,
        functionName: 'addAllowedToken',
        args: [usdcAddress]
      });
      
      console.log('Transaction hash:', hash1);
      console.log('⏳ Waiting for confirmation...');
      
      const receipt1 = await client.waitForTransactionReceipt({ hash: hash1 });
      console.log('✅ USDC added! Block:', receipt1.blockNumber);
    } else {
      console.log('\n✅ USDC is already an allowed token');
    }
    
    // Step 4: Set price oracle if it's the zero address
    if (currentOracle === '0x0000000000000000000000000000000000000000') {
      console.log('\n🔮 Setting price oracle...');
      const hash2 = await client.writeContract({
        address: contractAddress,
        abi: LandshareBuySaleAbi,
        functionName: 'setPriceOracle',
        args: [priceOracleAddress]
      });
      
      console.log('Transaction hash:', hash2);
      console.log('⏳ Waiting for confirmation...');
      
      const receipt2 = await client.waitForTransactionReceipt({ hash: hash2 });
      console.log('✅ Price oracle set! Block:', receipt2.blockNumber);
    } else {
      console.log('\n✅ Price oracle already set to:', currentOracle);
    }
    
    // Step 5: Verify final state
    console.log('\n📊 Final verification...');
    const finalCoins = await client.readContract({
      address: contractAddress,
      abi: LandshareBuySaleAbi,
      functionName: 'getAllowedStableCoins'
    });
    
    const finalOracle = await client.readContract({
      address: contractAddress,
      abi: LandshareBuySaleAbi,
      functionName: 'PRICE_ORACLE'
    });
    
    console.log('Allowed stablecoins:', finalCoins);
    console.log('Price oracle:', finalOracle);
    console.log('\n✨ Setup complete!');
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

main();
