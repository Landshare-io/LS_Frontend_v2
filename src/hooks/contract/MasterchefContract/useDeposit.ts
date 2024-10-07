import { useWriteContract } from "wagmi";
import type { Address } from "viem";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useDeposit(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function deposit(depositId: number, amount: BigNumberish) {
    await writeContract({
      address: MASTERCHEF_CONTRACT_ADDRESS[chainId] as Address,
      abi: MasterchefAbi,
      functionName: "deposit",
      args: [depositId, amount]
    });
  }

  return {
    deposit,
    isPending,
    data
  }
}
