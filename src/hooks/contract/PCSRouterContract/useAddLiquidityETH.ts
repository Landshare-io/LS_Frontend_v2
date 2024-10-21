import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import { BigNumberish } from 'ethers';
import { bsc } from 'viem/chains';
import PscRouter from "../../../abis/PancakeRouter.json";
import { PSC_ROUTER_CONTRACT_ADDRESS, LAND_TOKEN_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useAddLiquidityETH() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function addLiquidityETH(amount: BigNumberish | number, address: Address | undefined, minEth: string | number | BigNumberish) {
    await writeContract({
      address: PSC_ROUTER_CONTRACT_ADDRESS,
      abi: PscRouter,
      functionName: "addLiquidityETH",
      chainId: bsc.id,
      args: [
        LAND_TOKEN_CONTRACT_ADDRESS[bsc.id],
        amount,
        0,
        0,
        address,
        Date.now()
      ],
      value: BigInt(minEth)
    })
  }

  return {
    addLiquidityETH,
    isPending,
    data
  }
}
