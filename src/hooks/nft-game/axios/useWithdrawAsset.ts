import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { BigNumberish } from "ethers";
import { Address } from "viem";
import axios from "./nft-game-axios";
import { validateResource } from "../../../utils/helpers/validator";
import useGetResource from "./useGetResource";
import useWithdrawOfAssetStake from "../../contract/AssetStakeContract/useWithdraw";
import useStakedBalance from "../../contract/AssetStakeContract/useStakedBalance";
import useGetUserData from "./useGetUserData";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useWithdrawAsset(chainId: number, address: Address | undefined, setDepositLoading: Function, setWithdrawLoading: Function) {
  const [depositAmount, setDepositAmount] = useState<BigNumberish>(0)
  const { resource } = useGetResource()
  const {notifyError, notifySuccess} = useGlobalContext()
  const { withdraw, data: withdrawTx } = useWithdrawOfAssetStake(chainId)
  const { refetch } = useStakedBalance(chainId, address)
  const { getUserData } = useGetUserData()

  const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({
    chainId,
    hash: withdrawTx,
  })

  useEffect(() => {
    (async () => {
      try {
        if (withdrawTx) {
          if (withdrawSuccess) {
            await axios.post('/house/withdraw-asset-token', {
              houseId: -1
            })
  
            getUserData()
            setDepositLoading(false);
            setWithdrawLoading(false)
            notifySuccess(`${depositAmount} LSRWA withdrawn successfully!`);
          }
        }
      } catch (error: any) {
        console.log("Withdraw error", error);
        setWithdrawLoading(false)
        notifyError(error.response.data.message);
      }
    })()
  }, [withdrawTx, withdrawSuccess])

  const withdrawAssetTokenHandler = async (withdrawStakedCost: string, amount: BigNumberish) => {
    const withdrawCost = withdrawStakedCost.split(',')
    setDepositAmount(amount)
    if (await validateResource(resource, withdrawCost)) {
      try {
        withdraw(amount)
      } catch (error: any) {
        console.log("Withdraw error", error);
        setWithdrawLoading(false)
        notifyError(error.response.data.message);
      }
    } else {
      setWithdrawLoading(false)
      notifyError("Insufficient resources.");
    }
  }

  return {
    withdrawAssetTokenHandler
  }
}