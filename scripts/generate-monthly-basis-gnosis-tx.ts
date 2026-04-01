import { ethers } from 'ethers';
import * as fs from 'fs';
import RWAContractABI from '../src/abis/RWAContract.json';
import AssetStakeABI from '../src/abis/AssetStake.json';

type ParsedArgs = {
  lastPrice?: string;
  currentPrice?: string;
  addressesCsv?: string;
  addressesFile?: string;
  safeAddress?: string;
  output?: string;
  rpcUrl?: string;
  chainId?: string;
  rwaContract?: string;
  stakeContract?: string;
  usdcContract?: string;
};

interface WalletScanResult {
  address: string;
  walletBalance: bigint;
  stakedBalance: bigint;
  totalBalance: bigint;
  tokensToSell: bigint;
  gainAmountUnits: bigint;
  gainAmountFormatted: string;
  usdcAmountUnits: bigint;
  usdcAmountFormatted: string;
}

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

const DEFAULTS = {
  rpcUrl: 'https://binance.llamarpc.com/',
  chainId: '56',
  safeAddress: '0x692d606069f7798fAe4FA51117dA418EFa15A2BA',
  output: 'gnosis-monthly-basis-transfer.json',
  rwaContract: '0x475eD67Bfc62B41c048b81310337c1D75D45aADd',
  stakeContract: '0x018E809663341771002c7dfd9B5ac36DF6044dB7',
  usdcContract: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
};

const TRANSFER_FUNDS_FUNCTION = 'function transferFunds(address _from, address _to, uint256 _amount)';
const ERC20_TRANSFER_FUNCTION = 'function transfer(address to, uint256 amount) returns (bool)';
const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);
const BIGINT_TWO = BigInt(2);
const BIGINT_TEN = BigInt(10);
const BIGINT_NEGATIVE_ONE = BigInt(-1);

function pow10(exponent: number): bigint {
  let result = BIGINT_ONE;

  for (let index = 0; index < exponent; index += 1) {
    result *= BIGINT_TEN;
  }

  return result;
}

function printUsage(): void {
  console.log('Usage: tsx scripts/generate-monthly-basis-gnosis-tx.ts --last-price <value> --current-price <value> [--addresses <a,b,c> | --addresses-file <file>] [--safe-address <address>] [--output <file>] [--rpc-url <url>] [--chain-id <id>] [--rwa-contract <address>] [--stake-contract <address>] [--usdc-contract <address>]');
  console.log('');
  console.log('Example:');
  console.log('tsx scripts/generate-monthly-basis-gnosis-tx.ts --last-price 1.2375 --current-price 1.2550 --addresses-file ./addresses.txt --safe-address 0x692d606069f7798fAe4FA51117dA418EFa15A2BA --rwa-contract 0x475eD67Bfc62B41c048b81310337c1D75D45aADd --stake-contract 0x018E809663341771002c7dfd9B5ac36DF6044dB7');
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {};

  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];

    if (!key.startsWith('--')) {
      continue;
    }

    switch (key) {
      case '--last-price':
        args.lastPrice = value;
        i += 1;
        break;
      case '--current-price':
        args.currentPrice = value;
        i += 1;
        break;
      case '--addresses':
        args.addressesCsv = value;
        i += 1;
        break;
      case '--addresses-file':
        args.addressesFile = value;
        i += 1;
        break;
      case '--safe-address':
        args.safeAddress = value;
        i += 1;
        break;
      case '--output':
        args.output = value;
        i += 1;
        break;
      case '--rpc-url':
        args.rpcUrl = value;
        i += 1;
        break;
      case '--chain-id':
        args.chainId = value;
        i += 1;
        break;
      case '--rwa-contract':
        args.rwaContract = value;
        i += 1;
        break;
      case '--stake-contract':
        args.stakeContract = value;
        i += 1;
        break;
      case '--usdc-contract':
        args.usdcContract = value;
        i += 1;
        break;
      case '--help':
        printUsage();
        process.exit(0);
      default:
        break;
    }
  }

  return args;
}

