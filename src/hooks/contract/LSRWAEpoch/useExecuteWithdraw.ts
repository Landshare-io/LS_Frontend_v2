import VaultAbi from "@/abis/Vault.json";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import { useWriteContract } from 'wagmi'

export default function useExecuteWithdraw(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function executeWithdraw(id: BigInt) {
    await writeContract({
      address: LSRWA_VAULT_ADDRESS[chainId],
      abi: VaultAbi,
      functionName: "executeWithdraw",
      chainId: chainId,
      args: [id]
    });
  }

  return {
    executeWithdraw,
    isPending,
    isError,
    error,
    data
  }
}
