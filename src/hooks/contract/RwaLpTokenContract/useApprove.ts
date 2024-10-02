import { useWriteContract } from 'wagmi'
import { bsc } from 'viem/chains'
import RwaLpContractAbi from "../../../abis/RwaLpContract.json";
import { RWA_LP_CONTRACT_ADDRESS } from '../../../config/constants/environments';
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
      address: RWA_LP_CONTRACT_ADDRESS,
      abi: RwaLpContractAbi,
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
