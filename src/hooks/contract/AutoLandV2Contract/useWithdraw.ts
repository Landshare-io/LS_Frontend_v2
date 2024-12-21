import { useWriteContract } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import AutoLandVaultV2 from '../../../abis/AutoLandVaultV2.json';
import { AUTO_LAND_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useWithdraw() {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function withdraw(amount: BigNumberish) {
    await writeContract({
      address: AUTO_LAND_V2_CONTRACT_ADDRESS,
      abi: AutoLandVaultV2,
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
