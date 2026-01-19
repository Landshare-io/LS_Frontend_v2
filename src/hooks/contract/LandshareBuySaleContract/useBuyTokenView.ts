import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LandshareBuySaleAbi from "../../../abis/LandshareBuySale.json"
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";
import { Address } from "viem";

export default function useBuyTokenView(chainId: number, amountOfSecurities: number | BigNumberish, stableCoinAddress: Address) {
  // Skip the contract call if amountOfSecurities is 0 or invalid
  // Also skip if amount is less than 1 (minimum threshold to avoid contract reverts)
  const shouldSkip = typeof LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId] == "undefined" 
    || typeof stableCoinAddress == "undefined" 
    || !amountOfSecurities 
    || Number(amountOfSecurities) === 0
    || Number(amountOfSecurities) < 1;

  const { data, isError, isLoading, error } = useReadContract({
    address: LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
    abi: LandshareBuySaleAbi,
    functionName: "buyTokenView",
    chainId: chainId,
    args: [amountOfSecurities, stableCoinAddress],
    query: {
      enabled: !shouldSkip,
      retry: false,
      staleTime: 5000,
    }
  })

  if (shouldSkip) return [0, 0]
  if (isLoading) return [0, 0]
  // {
  //   amountOfStableCoin: 0,
  //   amountOfLAND: 0
  // }
  if (isError) {
    // Silently return default values instead of logging error for better UX
    // console.log('Fetching LandshareBuySaleContract buyTokenView error', error)
    return [0, 0]
    // {
    //   amountOfStableCoin: 0,
    //   amountOfLAND: 0
    // }
  }

  return data
}
