import VaultAbi from "@/abis/Vault.json";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import { useWriteContract } from 'wagmi'

export default function useCancelDeposit(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function cancelDeposit(id: BigInt) {
    await writeContract({
      address: LSRWA_VAULT_ADDRESS[chainId],
      abi: VaultAbi,
      functionName: "cancelDepositRequest",
      chainId: chainId,
      args: [id]
    });
  }

  return {
    cancelDeposit,
    isPending,
    isError,
    error,
    data
  }
}
