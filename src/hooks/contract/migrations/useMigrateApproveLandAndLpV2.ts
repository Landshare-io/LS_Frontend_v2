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

interface useMigrateApproveLandAndLpV2Props {
  address: Address | undefined
}

export default function useMigrateApproveLandAndLpV2({ address }: useMigrateApproveLandAndLpV2Props) {
  const [isSuccessApprove, setIsSuccessApprove] = useState(false);
  const { isConnected } = useAccount()
  const { setScreenLoadingStatus } = useGlobalContext();

  const { data: landTokenV2Balance } = useBalanceOf({ chainId: bsc.id, address }) as { data: BigNumberish }
  const { data: lpTokenV2Balance } = useBalanceOfLpTokenV2({ chainId: bsc.id, address }) as { data: BigNumberish }

  const { approve: approveLand, data: approveLandTx } = useApproveLandToken()
  const { isSuccess: approveLandSuccess } = useWaitForTransactionReceipt({
    hash: approveLandTx,
    chainId: bsc.id
  });

  const { approve: approveLp, data: approveLpTx } = useApproveOfLpTokenV2(bsc.id)
  const { isSuccess: approveLpSuccess } = useWaitForTransactionReceipt({
    hash: approveLpTx,
    chainId: bsc.id
  });

  useEffect(() => {
    if (approveLandTx) {
      if (approveLandSuccess) {
        try {
          setScreenLoadingStatus("Transaction Completed.")
          setIsSuccessApprove(true);
        } catch (error) {
          console.log("approve error", error)
          setIsSuccessApprove(false);
          setScreenLoadingStatus("Transaction Failed.")
        }

        return () => {
          setTimeout(() => {
            setScreenLoadingStatus("")
          }, 1000);
        }
      }
    }

  }, [approveLandTx, approveLandSuccess])

  useEffect(() => {
    if (approveLpTx) {
      if (approveLpSuccess) {
        try {
          setScreenLoadingStatus("Transaction Completed.")
          setIsSuccessApprove(true);
        } catch (error) {
          console.log("approve error", error)
          setIsSuccessApprove(false);
          setScreenLoadingStatus("Transaction Failed.")
        }

        return () => {
          setTimeout(() => {
            setScreenLoadingStatus("")
          }, 1000);
        }
      }
    }

  }, [approveLpTx, approveLpSuccess])

  async function approveLandV2(approveAddress: Address) {
    if (isConnected == true) {
      try {
        setScreenLoadingStatus("Transaction is in progress...")
        approveLand(bsc.id, approveAddress, landTokenV2Balance);
      } catch (e) {
        setIsSuccessApprove(false);
        console.log(e);
      }
    }
  }

  async function approveLpToken(approveAddress: Address) {
    if (isConnected == true) {
      try {
        setScreenLoadingStatus("Transaction is in progress...")
        approveLp(approveAddress, lpTokenV2Balance);
      } catch (e) {
        setIsSuccessApprove(false);
        console.log(e);
      }
    }
  }

  return {
    approveLandV2,
    approveLpToken,
    isSuccessApprove,
    setIsSuccessApprove,
  };
}
