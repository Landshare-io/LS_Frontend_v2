import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import LandLPFarm from '../../../abis/LandLPFarm.json';
import { LP_FARM_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdraw() {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function withdraw(amount: BigNumberish) {
    await writeContract({
      address: LP_FARM_CONTRACT_ADDRESS,
      abi: LandLPFarm,
      functionName: "withdraw",
      chainId: bsc.id,
      args: [amount]
    });
  }

  return {
    withdraw,
    isPending,
    isError,
    data
  }
}
