import { useEffect, useRef } from 'react';
import { useWaitForTransactionReceipt, useReadContract } from 'wagmi';
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
import useBalanceOfUsdcContract from '../contract/UsdcContract/useBalanceOf';
import useAllowanceOfLandContract from '../contract/LpTokenV2Contract/useAllowance';
import {
  LANDSHARE_BUY_SALE_CONTRACT_ADDRESS,
  USDC_ADDRESS,
  LAND_TOKEN_CONTRACT_ADDRESS,
  TRANSACTION_CONFIRMATIONS_COUNT
} from '../../config/constants/environments';
import { useGlobalContext } from '../../context/GlobalContext';
import UsdcAbi from '../../abis/USDC.json';
import LandshareBuySaleAbi from '../../abis/LandshareBuySale.json';

export default function useBuyTokens(chainId: number, address: Address | undefined, landAmount: BigNumberish, amount: number) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { refetch: rwaBalanceRefetch } = useBalanceOfRwaContract(chainId, address) as { refetch: Function };
  const { refetch: usdtBalanceRefetch } = useBalanceOfUsdtContract(chainId, address) as { refetch: Function };
  const { refetch: landBalanceRefetch } = useBalanceOfLandContract({ chainId, address });
  
  const { data: usdcBalance, refetch: usdcBalanceRefetch } = useBalanceOfUsdcContract(chainId, address);

  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]);

  const { approve: approveUsdc, data: usdcApproveTx, isError: isUsdcApproveError, error: usdcApproveError } = useApproveOfUsdcContract()

  const { isSuccess: usdcApproveSuccess, data: usdcApproveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: usdcApproveTx,
    chainId: chainId
  });

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]);

  const { approve: approveLand, data: landApproveTx, isError: isLandApproveError, error: landApproveError } = useApproveOfLandContract()

  const { isSuccess: landApproveSuccess, data: landApproveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: landApproveTx,
  });

  const { buyToken, data: buyTx, isError, error: buyError } = useBuyToken(chainId)

  const { isSuccess: buySuccess, data: buyStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: buyTx,
  });

  const proceededUsdcRef = useRef(false)
const proceededLandRef = useRef(false)

