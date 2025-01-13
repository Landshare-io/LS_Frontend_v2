import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import AssetStake from "../../../abis/AssetStake.json"
import { ASSET_STAKE_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useWithdraw(chainId: number) {
  const {
    data,
    isPending,
    writeContract,
    isError
  } = useWriteContract();

  async function withdraw(amount: BigNumberish) {
    await writeContract({
      address: ASSET_STAKE_CONTRACT_ADDRESS[chainId],
      abi: AssetStake,
      functionName: "withdraw",
      chainId: chainId,
      args: [amount]
    });
  }

  return {
    withdraw,
    isPending,
    data,
    isError
  }
}
