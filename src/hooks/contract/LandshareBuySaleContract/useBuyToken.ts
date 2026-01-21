import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import { BigNumberish } from 'ethers';
import { bsc } from 'viem/chains';
import LandshareBuySaleArtifact from "../../../abis/LandshareBuySale.json"
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS } from '../../../config/constants/environments';

const LandshareBuySaleAbi = LandshareBuySaleArtifact.abi;

export default function useBuyToken(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function buyToken(amount: number | BigNumberish, usdcAddress: Address) {
    try {
      console.log('=== Buy Token Transaction Starting ===');
      console.log('RWA Amount:', amount);
      console.log('USDC Address:', usdcAddress);
      console.log('Contract Address:', LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]);
      console.log('Chain ID:', chainId);
      
      await writeContract({
        address: LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
        abi: LandshareBuySaleAbi,
        functionName: "buyToken",
        chainId: chainId,
        args: [amount, usdcAddress]
      });
      
      console.log('Buy token transaction submitted successfully');
    } catch (err) {
      console.error('=== Buy Token Transaction Error ===');
      console.error('Error details:', err);
      console.error('RWA amount attempted:', amount);
      console.error('USDC address:', usdcAddress);
      console.error('Contract:', LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]);
      throw err;
    }
  }

  return {
    buyToken,
    isPending,
    isError,
    error,
    data
  }
}
