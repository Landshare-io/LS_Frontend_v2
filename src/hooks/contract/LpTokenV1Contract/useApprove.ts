import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import { BigNumberish } from 'ethers';
import { bsc } from 'viem/chains';
import LpTokenV1Abi from "../../../abis/LpTokenV1.json";
import { LP_TOKEN_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useApprove() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function approve(approveAddress: Address, amount: number | BigNumberish) {
    await writeContract({
      address: LP_TOKEN_V1_CONTRACT_ADDRESS,
      abi: LpTokenV1Abi,
      functionName: "approve",
      args: [approveAddress, amount],
      chainId: bsc.id
    });
  }

  return {
    approve,
    isPending,
    data
  }
}
