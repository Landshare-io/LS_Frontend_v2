import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import AutoVaultV2Contract from "../../../abis/AutoVaultV2.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdrawAll(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function withdrawAll() {
    await writeContract({
      address: AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id],
      abi: AutoVaultV2Contract,
      functionName: "withdrawAll",
      chainId: bsc.id,
      args: []
    });
  }

  return {
    withdrawAll,
    isPending,
    data
  }
}
