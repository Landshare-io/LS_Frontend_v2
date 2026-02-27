import { useWriteContract } from 'wagmi'
import { bsc } from "viem/chains"
import RwaLpContractAbi from "../../../abis/RwaLpContract.json";
import { RWA_LP_CONTRACT_ADDRESS } from '../../../config/constants/environments';
import { Address } from 'viem';
import { BigNumberish } from 'ethers';

export default function useApprove() {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function approve(chainId: number, approveAddress: Address, amount: number | BigNumberish, lpContractAddress?: Address) {
    await writeContract({
      address: lpContractAddress || RWA_LP_CONTRACT_ADDRESS[bsc.id],
      abi: RwaLpContractAbi,
      functionName: "approve",
      chainId: bsc.id,
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
