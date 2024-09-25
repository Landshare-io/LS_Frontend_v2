import { useWriteContract } from 'wagmi'
import { bsc } from 'viem/chains';
import { Address } from 'viem';
import { BigNumberish } from 'ethers';
import LandshareBuySaleAbi from "../../../abis/LandshareBuySale.json"
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS } from '../../../config/constants/environments';

export default function useSellRwa() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function sellRwa(amount: number | BigNumberish) {
    await writeContract({
      address: LANDSHARE_BUY_SALE_CONTRACT_ADDRESS,
      abi: LandshareBuySaleAbi,
      functionName: "sellRwa",
      chainId: bsc.id,
      args: [amount]
    });
  }

  return {
    sellRwa,
    isPending,
    data
  }
}
