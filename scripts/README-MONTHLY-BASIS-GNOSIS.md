# Monthly Basis Gnosis Generator

Generates a Gnosis Safe batch JSON that:
- Collects `tokensToSell` LSRWA from each address (0 decimals)
- Sends USDC equal to `tokensToSell * currentPrice`

## Formula

- `totalTokens = walletLSRWA + stakedLSRWA`
- `priceDelta = currentPrice - lastPrice`
- `gain = totalTokens * priceDelta`
- `tokensToSell = floor(gain / currentPrice)`
- `usdcPayout = tokensToSell * currentPrice`

USDC amounts are rounded half-up to the on-chain USDC decimals.

## Script

- `scripts/generate-monthly-basis-gnosis-tx.ts`

## Inputs

Required:
- `--last-price <decimal>`
- `--current-price <decimal>`

Address list (use one or both):
- `--addresses <comma,separated,addresses>`
- `--addresses-file <path>` (one address per line, `#` comments supported)

Optional:
- `--safe-address <address>` (default: admin wallet)
- `--output <file>` (default: `gnosis-monthly-basis-transfer.json`)
- `--rpc-url <url>` (default: BSC llama RPC)
- `--chain-id <id>` (default: `56`)

## Usage

```bash
npm run gnosis-monthly-basis -- \
  --last-price 1.2375 \
  --current-price 1.2550 \
  --addresses-file ./addresses.txt \
  --safe-address 0x692d606069f7798fAe4FA51117dA418EFa15A2BA \
  --output gnosis-monthly-basis-transfer.json
```

## Output JSON

The generated JSON includes:
- Safe metadata (`version`, `chainId`, `meta`)
- pricing and totals summary
- per-address scan and payout entry
- `transactions` array ready for Safe Transaction Builder upload

Each included address gets two transactions:
1. `RWAContract.transferFunds(from=user, to=safe, amount=tokensToSell)`
2. `USDC.transfer(to=user, amount=usdcPayout)`

## Notes

- Price delta must be positive (`currentPrice > lastPrice`).
- Addresses with zero computed `tokensToSell` or zero computed USDC are excluded from the batch.
- Verify all contract methods and amounts before signing in Safe.
