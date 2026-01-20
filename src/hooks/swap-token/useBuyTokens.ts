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
  const { refetch: landBalanceRefetch } = useBalanceOfLandContract({ chainId, address }) as { refetch: Function };
  
  const { data: usdcBalance, refetch: usdcBalanceRefetch } = useBalanceOfUsdcContract(chainId, address) as {
    data: BigNumberish,
    refetch: Function
  };

  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

  const { approve: approveUsdc, data: usdcApproveTx, isError: isUsdcApproveError, error: usdcApproveError } = useApproveOfUsdcContract()

  const { isSuccess: usdcApproveSuccess, data: usdcApproveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: usdcApproveTx,
    chainId: chainId
  });

  const { data: landAllowance, refetch: landAllowanceRefetch } = useAllowanceOfLandContract(chainId, address, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }

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
  timeoutMs = 20_000,
  intervalMs = 800
) {
  const deadline = Date.now() + timeoutMs
  while (true) {
    const res = await refetchFn()
    // wagmi read hooks usually return { data }, coerce safely:
    const current = BigInt((res?.data ?? 0).toString())
    if (current >= needed) return
    if (Date.now() > deadline) throw new Error("allowance still below required")
    await new Promise(r => setTimeout(r, intervalMs))
  }
}

  useEffect(() => {
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
      } else if (usdcApproveTx) {
        console.log('USDC approval transaction submitted:', usdcApproveTx);
        usdcAllowanceRefetch()

        if (usdcApproveStatusData) {
          console.log('USDC approval status data received:', usdcApproveStatusData);
          if (usdcApproveSuccess) {
            console.log('USDC approval successful');
            if (BigInt(landAmount) > BigInt(0)) {
              console.log('Proceeding to LAND approval. LAND amount needed:', landAmount.toString());
              approveLand(
                chainId,
                LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
                (BigInt(landAmount) * BigInt(101)) / BigInt(100)
              )
              landAllowanceRefetch()
            } else {
              console.log('No LAND fee required, proceeding directly to buy');
              console.log('Buying RWA amount:', amount, 'using USDC:', USDC_ADDRESS[chainId]);
              buyToken(amount, USDC_ADDRESS[chainId])
            }
          } else {
            console.error('USDC approval transaction did not succeed');
            console.error('Status data:', usdcApproveStatusData);
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      console.error('=== Error in USDC approval flow ===');
      console.error('Error details:', error);
      setScreenLoadingStatus("Transaction Failed.")
    }
  }, [usdcApproveTx, usdcApproveStatusData, usdcApproveSuccess, isUsdcApproveError])

  useEffect(() => {
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
      } else if (landApproveTx) {
        console.log('LAND approval transaction submitted:', landApproveTx);
        landAllowanceRefetch()

        if (landApproveStatusData) {
          console.log('LAND approval status data received:', landApproveStatusData);
          if (landApproveSuccess) {
            console.log('LAND approval successful, proceeding to buy');
            console.log('Buying RWA amount:', amount, 'using USDC:', USDC_ADDRESS[chainId]);
            buyToken(amount, USDC_ADDRESS[chainId])
          } else {
            console.error('LAND approval transaction did not succeed');
            console.error('Status data:', landApproveStatusData);
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      console.error('=== Error in LAND approval flow ===');
      console.error('Error details:', error);
      setScreenLoadingStatus("Transaction Failed.")
    }
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
          console.error('LAND fee required:', landAmount.toString());
          
          // Identify the failing token based on allowances and balances
          const usdcNeeded = BigInt(amount);
          const landNeeded = BigInt(landAmount);
          
          if (BigInt(usdcBalance ?? 0) < usdcNeeded) {
            console.error('\n❌ FAILING: USDC BALANCE');
            console.error(`USDC balance (${usdcBalance?.toString()}) < needed (${usdcNeeded.toString()})`);
            console.error('⚠️ User does not have enough USDC to complete the purchase!');
          } else if (BigInt(usdcAllowance ?? 0) < usdcNeeded) {
            console.error('\n❌ FAILING TOKEN: USDC ALLOWANCE');
            console.error(`USDC allowance (${usdcAllowance?.toString()}) < needed (${usdcNeeded.toString()})`);
          } else if (BigInt(landAllowance ?? 0) < landNeeded && landNeeded > BigInt(0)) {
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
          console.error('Full buy error:', JSON.stringify(buyError, Object.getOwnPropertyNames(buyError), 2));
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
      console.log('LAND fee amount:', landAmount.toString());
      console.log('Chain ID:', chainId);
      
      usdcAllowanceRefetch()
      landAllowanceRefetch()
      usdcBalanceRefetch()
      
      console.log('Current USDC Balance:', usdcBalance?.toString() ?? '0');
      console.log('Current USDC Allowance:', usdcAllowance?.toString() ?? '0');
      console.log('Current LAND Allowance:', landAllowance?.toString() ?? '0');
      
      setScreenLoadingStatus("Transaction Pending...")
      
      // Check USDC balance first
      if (BigInt(usdcBalance ?? 0) < BigInt(buyUSDCAmount)) {
        console.error('❌ Insufficient USDC balance!');
        console.error('Balance:', usdcBalance?.toString(), 'Needed:', buyUSDCAmount.toString());
        setScreenLoadingStatus("Insufficient USDC Balance")
        return;
      }
      
      // Check if we need to approve USDC
      if (Number(formatEther(BigInt(usdcAllowance ?? 0))) < Number(formatEther(BigInt(buyUSDCAmount)))) {
        console.log('USDC allowance insufficient, requesting approval...');
        console.log('Approving USDC amount:', buyUSDCAmount.toString());
        await approveUsdc(chainId, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId], buyUSDCAmount);
      } else if (Number(formatEther(BigInt(landAllowance ?? 0))) < Number(formatEther(BigInt(landAmount))) && BigInt(landAmount) > BigInt(0)) { 
        console.log('LAND allowance insufficient, requesting approval...');
        console.log('Approving LAND with 1% buffer:', ((BigInt(landAmount) * BigInt(101)) / BigInt(100)).toString());
        approveLand(
          chainId,
          LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
          (BigInt(landAmount) * BigInt(101)) / BigInt(100)
        )
      } else {
        console.log('All allowances sufficient, proceeding to buy...');
        console.log('Calling buyToken with amount:', amount, 'USDC address:', USDC_ADDRESS[chainId]);
        buyToken(amount, USDC_ADDRESS[chainId])
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