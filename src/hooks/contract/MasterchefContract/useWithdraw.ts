import { useWriteContract } from "wagmi";
import type { Address } from "viem";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useWithdraw(chainId: number) {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function withdraw(withdrawId: number, amount: BigNumberish) {
    writeContract({
      address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id] as Address,
      abi: MasterchefAbi,
      functionName: "withdraw",
      chainId: bsc.id,
      args: [withdrawId, amount]
    });
  }

  return {
    withdraw,
    isPending,
    isError,
    data
  }
}
