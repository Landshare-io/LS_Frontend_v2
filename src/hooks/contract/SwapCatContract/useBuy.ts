import { useWriteContract } from 'wagmi'
import { bsc } from 'viem/chains';
import Swapcat from "../../../abis/Swapcat.json";
import { SWAPCAT_ADDRESS } from "../../../config/constants/environments";

export default function useBuy() {
  const {
    data,
    isError,
    isPending,
    writeContract
  } = useWriteContract();

  async function buy(offerId: number) {
    await writeContract({
      address: SWAPCAT_ADDRESS,
      abi: Swapcat,
      functionName: "buy",
      chainId: bsc.id,
      args: [offerId]
    });
  }

  return {
    buy,
    isError,
    isPending,
    data
  }
}
