import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { formatEther, parseUnits } from 'viem';
import { bsc } from 'viem/chains';
import { BigNumberish } from 'ethers';
import useAllowanceOfUsdcContract from '../contract/UsdcContract/useAllowance';
import useApproveOfLandContract from '../contract/LandTokenContract/useApprove';
import useApproveOfUsdcContract from '../contract/UsdcContract/useApprove';
import useBuyToken from '../contract/LandshareBuySaleContract/useBuyToken';
import useGetRwaPrice from '../contract/APIConsumerContract/useGetRwaPrice';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS, USDC_ADDRESS } from '../../config/constants/environments';
import { useGlobalContext } from '../../context/GlobalContext';

export default function useBuyTokens(chainId: number, address: Address | undefined, landAmount: BigNumberish, amount: number) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const rwaPrice = useGetRwaPrice(chainId) as BigNumberish;

  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveUsdc, data: usdcApproveTx } = useApproveOfUsdcContract()

  const { isSuccess: usdcApproveSuccess, data: usdcApproveStatusData } = useWaitForTransactionReceipt({
    hash: usdcApproveTx,
    chainId: chainId
  });

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveLand, data: landApproveTx } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, data: landApproveStatusData } = useWaitForTransactionReceipt({
    hash: landApproveTx,
  });

  const { buyToken, data: sellTx } = useBuyToken(chainId)

  const { isSuccess: sellSuccess, data: sellStatusData } = useWaitForTransactionReceipt({
    hash: sellTx,
  });

  useEffect(() => {
    (async () => {
      try {
        if (usdcApproveTx) {
          await usdcAllowanceRefetch()
          // if (BigInt(usdcAllowance) < amount) {
          //   window.alert("Please approve sufficient allowance.")
          //   setScreenLoadingStatus("Insufficient Allowance")
          // }

          if (usdcApproveStatusData) {
            if (usdcApproveSuccess) {
              if (BigInt(landAllowance) < BigInt(amount)) {
                await approveLand(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId], landAmount)
                await landAllowanceRefetch()
              }
            }
          }
        }
      } catch (error) {
        setScreenLoadingStatus("Transaction failed")
        console.log(error)
      }
    })()
  }, [usdcApproveTx, usdcApproveStatusData, usdcApproveSuccess])

  useEffect(() => {
    (async () => {
      try {
        if (landApproveTx) {
          await landAllowanceRefetch()
          // if (BigInt(landAllowance) < BigInt(landAmount)) {
          //   window.alert("Please approve sufficient allowance.")
          //   setScreenLoadingStatus("Insufficient Allowance")
          // }

          if (landApproveStatusData) {
            if (landApproveSuccess) {
              await buyToken(amount, USDC_ADDRESS[chainId])
            }
          }
        }
      } catch (error) {
        setScreenLoadingStatus("Transaction failed")
        console.log(error)
      }
    })()
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

  const buyTokens = async () => {
    try {
      setScreenLoadingStatus("Transaction Pending...")
      if (Number(formatEther(BigInt(usdcAllowance))) < Number(formatEther(BigInt(rwaPrice ?? 0))) * amount) {
        await approveUsdc(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId], parseUnits((Number(formatEther(BigInt(rwaPrice ?? 0))) * amount).toString(), 18));
        await usdcAllowanceRefetch()
      } else {
        buyToken(amount, USDC_ADDRESS[chainId])
      }
    } catch (error) {
      console.error(error);
      setScreenLoadingStatus('Transaction failed')
    }
  };

  return {
    buyTokens
  };
}
