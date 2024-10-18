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

interface useSplitLPProps {
  address: Address | undefined
}

export default function useSplitLP({
  address
}: useSplitLPProps) {
  const [isSuccessSplit, setIsSuccessSplit] = useState(false);
  const [removeLiquidityETHAmount, setRemoveLiquidityETHAmount] = useState<string | number>(0)
  const [removeLiquidityETHMinLand, setRemoveLiquidityETHMinLand] = useState<string | number | bigint>(0)
  const [removeLiquidityETHMinEth, setRemoveLiquidityETHMinEth] = useState<string | number | bigint>(0)
  const [amountSplitedTokens, setAmountSplitedTokens] = useState({
    bnb: 0,
    land: 0,
  });
  const {setScreenLoadingStatus} = useGlobalContext()
  const { isConnected } = useAccount();
  const { data: balance } = useBalanceOf({ address })
  const { approve, data: approveTx } = useApprove()
  const { removeLiquidityETH, data: removeLiquidityETHTx } = useRemoveLiquidityETH()

  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: bsc.id
  });

  const { isSuccess: removeLiquiditySuccess } = useWaitForTransactionReceipt({
    hash: removeLiquidityETHTx,
    chainId: bsc.id
  });

  useEffect(() => {
    if (approveTx) {
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
  }, [approveSuccess, approveTx])

  useEffect(() => {
    (async () => {
      if (removeLiquidityETHTx) {
        if (removeLiquiditySuccess) {
          try {
            const receiptTx = await PROVIDERS[bsc.id].getTransactionReceipt(removeLiquidityETHTx);
            const amountLand = receiptTx.args.amount0;
            const amountBNB = receiptTx.args.amount1;
            setAmountSplitedTokens({ bnb: amountBNB, land: amountLand });
            setScreenLoadingStatus("Transaction Completed.")
            setIsSuccessSplit(true)
          } catch (error) {
            setScreenLoadingStatus("Transaction Failed.")
          }
          return () => {
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        }
      }
    })()
  }, [removeLiquiditySuccess, removeLiquidityETHTx])

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
        setScreenLoadingStatus("Transaction failed")
        setIsSuccessSplit(false);
        console.log("Error, withdraw: ", e);
      }
   
    }
  }

  return { splitLP, isSuccessSplit, amountSplitedTokens, setIsSuccessSplit };
}
