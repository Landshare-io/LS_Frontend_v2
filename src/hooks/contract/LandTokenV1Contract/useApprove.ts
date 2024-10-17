import { useWriteContract } from 'wagmi'
import { bsc } from "viem/chains";
import LandTokenAbi from "../../../abis/LandToken.json";
import { LAND_TOKEN_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from 'viem';
import { BigNumberish } from 'ethers';

export default function useApprove() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function approve(approveAddress: Address | undefined, amount: number | BigNumberish) {
    await writeContract({
      address: LAND_TOKEN_V1_CONTRACT_ADDRESS,
      abi: LandTokenAbi,
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
