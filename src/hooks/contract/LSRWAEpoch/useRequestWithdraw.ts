import VaultAbi from "@/abis/Vault.json";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import { useWriteContract } from 'wagmi'

export default function useRequestWithdraw(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function requestWithdraw(amount: BigInt) {
    await writeContract({
      address: LSRWA_VAULT_ADDRESS[chainId],
      abi: VaultAbi,
      functionName: "requestWithdraw",
      chainId: chainId,
      args: [amount]
    });
  }

  return {
    requestWithdraw,
    isPending,
    isError,
    error,
    data
  }
}
