import { useEffect } from 'react';
import { ethers } from 'ethers';
import { useWaitForTransactionReceipt, useReadContract } from 'wagmi';
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
  // 1. Read RWA Allowance
  const { data: rwaAllowance, refetch: rwaAllowanceRefetch } = useAllowanceOfRwaContract(address, RWA_CONTRACT_ADDRESS) as {
    data: BigNumberish,
    refetch: Function
  }

  // 2. Read LAND Allowance
  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(address, LANDSHARE_SALE_CONTRACT_ADDRESS) as {
    data: BigNumberish,
    refetch: Function
  }

  // 3. Approve RWA Token
  const { approve: approveRWA, data: rwaApproveTx } = useApproveOfRwaContract()

  const { isSuccess: rwaApproveSuccess, isLoading: rwaApproveLoading } = useWaitForTransactionReceipt({
    hash: rwaApproveTx,
    chainId: bsc.id
  });

  // 4. Approve LAND Token
  const { approve: approveLand, data: landApproveTx } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, isLoading: landApproveLoading } = useWaitForTransactionReceipt({
    hash: landApproveTx,
  });

  // 5. Execute Sell Transaction
  const { sellRwa, data: sellTx } = useSellRwa()

  const { isSuccess: sellSuccess, isLoading: sellLoading } = useWaitForTransactionReceipt({
    hash: sellTx,
  });

  useEffect(() => {
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
  }, [rwaApproveSuccess])

  useEffect(() => {
    (async () => {
      await landAllowanceRefetch()
      if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
        return ''
      }

      if (landApproveSuccess) {
        await sellRwa(amount)
      }
    })()
  }, [landApproveSuccess])

  useEffect(() => {
    if (sellSuccess) {

    }
  }, [sellSuccess])

  // Handle Token Approval and Sale Logic
  const sellTokens = async () => {
    try {
      if (BigInt(rwaAllowance) < amount) {
        await approveRWA(LANDSHARE_SALE_CONTRACT_ADDRESS, amount);
        await rwaAllowanceRefetch()
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    sellTokens
  };
}
