import { useWriteContract } from 'wagmi'
import { bsc } from 'viem/chains';
import HouseNft from "../../../abis/HouseNft.json";
import { HOUSE_NFT_CONTRACT, ADMIN_WALLET_ADDRESS } from "../../../config/constants/environments";

export default function useSetApprovalForAll() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function setApprovalForAll(chainId: number, value: boolean) {
    await writeContract({
      address: HOUSE_NFT_CONTRACT[chainId],
      abi: HouseNft,
      functionName: "setApprovalForAll",
      chainId: chainId,
      args: [ADMIN_WALLET_ADDRESS, value]
    })
  }

  return {
    setApprovalForAll,
    isPending,
    data
  }
}
