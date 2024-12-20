import { useWriteContract } from 'wagmi'
import usdcAbi from "../../../abis/USDC.json";
import { USDC_ADDRESS } from "../../../config/constants/environments";
import { Address } from 'viem';
import { BigNumberish } from 'ethers';

export default function useApprove() {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function approve(chainId: number, approveAddress: Address, amount: number | BigNumberish) {
    await writeContract({
      address: USDC_ADDRESS[chainId],
      abi: usdcAbi,
      functionName: "approve",
      chainId: chainId,
      args: [approveAddress, amount]
    });
  }

  return {
    approve,
    isPending,
    isError,
    data
  }
}
