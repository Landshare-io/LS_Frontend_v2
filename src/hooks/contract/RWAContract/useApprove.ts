import { useWriteContract } from 'wagmi'
import { bsc } from "viem/chains"
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from '../../../config/constants/environments';
import { Address } from 'viem';
import { BigNumberish } from 'ethers';

export default function useApprove(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract,
  } = useWriteContract();

  async function approve(approveAddress: Address, amount: number | BigNumberish) {
    try {
      console.log('=== RWA Approve Transaction ===');
      console.log('Approve address:', approveAddress);
      console.log('Amount:', amount.toString());
      console.log('RWA Contract:', RWA_CONTRACT_ADDRESS[chainId]);
      console.log('Chain ID:', chainId);
      
      await writeContract({
        address: RWA_CONTRACT_ADDRESS[chainId],
        abi: RwaContractAbi,
        functionName: "approve",
        chainId: chainId,
        args: [approveAddress, amount]
      });
      
      console.log('RWA approval transaction submitted');
    } catch (err) {
      console.error('=== RWA Approve Transaction Error ===');
      console.error('Error details:', err);
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
