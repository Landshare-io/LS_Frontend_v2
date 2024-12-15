import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import AutoVaultV3Contract from "../../../abis/AutoVaultV3.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useDeposit(chainId: number) {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function deposit(amount: BigNumberish) {
    writeContract({
      address: AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id],
      abi: AutoVaultV3Contract,
      functionName: "deposit",
      chainId: bsc.id,
      args: [amount]
    });
  }

  return {
    deposit,
    isPending,
    isError,
    data
  }
}
