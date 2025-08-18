// hooks/useWallet.ts

import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { formatUnits } from 'ethers';
import { useChainId } from "wagmi";
import { RWA_CONTRACT_ADDRESS, USDC_ADDRESS } from "@/config/constants/environments";
import { LSRWA_ADMIN_ADDRESS } from "@/config/constants/environments";
import numeral from "numeral";

export function useWallet() {

  const { address, isConnected, connector, status } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId()

  const {
    data: usdcBalance,
    isPending: isUSDCBalanceLoading,
    refetch: refetchUSDCBalance,
  } = useBalance({
    address: address,
    token: USDC_ADDRESS[chainId],
    chainId: chainId,
  }) as { data: any, isPending: any, refetch: any };

  const {
    data: tokenBalance,
    isPending: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useBalance({
    address: address,
    token: RWA_CONTRACT_ADDRESS[chainId],
    chainId: chainId
  }) as { data: any, isPending: any, refetch: any };
  const isAdminConnected = isConnected && address == LSRWA_ADMIN_ADDRESS[chainId]
  return {
    isAdminConnected,
    address,
    isConnected,
    status,
    connector,
    disconnect,
    balance: usdcBalance?.value ? numeral(formatUnits(usdcBalance.value, 6)).format("0.[000]") : '0.0',
    symbol: usdcBalance?.symbol ?? '',
    tokenBalance: !isTokenBalanceLoading ? numeral(formatUnits((tokenBalance as any).value, 18)).format("0.[000]") : '0.0',
    // symbol: balanceData?.symbol ?? '',
    isTokenBalanceLoading,
    isUSDCBalanceLoading,
    refetchUSDCBalance,
    refetchTokenBalance,
  };
}
