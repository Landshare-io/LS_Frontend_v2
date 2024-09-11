import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import PancakePairAbi from '../../../abis/PancakePair.json';
import { PANCAKEPAIRCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetReserves() {
  const { data } = useReadContract({
    address: PANCAKEPAIRCONTRACT_ADDRESS,
    abi: PancakePairAbi,
    functionName: "getReserves",
    chainId: bsc.id
  })

  return data
}
