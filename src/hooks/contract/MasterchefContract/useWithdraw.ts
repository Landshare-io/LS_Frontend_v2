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
    writeContract
  } = useWriteContract();

  async function withdraw(withdrawId: number, amount: BigNumberish) {
    await writeContract({
      address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id] as Address,
      abi: MasterchefAbi,
      functionName: "withdraw",
      chainId: chainId,
      args: [withdrawId, amount]
    });
  }

  return {
    withdraw,
    isPending,
    data
  }
}
