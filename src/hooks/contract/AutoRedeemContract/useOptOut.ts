import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import type { Address } from "viem";
import AutoRedeemAbi from "../../../abis/AutoRedeem.json";
import { AUTOREDEEMCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useOptOut() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function onOptOut() {
    await writeContract({
      address: AUTOREDEEMCONTRACT_ADDRESS as Address,
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
