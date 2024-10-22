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

interface useRecombineProps {
  address: Address | undefined
}

export default function useRecombine({
  address,
}: useRecombineProps) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { isConnected } = useAccount();
  const [isSuccessRecombine, setIsSuccessRecombine] = useState(false);
  const [LandAmount, setLandAmount] = useState<number | string | BigNumberish>(0)
  const [minGas, setMinGas] = useState<number | string | BigNumberish>(0)

  const { data: balanceBNB } = useBalance({ chainId: bsc.id, address }) as { data: BigNumberish }
  const { data: balanceLandV2 } = useBalanceOfLandToken({ chainId: bsc.id, address }) as { data: BigNumberish }
  const { data: landAllowance } = useAllowanceOfLandToken(bsc.id, address, PSC_ROUTER_CONTRACT_ADDRESS) as { data: BigNumberish }
  const { approve, data: approveTx } = useApproveLandToken()
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: bsc.id
  });

  const { addLiquidityETH, data: addLiquidityETHTx } = useAddLiquidityETH()
  const { isSuccess: addLiquiditySuccess } = useWaitForTransactionReceipt({
    hash: addLiquidityETHTx,
    chainId: bsc.id
  })

  useEffect(() => {
    if (approveTx) {
      if (approveSuccess) {
        setScreenLoadingStatus("Transaction 2 of 2 Pending...")
        addLiquidityETH(LandAmount, address, minGas)
      } else {
        setScreenLoadingStatus("Transaction Failed")
        setIsSuccessRecombine(false);

        return () => {
          setTimeout(() => {
            setScreenLoadingStatus("")
          }, 1000);
        }
      }
    }
  }, [approveTx, approveSuccess])

  useEffect(() => {
    if (addLiquidityETHTx) {
      if (addLiquiditySuccess) {
        setScreenLoadingStatus("Transaction success")
        setIsSuccessRecombine(true);
      } else {
        setScreenLoadingStatus("Transaction Failed")
        setIsSuccessRecombine(false);
      }

      return () => {
        setTimeout(() => {
          setScreenLoadingStatus("")
        }, 1000);
      }
    }
  }, [addLiquidityETHTx, addLiquiditySuccess])

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
        setIsSuccessRecombine(false);
        console.log("Error, withdraw: ", e);
      }
    }
  }
  return { recombine, isSuccessRecombine, setIsSuccessRecombine };
}
