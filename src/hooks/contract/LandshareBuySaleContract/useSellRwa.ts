import { useWriteContract } from 'wagmi'
import { BigNumberish } from 'ethers';
import { bsc } from 'viem/chains';
import LandshareSaleAbi from "../../../abis/LandshareSale.json"
import { LANDSHARE_SALE_CONTRACT_ADDRESS } from '../../../config/constants/environments';

export default function useSellRwa(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function sellRwa(amount: number | BigNumberish) {
    await writeContract({
      address: LANDSHARE_SALE_CONTRACT_ADDRESS[chainId],
      abi: LandshareSaleAbi,
      functionName: "sellRWA",
      chainId: chainId,
      args: [amount]
    });
  }

  return {
    sellRwa,
    isPending,
    isError,
    error,
    data
  }
}
