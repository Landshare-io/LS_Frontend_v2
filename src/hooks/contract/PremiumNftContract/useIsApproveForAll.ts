import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import PremiumNft from "../../../abis/PremiumNft.json";
import { ADMIN_WALLET_ADDRESS } from "../../../config/constants/environments";

export default function useIsApprovedForAll() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function isApprovedForAll(chainId: number, contractAddress: Address, address: Address | undefined) {
    await writeContract({
      address: contractAddress,
      abi: PremiumNft,
      functionName: "isApprovedForAll",
      chainId: chainId,
      args: [address, ADMIN_WALLET_ADDRESS]
    })
  }

  return {
    isApprovedForAll,
    isPending,
    data
  }
}
