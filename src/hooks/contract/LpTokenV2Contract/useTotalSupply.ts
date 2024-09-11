import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LPTOKENV2CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalSupply() {
  const { data } = useReadContract({
    address: LPTOKENV2CONTRACT_ADDRESS,
    abi: LpTokenV2Abi,
    functionName: "totalSupply",
    chainId: bsc.id
  })

  return data
}
