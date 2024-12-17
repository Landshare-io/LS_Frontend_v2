import { useWriteContract } from "wagmi";
import type { Address } from "viem";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useDeposit(chainId: number) {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function deposit(depositId: number, amount: BigNumberish) {
    writeContract({
      address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id] as Address,
      abi: MasterchefAbi,
      functionName: "deposit",
      args: [depositId, amount],
      chainId: bsc.id
    });
  }

  return {
    deposit,
    isPending,
    isError,
    data
  }
}
