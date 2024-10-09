import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { bsc } from 'viem/chains';
import useAllowanceOfUsdcContract from '../contract/UsdcContract/useAllowance';
import useApproveOfLandContract from '../contract/LandTokenContract/useApprove';
import useApproveOfUsdcContract from '../contract/UsdcContract/useApprove';
import useBuyToken from '../contract/LandshareBuySaleContract/useBuyToken';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS, USDC_ADDRESS } from '../../config/constants/environments';
import { BigNumberish } from 'ethers';

export default function useBuyTokens(chainId: number, address: Address | undefined, landAmount: BigNumberish, amount: number) {
  const [transactionStatus, setTransactionStatus] = useState('')

  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[bsc.id]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveUsdc, data: usdcApproveTx } = useApproveOfUsdcContract()

  const { isSuccess: usdcApproveSuccess, isLoading: usdcApproveLoading } = useWaitForTransactionReceipt({
    hash: usdcApproveTx,
    chainId: chainId
  });

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[bsc.id]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveLand, data: landApproveTx } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, isLoading: landApproveLoading } = useWaitForTransactionReceipt({
    hash: landApproveTx,
  });

  const { buyToken, data: sellTx } = useBuyToken(chainId)

  const { isSuccess: sellSuccess, isLoading: sellLoading } = useWaitForTransactionReceipt({
    hash: sellTx,
  });

  useEffect(() => {
    (async () => {
      try {
        if (usdcApproveTx) {
          await usdcAllowanceRefetch()
          if (BigInt(usdcAllowance) < amount) {
            window.alert("Please approve sufficient allowance.")
            setTransactionStatus("Insufficient Allowance")
          }
    
          if (usdcApproveSuccess) {
            if (BigInt(landAllowance) < BigInt(amount)) {
              await approveLand(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[bsc.id], landAmount)
              await landAllowanceRefetch()
            }
          }
        }
      } catch (error) {
        setTransactionStatus("Transaction failed")
        console.log(error)
      }
    })()
  }, [usdcApproveTx, usdcApproveSuccess])

  useEffect(() => {
    (async () => {
      try {
        if (landApproveTx) {
          await landAllowanceRefetch()
          if (BigInt(landAllowance) < BigInt(landAmount)) {
            window.alert("Please approve sufficient allowance.")
            setTransactionStatus("Insufficient Allowance")
          }
    
          if (landApproveSuccess) {
            await buyToken(amount, USDC_ADDRESS[chainId])
          }
        }
      } catch (error) {
        setTransactionStatus("Transaction failed")
        console.log(error)
      }
    })()
  }, [landApproveTx, landApproveSuccess])

  useEffect(() => {
    if (sellTx) {
      if (sellSuccess) {
        setTransactionStatus("Transaction Successful")
      } else {
        setTransactionStatus("Transaction failed")
      }
    }
  }, [sellTx, sellSuccess])

  const buyTokens = async () => {
    try {
      setTransactionStatus("Transaction Pending...")
      if (BigInt(usdcAllowance) < amount) {
        await approveUsdc(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[bsc.id], amount);
        await usdcAllowanceRefetch()
      }
    } catch (error) {
      console.error(error);
      setTransactionStatus('Transaction failed')
    }
  };

  return {
    buyTokens,
    transactionStatus
  };
}
