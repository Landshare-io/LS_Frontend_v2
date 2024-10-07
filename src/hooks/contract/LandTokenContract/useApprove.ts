import { useWriteContract } from 'wagmi'
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LAND_TOKEN_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from 'viem';
import { BigNumberish } from 'ethers';

export default function useApprove() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function approve(chainId: number, approveAddress: Address, amount: number | BigNumberish) {
    await writeContract({
      address: LAND_TOKEN_CONTRACT_ADDRESS[chainId],
      abi: LpTokenV2Abi,
      functionName: "approve",
      chainId: chainId,
      args: [approveAddress, amount]
    });
  }

  return {
    approve,
    isPending,
    data
  }
}
