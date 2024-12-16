import { useEffect, useState } from "react";
import { bsc } from "viem/chains";
import { Address } from "viem";
import { 
  useAccount,
  useWaitForTransactionReceipt
} from "wagmi";
import { useGlobalContext } from "../../../context/GlobalContext";
import { BigNumberish } from "ethers";
import useBalanceOf from "../LandTokenContract/useBalanceOf";
import useApprove from "../LandTokenV1Contract/useApprove";
import useSwap from "../TokenMigrateContract/useSwap";

let isSuccessMigrateState = false

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

interface useTokenMigrateProps {
  address: Address | undefined;
}

export default function useTokenMigrate({ address }: useTokenMigrateProps) {
  const [isSuccessMigrate, setIsSuccessMigrate] = useState(isSuccessMigrateState);
  const { isConnected } = useAccount()
  const { refetch: updateLandTokenV2Balance } = useBalanceOf({ chainId: bsc.id, address })
  const { approve: landTokenApprove, data: landTokenApproveTx } = useApprove()
  const { swap, data: swapTx } = useSwap()
  const { setScreenLoadingStatus } = useGlobalContext()

  const { isSuccess: landTokenApproveSuccess, data: landTokenApproveStatusData } = useWaitForTransactionReceipt({
    hash: landTokenApproveTx,
    chainId: bsc.id
  });

  const { isSuccess: swapSuccess, data: swapStatusData } = useWaitForTransactionReceipt({
    hash: swapTx,
    chainId: bsc.id
  });

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setIsSuccessMigrate(isSuccessMigrateState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateIsSuccessMigrate = (newIsSuccessMigrate: boolean) => {
    isSuccessMigrateState = newIsSuccessMigrate;
    notifySubscribers();
  };
  
  useEffect(() => {
    if (landTokenApproveTx) {
      if (landTokenApproveStatusData) {
        if (landTokenApproveSuccess) {
          try {
            setScreenLoadingStatus("Transaction 2 of 2 Pending...")
            swap()
          } catch (error) {
            console.log("swap error", error)
            setScreenLoadingStatus("Transaction Failed.")
  
            return () => {
              setTimeout(() => {
                setScreenLoadingStatus("")
              }, 1000);
            }
          }
        }
      }
    }
  }, [landTokenApproveTx, landTokenApproveStatusData, landTokenApproveSuccess])

  useEffect(() => {
    if (swapTx) {
      if (swapStatusData) {
        if (swapSuccess) {
          try {
            updateIsSuccessMigrate(true)
            updateLandTokenV2Balance()
            setScreenLoadingStatus("Transaction Completed.")
          } catch (error) {
            setScreenLoadingStatus("Transaction Failed.")
          }
  
          return () => {
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        } else {
          updateIsSuccessMigrate(false)
        }
      }
    }
  }, [swapTx, swapStatusData, swapSuccess])

  async function tokenMigrate(amount: BigNumberish) {
    if (isConnected == true) {
      setScreenLoadingStatus("Transaction 1 of 2 Pending...")
      landTokenApprove(address, amount)
    }
  }
  return { tokenMigrate, isSuccessMigrate, setIsSuccessMigrate: updateIsSuccessMigrate };
}
