import { ethers } from 'ethers';

// Contract addresses on BSC
const USDC_ADDRESS = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
const LSRWA_ADDRESS = '0x475eD67Bfc62B41c048b81310337c1D75D45aADd';

// Recipient addresses with LSRWA amounts and USDC amounts
const transfers = [
  {
    address: '0x3a21cF11E9c94471773EA51c99B11D379b9Ea6D1',
    lsrwaAmount: '13',
    usdcAmount: '16.06189'
  },
  {
    address: '0xA9Ef14d7815820e727616E3207b4d0C2C4C07148',
    lsrwaAmount: '11',
    usdcAmount: '13.59083'
  },
  {
    address: '0x9a0f05a910fae32142F0F47538869d5e85BE0aEc',
    lsrwaAmount: '50',
    usdcAmount: '61.7765'
  }
];

// Token decimals
const USDC_DECIMALS = 18;
const LSRWA_DECIMALS = 0;

// ERC20 and custom function signatures
const TRANSFER_FUNDS_FUNCTION = 'function transferFunds(address _from, address _to, uint256 _amount)';
const TRANSFER_FUNCTION = 'function transfer(address to, uint256 amount) returns (bool)';

interface GnosisTransaction {
  to: string;
  value: string;
  data: string;
  contractMethod?: {
    inputs: Array<{ name: string; type: string; internalType: string }>;
    name: string;
    payable: boolean;
  };
  contractInputsValues?: Record<string, string>;
}

