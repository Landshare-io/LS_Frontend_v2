// hooks/useWallet.ts

import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { formatUnits, ethers } from 'ethers';
import { formatNumber } from '@/utils/helpers/format-numbers';
import type { Address } from "viem";

export function useWallet() {

  const { address, isConnected, connector, status, chainId } = useAccount();
  const { disconnect } = useDisconnect();

  const {
    data: usdcBalance,
    isPending: isUSDCBalanceLoading,
    refetch: refetchUSDCBalance,
  } = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_USDC_ADDRESS as Address,
    chainId: chainId
  }) as { data: any, isPending: any, refetch: any };

  const {
    data: tokenBalance,
    isPending: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as Address,
    chainId: chainId
  }) as { data: any, isPending: any, refetch: any };

  const decimals = parseInt(process.env.NEXT_PUBLIC_USDC_DECIMALS || '6');

  const isAdminConnected = isConnected && address == process.env.NEXT_PUBLIC_ADMIN_ADDRESS
  return {
    isAdminConnected,
    address,
    isConnected,
    status,
    connector,
    disconnect,
    balance: usdcBalance?.value ? formatNumber(formatUnits(usdcBalance.value, decimals)) : '0.0',
    symbol: usdcBalance?.symbol ?? '',
    tokenBalance: !isTokenBalanceLoading ? formatNumber(formatUnits((tokenBalance as any).value, 18)) : '0.0',
    // symbol: balanceData?.symbol ?? '',
    isTokenBalanceLoading,
    isUSDCBalanceLoading,
    refetchUSDCBalance,
    refetchTokenBalance,
  };
}
