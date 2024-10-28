import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import AssetStake from "../../../abis/AssetStake.json"
import { ASSET_STAKE_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useDeposit(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function deposit(amount: BigNumberish) {
    await writeContract({
      address: ASSET_STAKE_CONTRACT_ADDRESS[chainId],
      abi: AssetStake,
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
