import { useWriteContract } from "wagmi";
import AutoVaultV2Contract from "../../../abis/AutoVaultV2.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useHarvest(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function harvest() {
    await writeContract({
      address: AUTO_VAULT_V3_CONTRACT_ADDRESS[chainId],
      abi: AutoVaultV2Contract,
      functionName: "harvest",
      chainId: chainId,
      args: []
    });
  }

  return {
    harvest,
    isPending,
    data
  }
}
