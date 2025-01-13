import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import PremiumNft from "../../../abis/PremiumNft.json";
import { ADMIN_WALLET_ADDRESS } from "../../../config/constants/environments";

export default function useSetApprovalForAll() {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function setApprovalForAll(chainId: number, contractAddress: Address) {
    await writeContract({
      address: contractAddress,
      abi: PremiumNft,
      functionName: "setApprovalForAll",
      chainId: chainId,
      args: [ADMIN_WALLET_ADDRESS[chainId], true]
    })
  }

  return {
    setApprovalForAll,
    isPending,
    isError,
    data
  }
}
