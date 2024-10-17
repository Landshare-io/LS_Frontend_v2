import React from "react";
import { useAccount } from "wagmi";
import useBalanceOf from "../LpTokenV1Contract/useBalanceOf";
import { useLandshareV1Context } from "../contexts/LandshareV1Context";
import { useMigrationContext } from "../contexts/MigrationContext";
import { useGlobalContext } from "../contexts/GlobalContext";
import { LP_TOKEN_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useSplitLP({
  state,
  startTransactionRefresh,
  endTransaction,
  transactionResult,

}) {
  const [isSuccessSplit, setIsSuccessSplit] = React.useState(false);
  const [amountSplitedTokens, setAmountSplitedTokens] = React.useState({
    bnb: 0,
    land: 0,
  });
  const { isConnected } = useGlobalContext();
  const {
    contract: { lpTokenContract },
  } = useLandshareV1Context();
  const { PCSRouterContract } = useMigrationContext();
  const { address } = useAccount();
  async function splitLP(amount: string | number, minLand: string | number | bigint, minEth: string | number | bigint) {
    startTransactionRefresh(1, 2);
    const balance = await lpTokenContract.balanceOf(address);

    if (isConnected == true) {
      if (Number(amount) > Number(balance)) {
        endTransaction();
        window.alert("Insufficient Balance");
        return;
      }
      try {
        const txApprove = await lpTokenContract.approve(
          process.env.REACT_APP_PSC_ROUTER,
          amount
        );
        txApprove.wait().then(async () => {
          startTransactionRefresh(2, 2);
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
