import { useReadContracts } from 'wagmi';
import { formatUnits } from "ethers";
import vaultAbi from '@/abis/Vault.json';
import usdcAbi from "@/abis/ERC20.json"

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const USDC_DECIMAL = parseInt(process.env.NEXT_PUBLIC_USDC_DECIMALS || '6');

export function useAdminSummary() {

  const { data, isLoading, refetch, error } = useReadContracts({
    contracts: [
      {
        address: USDC_ADDRESS as any,
        abi: usdcAbi,
        functionName: 'balanceOf',
        args: [VAULT_ADDRESS],
      },
      {
        abi: vaultAbi,
        address: VAULT_ADDRESS as any,
        functionName: 'borrowingUSDC',
      },
      {
        address: TOKEN_ADDRESS as any,
        abi: usdcAbi,
        functionName: 'balanceOf',
        args: [VAULT_ADDRESS],
      },
      {
        address: VAULT_ADDRESS as any,
        abi: vaultAbi,
        functionName: 'collateralRatio',
      },
      {
        abi: vaultAbi,
        address: VAULT_ADDRESS as any,
        functionName: 'repaymentRequired',
      },
      {
        abi: vaultAbi,
        address: VAULT_ADDRESS as any,
        functionName: 'rewardDebt',
      },
    ],
    allowFailure: false,
  });

  const poolUSDC = formatUnits((data as any)?.[0] ?? "0", USDC_DECIMAL);
  const borrowingUSDC = formatUnits((data as any)?.[1] ?? "0", USDC_DECIMAL);
  const poolLSRWA = formatUnits((data as any)?.[2] ?? "0", 18);
  const collateralRatio = Number((data as any)?.[3]?? "0") ;
  const repaymentRequired = data?.[4]?? false ;
  const rewardDebt = formatUnits((data as any)?.[5]?? "0", USDC_DECIMAL) ;

  return {
    poolUSDC,
    borrowingUSDC,
    poolLSRWA,
    collateralRatio,
    repaymentRequired,
    rewardDebt,
    refetch,
    isLoading,
    error,
  };
}
