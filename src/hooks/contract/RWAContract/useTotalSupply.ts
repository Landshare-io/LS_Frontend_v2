import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWACONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalSupply() {
  const { data, isError, isLoading, error } = useReadContract({
    address: RWACONTRACT_ADDRESS,
    abi: RwaContractAbi,
    functionName: "totalSupply",
    chainId: bsc.id
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching RWAContract totalSupply error', error)
    return 0
  }

  return data
}
