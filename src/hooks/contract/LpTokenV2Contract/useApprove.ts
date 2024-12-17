import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import { BigNumberish } from 'ethers';
import { bsc } from 'viem/chains';
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LP_TOKEN_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useApprove(chainId: number) {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function approve(approveAddress: Address, amount: number | BigNumberish) {
    writeContract({
      address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id],
      abi: LpTokenV2Abi,
      functionName: "approve",
      args: [approveAddress, amount],
      chainId: bsc.id
    });
  }

  return {
    approve,
    isPending,
    isError,
    data
  }
}
