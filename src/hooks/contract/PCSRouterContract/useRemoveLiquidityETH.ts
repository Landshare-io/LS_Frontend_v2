import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import { BigNumberish } from 'ethers';
import { bsc } from 'viem/chains';
import PscRouter from "../../../abis/PancakeRouter.json";
import { PSC_ROUTER_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useRemoveLiquidityETH() {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function removeLiquidityETH(tokenAddress: Address, liquidity: number | BigNumberish, amountTokenMin: number | BigNumberish, amountETHMin: number | BigNumberish, to: Address | undefined, deadline: number | BigNumberish) {
    await writeContract({
      address: PSC_ROUTER_CONTRACT_ADDRESS,
      abi: PscRouter,
      functionName: "removeLiquidityETH",
      args: [tokenAddress, liquidity, amountTokenMin, amountETHMin, to, deadline],
      chainId: bsc.id
    });
  }

  return {
    removeLiquidityETH,
    isPending,
    isError,
    data
  }
}
