import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import LandStakingV2 from '../../../abis/LandStakingV2.json';
import { LAND_TOKEN_STAKE_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdraw() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function withdraw(amount: BigNumberish) {
    await writeContract({
      address: LAND_TOKEN_STAKE_V2_CONTRACT_ADDRESS,
      abi: LandStakingV2,
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
