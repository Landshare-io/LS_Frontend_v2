import { useWriteContract } from 'wagmi'
import { bsc } from "viem/chains"
import HouseNft from "../../../abis/HouseNft.json";
import { HOUSE_NFT_CONTRACT } from '../../../config/constants/environments';
import { Address } from 'viem';
import { BigNumberish } from 'ethers';

export default function useApprove() {
  const {
    data,
    isPending,
    error,
    isError,
    writeContract
  } = useWriteContract();

  async function approve(chainId: number, approveAddress: Address, houseId: number) {
    await writeContract({
      address: HOUSE_NFT_CONTRACT[chainId],
      abi: HouseNft,
      functionName: "approve",
      chainId: chainId,
      args: [approveAddress, houseId]
    });
  }

  return {
    approve,
    error,
    isPending,
    isError,
    data
  }
}
