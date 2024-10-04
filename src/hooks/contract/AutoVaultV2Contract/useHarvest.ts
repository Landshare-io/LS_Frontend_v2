import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import type { Address } from "viem";
import AutoVaultV2Contract from "../../../abis/AutoVaultV2.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useHarvest() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function harvest() {
    await writeContract({
      address: AUTO_VAULT_V3_CONTRACT_ADDRESS as Address,
      abi: AutoVaultV2Contract,
      functionName: "harvest",
      chainId: bsc.id,
      args: []
    });
  }

  return {
    harvest,
    isPending,
    data
  }
}
