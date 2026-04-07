import { useReadContract } from "wagmi";
import VaultAbi from "@/abis/Vault.json";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import { Address } from "viem";

export default function usefetchTotalValue(chainId: number, users : Address[]) {

    const { data, isError, isLoading, error, refetch } = useReadContract({
        address: LSRWA_VAULT_ADDRESS[chainId],
        abi: VaultAbi,
        functionName: "totalDepositValue",
        chainId: chainId,
        args: [users]
    })

    if (typeof LSRWA_VAULT_ADDRESS[chainId] == 'undefined') return { data: 0, refetch }
    if (isLoading) return { data: 0, refetch }
    if (isError) {
        console.log('Fetching Vault Contract total value error', error)
        return { data: 0, refetch }
    }

    return { data, refetch }
}
