import { useEffect, useState } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { bsc } from 'viem/chains';
import { Address } from 'viem';
import useAllowanceOfRwaContract from '../contract/RWAContract/useAllowance';
import useApproveOfRwaContract from '../contract/RWAContract/useApprove';
import useApproveOfLandContract from '../contract/LandTokenContract/useApprove';
import useSellRwa from '../contract/LandshareBuySaleContract/useSellRwa';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import { RWA_CONTRACT_ADDRESS, LANDSHARE_SALE_CONTRACT_ADDRESS } from '../../config/constants/environments';
import { BigNumberish } from 'ethers';

export default function useSellTokens(address: Address | undefined, landFeeAmount: BigNumberish, amount: number) {
  const [transactionStatus, setTransactionStatus] = useState('')

  const { data: rwaAllowance, refetch: rwaAllowanceRefetch } = useAllowanceOfRwaContract(address, RWA_CONTRACT_ADDRESS) as {
    data: BigNumberish,
    refetch: Function
  }

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(address, LANDSHARE_SALE_CONTRACT_ADDRESS) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveRWA, data: rwaApproveTx } = useApproveOfRwaContract()

  const { isSuccess: rwaApproveSuccess, isLoading: rwaApproveLoading } = useWaitForTransactionReceipt({
    hash: rwaApproveTx,
    chainId: bsc.id
  });

  const { approve: approveLand, data: landApproveTx } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, isLoading: landApproveLoading } = useWaitForTransactionReceipt({
    hash: landApproveTx,
  });

  const { sellRwa, data: sellTx } = useSellRwa()

  const { isSuccess: sellSuccess, isLoading: sellLoading } = useWaitForTransactionReceipt({
    hash: sellTx,
  });

  useEffect(() => {
    try {
      (async () => {
        await rwaAllowanceRefetch()
        if (BigInt(rwaAllowance) < amount) {
          return ''
        }
  
        if (rwaApproveSuccess) {
          if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
            await approveLand(bsc.id, LANDSHARE_SALE_CONTRACT_ADDRESS, landFeeAmount)
            await landAllowanceRefetch()
          }
        }
      })()
    } catch (error) {
      setTransactionStatus("Transaction failed")
      console.log(error)
    }
  }, [rwaApproveSuccess])

  useEffect(() => {
    try {
      (async () => {
        await landAllowanceRefetch()
        if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
          window.alert("Please approve sufficient allowance.")
          setTransactionStatus("Insufficient Allowance")
        }
  
        if (landApproveSuccess) {
          await sellRwa(amount)
        }
      })()
    } catch (error) {
      setTransactionStatus("Transaction failed")
      console.log(error)
    }
  }, [landApproveSuccess])

  useEffect(() => {
    if (sellSuccess) {
      setTransactionStatus("Transaction Successful")
    }
  }, [sellSuccess])

  const sellTokens = async () => {
    try {
      if (BigInt(rwaAllowance) < amount) {
        await approveRWA(LANDSHARE_SALE_CONTRACT_ADDRESS, amount);
        await rwaAllowanceRefetch()
      }
    } catch (error) {
      console.error(error);
      setTransactionStatus('Transaction failed')
    }
  };

  return {
    sellTokens,
    transactionStatus
  };
}
