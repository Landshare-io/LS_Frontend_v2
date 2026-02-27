import { ethers } from 'ethers';
import RWAContractABI from '../src/abis/RWAContract.json';
import AssetStakeABI from '../src/abis/AssetStake.json';

// Configuration
const BSC_RPC_URL = 'https://binance.llamarpc.com/';
const RWA_CONTRACT_ADDRESS = '0x475eD67Bfc62B41c048b81310337c1D75D45aADd'; // BSC mainnet
const ASSET_STAKE_CONTRACT_ADDRESS = '0x018E809663341771002c7dfd9B5ac36DF6044dB7'; // BSC mainnet

// Add your wallet addresses here
const WALLET_ADDRESSES: string[] = [
  '0x3a21cF11E9c94471773EA51c99B11D379b9Ea6D1',
  '0xA9Ef14d7815820e727616E3207b4d0C2C4C07148',
  '0x9a0f05a910fae32142F0F47538869d5e85BE0aEc',
];

interface WalletBalance {
  address: string;
  lsrwaBalance: string;
  lsrwaBalanceFormatted: string;
  stakedBalance: string;
  stakedBalanceFormatted: string;
  totalBalance: string;
  totalBalanceFormatted: string;
}

async function getLSRWABalances(): Promise<WalletBalance[]> {
  console.log('🔍 Fetching LSRWA token balances...\n');

  // Setup provider and contracts
  const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
  const rwaContract = new ethers.Contract(RWA_CONTRACT_ADDRESS, RWAContractABI, provider);
  const assetStakeContract = new ethers.Contract(ASSET_STAKE_CONTRACT_ADDRESS, AssetStakeABI, provider);

  const results: WalletBalance[] = [];

  for (const address of WALLET_ADDRESSES) {
    try {
      console.log(`📍 Checking address: ${address}`);

      // Get LSRWA token balance
      const lsrwaBalance = await rwaContract.balanceOf(address);
      
      // Get staked balance
      const stakedBalance = await assetStakeContract.balanceOf(address);

      // Calculate total
      const totalBalance = lsrwaBalance + stakedBalance;

      // Format balances (0 decimals - whole tokens)
      const lsrwaFormatted = lsrwaBalance.toString();
      const stakedFormatted = stakedBalance.toString();
      const totalFormatted = totalBalance.toString();

      const walletData: WalletBalance = {
        address,
        lsrwaBalance: lsrwaBalance.toString(),
        lsrwaBalanceFormatted: lsrwaFormatted,
        stakedBalance: stakedBalance.toString(),
        stakedBalanceFormatted: stakedFormatted,
        totalBalance: totalBalance.toString(),
        totalBalanceFormatted: totalFormatted,
      };

      results.push(walletData);

      console.log(`  💰 LSRWA Balance: ${lsrwaFormatted}`);
      console.log(`  🔒 Staked Balance: ${stakedFormatted}`);
      console.log(`  📊 Total Balance: ${totalFormatted}\n`);

    } catch (error) {
      console.error(`  ❌ Error fetching balance for ${address}:`, error);
      results.push({
        address,
        lsrwaBalance: 'Error',
        lsrwaBalanceFormatted: 'Error',
        stakedBalance: 'Error',
        stakedBalanceFormatted: 'Error',
        totalBalance: 'Error',
        totalBalanceFormatted: 'Error',
      });
    }
  }

  return results;
}

async function main() {
  try {
    const balances = await getLSRWABalances();

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('                    SUMMARY REPORT');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Calculate totals
    let totalLSRWA = BigInt(0);
    let totalStaked = BigInt(0);
    let totalCombined = BigInt(0);

    balances.forEach((balance, index) => {
      console.log(`${index + 1}. Address: ${balance.address}`);
      console.log(`   LSRWA Balance: ${balance.lsrwaBalanceFormatted}`);
      console.log(`   Staked Balance: ${balance.stakedBalanceFormatted}`);
      console.log(`   Total: ${balance.totalBalanceFormatted}\n`);

      if (balance.lsrwaBalance !== 'Error') {
        totalLSRWA += BigInt(balance.lsrwaBalance);
        totalStaked += BigInt(balance.stakedBalance);
        totalCombined += BigInt(balance.totalBalance);
      }
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log('GRAND TOTALS:');
    console.log(`Total LSRWA: ${totalLSRWA.toString()}`);
    console.log(`Total Staked: ${totalStaked.toString()}`);
    console.log(`Combined Total: ${totalCombined.toString()}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Export to JSON
    const fs = require('fs');
    const outputData = {
      timestamp: new Date().toISOString(),
      contracts: {
        rwaContract: RWA_CONTRACT_ADDRESS,
        assetStakeContract: ASSET_STAKE_CONTRACT_ADDRESS,
      },
      balances,
      totals: {
        totalLSRWA: totalLSRWA.toString(),
        totalStaked: totalStaked.toString(),
        totalCombined: totalCombined.toString(),
      },
    };

    fs.writeFileSync('lsrwa-balances-report.json', JSON.stringify(outputData, null, 2));
    console.log('✅ Report saved to: lsrwa-balances-report.json');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
