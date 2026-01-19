import { createPublicClient, http, parseAbi } from 'viem';
import { bsc } from 'viem/chains';
import LandshareSaleAbi from '../src/abis/LandshareSale.json';
import RwaAbi from '../src/abis/RWAContract.json';
import LandAbi from '../src/abis/LandToken.json';
import UsdcAbi from '../src/abis/USDC.json';

// Contract addresses
const LANDSHARE_SALE_CONTRACT = '0x8B7dE9EcF1669800ECa1AF2441FcBEbcF6c4E5ea';
const RWA_CONTRACT = '0x475eD67Bfc62B41c048b81310337c1D75D45aADd';
const LAND_CONTRACT = '0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C';
const USDC_CONTRACT = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';

// Replace with the actual user address from the error
const USER_ADDRESS = '0xYourAddressHere'; // TODO: Replace with actual address

async function debugSellTransaction() {
  const client = createPublicClient({
    chain: bsc,
    transport: http('https://binance.llamarpc.com/')
  });

  console.log('=== Debugging Sell RWA Transaction ===\n');

  try {
    // 1. Check RWA balance
    const rwaBalance = await client.readContract({
      address: RWA_CONTRACT as `0x${string}`,
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [USER_ADDRESS as `0x${string}`]
    });
    console.log('1. RWA Balance:', rwaBalance.toString());

    // 2. Check RWA allowance to sale contract
    const rwaAllowance = await client.readContract({
      address: RWA_CONTRACT as `0x${string}`,
      abi: parseAbi(['function allowance(address,address) view returns (uint256)']),
      functionName: 'allowance',
      args: [USER_ADDRESS as `0x${string}`, LANDSHARE_SALE_CONTRACT as `0x${string}`]
    });
    console.log('2. RWA Allowance to Sale Contract:', rwaAllowance.toString());

    // 3. Check LAND balance
    const landBalance = await client.readContract({
      address: LAND_CONTRACT as `0x${string}`,
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [USER_ADDRESS as `0x${string}`]
    });
    console.log('3. LAND Balance:', landBalance.toString());

    // 4. Check LAND allowance to sale contract
    const landAllowance = await client.readContract({
      address: LAND_CONTRACT as `0x${string}`,
      abi: parseAbi(['function allowance(address,address) view returns (uint256)']),
      functionName: 'allowance',
      args: [USER_ADDRESS as `0x${string}`, LANDSHARE_SALE_CONTRACT as `0x${string}`]
    });
    console.log('4. LAND Allowance to Sale Contract:', landAllowance.toString());

    // 5. Get treasury wallet address from contract
    const treasuryWallet = await client.readContract({
      address: LANDSHARE_SALE_CONTRACT as `0x${string}`,
      abi: parseAbi(['function treasuryWallet() view returns (address)']),
      functionName: 'treasuryWallet'
    });
    console.log('5. Treasury Wallet Address:', treasuryWallet);

    // 6. Check USDC balance in treasury
    const treasuryUsdcBalance = await client.readContract({
      address: USDC_CONTRACT as `0x${string}`,
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [treasuryWallet as `0x${string}`]
    });
    console.log('6. Treasury USDC Balance:', treasuryUsdcBalance.toString());

    // 7. Check USDC allowance from treasury to sale contract
    const treasuryUsdcAllowance = await client.readContract({
      address: USDC_CONTRACT as `0x${string}`,
      abi: parseAbi(['function allowance(address,address) view returns (uint256)']),
      functionName: 'allowance',
      args: [treasuryWallet as `0x${string}`, LANDSHARE_SALE_CONTRACT as `0x${string}`]
    });
    console.log('7. Treasury USDC Allowance to Sale Contract:', treasuryUsdcAllowance.toString());

    // 8. Try to simulate the transaction
    const amountToSell = 1n; // Selling 1 RWA token
    console.log('\n8. Simulating sellRWA with amount:', amountToSell.toString());
    
    try {
      await client.simulateContract({
        address: LANDSHARE_SALE_CONTRACT as `0x${string}`,
        abi: LandshareSaleAbi,
        functionName: 'sellRWA',
        args: [amountToSell],
        account: USER_ADDRESS as `0x${string}`
      });
      console.log('✅ Simulation successful!');
    } catch (simError: any) {
      console.error('❌ Simulation failed with error:');
      console.error('Error message:', simError.message);
      
      // Try to parse the revert reason
      if (simError.message.includes('ERC20')) {
        console.log('\n🔍 This is an ERC20 token error!');
        
        if (simError.message.includes('insufficient allowance')) {
          console.log('❌ INSUFFICIENT ALLOWANCE ERROR DETECTED');
          console.log('\nBased on the allowances checked above:');
          console.log('- RWA Allowance:', rwaAllowance.toString());
          console.log('- LAND Allowance:', landAllowance.toString());
          console.log('- Treasury USDC Allowance:', treasuryUsdcAllowance.toString());
          console.log('\n⚠️ THE FAILING TOKEN IS LIKELY THE ONE WITH INSUFFICIENT ALLOWANCE');
        }
        
        if (simError.message.includes('transfer amount exceeds balance')) {
          console.log('❌ INSUFFICIENT BALANCE ERROR DETECTED');
          console.log('\nBased on the balances checked above:');
          console.log('- RWA Balance:', rwaBalance.toString());
          console.log('- LAND Balance:', landBalance.toString());
          console.log('- Treasury USDC Balance:', treasuryUsdcBalance.toString());
        }
      }
      
      console.log('\n📋 Full error object:', JSON.stringify(simError, null, 2));
    }

  } catch (error: any) {
    console.error('Error during debugging:', error);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

debugSellTransaction();
