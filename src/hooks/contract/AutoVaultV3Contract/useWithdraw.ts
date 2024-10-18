import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import AutoVaultV3Contract from "../../../abis/AutoVaultV3.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdraw(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function withdraw(amount: BigNumberish) {
    await writeContract({
      address: AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id],
      abi: AutoVaultV3Contract,
      functionName: "withdraw",
      chainId: bsc.id,
      args: [amount]
    });
  }

  return {
    withdraw,
    isPending,
    data
  }
}
