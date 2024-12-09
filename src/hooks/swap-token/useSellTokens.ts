import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { bsc } from 'viem/chains';
import { BigNumberish } from 'ethers';
import useAllowanceOfRwaContract from '../contract/RWAContract/useAllowance';
import useApproveOfRwaContract from '../contract/RWAContract/useApprove';
import useApproveOfLandContract from '../contract/LandTokenContract/useApprove';
import useSellRwa from '../contract/LandshareBuySaleContract/useSellRwa';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import { RWA_CONTRACT_ADDRESS, LANDSHARE_SALE_CONTRACT_ADDRESS } from '../../config/constants/environments';
import { useGlobalContext } from '../../context/GlobalContext';

export default function useSellTokens(chainId: number, address: Address | undefined, landFeeAmount: BigNumberish, amount: number) {
  const { setScreenLoadingStatus } = useGlobalContext()

  const { data: rwaAllowance, refetch: rwaAllowanceRefetch } = useAllowanceOfRwaContract(chainId, address, RWA_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(chainId, address, LANDSHARE_SALE_CONTRACT_ADDRESS[bsc.id]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveRWA, data: rwaApproveTx } = useApproveOfRwaContract(chainId)

  const { isSuccess: rwaApproveSuccess, data: rwaApproveStatusData } = useWaitForTransactionReceipt({
    hash: rwaApproveTx,
    chainId: chainId
  });

  const { approve: approveLand, data: landApproveTx } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, data: landApproveStatusData } = useWaitForTransactionReceipt({
    hash: landApproveTx,
  });

  const { sellRwa, data: sellTx } = useSellRwa(chainId)

  const { isSuccess: sellSuccess, data: sellStatusData } = useWaitForTransactionReceipt({
    hash: sellTx,
  });

  useEffect(() => {
    try {
      (async () => {
        if (rwaApproveTx) {
          if (rwaApproveStatusData) {
            await rwaAllowanceRefetch()
            if (BigInt(rwaAllowance) < amount) {
              return ''
            }
      
            if (rwaApproveSuccess) {
              if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
                await approveLand(chainId, LANDSHARE_SALE_CONTRACT_ADDRESS[bsc.id], landFeeAmount)
                await landAllowanceRefetch()
              }
            }
          }
        }
      })()
    } catch (error) {
      setScreenLoadingStatus("Transaction failed")
      console.log(error)
    }
  }, [rwaApproveTx, rwaApproveStatusData, rwaApproveSuccess])

  useEffect(() => {
    try {
      (async () => {
        if (landApproveTx) {
          if (landApproveStatusData) {
            await landAllowanceRefetch()
            if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
              window.alert("Please approve sufficient allowance.")
              setScreenLoadingStatus("Insufficient Allowance")
            }
      
            if (landApproveSuccess) {
              await sellRwa(amount)
            }
          }
        }
      })()
    } catch (error) {
      setScreenLoadingStatus("Transaction failed")
      console.log(error)
    }
  }, [landApproveTx, landApproveStatusData, landApproveSuccess])

  useEffect(() => {
    if (sellTx) {
      if (sellStatusData) {
        if (sellSuccess) {
          setScreenLoadingStatus("Transaction Successful")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
      }
    }
  }, [sellTx, sellStatusData, sellSuccess])

  const sellTokens = async () => {
    try {
      if (BigInt(rwaAllowance ?? 0) < amount) {
        await approveRWA(LANDSHARE_SALE_CONTRACT_ADDRESS[bsc.id], amount);
        await rwaAllowanceRefetch()
      }
    } catch (error) {
      console.error(error);
      setScreenLoadingStatus('Transaction failed')
    }
  };

  return {
    sellTokens
  };
}
