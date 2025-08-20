import VaultAbi from "@/abis/Vault.json";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import { useWriteContract } from 'wagmi'
import { BigNumberish } from 'ethers';

export default function useRequestDeposit(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function requestDeposit(amount: number | BigNumberish) {
    await writeContract({
      address: LSRWA_VAULT_ADDRESS[chainId],
      abi: VaultAbi,
      functionName: "requestDeposit",
      chainId: chainId,
      args: [amount]
    });
  }

  return {
    requestDeposit,
    isPending,
    isError,
    error,
    data
  }
}
