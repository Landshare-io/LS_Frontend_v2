import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import AutoVaultV2Contract from "../../../abis/AutoVaultV2.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdraw(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function withdraw(amount: BigNumberish) {
    await writeContract({
      address: AUTO_VAULT_V3_CONTRACT_ADDRESS[chainId],
      abi: AutoVaultV2Contract,
      functionName: "withdraw",
      chainId: chainId,
      args: [amount]
    });
  }

  return {
    withdraw,
    isPending,
    data
  }
}
