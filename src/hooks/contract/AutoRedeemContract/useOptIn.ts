import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import AutoRedeemAbi from "../../../abis/AutoRedeem.json";
import { AUTO_REDEEM_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useOptIn(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function onOptIn() {
    await writeContract({
      address: AUTO_REDEEM_CONTRACT_ADDRESS[bsc.id],
      abi: AutoRedeemAbi,
      functionName: "optIn",
      chainId: chainId
    });
  }

  return {
    onOptIn,
    isPending,
    data
  }
}
