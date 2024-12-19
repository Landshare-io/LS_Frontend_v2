import { useState, useEffect } from "react";
import { bsc } from "viem/chains";
import { Address } from "viem";
import { 
  useBalance, 
  useAccount,
  useWaitForTransactionReceipt
} from "wagmi";
import { useGlobalContext } from "../../../context/GlobalContext";
import useBalanceOfLandToken from "../LandTokenContract/useBalanceOf";
import useAllowanceOfLandToken from "../LandTokenContract/useAllowance";
import useApproveLandToken from "../LandTokenContract/useApprove";
import useAddLiquidityETH from "../PCSRouterContract/useAddLiquidityETH";
import { PSC_ROUTER_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

let isSuccessRecombineState = false

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

interface useRecombineProps {
  address: Address | undefined
}

export default function useRecombine({
  address,
}: useRecombineProps) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { isConnected } = useAccount();
  const [isSuccessRecombine, setIsSuccessRecombine] = useState(isSuccessRecombineState);
  const [LandAmount, setLandAmount] = useState<number | string | BigNumberish>(0)
  const [minGas, setMinGas] = useState<number | string | BigNumberish>(0)

  const { data: balanceBNB } = useBalance({ chainId: bsc.id, address }) as { data: BigNumberish }
  const { data: balanceLandV2 } = useBalanceOfLandToken({ chainId: bsc.id, address }) as { data: BigNumberish }
  const { data: landAllowance } = useAllowanceOfLandToken(bsc.id, address, PSC_ROUTER_CONTRACT_ADDRESS) as { data: BigNumberish }
  const { approve, data: approveTx, isError: isApproveError } = useApproveLandToken()
  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: bsc.id
  });

  const { addLiquidityETH, data: addLiquidityETHTx, isError: isAddLiquidityError } = useAddLiquidityETH()
  const { isSuccess: addLiquiditySuccess, data: addLiquidityStatusData } = useWaitForTransactionReceipt({
    hash: addLiquidityETHTx,
    chainId: bsc.id
  })

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setIsSuccessRecombine(isSuccessRecombineState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateIsSuccessRecombine = (newIsSuccessRecombine: boolean) => {
    isSuccessRecombineState = newIsSuccessRecombine;
    notifySubscribers();
  };

  useEffect(() => {
    if (isApproveError) {
      setScreenLoadingStatus("Transaction Failed.")
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    } else if (approveTx) {
      if (approveStatusData) {
        if (approveSuccess) {
          setScreenLoadingStatus("Transaction 2 of 2 Pending...")
          addLiquidityETH(LandAmount, address, minGas)
        } else {
          setScreenLoadingStatus("Transaction Failed")
          updateIsSuccessRecombine(false);
          setTimeout(() => {
            setScreenLoadingStatus("")
          }, 1000);
        }
      }
    }
  }, [approveTx, approveStatusData, approveSuccess, isApproveError])

  useEffect(() => {
    if (isAddLiquidityError) {
      setScreenLoadingStatus("Transaction Failed.")
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    } else if (addLiquidityETHTx) {
      if (addLiquidityStatusData) {
        if (addLiquiditySuccess) {
          setScreenLoadingStatus("Transaction success")
          updateIsSuccessRecombine(true);
          setTimeout(() => {
            setScreenLoadingStatus("")
          }, 1000);
        } else {
          setScreenLoadingStatus("Transaction Failed")
          updateIsSuccessRecombine(false);
          setTimeout(() => {
            setScreenLoadingStatus("")
          }, 1000);
        }
      }
    }
  }, [addLiquidityETHTx, addLiquidityStatusData, addLiquiditySuccess, isAddLiquidityError])

  async function recombine(
    amountBNB: string | number | BigNumberish,
    amountLandV2: string | number | BigNumberish,
    // minLand,
    minEth: string | number | BigNumberish
  ) {
    if (isConnected == true) {
      setLandAmount(amountLandV2)
      setMinGas(minEth)
      if (
        Number(amountBNB) > Number(balanceBNB) ||
        Number(amountLandV2) > Number(balanceLandV2)
      ) {
        window.alert("Insufficient BNB balance. ");
        return;
      }
      try {
        if (Number(landAllowance) < Number(amountLandV2)) {
          setScreenLoadingStatus("Transaction 2 of 1 Pending...")
          approve(bsc.id, PSC_ROUTER_CONTRACT_ADDRESS, amountLandV2);
        } else {
          setScreenLoadingStatus("")
        }
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.");
        updateIsSuccessRecombine(false);
        setTimeout(() => {
          setScreenLoadingStatus("")
        }, 1000);
      }
    }
  }
  return { recombine, isSuccessRecombine, setIsSuccessRecombine: updateIsSuccessRecombine };
}
