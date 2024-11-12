import { useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { bsc } from "viem/chains";
import useBuy from "../SwapCatContract/useBuy";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useBuyOffer(setIsSwapping: Function, getOfferAmounts: Function, completeRequest: Function) {
  const { buy, data: buyTx } = useBuy()
  const { notifyError, notifySuccess } = useGlobalContext();

  const { isSuccess: buySuccess, data: buyStatusData } = useWaitForTransactionReceipt({
    hash: buyTx,
    chainId: bsc.id
  });

  useEffect(() => {
    (async () => {
      if (buyTx) {
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
  }, [buyTx, buySuccess, buyStatusData])


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