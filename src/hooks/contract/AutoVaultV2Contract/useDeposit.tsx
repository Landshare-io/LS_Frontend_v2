import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import type { Address } from "viem";
import AutoVaultV2Contract from "../../../abis/AutoVaultV2.json"
import { AUTO_VAULT_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useDeposit() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function deposit(amount: BigNumberish) {
    await writeContract({
      address: AUTO_VAULT_V2_CONTRACT_ADDRESS as Address,
      abi: AutoVaultV2Contract,
      functionName: "deposit",
      chainId: bsc.id,
      args: [amount]
    });
  }

  return {
    deposit,
    isPending,
    data
  }
}
