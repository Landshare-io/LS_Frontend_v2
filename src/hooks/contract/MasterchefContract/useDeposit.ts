import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import type { Address } from "viem";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useDeposit() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function deposit(amount: BigNumberish) {
    await writeContract({
      address: MASTERCHEF_CONTRACT_ADDRESS as Address,
      abi: MasterchefAbi,
      functionName: "deposit",
      chainId: bsc.id,
      args: [1, amount]
    });
  }

  return {
    deposit,
    isPending,
    data
  }
}
