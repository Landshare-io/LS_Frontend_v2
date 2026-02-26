# LSRWA Balance Checker

This script fetches LSRWA token balances and staked amounts from the BSC network.

## Contracts being queried:
- **RWA Token Contract**: `0x475eD67Bfc62B41c048b81310337c1D75D45aADd`
- **Asset Stake Contract**: `0x018E809663341771002c7dfd9B5ac36DF6044dB7`

## How to use:

### 1. Add wallet addresses to check

Edit `scripts/get-lsrwa-balances.ts` and add your wallet addresses to the `WALLET_ADDRESSES` array:

```typescript
const WALLET_ADDRESSES: string[] = [
  '0x692d606069f7798fAe4FA51117dA418EFa15A2BA',
  '0xYourWalletAddress1',
  '0xYourWalletAddress2',
  // Add more addresses as needed
];
```

### 2. Install tsx (if not already installed)

```bash
npm install -g tsx
# or
npm install --save-dev tsx
```

### 3. Run the script

```bash
tsx scripts/get-lsrwa-balances.ts
```

## Output

The script will:
- Display balances in the console for each wallet
- Show LSRWA token balance (unlocked)
- Show staked balance (locked in staking contract)
- Show total balance (LSRWA + staked)
- Calculate grand totals across all wallets
- Save a detailed JSON report to `lsrwa-balances-report.json`

## Example Output

```
🔍 Fetching LSRWA token balances...

📍 Checking address: 0x692d606069f7798fAe4FA51117dA418EFa15A2BA
  💰 LSRWA Balance: 1234.567890123456789
  🔒 Staked Balance: 5678.901234567890123
  📊 Total Balance: 6913.469124691358912

═══════════════════════════════════════════════════════════
                    SUMMARY REPORT
═══════════════════════════════════════════════════════════

1. Address: 0x692d606069f7798fAe4FA51117dA418EFa15A2BA
   LSRWA Balance: 1234.567890123456789
   Staked Balance: 5678.901234567890123
   Total: 6913.469124691358912

═══════════════════════════════════════════════════════════
GRAND TOTALS:
Total LSRWA: 1234.567890123456789
Total Staked: 5678.901234567890123
Combined Total: 6913.469124691358912
═══════════════════════════════════════════════════════════

✅ Report saved to: lsrwa-balances-report.json
```
