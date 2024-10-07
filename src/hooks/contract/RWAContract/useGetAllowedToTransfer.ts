import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useGetAllowedToTransfer(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: RWA_CONTRACT_ADDRESS[bsc.id],
    abi: RwaContractAbi,
    functionName: "getAllowedToTransfer",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return 0
  if (isLoading) return 0
  if (isError) {
    console.log('Fetching LandshareSaleContract getAllowedToTransfer error', error)
    return 0
  }

  return data
}
