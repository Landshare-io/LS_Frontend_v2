import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import PremiumNft from "../../../abis/PremiumNft.json";
import { ADMIN_WALLET_ADDRESS } from "../../../config/constants/environments";

export default function useApprove() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function approve(chainId: number, contractAddress: Address, itemId: number) {
    await writeContract({
      address: contractAddress,
      abi: PremiumNft,
      functionName: "approve",
      chainId: chainId,
      args: [ADMIN_WALLET_ADDRESS[chainId], itemId]
    })
  }

  return {
    approve,
    isPending,
    data
  }
}