function parseDecimal(input: string): { signedInt: bigint; scale: number } {
  const trimmed = input.trim();
  if (!/^[-+]?\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error(`Invalid decimal number: ${input}`);
  }

  const negative = trimmed.startsWith('-');
  const unsigned = trimmed.replace(/^[-+]/, '');
  const [whole, fraction = ''] = unsigned.split('.');
  const normalizedWhole = whole.replace(/^0+(?=\d)/, '') || '0';
  const digits = `${normalizedWhole}${fraction}`.replace(/^0+(?=\d)/, '') || '0';
  const signedInt = BigInt(digits) * (negative ? BIGINT_NEGATIVE_ONE : BIGINT_ONE);

  return { signedInt, scale: fraction.length };
}

function subtractDecimals(a: string, b: string): { signedInt: bigint; scale: number } {
  const da = parseDecimal(a);
  const db = parseDecimal(b);
  const scale = Math.max(da.scale, db.scale);
  const factorA = pow10(scale - da.scale);
  const factorB = pow10(scale - db.scale);
  return {
    signedInt: da.signedInt * factorA - db.signedInt * factorB,
    scale
  };
}

function multiplyAndScaleRoundHalfUp(
  valueInt: bigint,
  valueScale: number,
  multiplier: bigint,
  outputScale: number
): bigint {
  const numerator = valueInt * multiplier * pow10(outputScale);
  const denominator = pow10(valueScale);

  if (denominator === BIGINT_ONE) {
    return numerator;
  }

  if (numerator >= BIGINT_ZERO) {
    return (numerator + (denominator / BIGINT_TWO)) / denominator;
  }

  return -((-numerator + (denominator / BIGINT_TWO)) / denominator);
}

function divideFloor(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= BIGINT_ZERO) {
    throw new Error('Denominator must be greater than zero.');
  }

  if (numerator >= BIGINT_ZERO) {
    return numerator / denominator;
  }

  return -((-numerator + denominator - BIGINT_ONE) / denominator);
}

function uniqueAddresses(addresses: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const address of addresses) {
    const normalized = address.trim();
    if (!normalized) {
      continue;
    }

    if (!ethers.isAddress(normalized)) {
      throw new Error(`Invalid address: ${normalized}`);
    }

    const checksum = ethers.getAddress(normalized);
    if (!seen.has(checksum)) {
      seen.add(checksum);
      output.push(checksum);
    }
  }

  return output;
}

