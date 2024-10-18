import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import LandStakingV3 from '../../../abis/LandStakingV3.json';
import { LAND_TOKEN_STAKE_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdraw() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function withdraw(amount: BigNumberish) {
    await writeContract({
      address: LAND_TOKEN_STAKE_V3_CONTRACT_ADDRESS,
      abi: LandStakingV3,
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
