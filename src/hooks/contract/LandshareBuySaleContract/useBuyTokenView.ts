import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LandshareBuySaleArtifact from "../../../abis/LandshareBuySale.json"
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";
import { Address, parseEther } from "viem";

const LandshareBuySaleAbi = LandshareBuySaleArtifact.abi;

export default function useBuyTokenView(chainId: number, amountOfSecurities: number | BigNumberish, stableCoinAddress: Address) {
  // Skip the contract call if amountOfSecurities is 0 or invalid
  const shouldSkip = typeof LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId] == "undefined" 
    || typeof stableCoinAddress == "undefined" 
    || !amountOfSecurities 
    || Number(amountOfSecurities) <= 0;

  // Convert the amount - LSRWA has 0 decimals, so no conversion needed
  const amountInWei = shouldSkip ? BigInt(0) : BigInt(Math.floor(Number(amountOfSecurities)));

  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
    abi: LandshareBuySaleAbi,
    functionName: "buyTokenView",
    chainId: chainId,
    args: [amountInWei, stableCoinAddress],
    query: {
      enabled: !shouldSkip,
      retry: 3,
      retryDelay: 1000,
      staleTime: 3000,
      refetchInterval: 10000, // Refetch every 10 seconds for updated prices
    }
  })

  if (shouldSkip) {
    return { amountOfStableCoin: BigInt(0), amountOfLAND: BigInt(0), amountOfSecurities: BigInt(0) }
  }
  
  if (isLoading) {
    return { amountOfStableCoin: BigInt(0), amountOfLAND: BigInt(0), amountOfSecurities: BigInt(0) }
  }
  
  if (isError) {
    // Silently handle errors - price oracle might not be configured yet
    return { amountOfStableCoin: BigInt(0), amountOfLAND: BigInt(0), amountOfSecurities: BigInt(0) }
  }

  // The contract returns [amountOfStableCoin, amountOfLAND, amountOfSecurities_]
  if (Array.isArray(data) && data.length === 3) {
    return {
      amountOfStableCoin: data[0],
      amountOfLAND: data[1],
      amountOfSecurities: data[2]
    }
  }

  // Fallback
  return { amountOfStableCoin: BigInt(0), amountOfLAND: BigInt(0), amountOfSecurities: BigInt(0) }
}