function loadAddresses(args: ParsedArgs): string[] {
  const csvItems = (args.addressesCsv || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  let fileItems: string[] = [];
  if (args.addressesFile) {
    const raw = fs.readFileSync(args.addressesFile, 'utf8');
    fileItems = raw
      .split(/\r?\n/)
      .map((line) => line.replace(/#.*$/, '').trim())
      .filter(Boolean);
  }

  const combined = [...csvItems, ...fileItems];
  return uniqueAddresses(combined);
}

async function scanBalances(
  provider: ethers.JsonRpcProvider,
  rwaAddress: string,
  stakeAddress: string,
  addresses: string[]
): Promise<Array<{ address: string; wallet: bigint; staked: bigint; total: bigint }>> {
  const rwaContract = new ethers.Contract(rwaAddress, RWAContractABI, provider);
  const stakeContract = new ethers.Contract(stakeAddress, AssetStakeABI, provider);

  const output: Array<{ address: string; wallet: bigint; staked: bigint; total: bigint }> = [];

  for (const address of addresses) {
    const [walletBalance, stakedBalance] = await Promise.all([
      rwaContract.balanceOf(address) as Promise<bigint>,
      stakeContract.balanceOf(address) as Promise<bigint>
    ]);

    const totalBalance = walletBalance + stakedBalance;

    output.push({
      address,
      wallet: walletBalance,
      staked: stakedBalance,
      total: totalBalance
    });
  }

  return output;
}

function buildGnosisTransactions(
  entries: WalletScanResult[],
  safeAddress: string,
  rwaAddress: string,
  usdcAddress: string
): GnosisTransaction[] {
  const transferFundsIface = new ethers.Interface([TRANSFER_FUNDS_FUNCTION]);
  const transferIface = new ethers.Interface([ERC20_TRANSFER_FUNCTION]);
  const txs: GnosisTransaction[] = [];

  for (const entry of entries) {
    if (entry.tokensToSell <= BIGINT_ZERO || entry.usdcAmountUnits <= BIGINT_ZERO) {
      continue;
    }

    const collectData = transferFundsIface.encodeFunctionData('transferFunds', [
      entry.address,
      safeAddress,
      entry.tokensToSell
    ]);
    txs.push({
      to: rwaAddress,
      value: '0',
      data: collectData,
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
        _from: entry.address,
        _to: safeAddress,
        _amount: entry.tokensToSell.toString()
      }
    });

    const usdcTransferData = transferIface.encodeFunctionData('transfer', [
      entry.address,
      entry.usdcAmountUnits
    ]);
    txs.push({
      to: usdcAddress,
      value: '0',
      data: usdcTransferData,
      contractMethod: {
        inputs: [
          { name: 'to', type: 'address', internalType: 'address' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' }
        ],
        name: 'transfer',
        payable: false
      },
      contractInputsValues: {
        to: entry.address,
        amount: entry.usdcAmountUnits.toString()
      }
    });
  }

  return txs;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const lastPrice = args.lastPrice;
  const currentPrice = args.currentPrice;

  if (!lastPrice || !currentPrice) {
    printUsage();
    throw new Error('Both --last-price and --current-price are required.');
  }

  const safeAddress = ethers.getAddress(args.safeAddress || DEFAULTS.safeAddress);
  const rpcUrl = args.rpcUrl || DEFAULTS.rpcUrl;
  const chainId = args.chainId || DEFAULTS.chainId;
  const outputFile = args.output || DEFAULTS.output;
  const rwaContractAddress = ethers.getAddress(args.rwaContract || DEFAULTS.rwaContract);
  const stakeContractAddress = ethers.getAddress(args.stakeContract || DEFAULTS.stakeContract);
  const usdcContractAddress = ethers.getAddress(args.usdcContract || DEFAULTS.usdcContract);
  const addresses = loadAddresses(args);

  if (addresses.length === 0) {
    throw new Error('No valid addresses provided. Use --addresses and/or --addresses-file.');
  }

  const delta = subtractDecimals(currentPrice, lastPrice);
  if (delta.signedInt <= BIGINT_ZERO) {
    throw new Error(`Price change must be positive. currentPrice (${currentPrice}) - lastPrice (${lastPrice}) = ${delta.signedInt.toString()} / 10^${delta.scale}`);
  }

  const currentParsed = parseDecimal(currentPrice);
  if (currentParsed.signedInt <= BIGINT_ZERO) {
    throw new Error('Current price must be greater than zero.');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const blockNumber = await provider.getBlockNumber();
  const usdcContract = new ethers.Contract(
    usdcContractAddress,
    ['function decimals() view returns (uint8)'],
    provider
  );
  const usdcDecimals = Number(await usdcContract.decimals());

  console.log('Monthly Basis Gnosis Generator');
  console.log('================================');
  console.log(`RPC: ${rpcUrl}`);
  console.log(`Block: ${blockNumber}`);
  console.log(`Safe: ${safeAddress}`);
  console.log(`RWA contract: ${rwaContractAddress}`);
  console.log(`Stake contract: ${stakeContractAddress}`);
  console.log(`USDC contract: ${usdcContractAddress}`);
  console.log(`Addresses: ${addresses.length}`);
  console.log(`Last price: ${lastPrice}`);
  console.log(`Current price: ${currentPrice}`);
  console.log(`Price delta: ${delta.signedInt.toString()} / 10^${delta.scale}`);
  console.log(`USDC decimals: ${usdcDecimals}`);
  console.log('');

  const scanned = await scanBalances(provider, rwaContractAddress, stakeContractAddress, addresses);

  const entries: WalletScanResult[] = scanned.map((row) => {
    const gainAmountUnits = multiplyAndScaleRoundHalfUp(
      delta.signedInt,
      delta.scale,
      row.total,
      usdcDecimals
    );

    const sellNumerator = row.total * delta.signedInt * pow10(currentParsed.scale);
    const sellDenominator = pow10(delta.scale) * currentParsed.signedInt;
    const tokensToSell = divideFloor(sellNumerator, sellDenominator);

    const usdcAmountUnits = multiplyAndScaleRoundHalfUp(
      currentParsed.signedInt,
      currentParsed.scale,
      tokensToSell,
      usdcDecimals
    );

    return {
      address: row.address,
      walletBalance: row.wallet,
      stakedBalance: row.staked,
      totalBalance: row.total,
      tokensToSell,
      gainAmountUnits,
      gainAmountFormatted: ethers.formatUnits(gainAmountUnits, usdcDecimals),
      usdcAmountUnits,
      usdcAmountFormatted: ethers.formatUnits(usdcAmountUnits, usdcDecimals)
    };
  });

  const payableEntries = entries.filter((x) => x.tokensToSell > BIGINT_ZERO && x.usdcAmountUnits > BIGINT_ZERO);
  if (payableEntries.length === 0) {
    throw new Error('No payable entries found (all tokens-to-sell or calculated USDC amounts were 0).');
  }

  const transactions = buildGnosisTransactions(
    payableEntries,
    safeAddress,
    rwaContractAddress,
    usdcContractAddress
  );

  let totalLSRWA = BIGINT_ZERO;
  let totalUSDCUnits = BIGINT_ZERO;

  console.log('Per-wallet scan and payout');
  console.log('---------------------------');
  for (const entry of entries) {
    console.log(`${entry.address}`);
    console.log(`  Wallet LSRWA: ${entry.walletBalance.toString()}`);
    console.log(`  Staked LSRWA: ${entry.stakedBalance.toString()}`);
    console.log(`  Total LSRWA: ${entry.totalBalance.toString()}`);
    console.log(`  Basis gain (USDC): ${entry.gainAmountFormatted} (${entry.gainAmountUnits.toString()} units)`);
    console.log(`  Tokens to sell: ${entry.tokensToSell.toString()}`);
    console.log(`  USDC payout: ${entry.usdcAmountFormatted} (${entry.usdcAmountUnits.toString()} units)`);
    console.log('');
  }

  for (const entry of payableEntries) {
    totalLSRWA += entry.tokensToSell;
    totalUSDCUnits += entry.usdcAmountUnits;
  }

  const gnosisJSON = {
    version: '1.0',
    chainId,
    createdAt: Date.now(),
    meta: {
      name: 'Monthly Basis Payout + LSRWA Collection',
      description: 'Collect floor(gain/currentPrice) LSRWA and pay that amount valued at currentPrice in USDC',
      txBuilderVersion: '1.16.3',
      createdFromSafeAddress: safeAddress,
      createdFromOwnerAddress: '',
      checksum: ''
    },
    transactions
  };

  const reportJSON = {
    pricing: {
      lastPrice,
      currentPrice,
      priceDelta: `${delta.signedInt.toString()}/10^${delta.scale}`
    },
    source: {
      rpcUrl,
      blockNumber,
      contracts: {
        rwa: rwaContractAddress,
        stake: stakeContractAddress,
        usdc: usdcContractAddress
      }
    },
    totals: {
      addressesInput: addresses.length,
      addressesIncluded: payableEntries.length,
      totalLSRWACollected: totalLSRWA.toString(),
      totalUSDCSentUnits: totalUSDCUnits.toString(),
      totalUSDCSentFormatted: ethers.formatUnits(totalUSDCUnits, usdcDecimals),
      usdcDecimals
    },
    entries: entries.map((entry) => ({
      address: entry.address,
      walletLSRWA: entry.walletBalance.toString(),
      stakedLSRWA: entry.stakedBalance.toString(),
      totalLSRWA: entry.totalBalance.toString(),
      tokensToSell: entry.tokensToSell.toString(),
      gainUsdcUnits: entry.gainAmountUnits.toString(),
      gainUsdcFormatted: entry.gainAmountFormatted,
      usdcUnits: entry.usdcAmountUnits.toString(),
      usdcFormatted: entry.usdcAmountFormatted,
      includedInBatch: entry.tokensToSell > BIGINT_ZERO && entry.usdcAmountUnits > BIGINT_ZERO
    }))
  };

  fs.writeFileSync(outputFile, JSON.stringify(gnosisJSON, null, 2));
  fs.writeFileSync(`${outputFile}.report.json`, JSON.stringify(reportJSON, null, 2));

  console.log('Summary');
  console.log('-------');
  console.log(`Addresses scanned: ${addresses.length}`);
  console.log(`Addresses included in batch: ${payableEntries.length}`);
  console.log(`Total LSRWA to collect (0 decimals): ${totalLSRWA.toString()}`);
  console.log(`Total USDC to send: ${ethers.formatUnits(totalUSDCUnits, usdcDecimals)}`);
  console.log(`Batch transaction count: ${transactions.length}`);
  console.log(`Output JSON: ${outputFile}`);
  console.log(`Report JSON: ${outputFile}.report.json`);
}

main().catch((error) => {
  console.error('Fatal error:', error instanceof Error ? error.message : error);
  process.exit(1);
});
