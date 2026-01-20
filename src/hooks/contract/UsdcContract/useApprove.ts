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
    error,
    writeContract
  } = useWriteContract();

  async function approve(chainId: number, approveAddress: Address, amount: number | BigNumberish) {
    try {
      console.log('=== USDC Approve Transaction Starting ===');
      console.log('Approving address:', approveAddress);
      console.log('Amount:', amount.toString());
      console.log('USDC Contract:', USDC_ADDRESS[chainId]);
      console.log('Chain ID:', chainId);
      
      await writeContract({
        address: USDC_ADDRESS[chainId],
        abi: usdcAbi,
        functionName: "approve",
        chainId: chainId,
        args: [approveAddress, amount]
      });
      
      console.log('USDC approve transaction submitted successfully');
    } catch (err) {
      console.error('=== USDC Approve Transaction Error ===');
      console.error('Error details:', err);
      console.error('Approve address:', approveAddress);
      console.error('Amount:', amount.toString());
      throw err;
    }
  }

  return {
    approve,
    isPending,
    isError,
    error,
    data
  }
}
