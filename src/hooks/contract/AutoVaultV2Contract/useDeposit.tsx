import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import AutoVaultV2Contract from "../../../abis/AutoVaultV2.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useDeposit(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function deposit(amount: BigNumberish) {
    await writeContract({
      address: AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id],
      abi: AutoVaultV2Contract,
      functionName: "deposit",
      chainId: chainId,
      args: [amount]
    });
  }

  return {
    deposit,
    isPending,
    data
  }
}
