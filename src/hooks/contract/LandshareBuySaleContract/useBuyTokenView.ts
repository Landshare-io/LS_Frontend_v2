import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LandshareBuySaleAbi from "../../../abis/LandshareBuySale.json"
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";
import { Address } from "viem";

export default function useBuyTokenView(chainId: number, amountOfSecurities: number | BigNumberish, stableCoinAddress: Address) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[bsc.id],
    abi: LandshareBuySaleAbi,
    functionName: "buyTokenView",
    chainId: bsc.id,
    args: [amountOfSecurities, stableCoinAddress]
  })

  if (isLoading) return [0, 0]
  // {
  //   amountOfStableCoin: 0,
  //   amountOfLAND: 0
  // }
  if (isError) {
    console.log('Fetching LandshareBuySaleContract buyTokenView error', error)
    return [0, 0]
    // {
    //   amountOfStableCoin: 0,
    //   amountOfLAND: 0
    // }
  }

  return data
}
