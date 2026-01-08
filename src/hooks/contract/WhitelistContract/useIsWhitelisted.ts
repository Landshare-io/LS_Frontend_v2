import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import WhitelistContractAbi from "../../../abis/WhitelistContract.json";
import { WHITELIST_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useIsWhitelisted(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: WHITELIST_CONTRACT_ADDRESS[chainId],
    abi: WhitelistContractAbi,
    functionName: "isWhitelisted",
    chainId: chainId,
    args: [address]
  });

  if (typeof address === 'undefined') return { refetch, data: false };
  if (isLoading) return { refetch, data: false };
  if (isError) {
    console.log('Fetching WhitelistContract isWhitelisted error', error);
    return { refetch, data: false };
  }

  return { refetch, data };
}