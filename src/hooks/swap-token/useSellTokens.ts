import { useEffect } from 'react';
import { useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { Address } from 'viem';
import { bsc } from 'viem/chains';
import { BigNumberish } from 'ethers';
import useAllowanceOfRwaContract from '../contract/RWAContract/useAllowance';
import useApproveOfRwaContract from '../contract/RWAContract/useApprove';
import useApproveOfLandContract from '../contract/LandTokenContract/useApprove';
import useSellRwa from '../contract/LandshareBuySaleContract/useSellRwa';
import useBalanceOfUsdtContract from '../contract/UsdtContract/useBalanceOf';
import useBalanceOfRwaContract from '../contract/RWAContract/useBalanceOf';
import useBalanceOfLandContract from '../contract/LandTokenContract/useBalanceOf';
import useAllowanceOfLandContract from '../contract/LandTokenContract/useAllowance';
import { 
  RWA_CONTRACT_ADDRESS, 
  LANDSHARE_SALE_CONTRACT_ADDRESS,
  USDC_ADDRESS,
  TRANSACTION_CONFIRMATIONS_COUNT
} from '../../config/constants/environments';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  PUSD_SUPPORT_CHINAS,
} from "../../config/constants/environments";
import UsdcAbi from '../../abis/USDC.json';
import LandshareSaleAbi from '../../abis/LandshareSale.json';

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

  // Get treasury wallet address from sale contract
  const { data: treasuryWallet } = useReadContract({
    address: LANDSHARE_SALE_CONTRACT_ADDRESS[chainId],
    abi: LandshareSaleAbi,
    functionName: 'treasuryWallet',
    chainId: chainId
  });

  // Check USDC allowance from treasury to sale contract
  const { data: treasuryUsdcAllowance } = useReadContract({
    address: USDC_ADDRESS[chainId],
    abi: UsdcAbi,
    functionName: 'allowance',
    args: [treasuryWallet, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]],
    chainId: chainId,
    query: {
      enabled: !!treasuryWallet
    }
  });

  // Check USDC balance in treasury
  const { data: treasuryUsdcBalance } = useReadContract({
    address: USDC_ADDRESS[chainId],
    abi: UsdcAbi,
    functionName: 'balanceOf',
    args: [treasuryWallet],
    chainId: chainId,
    query: {
      enabled: !!treasuryWallet
    }
  });

  const { approve: approveRWA, data: rwaApproveTx, isError: isRwaApproveError, error: rwaApproveError, isPending: isLoadingApproveRWA } = useApproveOfRwaContract(chainId)

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

  // const { approve: approveUsdc, data: usdcApproveTx, isError: isUsdcApproveError } = useApproveOfUsdcContract()

  // const { isSuccess: usdcApproveSuccess, data: usdcApproveStatusData } = useWaitForTransactionReceipt({
  //   confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
  //   hash: usdcApproveTx,
  //   chainId: chainId
  // });

  const { sellRwa, data: sellTx, isError, error: sellRWAError } = useSellRwa(chainId)

  const { isSuccess: sellSuccess, data: sellStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: sellTx,
  });

  useEffect(() => {
    try {
      if (isRwaApproveError) {
        console.error('=== RWA Approve Error ===');
        console.error('RWA approval failed');
        console.error('Error object:', rwaApproveError);
        console.error('Error message:', rwaApproveError?.message);
        console.error('Error name:', rwaApproveError?.name);
        console.error('Error cause:', rwaApproveError?.cause);
        console.error('Error shortMessage:', (rwaApproveError as any)?.shortMessage);
        console.error('Error details:', (rwaApproveError as any)?.details);
        if (rwaApproveError && typeof rwaApproveError === 'object') {
          console.error('Full error stringified:', JSON.stringify(rwaApproveError, Object.getOwnPropertyNames(rwaApproveError), 2));
        }
        setScreenLoadingStatus("Transaction Failed.")
      } else if (rwaApproveTx) {
        if (rwaApproveStatusData) {
          rwaAllowanceRefetch()
      
          if (rwaApproveSuccess && !isLoadingApproveRWA && !isLoadingApproveLAND) {
            console.log('RWA approved successfully, proceeding to sell...');
            if (chainId == bsc.id) {
              if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
                console.log('LAND approval required, amount:', landFeeAmount.toString());
                approveLand(chainId, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], landFeeAmount)
              } else {
                console.log('Calling sellRwa with amount:', amount);
                sellRwa(amount)
              }
            } else {
              console.log('Calling sellRwa with amount:', amount);
              sellRwa(amount)
            }
          } else {
            console.error('RWA approval did not succeed or still loading');
            console.error('rwaApproveSuccess:', rwaApproveSuccess);
            console.error('isLoadingApproveRWA:', isLoadingApproveRWA);
            console.error('isLoadingApproveLAND:', isLoadingApproveLAND);
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      console.error('=== Error in RWA Approve Effect ===');
      console.error(error);
      setScreenLoadingStatus("Transaction Failed.")
    }
  }, [rwaApproveSuccess, isRwaApproveError])

  useEffect(() => {
    try {
      if (isLandApproveError) {
        console.error('=== LAND Approve Error ===');
        console.error('Error details:', landApproveError);
        setScreenLoadingStatus("Transaction Failed.")
      } else if (landApproveTx ) {
        if (landApproveStatusData) {
          landAllowanceRefetch()
          // if (BigInt(landAllowance) < BigInt(landFeeAmount)) {
          //   window.alert("Please approve sufficient allowance.")
          //   setScreenLoadingStatus("Insufficient Allowance")
          // }
          if (landApproveSuccess) {
            console.log('LAND approved successfully, calling sellRwa with amount:', amount);
            sellRwa(amount)
          } else {
            console.error('LAND approval did not succeed');
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      console.error('=== Error in LAND Approve Effect ===');
      console.error(error);
      setScreenLoadingStatus("Transaction Failed.")
    }
  }, [ landApproveSuccess, isLandApproveError])

  useEffect(() => {
    (async () => {
      if (isError) {
        console.error('=== Sell RWA Transaction Failed ===');
        console.error('Error details:', sellRWAError);
        console.error('Error message:', sellRWAError?.message);
        console.error('Error name:', sellRWAError?.name);
        console.error('Error cause:', sellRWAError?.cause);
        console.error('Error shortMessage:', (sellRWAError as any)?.shortMessage);
        console.error('Error details:', (sellRWAError as any)?.details);
        console.error('Error metaMessages:', (sellRWAError as any)?.metaMessages);
        
        // Decode which token is failing
        const errorMsg = sellRWAError?.message?.toLowerCase() || '';
        if (errorMsg.includes('insufficient allowance') || errorMsg.includes('erc20')) {
          console.error('\n🔍 TOKEN IDENTIFICATION:');
          console.error('RWA Contract:', RWA_CONTRACT_ADDRESS[chainId]);
          console.error('LAND Contract:', '0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C');
          console.error('USDC Contract:', USDC_ADDRESS[chainId]);
          console.error('Sale Contract:', LANDSHARE_SALE_CONTRACT_ADDRESS[chainId]);
          console.error('Treasury Wallet:', treasuryWallet);
          
          console.error('\n📊 ALLOWANCE CHECK:');
          console.error('User RWA → Sale Contract:', rwaAllowance?.toString() ?? '0');
          console.error('User LAND → Sale Contract:', landAllowance?.toString() ?? '0');
          console.error('Treasury USDC → Sale Contract:', treasuryUsdcAllowance?.toString() ?? '0');
          console.error('Treasury USDC Balance:', treasuryUsdcBalance?.toString() ?? '0');
          console.error('Amount trying to sell:', amount);
          console.error('LAND fee required:', landFeeAmount.toString());
          
          // Identify the failing token based on allowances
          const rwaNeeded = BigInt(amount);
          const landNeeded = BigInt(landFeeAmount);
          
          if (BigInt(rwaAllowance ?? 0) < rwaNeeded) {
            console.error('\n❌ FAILING TOKEN: RWA');
            console.error(`RWA allowance (${rwaAllowance?.toString()}) < needed (${rwaNeeded.toString()})`);
          } else if (BigInt(landAllowance ?? 0) < landNeeded) {
            console.error('\n❌ FAILING TOKEN: LAND');
            console.error(`LAND allowance (${landAllowance?.toString()}) < needed (${landNeeded.toString()})`);
          } else if (treasuryUsdcAllowance === 0n || treasuryUsdcAllowance === undefined) {
            console.error('\n❌ FAILING TOKEN: USDC (TREASURY)');
            console.error('⚠️ Treasury wallet has NOT approved the sale contract to spend USDC!');
            console.error(`Treasury USDC allowance: ${treasuryUsdcAllowance?.toString() ?? '0'}`);
            console.error('This is a CONTRACT CONFIGURATION ISSUE - the treasury wallet owner must approve the sale contract.');
          } else {
            console.error('\n⚠️ All allowances appear sufficient, but transaction still reverted:');
            console.error('RWA allowance:', rwaAllowance?.toString());
            console.error('LAND allowance:', landAllowance?.toString());
            console.error('Treasury USDC allowance:', treasuryUsdcAllowance?.toString());
          }
          
          // Check error data for contract address
          const errorData = (sellRWAError as any)?.data || (sellRWAError as any)?.cause?.data;
          if (errorData) {
            console.error('\n📋 ERROR DATA:');
            console.error('Error data:', errorData);
            console.error('Error data stringified:', JSON.stringify(errorData, null, 2));
            
            // Try to extract the failing contract address from error data
            if (errorData.abiItem) {
              console.error('ABI Item:', errorData.abiItem);
            }
            if (errorData.args) {
              console.error('Error args:', errorData.args);
            }
            if (errorData.errorName) {
              console.error('Error name from data:', errorData.errorName);
            }
          }
          
          // Check cause for more details
          const cause = (sellRWAError as any)?.cause;
          if (cause?.data) {
            console.error('Cause data:', JSON.stringify(cause.data, null, 2));
          }
          
          // Try to identify from error context
          if (errorMsg.includes('0x475ed67') || errorMsg.includes(RWA_CONTRACT_ADDRESS[chainId]?.toLowerCase())) {
            console.error('❌ FAILING TOKEN: RWA (0x475eD67Bfc62B41c048b81310337c1D75D45aADd)');
          } else if (errorMsg.includes('0xa73164db') || errorMsg.includes('land')) {
            console.error('❌ FAILING TOKEN: LAND (0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C)');
          } else if (errorMsg.includes('0x8ac76a51') || errorMsg.includes('usdc')) {
            console.error('❌ FAILING TOKEN: USDC (0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d)');
            console.error('⚠️ This is the TREASURY USDC transfer - treasury wallet needs to approve sale contract!');
          } else {
            console.error('⚠️ Could not automatically identify token. Full error below:');
          }
        }
        
        if (sellRWAError && typeof sellRWAError === 'object') {
          console.error('Full sell error:', JSON.stringify(sellRWAError, Object.getOwnPropertyNames(sellRWAError), 2));
        }
        console.error('Transaction hash:', sellTx);
        console.error('Amount attempted:', amount);
        setScreenLoadingStatus("Transaction Failed.")
      } else if (sellTx) {
        console.log('Sell transaction hash:', sellTx);
        if (sellStatusData) {
          console.log('Transaction status data received:', sellStatusData);
          if (sellSuccess) {
            console.log('Sell transaction successful! Refetching balances...');
            await rwaBalanceRefetch()
            await usdtBalanceRefetch()
            await landBalanceRefetch()
            setScreenLoadingStatus("Transaction Complete.")
          } else {
            console.error('Transaction did not succeed');
            console.error('Status data:', sellStatusData);
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    })()
  }, [sellTx, sellStatusData, sellSuccess, isError])

  const sellTokens = async () => {
    try {
      console.log('=== Starting Sell Tokens Process ===');
      console.log('Amount to sell (RWA has 0 decimals):', amount);
      console.log('Land fee amount:', landFeeAmount.toString());
      console.log('Chain ID:', chainId);
   
      landAllowanceRefetch()
      rwaAllowanceRefetch()
      
      console.log('Current RWA Allowance:', rwaAllowance?.toString() ?? '0');
      console.log('Current LAND Allowance:', landAllowance?.toString() ?? '0');
     
      setScreenLoadingStatus('Transaction Pending...')
      
      // Check if we need to approve RWA (always with buffer)
      const rwaNeeded = (BigInt(amount) * BigInt(105)) / BigInt(100); // 5% buffer
      if (BigInt(rwaAllowance ?? 0) < rwaNeeded) {
        console.log('RWA allowance insufficient, requesting approval...');
        console.log('Approving RWA with 5% buffer:', rwaNeeded.toString());
        await approveRWA(LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], rwaNeeded);
      } else {
        console.log('RWA allowance sufficient');
        
        // Check if we need to approve LAND with larger buffer (contract calculates fee internally)
        const landNeeded = (BigInt(landFeeAmount) * BigInt(110)) / BigInt(100); // 10% buffer
        if (BigInt(landAllowance) < landNeeded && !PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866)) {
          console.log('LAND allowance insufficient, requesting approval...');
          console.log('Required LAND fee:', landFeeAmount.toString());
          console.log('Approving LAND with 10% buffer:', landNeeded.toString());
          approveLand(chainId, LANDSHARE_SALE_CONTRACT_ADDRESS[chainId], landNeeded)
        } else {
          console.log('All allowances sufficient, proceeding to sell...');
          console.log('Calling sellRwa with amount:', amount);
          sellRwa(amount)
        }
      }
    } catch (error) {
      console.error('=== Error in sellTokens function ===');
      console.error('Error details:', error);
      console.error('Amount:', amount);
      console.error('Chain ID:', chainId);
      setScreenLoadingStatus('Transaction Failed.')
    }
  };

  return {
    sellTokens
  };
}
