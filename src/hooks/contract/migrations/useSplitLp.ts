import { useState, useEffect } from "react";
import { 
  useAccount,
  useWaitForTransactionReceipt
} from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import useBalanceOf from "../LpTokenV1Contract/useBalanceOf";
import useApprove from "../LpTokenV1Contract/useApprove";
import useRemoveLiquidityETH from "../PCSRouterContract/useRemoveLiquidityETH";
import { useGlobalContext } from "../../../context/GlobalContext";
import { 
  PROVIDERS,
  LAND_TOKEN_V1_CONTRACT_ADDRESS,
  PSC_ROUTER_CONTRACT_ADDRESS 
} from "../../../config/constants/environments";

let isSuccessSplitState = false
let amountSplitedTokensState = {
  bnb: 0,
  land: 0,
}

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

interface useSplitLPProps {
  address: Address | undefined
}

export default function useSplitLP({
  address
}: useSplitLPProps) {
  const [isSuccessSplit, setIsSuccessSplit] = useState(isSuccessSplitState);
  const [removeLiquidityETHAmount, setRemoveLiquidityETHAmount] = useState<string | number>(0)
  const [removeLiquidityETHMinLand, setRemoveLiquidityETHMinLand] = useState<string | number | bigint>(0)
  const [removeLiquidityETHMinEth, setRemoveLiquidityETHMinEth] = useState<string | number | bigint>(0)
  const [amountSplitedTokens, setAmountSplitedTokens] = useState(amountSplitedTokensState);
  const {setScreenLoadingStatus} = useGlobalContext()
  const { isConnected } = useAccount();
  const { data: balance } = useBalanceOf({ address })
  const { approve, data: approveTx, isError:isApproveError } = useApprove()
  const { removeLiquidityETH, data: removeLiquidityETHTx, isError: isRemoveLiquidityError } = useRemoveLiquidityETH()

  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: bsc.id
  });

  const { isSuccess: removeLiquiditySuccess, data: removeLiquidityStatusData } = useWaitForTransactionReceipt({
    hash: removeLiquidityETHTx,
    chainId: bsc.id
  });

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setAmountSplitedTokens(amountSplitedTokensState)
      setIsSuccessSplit(isSuccessSplitState)
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateIsSuccessSplit = (newUpdateIsSuccessSplit: any) => {
    isSuccessSplitState = newUpdateIsSuccessSplit;
    notifySubscribers();
  };

  const updateNewAmountSplitedTokens = (newAmountSplitedTokens: any) => {
    amountSplitedTokensState = newAmountSplitedTokens;
    notifySubscribers();
  };

  useEffect(() => {
    if (isApproveError) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (approveTx) {
      if (approveStatusData) {
        if (approveSuccess) {
          try {
            setScreenLoadingStatus("Transaction 2 of 2 Pending...")
            removeLiquidityETH(
              LAND_TOKEN_V1_CONTRACT_ADDRESS,
              removeLiquidityETHAmount, removeLiquidityETHMinLand, removeLiquidityETHMinEth,
              address,
              Date.now()
            )
          } catch (error) {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    }
  }, [approveSuccess, approveStatusData, approveTx, isApproveError])

  useEffect(() => {
    (async () => {
      if (isRemoveLiquidityError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (removeLiquidityETHTx) {
        if (removeLiquidityStatusData) {
          if (removeLiquiditySuccess) {
            try {
              const receiptTx = await PROVIDERS[bsc.id].getTransactionReceipt(removeLiquidityETHTx);
              const amountLand = receiptTx.args.amount0;
              const amountBNB = receiptTx.args.amount1;
              updateNewAmountSplitedTokens({ bnb: amountBNB, land: amountLand });
              setScreenLoadingStatus("Transaction Complete.")
              updateIsSuccessSplit(true)
            } catch (error) {
              setScreenLoadingStatus("Transaction Failed.")
            }
          }
        }
      }
    })()
  }, [removeLiquiditySuccess, removeLiquidityStatusData, removeLiquidityETHTx, isRemoveLiquidityError])

  async function splitLP(amount: string | number, minLand: string | number | bigint, minEth: string | number | bigint) {
    if (isConnected == true) {
      setRemoveLiquidityETHAmount(amount)
      setRemoveLiquidityETHMinLand(minLand)
      setRemoveLiquidityETHMinEth(minEth)
      if (Number(amount) > Number(balance)) {
        window.alert("Insufficient Balance");
        return;
      }
      try {
        setScreenLoadingStatus("Transaction 1 of 2 Pending...")
        approve(PSC_ROUTER_CONTRACT_ADDRESS, amount)
        
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.")
        updateIsSuccessSplit(false);
      }
   
    }
  }

  return { splitLP, isSuccessSplit, amountSplitedTokens, setIsSuccessSplit: updateIsSuccessSplit };
}
