import { useWriteContract } from 'wagmi'
import usdcAbi from "../../../abis/USDC.json";
import { USDC_ADDRESS } from "../../../config/constants/environments";
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
      address: USDC_ADDRESS[chainId ?? 56],
      abi: usdcAbi,
      functionName: "approve",
      chainId: chainId ?? 56,
      args: [approveAddress, amount]
    });
  }

  return {
    approve,
    isPending,
    data
  }
}
