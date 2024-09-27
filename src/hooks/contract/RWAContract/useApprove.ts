import { useWriteContract } from 'wagmi'
import { bsc } from 'viem/chains'
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from '../../../config/constants/environments';
import { Address } from 'viem';
import { BigNumberish } from 'ethers';

export default function useApprove() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function approve(approveAddress: Address, amount: number | BigNumberish) {
    const result = await writeContract({
      address: RWA_CONTRACT_ADDRESS,
      abi: RwaContractAbi,
      functionName: "approve",
      chainId: bsc.id,
      args: [approveAddress, amount]
    });

    console.log('==============', result)
  }

  return {
    approve,
    isPending,
    data
  }
}
