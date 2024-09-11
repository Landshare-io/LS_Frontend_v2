import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import BNBApePair from "../../../abis/BNBApePair.json";
import { BNBAPEPAIRCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetReserves() {
  const { data } = useReadContract({
    address: BNBAPEPAIRCONTRACT_ADDRESS,
    abi: BNBApePair,
    functionName: "getReserves",
    chainId: bsc.id
  })

  return data
}
