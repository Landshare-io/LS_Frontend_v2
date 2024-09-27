import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useGetAllowedToTransfer(address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: RWA_CONTRACT_ADDRESS,
    abi: RwaContractAbi,
    functionName: "getAllowedToTransfer",
    chainId: bsc.id,
    args: [address]
  })

  if (isLoading) return []
  if (isError) {
    console.log('Fetching LandshareSaleContract getAllowedToTransfer error', error)
    return []
  }

  return data
}
