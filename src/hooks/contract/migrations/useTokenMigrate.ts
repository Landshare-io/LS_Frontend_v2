import React from "react";
import { useAccount } from "wagmi";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useLandshareV1Context } from "../contexts/LandshareV1Context";
import { useLandshareV2Context } from "../contexts/LandshareV2Context";


export default function useTokenMigrate({
  startTransactionRefresh,
  transactionResult,
 
}) {
  const [isSuccessMigrate, setIsSuccessMigrate] = React.useState(false);
  const { isConnected } = useAccount()
  const { updateLandTokenV2Balance } = useGlobalContext();
  const {
    contract: { landTokenContract },
  } = useLandshareV1Context();
  const {
    contract: { tokenMigrateContract },
  } = useLandshareV2Context();

  async function tokenMigrate(amount) {
    if (isConnected == true) {
      startTransactionRefresh(1, 2);
      try {
        const txApprove = await landTokenContract.approve(
          process.env.REACT_APP_TOKEN_MIGRATE_ADDR,
          amount
        );
        txApprove.wait().then(async () => {
          startTransactionRefresh(2, 2);
          try {
            const txSwap = await tokenMigrateContract.swap();
            txSwap.wait().then(() => {
              transactionResult("Transaction Completed.", true);
              setIsSuccessMigrate(true);
              updateLandTokenV2Balance()
            });
          } catch (e) {
            transactionResult("Transaction Failed.", false);
            setIsSuccessMigrate(false);
            console.log("Error, withdraw: ", e);
          }
         
        });
       
      } catch (e) {
        transactionResult("Transaction Failed.", false);
        setIsSuccessMigrate(false);
        console.log("Error, withdraw: ", e);
      }
    
    }
  }
  return { tokenMigrate, isSuccessMigrate, setIsSuccessMigrate };
}
