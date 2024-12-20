import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { bsc } from 'viem/chains';
import { BigNumberish } from 'ethers';
import useAllowanceOfRwaContract from '../contract/RWAContract/useAllowance';
import useApproveOfRwaContract from '../contract/RWAContract/useApprove';
import useApproveOfLandContract from '../contract/LandTokenContract/useApprove';
import useSellRwa from '../contract/LandshareBuySaleContract/useSellRwa';
import useAllowanceOfUsdcContract from '../contract/UsdcContract/useAllowance';
import useApproveOfUsdcContract from '../contract/UsdcContract/useApprove';
import useBalanceOfUsdtContract from '../contract/UsdtContract/useBalanceOf';
import useBalanceOfRwaContract from '../contract/RWAContract/useBalanceOf';
import useBalanceOfLandContract from '../contract/LandTokenContract/useBalanceOf';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import { RWA_CONTRACT_ADDRESS, LANDSHARE_SALE_CONTRACT_ADDRESS } from '../../config/constants/environments';
import { useGlobalContext } from '../../context/GlobalContext';

export default function useSellTokens(chainId: number, address: Address | undefined, landFeeAmount: BigNumberish, amount: number) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { refetch: rwaBalanceRefetch } = useBalanceOfRwaContract(chainId, address) as { refetch: Function };
  const { refetch: usdtBalanceRefetch } = useBalanceOfUsdtContract(chainId, address) as { refetch: Function };
  const { refetch: landBalanceRefetch } = useBalanceOfLandContract({chainId, address}) as { refetch: Function };

  const { data: rwaAllowance, refetch: rwaAllowanceRefetch } = useAllowanceOfRwaContract(chainId, address, RWA_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(chainId, address, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveRWA, data: rwaApproveTx, isError: isRwaApproveError } = useApproveOfRwaContract(chainId)

  const { isSuccess: rwaApproveSuccess, data: rwaApproveStatusData } = useWaitForTransactionReceipt({
    hash: rwaApproveTx,
    chainId: chainId
  });

  const { approve: approveLand, data: landApproveTx, isError: isLandApproveError } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, data: landApproveStatusData } = useWaitForTransactionReceipt({
    hash: landApproveTx,
  });

  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveUsdc, data: usdcApproveTx, isError: isUsdcApproveError } = useApproveOfUsdcContract()

  const { isSuccess: usdcApproveSuccess, data: usdcApproveStatusData } = useWaitForTransactionReceipt({
    hash: usdcApproveTx,
    chainId: chainId
  });

  const { sellRwa, data: sellTx, isError } = useSellRwa(chainId)

  const { isSuccess: sellSuccess, data: sellStatusData } = useWaitForTransactionReceipt({
    hash: sellTx,
  });

  useEffect(() => {
    try {
      if (isRwaApproveError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (rwaApproveTx) {
        if (rwaApproveStatusData) {
          rwaAllowanceRefetch()

          if (rwaApproveSuccess) {
            if (chainId == bsc.id) {
              if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
                approveLand(chainId, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], landFeeAmount)
              } else {
                sellRwa(amount)
              }
            } else {
              if (BigInt(usdcAllowance) < BigInt(landFeeAmount)) {
                approveUsdc(chainId, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], landFeeAmount)
              } else {
                sellRwa(amount)
              }
            }
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction failed")
      console.log(error)
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [rwaApproveTx, rwaApproveStatusData, rwaApproveSuccess, isRwaApproveError])

  useEffect(() => {
    try {
      if (isLandApproveError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (landApproveTx) {
        if (landApproveStatusData) {
          landAllowanceRefetch()
          // if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
          //   window.alert("Please approve sufficient allowance.")
          //   setScreenLoadingStatus("Insufficient Allowance")
          // }
          if (landApproveSuccess) {
            sellRwa(amount)
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction failed")
      console.log(error)
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [landApproveTx, landApproveStatusData, landApproveSuccess, isLandApproveError])

  useEffect(() => {
    try {
      if (isUsdcApproveError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (usdcApproveTx) {
        if (usdcApproveStatusData) {
          usdcAllowanceRefetch()
          // if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
          //   window.alert("Please approve sufficient allowance.")
          //   setScreenLoadingStatus("Insufficient Allowance")
          // }
          if (usdcApproveSuccess) {
            sellRwa(amount)
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction failed")
      console.log(error)
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [usdcApproveTx, usdcApproveStatusData, usdcApproveSuccess, isUsdcApproveError])

  useEffect(() => {
    if (isError) {
      setScreenLoadingStatus("Transaction failed")
    } else if (sellTx) {
      if (sellStatusData) {
        if (sellSuccess) {
          rwaBalanceRefetch()
          usdtBalanceRefetch()
          landBalanceRefetch()
          setScreenLoadingStatus("Transaction Successful")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
      }
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [sellTx, sellStatusData, sellSuccess, isError])

  const sellTokens = async () => {
    try {
      if (Number(rwaAllowance ?? 0) < amount) {
        await approveRWA(LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], amount);
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
