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
    try {
      console.log('=== Sell RWA Transaction Starting ===');
      console.log('Amount:', amount);
      console.log('Contract Address:', LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]);
      console.log('Chain ID:', chainId);
      
      await writeContract({
        address: LANDSHARE_SALE_CONTRACT_ADDRESS[chainId],
        abi: LandshareSaleAbi,
        functionName: "sellRWA",
        chainId: chainId,
        args: [amount]
      });
      
      console.log('Sell RWA transaction submitted successfully');
    } catch (err) {
      console.error('=== Sell RWA Transaction Error ===');
      console.error('Error details:', err);
      console.error('Amount attempted:', amount);
      console.error('Contract:', LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]);
      throw err;
    }
  }

  return {
    sellRwa,
    isPending,
    isError,
    error,
    data
  }
}
