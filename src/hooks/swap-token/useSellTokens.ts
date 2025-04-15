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
import useAllowanceOfLandContract from '../contract/LandTokenContract/useAllowance';
import { 
  RWA_CONTRACT_ADDRESS, 
  LANDSHARE_SALE_CONTRACT_ADDRESS,
  TRANSACTION_CONFIRMATIONS_COUNT
} from '../../config/constants/environments';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  PUSD_SUPPORT_CHINAS,
} from "../../config/constants/environments";

export default function useSellTokens(chainId: number, address: Address | undefined, landFeeAmount: BigNumberish, amount: number) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { refetch: rwaBalanceRefetch } = useBalanceOfRwaContract(chainId, address) as { refetch: Function };
  const { refetch: usdtBalanceRefetch } = useBalanceOfUsdtContract(chainId, address) as { refetch: Function };
  const { refetch: landBalanceRefetch } = useBalanceOfLandContract({chainId, address}) as { refetch: Function };

  const { data: rwaAllowance, refetch: rwaAllowanceRefetch } = useAllowanceOfRwaContract(chainId, address, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(chainId, address, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function 
  }

  const { approve: approveRWA, data: rwaApproveTx, isError: isRwaApproveError, isPending: isLoadingApproveRWA } = useApproveOfRwaContract(chainId)

  const { isSuccess: rwaApproveSuccess, data: rwaApproveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: rwaApproveTx,
    chainId: chainId
  });

  const { approve: approveLand, data: landApproveTx, isError: isLandApproveError, error: landApproveError, isPending: isLoadingApproveLAND } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, data: landApproveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: landApproveTx,
  });

  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveUsdc, data: usdcApproveTx, isError: isUsdcApproveError } = useApproveOfUsdcContract()

  const { isSuccess: usdcApproveSuccess, data: usdcApproveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: usdcApproveTx,
    chainId: chainId
  });

  const { sellRwa, data: sellTx, isError, error: sellRWAError } = useSellRwa(chainId)

  const { isSuccess: sellSuccess, data: sellStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: sellTx,
  });

  useEffect(() => {
    try {
      if (isRwaApproveError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (rwaApproveTx) {
        if (rwaApproveStatusData) {
          rwaAllowanceRefetch()
      
          if (rwaApproveSuccess && !isLoadingApproveRWA && !isLoadingApproveLAND) {
            if (chainId == bsc.id) {
              if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
                approveLand(chainId, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], landFeeAmount)
              } else {
                sellRwa(amount)
              }
            } else {
              if (BigInt(usdcAllowance) < BigInt(landFeeAmount)) {
                approveUsdc(
                  chainId,
                  LANDSHARE_SALE_CONTRACT_ADDRESS[chainId],
                  BigInt(landFeeAmount) / BigInt("1000000000000") // divide by 1e12 to go from 18 to 6 decimals
                );
              } else {
                sellRwa(amount)
              }
            }
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [rwaApproveSuccess, isRwaApproveError])

  useEffect(() => {
    try {
      if (isLandApproveError) {
        setScreenLoadingStatus("Transaction Failed.")
        console.log(landApproveError)
      } else if (landApproveTx ) {
        if (landApproveStatusData) {
          landAllowanceRefetch()
          // if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
          //   window.alert("Please approve sufficient allowance.")
          //   setScreenLoadingStatus("Insufficient Allowance")
          // }
          if (landApproveSuccess) {
            console.log("here")
            sellRwa(amount)
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [ landApproveSuccess, isLandApproveError])

  useEffect(() => {
    try {
      if (isUsdcApproveError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (usdcApproveTx) {
        if (usdcApproveStatusData) {
          usdcAllowanceRefetch()
          // if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
          //   window.alert("Please approve sufficient allowance.")
          //   setScreenLoadingStatus("Insufficient Allowance")
          // }
          if (usdcApproveSuccess) {
            sellRwa(amount)
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [usdcApproveTx, usdcApproveStatusData, usdcApproveSuccess, isUsdcApproveError])

  useEffect(() => {
    (async () => {
      if (isError) {
        setScreenLoadingStatus("Transaction Failed.")
        console.log(sellRWAError)
      } else if (sellTx) {
        if (sellStatusData) {
          if (sellSuccess) {
            await rwaBalanceRefetch()
            await usdtBalanceRefetch()
            await landBalanceRefetch()
            setScreenLoadingStatus("Transaction Complete.")
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    })()
  }, [sellTx, sellStatusData, sellSuccess, isError])

  const sellTokens = async () => {
    try {
   
      landAllowanceRefetch()
      rwaAllowanceRefetch()
 
     
      setScreenLoadingStatus('Transaction Pending...')
      if (Number(rwaAllowance ?? 0) < amount) {
        
        await approveRWA(LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], amount);
      } else {
        if (BigInt(landAllowance) < BigInt(landFeeAmount) && !PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866)) {
          approveLand(chainId, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], landFeeAmount)
        } else {
          sellRwa(amount)
        }
      }
    } catch (error) {
      console.error(error);
      setScreenLoadingStatus('Transaction Failed.')
    }
  };

  return {
    sellTokens
  };
}
