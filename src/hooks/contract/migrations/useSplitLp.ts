import { useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "viem";
import useBalanceOf from "../LpTokenV1Contract/useBalanceOf";
import useApprove from "../LpTokenV1Contract/useApprove";
import useRemoveLiquidityETH from "../PCSRouterContract/useRemoveLiquidityETH";
import { useLandshareV1Context } from "../contexts/LandshareV1Context";
import { useMigrationContext } from "../contexts/MigrationContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import { LP_TOKEN_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface useSplitLPProps {
  address: Address | undefined
}

export default function useSplitLP({
  address
}: useSplitLPProps) {
  const [isSuccessSplit, setIsSuccessSplit] = useState(false);
  const [amountSplitedTokens, setAmountSplitedTokens] = useState({
    bnb: 0,
    land: 0,
  });
  const {setScreenLoadingStatus} = useGlobalContext()
  const { isConnected } = useAccount();
  const {
    contract: { lpTokenContract },
  } = useLandshareV1Context();
  const { PCSRouterContract } = useMigrationContext();
  const { data: balance } = useBalanceOf({ address })
  const { approve } = useApprove()

  async function splitLP(amount: string | number, minLand: string | number | bigint, minEth: string | number | bigint) {
    if (isConnected == true) {
      if (Number(amount) > Number(balance)) {
        window.alert("Insufficient Balance");
        return;
      }
      try {
        const txApprove = await lpTokenContract.approve(
          process.env.REACT_APP_PSC_ROUTER,
          amount
        );
        txApprove.wait().then(async () => {
          
          try {
            const txRemoveLiquidity = await PCSRouterContract.removeLiquidityETH(
              process.env.REACT_APP_LAND_TOKEN_ADDR,
              amount,
              minLand,
              minEth,
              address,
              Date.now()
            );
            txRemoveLiquidity.wait().then( (res) => {
              const removeLiquidityEvent = res.events.find(event => event.event === 'Burn');
              const amountLand = removeLiquidityEvent.args.amount0;
              const amountBNB = removeLiquidityEvent.args.amount1;
              setAmountSplitedTokens({ bnb: amountBNB, land: amountLand });
              transactionResult("Transaction Completed.", true);
              setIsSuccessSplit(true);
         
            });
          } catch (e) {
            transactionResult("Transaction Failed.", false);
            setIsSuccessSplit(false);
            console.log("Error, withdraw: ", e);
          }
     
        });

      } catch (e) {
        transactionResult("Transaction Failed.", false);
        setIsSuccessSplit(false);
        console.log("Error, withdraw: ", e);
      }
   
    } else {
      endTransaction();
    }
  }
  return { splitLP, isSuccessSplit, amountSplitedTokens, setIsSuccessSplit };
}