function generateGnosisSafeBatchTx(safeAddress: string): GnosisTransaction[] {
  const transferFundsIface = new ethers.Interface([TRANSFER_FUNDS_FUNCTION]);
  const transferIface = new ethers.Interface([TRANSFER_FUNCTION]);
  const transactions: GnosisTransaction[] = [];

  console.log('🏦 Generating Gnosis Safe Batch Transaction JSON\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`LSRWA Contract: ${LSRWA_ADDRESS}`);
  console.log(`USDC Contract: ${USDC_ADDRESS}`);
  console.log(`Gnosis Safe Address: ${safeAddress}`);
  console.log(`Chain: BSC (Binance Smart Chain)`);
  console.log('═══════════════════════════════════════════════════════════\n');

  let totalLSRWA = BigInt(0);
  let totalUSDC = 0;

  transfers.forEach((transfer, index) => {
    console.log(`User ${index + 1}: ${transfer.address}\n`);

    // Transaction 1: transferFunds LSRWA tokens from user to Safe
    const lsrwaAmount = BigInt(transfer.lsrwaAmount); // 0 decimals
    const lsrwaData = transferFundsIface.encodeFunctionData('transferFunds', [
      transfer.address,  // _from user
      safeAddress,       // _to safe
      lsrwaAmount
    ]);

    transactions.push({
      to: LSRWA_ADDRESS,
      value: '0',
      data: lsrwaData,
      contractMethod: {
        inputs: [
          { name: '_from', type: 'address', internalType: 'address' },
          { name: '_to', type: 'address', internalType: 'address' },
          { name: '_amount', type: 'uint256', internalType: 'uint256' }
        ],
        name: 'transferFunds',
        payable: false
      },
      contractInputsValues: {
        _from: transfer.address,
        _to: safeAddress,
        _amount: lsrwaAmount.toString()
      }
    });

    console.log(`  ⬅️  Collect LSRWA from user:`);
    console.log(`      Amount: ${transfer.lsrwaAmount} LSRWA`);
    console.log(`      Data: ${lsrwaData.substring(0, 66)}...`);

    // Transaction 2: transfer USDC to user
    const usdcAmount = ethers.parseUnits(transfer.usdcAmount, USDC_DECIMALS);
    const usdcData = transferIface.encodeFunctionData('transfer', [
      transfer.address,
      usdcAmount
    ]);

    transactions.push({
      to: USDC_ADDRESS,
      value: '0',
      data: usdcData,
      contractMethod: {
        inputs: [
          { name: 'to', type: 'address', internalType: 'address' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' }
        ],
        name: 'transfer',
        payable: false
      },
      contractInputsValues: {
        to: transfer.address,
        amount: usdcAmount.toString()
      }
    });

    console.log(`  ➡️  Send USDC to user:`);
    console.log(`      Amount: ${transfer.usdcAmount} USDC`);
    console.log(`      Amount (wei): ${usdcAmount.toString()}`);
    console.log(`      Data: ${usdcData.substring(0, 66)}...\n`);

    totalLSRWA += lsrwaAmount;
    totalUSDC += parseFloat(transfer.usdcAmount);
  });

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total LSRWA to collect: ${totalLSRWA.toString()} tokens`);
  console.log(`Total USDC to send: ${totalUSDC.toFixed(6)} USDC`);
  console.log('═══════════════════════════════════════════════════════════\n');

  return transactions;
}

function main() {
  // IMPORTANT: Replace this with your actual Gnosis Safe address
  const SAFE_ADDRESS = '0x692d606069f7798fAe4FA51117dA418EFa15A2BA'; // Example: Admin wallet address
  
  const transactions = generateGnosisSafeBatchTx(SAFE_ADDRESS);

  // Create the complete Gnosis Safe transaction JSON
  const gnosisJSON = {
    version: '1.0',
    chainId: '56',
    createdAt: Date.now(),
    meta: {
      name: 'LSRWA Collection & USDC Distribution',
      description: 'Collect LSRWA tokens from users and send USDC to them',
      txBuilderVersion: '1.16.3',
      createdFromSafeAddress: SAFE_ADDRESS,
      createdFromOwnerAddress: '',
      checksum: ''
    },
    transactions: transactions
  };

  // Save to file
  const fs = require('fs');
  const filename = 'gnosis-safe-usdc-transfer.json';
  fs.writeFileSync(filename, JSON.stringify(gnosisJSON, null, 2));

  console.log(`✅ Gnosis Safe transaction JSON saved to: ${filename}`);
  console.log(`   Total transactions: ${transactions.length} (${transactions.length / 2} collect + ${transactions.length / 2} send)\n`);
  console.log('⚠️  IMPORTANT - transferFunds function:');
  console.log('   This uses the custom transferFunds() function on LSRWA contract');
  console.log('   The Gnosis Safe must be authorized to call this function\n');
  console.log('📋 Instructions:');
  console.log('1. Open your Gnosis Safe at https://app.safe.global/');
  console.log('2. Go to "Transaction Builder" app');
  console.log('3. Click "Upload JSON file"');
  console.log(`4. Upload the ${filename} file`);
  console.log('5. Review all transactions carefully');
  console.log('6. Submit the batch transaction\n');

  // Also create a simplified version for manual entry
  console.log('═══════════════════════════════════════════════════════════');
  console.log('TRANSACTION SEQUENCE:');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  for (let i = 0; i < transactions.length; i += 2) {
    const collectTx = transactions[i];
    const sendTx = transactions[i + 1];
    const transferIndex = i / 2;
    
    console.log(`Pair ${transferIndex + 1}:`);
    console.log(`  A) Collect LSRWA from ${collectTx.contractInputsValues?._from}`);
    console.log(`     Contract: ${LSRWA_ADDRESS}`);
    console.log(`     Method: transferFunds`);
    console.log(`     Amount: ${collectTx.contractInputsValues?._amount} LSRWA`);
    console.log(``);
    console.log(`  B) Send USDC to ${sendTx.contractInputsValues?.to}`);
    console.log(`     Contract: ${USDC_ADDRESS}`);
    console.log(`     Method: transfer`);
    console.log(`     Amount: ${sendTx.contractInputsValues?.amount} wei (${transfers[transferIndex].usdcAmount} USDC)`);
    console.log('');
  }
}

main();
