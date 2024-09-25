import { useEffect } from 'react';
import { useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { bsc } from 'viem/chains';
import { Address } from 'viem';
import useAllowanceOfRwaContract from '../contract/RWAContract/useAllowance';
import useApproveOfRwaContract from '../contract/RWAContract/useApprove';
import useApproveOfLandContract from '../contract/LandTokenContract/useApprove';
import useSellRwa from '../contract/LandshareBuySaleContract/useSellRwa';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import { RWA_CONTRACT_ADDRESS, LANDSHARE_SALE_CONTRACT_ADDRESS } from '../../config/constants/environments';

export function useSellTokens(address: Address) {
  // 1. Read RWA Allowance
  const { data: rwaAllowance, refetch: rwaAllowanceRefetch } = useAllowanceOfRwaContract(address, RWA_CONTRACT_ADDRESS)

  // 2. Read LAND Allowance
  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(address, LANDSHARE_SALE_CONTRACT_ADDRESS)

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

  // Handle Token Approval and Sale Logic
  const sellTokens = async (amount: number) => {
    try {
      // Step 1: Check and Approve RWA Allowance
      if (!rwaAllowance || rwaAllowance.lt(amount)) {
        approveRWA(LANDSHARE_SALE_CONTRACT_ADDRESS, amount); // Trigger RWA approval

        if (rwaApproveLoading) return; // Wait for transaction

        if (rwaApproveSuccess) {
          await rwaAllowanceRefetch(); // Refetch RWA allowance after approval

          if (!rwaAllowance.gte(amount)) {
            window.alert('Please approve sufficient allowance.');
            throw new Error('Insufficient Allowance');
          }
        }
      }

      // Step 2: Check and Approve LAND Allowance
      if (!landAllowance || landAllowance.lt(landFeeAmount)) {
        approveLand(bsc.id, LANDSHARE_SALE_CONTRACT_ADDRESS, amount); // Trigger LAND approval

        if (landApproveLoading) return; // Wait for transaction

        if (landApproveSuccess) {
          await landAllowanceRefetch(); // Refetch LAND allowance after approval

          if (!landAllowance.gte(landFeeAmount)) {
            window.alert('Please approve sufficient allowance.');
            throw new Error('Insufficient Allowance');
          }
        }
      }

      sellRwa(amount); // Trigger sell transaction

      if (sellSuccess) {
        await rwaAllowanceRefetch(); // Refetch RWA allowance after sell
        await landAllowanceRefetch(); // Refetch LAND allowance after sell
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    sellTokens,
    rwaApproveLoading,
    landApproveLoading,
    sellLoading,
  };
}
