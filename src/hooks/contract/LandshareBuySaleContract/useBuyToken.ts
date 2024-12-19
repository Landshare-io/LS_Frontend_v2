import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import { BigNumberish } from 'ethers';
import { bsc } from 'viem/chains';
import LandshareBuySaleAbi from "../../../abis/LandshareBuySale.json"
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS } from '../../../config/constants/environments';

export default function useBuyToken(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function buyToken(amount: number | BigNumberish, usdcAddress: Address) {
    await writeContract({
      address: LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
      abi: LandshareBuySaleAbi,
      functionName: "buyToken",
      chainId: chainId,
      args: [amount, usdcAddress]
    });
  }

  return {
    buyToken,
    isPending,
    isError,
    error,
    data
  }
}
