import { useState, useEffect } from "react";
import { bsc } from "viem/chains";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { BigNumberish, ethers } from "ethers";
import useBalanceOf from "../LandTokenContract/useBalanceOf";
import useApproveLandToken from "../LandTokenContract/useApprove";
import useBalanceOfLpTokenV2 from "../LpTokenV2Contract/useBalanceOf";
import useApproveOfLpTokenV2 from "../LpTokenV2Contract/useApprove";
import { useGlobalContext } from "../../../context/GlobalContext";

let isSuccessApproveState = false

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

interface useMigrateApproveLandAndLpV2Props {
  address: Address | undefined
}

export default function useMigrateApproveLandAndLpV2({ address }: useMigrateApproveLandAndLpV2Props) {
  const [isSuccessApprove, setIsSuccessApprove] = useState(isSuccessApproveState);
  const { isConnected } = useAccount()
  const { setScreenLoadingStatus } = useGlobalContext();

  const { data: landTokenV2Balance } = useBalanceOf({ chainId: bsc.id, address }) as { data: BigNumberish }
  const { data: lpTokenV2Balance } = useBalanceOfLpTokenV2({ chainId: bsc.id, address }) as { data: BigNumberish }

  const { approve: approveLand, data: approveLandTx, isError: isApproveLandError } = useApproveLandToken()
  const { isSuccess: approveLandSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveLandTx,
    chainId: bsc.id
  });

  const { approve: approveLp, data: approveLpTx, isError: isApproveLPError } = useApproveOfLpTokenV2(bsc.id)
  const { isSuccess: approveLpSuccess, data: approveLpStatusData } = useWaitForTransactionReceipt({
    hash: approveLpTx,
    chainId: bsc.id
  });

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setIsSuccessApprove(isSuccessApproveState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateIsSuccessApprove = (newIsSuccessApprove: boolean) => {
    isSuccessApproveState = newIsSuccessApprove;
    notifySubscribers();
  };

  useEffect(() => {
    if (isApproveLandError) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (approveLandTx) {
      if (approveStatusData) {
        if (approveLandSuccess) {
          try {
            setScreenLoadingStatus("Transaction Complete.")
            updateIsSuccessApprove(true);
          } catch (error) {
            updateIsSuccessApprove(false);
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    }
  }, [approveLandTx, approveStatusData, approveLandSuccess, isApproveLandError])

  useEffect(() => {
    if (isApproveLPError) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (approveLpTx) {
      if (approveLpStatusData) {
        if (approveLpSuccess) {
          try {
            setScreenLoadingStatus("Transaction Complete.")
            updateIsSuccessApprove(true);
          } catch (error) {
            updateIsSuccessApprove(false);
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    }
  }, [approveLpTx, approveLpStatusData, approveLpSuccess, isApproveLPError])

  async function approveLandV2(approveAddress: Address) {
    if (isConnected == true) {
      try {
        setScreenLoadingStatus("Transaction Pending...")
        approveLand(bsc.id, approveAddress, landTokenV2Balance);
      } catch (e) {
        updateIsSuccessApprove(false);
        console.log(e);
      }
    }
  }

  async function approveLpTokenV2(approveAddress: Address) {
    if (isConnected == true) {
      try {
        setScreenLoadingStatus("Transaction Pending...")
        approveLp(approveAddress, lpTokenV2Balance);
      } catch (e) {
        updateIsSuccessApprove(false);
        console.log(e);
      }
    }
  }

  return {
    approveLandV2,
    approveLpTokenV2,
    isSuccessApprove,
    setIsSuccessApprove: updateIsSuccessApprove,
  };
}
