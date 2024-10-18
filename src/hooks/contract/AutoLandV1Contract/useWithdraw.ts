import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import AutoVaultContract from "../../../abis/AutoLandVault.json"
import { AUTO_LAND_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdraw() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function withdraw(amount: BigNumberish) {
    await writeContract({
      address: AUTO_LAND_V1_CONTRACT_ADDRESS,
      abi: AutoVaultContract,
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
