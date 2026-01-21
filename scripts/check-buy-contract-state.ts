import { createPublicClient, http, formatEther } from 'viem';
import { bsc } from 'viem/chains';
import LandshareBuySaleAbi from '../src/abis/LandshareBuySale.json';

const LANDSHARE_BUY_SALE_CONTRACT = '0x82D43fB342b11BD5Fc6bbd884bb8c626E37f402e';
const USDC_ADDRESS = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
const LAND_ADDRESS = '0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C';

async function checkContractState() {
  const client = createPublicClient({
    chain: bsc,
    transport: http('https://binance.llamarpc.com/')
  });

  console.log('=== Checking LandshareBuySale Contract State ===\n');
  console.log('Contract:', LANDSHARE_BUY_SALE_CONTRACT);
  console.log('USDC:', USDC_ADDRESS);
  console.log('LAND:', LAND_ADDRESS);
  console.log();

  try {
    // Check price oracle
    const priceOracle = await client.readContract({
      address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
      abi: LandshareBuySaleAbi,
      functionName: 'PRICE_ORACLE'
    });
    console.log('✓ Price Oracle:', priceOracle);

    // Check LAND token address
    const land = await client.readContract({
      address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
      abi: LandshareBuySaleAbi,
      functionName: 'LAND'
    });
    console.log('✓ LAND Token:', land);

    // Check land percent
    const landPercent = await client.readContract({
      address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
      abi: LandshareBuySaleAbi,
      functionName: 'LANDpercent'
    });
    console.log('✓ LAND Percent:', landPercent.toString() + '%');

    // Check if USDC is allowed
    const isUsdcAllowed = await client.readContract({
      address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
      abi: LandshareBuySaleAbi,
      functionName: 'allowedToken',
      args: [USDC_ADDRESS as `0x${string}`]
    });
    console.log('✓ USDC Allowed:', isUsdcAllowed);

    // Get all allowed tokens
    const allowedTokens = await client.readContract({
      address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
      abi: LandshareBuySaleAbi,
      functionName: 'getAllowedStableCoins'
    });
    console.log('✓ All Allowed Tokens:', allowedTokens);

    // Check offering price
    const offeringPrice = await client.readContract({
      address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
      abi: LandshareBuySaleAbi,
      functionName: 'offeringSecurityToUSDPrice'
    });
    console.log('✓ Offering Price:', formatEther(offeringPrice as bigint), 'USD');

    // Check status
    const status = await client.readContract({
      address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
      abi: LandshareBuySaleAbi,
      functionName: 'status'
    });
    console.log('✓ Contract Status (active):', status);

    console.log('\n=== Testing buyTokenView ===\n');

    // Try calling buyTokenView
    try {
      const result = await client.readContract({
        address: LANDSHARE_BUY_SALE_CONTRACT as `0x${string}`,
        abi: LandshareBuySaleAbi,
        functionName: 'buyTokenView',
        args: [BigInt('1000000000000000000'), USDC_ADDRESS as `0x${string}`]
      }) as any;

      console.log('✅ buyTokenView SUCCESS!');
      console.log('USDC Amount:', formatEther(result[0]));
      console.log('LAND Amount:', formatEther(result[1]));
      console.log('RWA Amount:', formatEther(result[2]));
    } catch (error: any) {
      console.error('❌ buyTokenView FAILED');
      console.error('Error:', error.message);
      
      // Try to get more info about the revert
      if (error.cause?.reason) {
        console.error('Revert Reason:', error.cause.reason);
      }
      if (error.cause?.data) {
        console.error('Revert Data:', error.cause.data);
      }
    }

  } catch (error: any) {
    console.error('Error checking contract:', error.message);
  }
}

checkContractState().catch(console.error);
