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
    writeContract
  } = useWriteContract();

  async function approve(approveAddress: Address, amount: number | BigNumberish) {
    await writeContract({
      address: HOUSE_NFT_CONTRACT,
      abi: HouseNft,
      functionName: "approve",
      chainId: bsc.id,
      args: [approveAddress, amount]
    });
  }

  return {
    approve,
    isPending,
    data
  }
}
