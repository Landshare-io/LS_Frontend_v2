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
import useBalanceOfRwaContract from '../contract/RWAContract/useBalanceOf';
import useBalanceOfUsdtContract from '../contract/UsdtContract/useBalanceOf';
import useBalanceOfLandContract from '../contract/LandTokenContract/useBalanceOf';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import { LANDSHARE_BUY_SALE_CONTRACT_ADDRESS, USDC_ADDRESS } from '../../config/constants/environments';
import { useGlobalContext } from '../../context/GlobalContext';

export default function useBuyTokens(chainId: number, address: Address | undefined, landAmount: BigNumberish, amount: number) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { refetch: rwaBalanceRefetch } = useBalanceOfRwaContract(chainId, address) as { refetch: Function };
  const { refetch: usdtBalanceRefetch } = useBalanceOfUsdtContract(chainId, address) as { refetch: Function };
  const { refetch: landBalanceRefetch } = useBalanceOfLandContract({chainId, address}) as { refetch: Function };

  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveUsdc, data: usdcApproveTx, isError: isUsdcApproveError } = useApproveOfUsdcContract()

  const { isSuccess: usdcApproveSuccess, data: usdcApproveStatusData } = useWaitForTransactionReceipt({
    hash: usdcApproveTx,
    chainId: chainId
  });

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveLand, data: landApproveTx, isError: isLandApproveError } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, data: landApproveStatusData } = useWaitForTransactionReceipt({
    hash: landApproveTx,
  });

  const { buyToken, data: buyTx, isError, error } = useBuyToken(chainId)

  const { isSuccess: buySuccess, data: buyStatusData } = useWaitForTransactionReceipt({
    hash: buyTx,
  });

  useEffect(() => {
    try {
      if (isUsdcApproveError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (usdcApproveTx) {
        usdcAllowanceRefetch()
        // if (BigInt(usdcAllowance) < amount) {
        //   window.alert("Please approve sufficient allowance.")
        //   setScreenLoadingStatus("Insufficient Allowance")
        // }

        if (usdcApproveStatusData) {
          if (usdcApproveSuccess) {
            if (BigInt(landAmount) > BigInt(0)) {
              approveLand(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId], landAmount)
              landAllowanceRefetch()
            } else {
              buyToken(amount, USDC_ADDRESS[chainId])
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
  }, [usdcApproveTx, usdcApproveStatusData, usdcApproveSuccess, isUsdcApproveError])

  useEffect(() => {
    try {
      if (isLandApproveError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (landApproveTx) {
        landAllowanceRefetch()
        // if (BigInt(landAllowance) < BigInt(landAmount)) {
        //   window.alert("Please approve sufficient allowance.")
        //   setScreenLoadingStatus("Insufficient Allowance")
        // }

        if (landApproveStatusData) {
          if (landApproveSuccess) {
            buyToken(amount, USDC_ADDRESS[chainId])
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [landApproveTx, landApproveStatusData, landApproveSuccess, isLandApproveError])

  useEffect(() => {
    if (isError) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (buyTx) {
      if (buyStatusData) {
        if (buySuccess) {
          usdcAllowanceRefetch()
          landAllowanceRefetch()
          rwaBalanceRefetch()
          usdtBalanceRefetch()
          landBalanceRefetch()
          setScreenLoadingStatus("Transaction Complete.")
        } else {
          setScreenLoadingStatus("Transaction Failed.")
        }
      }
    }
  }, [buyTx, buyStatusData, buySuccess, isError])

  const buyTokens = async (buyUSDCAmount: BigNumberish) => {
    try {
      setScreenLoadingStatus("Transaction Pending...")
      if (Number(formatEther(BigInt(usdcAllowance))) < Number(formatEther(BigInt(buyUSDCAmount)))) {
        await approveUsdc(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId], buyUSDCAmount);
      } else {
        buyToken(amount, USDC_ADDRESS[chainId])
      }
    } catch (error) {
      console.error(error);
      setScreenLoadingStatus('Transaction Failed.')
    }
  };

  return {
    buyTokens
  };
}
