import { useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { bsc } from "viem/chains";
import useBuy from "../SwapCatContract/useBuy";
import { useGlobalContext } from "../../../context/GlobalContext";
import { TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments";

export default function useBuyOffer(setIsSwapping: Function, getOfferAmounts: Function, completeRequest: Function) {
  const { buy, data: buyTx, isError: isBuyError } = useBuy()
  const { notifyError, notifySuccess } = useGlobalContext();

  const { isSuccess: buySuccess, data: buyStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: buyTx,
    chainId: bsc.id
  });

  useEffect(() => {
    (async () => {
      if (isBuyError) {
        notifyError("Swap Error");
        setIsSwapping([false, false]);
      } else if (buyTx) {
        if (buyStatusData) {
          if (buySuccess) {
            const totalOfferAmount = await getOfferAmounts();
            console.log(totalOfferAmount);
            if (Number(totalOfferAmount) === 0) {
              // Complete offer if both BUSD and LAND swap offer was completed
              completeRequest();
            }
            setIsSwapping([false, false]);
            notifySuccess("Swap success!");
          } else {
            notifyError("Swap Error");
            setIsSwapping([false, false]);
          }
        }
      }
    })()
  }, [isBuyError, buyTx, buySuccess, buyStatusData])


  const buyOffer = async (offerId: number) => {
    try {
      buy(offerId)
    } catch (e: any) {
      notifyError("Swap Error");
      console.log("swap error", e);
      setIsSwapping([false, false]);
    }
  }

  return { buyOffer }
}