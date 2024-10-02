import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import type { Address } from "viem";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useWithdraw() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function withdraw(withdrawId: number, amount: BigNumberish) {
    await writeContract({
      address: MASTERCHEF_CONTRACT_ADDRESS as Address,
      abi: MasterchefAbi,
      functionName: "withdraw",
      chainId: bsc.id,
      args: [withdrawId, amount]
    });
  }

  return {
    withdraw,
    isPending,
    data
  }
}
