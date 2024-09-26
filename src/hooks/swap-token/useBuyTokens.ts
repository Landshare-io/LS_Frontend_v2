import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { bsc } from 'viem/chains';
import { Address } from 'viem';
import useAllowanceOfUsdcContract from '../contract/UsdcContract/useAllowance';
import useApproveOfLandContract from '../contract/LandTokenContract/useApprove';
import useApproveOfUsdcContract from '../contract/UsdcContract/useApprove';
import useBuyToken from '../contract/LandshareBuySaleContract/useBuyToken';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS, USDC_ADDRESS } from '../../config/constants/environments';
import { BigNumberish } from 'ethers';

export default function useBuyTokens(chainId: number, address: Address | undefined, landAmount: BigNumberish, amount: number) {
  const [transactionStatus, setTransactionStatus] = useState('')

  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveUsdc, data: usdcApproveTx } = useApproveOfUsdcContract()

  const { isSuccess: usdcApproveSuccess, isLoading: usdcApproveLoading } = useWaitForTransactionReceipt({
    hash: usdcApproveTx,
    chainId: bsc.id
  });

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveLand, data: landApproveTx } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, isLoading: landApproveLoading } = useWaitForTransactionReceipt({
    hash: landApproveTx,
  });

  const { buyToken, data: sellTx } = useBuyToken()

  const { isSuccess: sellSuccess, isLoading: sellLoading } = useWaitForTransactionReceipt({
    hash: sellTx,
  });

  useEffect(() => {
    (async () => {
      try {
        await usdcAllowanceRefetch()
        if (BigInt(usdcAllowance) < amount) {
          window.alert("Please approve sufficient allowance.")
          setTransactionStatus("Insufficient Allowance")
        }
  
        if (usdcApproveSuccess) {
          if (BigInt(landAllowance) < BigInt(amount)) {
            await approveLand(bsc.id, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS, landAmount)
            await landAllowanceRefetch()
          }
        }
      } catch (error) {
        setTransactionStatus("Transaction failed")
        console.log(error)
      }
    })()
  }, [usdcApproveSuccess])

  useEffect(() => {
    (async () => {
      try {
        await landAllowanceRefetch()
        if (BigInt(landAllowance) < BigInt(landAmount)) {
          window.alert("Please approve sufficient allowance.")
          setTransactionStatus("Insufficient Allowance")
        }
  
        if (landApproveSuccess) {
          await buyToken(amount, USDC_ADDRESS[chainId])
        }
      } catch (error) {
        setTransactionStatus("Transaction failed")
        console.log(error)
      }
    })()
  }, [landApproveSuccess])

  useEffect(() => {
    if (sellSuccess) {
      setTransactionStatus("Transaction Successful")
    }
  }, [sellSuccess])

  const buyTokens = async () => {
    try {
      setTransactionStatus("Transaction Pending...")
      if (BigInt(usdcAllowance) < amount) {
        await approveUsdc(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS, amount);
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