async function waitForAllowance(
  refetchFn: () => Promise<{ data: unknown } | any>,
  needed: bigint,
  label: string,
  timeoutMs = 5_000,
  intervalMs = 300
) {
  const deadline = Date.now() + timeoutMs
  while (true) {
    const res = await refetchFn()
    // wagmi read hooks usually return { data }, coerce safely:
    const current = BigInt((res?.data ?? 0).toString())
    if (current >= needed) return
    if (Date.now() > deadline) {
      console.warn(`${label} allowance not updated within ${timeoutMs}ms, proceeding anyway`);
      return; // Continue instead of throwing
    }
    await new Promise(r => setTimeout(r, intervalMs))
  }
}

  useEffect(() => {
    (async () => {
      try {
        if (isUsdcApproveError) {
          console.error('=== USDC Approve Error ===');
          console.error('USDC approval failed');
          console.error('Error object:', usdcApproveError);
          console.error('Error message:', usdcApproveError?.message);
          console.error('Error name:', usdcApproveError?.name);
          if (usdcApproveError && typeof usdcApproveError === 'object') {
            console.error('Full USDC approve error:', JSON.stringify(usdcApproveError, Object.getOwnPropertyNames(usdcApproveError), 2));
          }
          setScreenLoadingStatus("Transaction Failed.")
        } else if (usdcApproveTx && !proceededUsdcRef.current) {
          console.log('USDC approval transaction submitted:', usdcApproveTx);

          if (usdcApproveStatusData && usdcApproveSuccess) {
            proceededUsdcRef.current = true
            console.log('USDC approval confirmed on chain');
            
            // Wait for allowance to update on chain
            await waitForAllowance(usdcAllowanceRefetch, BigInt(amount), 'USDC')
            console.log('USDC allowance updated successfully');

            if (BigInt(landAmount) > BigInt(0)) {
              console.log('Proceeding to LAND approval. LAND amount needed:', BigInt(landAmount).toString());
              await approveLand(
                chainId,
                LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
                (BigInt(landAmount) * BigInt(101)) / BigInt(100)
              )
            } else {
              console.log('No LAND fee required, proceeding directly to buy');
              console.log('Buying RWA amount (0 decimals):', amount, 'using USDC:', USDC_ADDRESS[chainId]);
              await buyToken(amount, USDC_ADDRESS[chainId])
            }
          }
        }
      } catch (error) {
        console.error('=== Error in USDC approval flow ===');
        console.error('Error details:', error);
        setScreenLoadingStatus("Transaction Failed.")
      }
    })()
  }, [usdcApproveTx, usdcApproveStatusData, usdcApproveSuccess, isUsdcApproveError])

  useEffect(() => {
    (async () => {
      try {
        if (isLandApproveError) {
          console.error('=== LAND Approve Error ===');
          console.error('LAND approval failed');
          console.error('Error object:', landApproveError);
          console.error('Error message:', landApproveError?.message);
          console.error('Error name:', landApproveError?.name);
          if (landApproveError && typeof landApproveError === 'object') {
            console.error('Full LAND approve error:', JSON.stringify(landApproveError, Object.getOwnPropertyNames(landApproveError), 2));
          }
          setScreenLoadingStatus("Transaction Failed.")
        } else if (landApproveTx && !proceededLandRef.current) {
          console.log('LAND approval transaction submitted:', landApproveTx);

          if (landApproveStatusData && landApproveSuccess) {
            proceededLandRef.current = true
            console.log('LAND approval confirmed on chain');
            
            // Wait for allowance to update on chain
            await waitForAllowance(landAllowanceRefetch, BigInt(landAmount), 'LAND')
            console.log('LAND allowance updated successfully');

            console.log('Proceeding to buy');
            console.log('Buying RWA amount (0 decimals):', amount, 'using USDC:', USDC_ADDRESS[chainId]);
            await buyToken(amount, USDC_ADDRESS[chainId])
          }
        }
      } catch (error) {
        console.error('=== Error in LAND approval flow ===');
        console.error('Error details:', error);
        setScreenLoadingStatus("Transaction Failed.")
      }
    })()
  }, [landApproveTx, landApproveStatusData, landApproveSuccess, isLandApproveError])

  useEffect(() => {
    (async () => {
      if (isError) {
        console.error('=== Buy RWA Transaction Failed ===');
        console.error('Error details:', buyError);
        console.error('Error message:', buyError?.message);
        console.error('Error name:', buyError?.name);
        console.error('Error cause:', buyError?.cause);
        console.error('Error shortMessage:', (buyError as any)?.shortMessage);
        console.error('Error metaMessages:', (buyError as any)?.metaMessages);
        
        // Decode which token is failing
        const errorMsg = buyError?.message?.toLowerCase() || '';
        if (errorMsg.includes('insufficient allowance') || errorMsg.includes('erc20')) {
          console.error('\n🔍 TOKEN IDENTIFICATION:');
          console.error('USDC Contract:', USDC_ADDRESS[chainId]);
          console.error('LAND Contract:', LAND_TOKEN_CONTRACT_ADDRESS[chainId]);
          console.error('Buy Sale Contract:', LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]);
          
          console.error('\n📊 ALLOWANCE & BALANCE CHECK:');
          console.error('User USDC Balance:', usdcBalance?.toString() ?? '0');
          console.error('User USDC → Buy Contract:', usdcAllowance?.toString() ?? '0');
          console.error('User LAND → Buy Contract:', landAllowance?.toString() ?? '0');
          console.error('Amount trying to buy (RWA):', amount);
          console.error('LAND fee required:', BigInt(landAmount).toString());
          
          // Identify the failing token based on allowances and balances
          const usdcNeeded = BigInt(amount);
          const landNeeded = BigInt(landAmount);
          const usdcBalanceBigInt = BigInt(usdcBalance?.toString() ?? '0');
          const usdcAllowanceBigInt = BigInt(usdcAllowance?.toString() ?? '0');
          const landAllowanceBigInt = BigInt(landAllowance?.toString() ?? '0');
          
          if (usdcBalanceBigInt < usdcNeeded) {
            console.error('\n❌ FAILING: USDC BALANCE');
            console.error(`USDC balance (${usdcBalance?.toString()}) < needed (${usdcNeeded.toString()})`);
            console.error('⚠️ User does not have enough USDC to complete the purchase!');
          } else if (usdcAllowanceBigInt < usdcNeeded) {
            console.error('\n❌ FAILING TOKEN: USDC ALLOWANCE');
            console.error(`USDC allowance (${usdcAllowance?.toString()}) < needed (${usdcNeeded.toString()})`);
          } else if (landAllowanceBigInt < landNeeded && landNeeded > BigInt(0)) {
            console.error('\n❌ FAILING TOKEN: LAND ALLOWANCE');
            console.error(`LAND allowance (${landAllowance?.toString()}) < needed (${landNeeded.toString()})`);
          } else {
            console.error('\n⚠️ All allowances and balances appear sufficient, but transaction still reverted:');
            console.error('USDC balance:', usdcBalance?.toString());
            console.error('USDC allowance:', usdcAllowance?.toString());
            console.error('LAND allowance:', landAllowance?.toString());
          }
          
          // Check error data for additional info
          const errorData = (buyError as any)?.data || (buyError as any)?.cause?.data;
          if (errorData) {
            console.error('\n📋 ERROR DATA:');
            console.error('Error data stringified:', JSON.stringify(errorData, null, 2));
          }
          
          // Check cause for more details
          const cause = (buyError as any)?.cause;
          if (cause?.data) {
            console.error('Cause data:', JSON.stringify(cause.data, null, 2));
          }
          
          // Try to identify from error context
          if (errorMsg.includes(USDC_ADDRESS[chainId]?.toLowerCase()) || errorMsg.includes('usdc')) {
            console.error('❌ FAILING TOKEN: USDC (0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d)');
          } else if (errorMsg.includes(LAND_TOKEN_CONTRACT_ADDRESS[chainId]?.toLowerCase()) || errorMsg.includes('land')) {
            console.error('❌ FAILING TOKEN: LAND');
          }
        }
        
        if (buyError && typeof buyError === 'object') {
          console.error('Full buy error:', JSON.stringify(buyError, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value, 2));
        }
        console.error('Transaction hash:', buyTx);
        console.error('Amount attempted:', amount);
        console.error('USDC address used:', USDC_ADDRESS[chainId]);
        
        setScreenLoadingStatus("Transaction Failed.")
      } else if (buyTx) {
        console.log('Buy transaction hash:', buyTx);
        if (buyStatusData) {
          console.log('Transaction status data received:', buyStatusData);
          if (buySuccess) {
            console.log('Buy transaction successful! Refetching balances...');
            await usdcAllowanceRefetch()
            await usdcBalanceRefetch()
            await landAllowanceRefetch()
            await rwaBalanceRefetch()
            await usdtBalanceRefetch()
            await landBalanceRefetch()
            setScreenLoadingStatus("Transaction Complete.")
          } else {
            console.error('Transaction did not succeed');
            console.error('Status data:', buyStatusData);
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    })()
  }, [buyTx, buyStatusData, buySuccess, isError])

  const buyTokens = async (buyUSDCAmount: BigNumberish) => {
    try {
      console.log('=== Starting Buy Tokens Process ===');
      console.log('USDC amount to spend:', buyUSDCAmount.toString());
      console.log('RWA amount to receive:', amount);
      console.log('LAND fee amount:', BigInt(landAmount).toString());
      console.log('Chain ID:', chainId);
      
      // Reset the refs
      proceededUsdcRef.current = false
      proceededLandRef.current = false
      
      await usdcAllowanceRefetch()
      await landAllowanceRefetch()
      await usdcBalanceRefetch()
      
      console.log('Current USDC Balance:', usdcBalance?.toString() ?? '0');
      console.log('Current USDC Allowance:', usdcAllowance?.toString() ?? '0');
      console.log('Current LAND Allowance:', landAllowance?.toString() ?? '0');
      
      setScreenLoadingStatus("Transaction Pending...")
      
      // Check USDC balance first
      const usdcBalanceBigInt = BigInt(usdcBalance?.toString() ?? '0');
      if (usdcBalanceBigInt < BigInt(buyUSDCAmount)) {
        console.error('❌ Insufficient USDC balance!');
        console.error('Balance:', usdcBalance?.toString(), 'Needed:', buyUSDCAmount.toString());
        setScreenLoadingStatus("Insufficient USDC Balance")
        return;
      }
      
      // Check if we need to approve USDC
      const usdcAllowanceBigInt = BigInt(usdcAllowance?.toString() ?? '0')
      const buyUSDCAmountBigInt = BigInt(buyUSDCAmount)
      
      if (usdcAllowanceBigInt < buyUSDCAmountBigInt) {
        console.log('USDC allowance insufficient, requesting approval...');
        console.log('Current allowance:', usdcAllowanceBigInt.toString());
        console.log('Approving USDC amount:', buyUSDCAmountBigInt.toString());
        await approveUsdc(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId], buyUSDCAmountBigInt);
      } else {
        // Check if we need to approve LAND
        const landAllowanceBigInt = BigInt(landAllowance?.toString() ?? '0')
        const landAmountBigInt = BigInt(landAmount)
        
        if (landAmountBigInt > BigInt(0) && landAllowanceBigInt < landAmountBigInt) {
          console.log('LAND allowance insufficient, requesting approval...');
          console.log('Current allowance:', landAllowanceBigInt.toString());
          console.log('Approving LAND with 1% buffer:', ((landAmountBigInt * BigInt(101)) / BigInt(100)).toString());
          await approveLand(
            chainId,
            LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
            (landAmountBigInt * BigInt(101)) / BigInt(100)
          )
        } else {
          console.log('All allowances sufficient, proceeding to buy...');
          console.log('Calling buyToken with RWA amount (0 decimals):', amount, 'USDC address:', USDC_ADDRESS[chainId]);
          await buyToken(amount, USDC_ADDRESS[chainId])
        }
      }
    } catch (error) {
      console.error('=== Error in buyTokens function ===');
      console.error('Error details:', error);
      console.error('USDC amount:', buyUSDCAmount.toString());
      console.error('RWA amount:', amount);
      console.error('Chain ID:', chainId);
      setScreenLoadingStatus('Transaction Failed.')
    }
  };

  return {
    buyTokens
  };
}