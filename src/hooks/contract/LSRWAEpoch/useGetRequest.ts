import { useReadContract } from "wagmi";
import VaultAbi from "@/abis/Vault.json";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import { Address } from "viem";

export default function useGetRequest(chainId: number, type = 0, processed = false, page = 1, limit = 10, owner = '', isAdmin = true, address: Address) {

    const { data, isError, isLoading, error, refetch } = useReadContract({
        address: LSRWA_VAULT_ADDRESS[chainId],
        abi: VaultAbi,
        functionName: "getRequests",
        chainId: chainId,
        args: [type, processed, page, limit, address, isAdmin]
    })

    if (typeof address == 'undefined') return { data: 0, refetch }
    if (isLoading) return { data: 0, refetch }
    if (isError) {
        console.log('Fetching Vault Contract error', error)
        return { data: 0, refetch }
    }

    return { data, refetch }
}
