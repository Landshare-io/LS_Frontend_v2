import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import AutoVaultV3Contract from "../../../abis/AutoVaultV3.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdrawAll(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function withdrawAll() {
    writeContract({
      address: AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id],
      abi: AutoVaultV3Contract,
      functionName: "withdrawAll",
      chainId: bsc.id,
      args: []
    });
  }

  return {
    withdrawAll,
    isPending,
    isError,
    data,
    error
  }
}
