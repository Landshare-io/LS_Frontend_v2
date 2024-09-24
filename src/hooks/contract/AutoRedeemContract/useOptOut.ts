import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import type { Address } from "viem";
import AutoRedeemAbi from "../../../abis/AutoRedeem.json";
import { AUTO_REDEEM_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useOptOut() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function onOptOut() {
    await writeContract({
      address: AUTO_REDEEM_CONTRACT_ADDRESS as Address,
      abi: AutoRedeemAbi,
      functionName: "optOut",
      chainId: bsc.id
    });
  }

  return {
    onOptOut,
    isPending,
    data
  }
}
