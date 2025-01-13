import { useState, useEffect } from "react";
import { 
  useDisconnect, 
  useWaitForTransactionReceipt, 
  useChainId, 
  useSendTransaction 
} from "wagmi";
import { bsc } from "viem/chains";
import { Address } from "viem";
import { BigNumberish, formatEther } from "ethers";
import axios from "./nft-game-axios";
import useGetUserData from "./useGetUserData";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetResource from "./useGetResource";
import useIsApprovedForAll from "../../contract/HouseNftContract/useIsApprovedForAll";
import useSetApprovalForAll from "../../contract/HouseNftContract/useSetApprovalForAll";
import useApprove from "../../contract/HouseNftContract/useApprove";
import useBalanceOfLand from "../../contract/LandTokenContract/useBalanceOf";
import useGetNftCredits from "../apollo/useGetNftCredits";
import useGetHouse from "./useGetHouse";
import { ADMIN_WALLET_ADDRESS, PROVIDERS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments";

export default function useHandleHouse(
  house: any, 
  setHouse: Function, 
  setIsLoading: Function, 
  isOwn: boolean, 
  onSaleLoading: boolean,
  setOnSaleLoading: Function, 
  setSaleOpen: Function,
  setShowOnSaleAlert: Function, 
  address: Address | undefined
) {
  const chainId = useChainId()
  const [salePrice, setSalePrice] = useState(0)
  const [isSale, setIsSale] = useState(false)
  const [transactionNonce, setTransactionNonce] = useState(0)
  const [extendLandAmount, setExtendLandAmount] = useState(0)
  const { disconnect } = useDisconnect();
  const { userData, getUserData } = useGetUserData()
  const { notifyError, notifySuccess } = useGlobalContext()
  const { data: isApprovedForAll } = useIsApprovedForAll(chainId, address)
  const { setApprovalForAll, data: setApprovalForAllTx, isError: isSetApprovalForAllError } = useSetApprovalForAll()
  const { approve, data: approveTx, isError: isApproveError } = useApprove()
  const { userReward } = useGetResource()
  const { data: userLandAmount, refetch: refetchLand } = useBalanceOfLand({ chainId, address }) as { data: BigNumberish, refetch: Function }
  const { nftCredits, getNftCredits } = useGetNftCredits(address)
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()
  const { getHouse } = useGetHouse(house.id)

  const { isSuccess: sendTxSuccess, data: sendTxData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: sendTransactionTx,
    chainId: chainId
  });
  const { isSuccess: approveForAllSuccess, data: approveForAllStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: setApprovalForAllTx,
    chainId: chainId
  });
  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: approveTx,
    chainId: chainId
  });

  useEffect(() => {
    (async () => {
      try {
        if (isSetApprovalForAllError) {
          setOnSaleLoading(false);
          notifyError("Approve error");
        } else if (setApprovalForAllTx) {
          if (approveForAllStatusData) {
            if (approveForAllSuccess) {
              await setHouseToOnSale();
            } else {
              setOnSaleLoading(false);
              notifyError("Approve error");
            }
          }
        }
      } catch (error) {
        setOnSaleLoading(false)
        notifyError("Transaction Failed.")
        console.log(error)
      }
    })()
  }, [setApprovalForAllTx, approveForAllStatusData, approveForAllSuccess, isSetApprovalForAllError])

  useEffect(() => {
    (async () => {
      try {
        if (isApproveError) {
          setSaleOpen(false);
          setOnSaleLoading(false);
          notifyError("Approve error");
        } else if (approveTx) {
          if (approveStatusData) {
            if (approveSuccess) {
              const { data } = await axios.post('/house/set-sale', {
                hosueId: house.id,
                setSale: isSale,
                price: salePrice
              })
      
              setHouse((prevState: any) => ({
                ...prevState,
                onSale: data.onSale,
                salePrice: data.salePrice
              }));
      
              setSaleOpen(false);
              setOnSaleLoading(false);
              notifySuccess(isSale ? `NFT successfully listed for sale` : `Successfully removed NFT from marketplace`);
            } else {
              setSaleOpen(false);
              setOnSaleLoading(false);
              notifyError("Approve error");
            }
          }
        }
      } catch (error: any) {
        console.log(`Setting ${isSale ? 'on' : 'off'}-sale error`, error);
        setSaleOpen(false);
        setOnSaleLoading(false);
        notifyError(error.response.data.message);
      }
    })()
  }, [approveTx, approveStatusData, approveSuccess, isApproveError])

  useEffect(() => {
    (async () => {
      try {
        if (transactionNonce) {
          if (isSendTransactionError) {
            setTransactionNonce(0)
            setOnSaleLoading(false)
            notifyError(`Extending house harvest limit Error`);
          } else if (sendTransactionTx) {
            if (sendTxData) {
              if (sendTxSuccess) {
                const receipt = await PROVIDERS[chainId].getTransactionReceipt(sendTransactionTx);
      
                if (receipt.status) {
                  const { data } = await axios.post('/house/extend-house-limit', {
                    houseId: house.id,
                    assetAmount: extendLandAmount * 4,
                    txHash: receipt.transactionHash,
                    nonce: transactionNonce,
                    blockNumber: receipt.blockNumber
                  })
        
                  if (data) {
                    await refetchLand()
                    await getNftCredits()
                    await getHouse()
                    setTransactionNonce(0)
                    setOnSaleLoading(false)
                    notifySuccess(`Extended house harvest limit`)
                  }
                } else {
                  setTransactionNonce(0)
                  setOnSaleLoading(false)
                  notifyError(`Extending house harvest limit Error`);
                }
              } else {
                setTransactionNonce(0)
                setOnSaleLoading(false)
                notifyError(`Extending house harvest limit Error`);
              }
            }
          }
        }
      } catch (error) {
        setOnSaleLoading(false)
        notifyError("Transaction Failed.")
        console.log(error)
      }
    })()
  }, [transactionNonce, sendTransactionTx, sendTxData, sendTxSuccess, isSendTransactionError])

  const renameNft = async (value: string) => {
    if (value.length > 0) {
      if (value.length < 32) {
        try {
          const { data: houseData } = await axios.patch(`/house/${house.id}`, {
            name: value
          })
          setHouse((prevState: any) => ({
            ...prevState,
            ...houseData
          }))
          notifySuccess("Rename NFT successfully!");
        } catch (error: any) {
          if (error.response?.data.status == 401) {
            localStorage.removeItem("jwtToken-v2");
            disconnect();
            return notifyError(`Unautherized error`);
          } else
            return notifyError(error.response.data.message);
        }
      } else {
        return notifyError("This field maximum length is 31.");
      }
    } else {
      return notifyError("This field value is not empty.");
    }
  };

  const deactivate = async (isLoading: boolean[]) => {
    if (isLoading[3]) return
    setIsLoading([false, false, false, true, false]);

    if (!house.isActivated) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Already Deactivated");
    }

    if (house.userId != userData.id) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("You are not house owner");
    }

    try {
      const { data: houseData } = await axios.patch(`/house/${house.id}`, {
        isActivated: false,
        lastRepairTime: new Date()
      })

      setHouse((prevState: any) => ({
        ...prevState,
        ...houseData
      }))
      await getUserData();
      setIsLoading([false, false, false, false, false]);
      notifySuccess("Deactivated successfully!");
    } catch (error: any) {
      setIsLoading([false, false, false, false, false]);
      if (error.response?.data.status == 401) {
        localStorage.removeItem("jwtToken-v2");
        disconnect();
        return notifyError(`Unautherized error`);
      } else
        return notifyError(error.response.data.message);
    }
  };

  const activate = async (isLoading: boolean[]) => {
    if (isLoading[3]) return
    setIsLoading([false, false, false, true, false]);

    if (house.isActivated) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Already activated");
    }

    if (house.userId != userData.id) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("You are not house owner");
    }

    try {
      const { data: houseData } = await axios.patch(`/house/${house.id}`, {
        isActivated: true,
        lastRepairTime: new Date()
      })

      setHouse((prevState: any) => ({
        ...prevState,
        ...houseData
      }))
      await getUserData();
      setIsLoading([false, false, false, false, false]);
      notifySuccess("Activated successfully!");
    } catch (error: any) {
      setIsLoading([false, false, false, false, false]);
      if (error.response?.data.status == 401) {
        localStorage.removeItem("jwtToken-v2");
        disconnect();
        return notifyError(`Unautherized error`);
      } else
        return notifyError(error.response.data.message);
    }
  };

  const onSaleHandler = async () => {
    if (house.isActivated) {
      if (isOwn) {
        if (!onSaleLoading) {
          if (house.onSale) {
            try {
              setIsSale(false)
              const { data } = await axios.post('/house/set-sale', {
                hosueId: house.id,
                setSale: false
              })
              setApprovalForAll(chainId, false);

            } catch (error: any) {
              console.log("Setting off-sale error", error);
              setSaleOpen(false);
              notifyError(error.response.data.message);
            }
          } else {
            if (userReward[4] > 0.1) {
              setShowOnSaleAlert(true)
            } else {
              setSaleOpen(true);
            }
          }
        }
      } else {
        notifyError("You do not own this NFT.");
      }
    } else {
      notifyError("Please activate this house");
    }
  };

  const setOnSale = async (price: number) => {
    if (house.isActivated) {
      if (isOwn) {
        setOnSaleLoading(true);
        try {
          setIsSale(true)
          setSalePrice(price)
          if (isApprovedForAll) {
            await setHouseToOnSale();
          } else {
            console.log('isApprovedForAll', isApprovedForAll)
            setApprovalForAll(chainId, true);
          }
        } catch (error: any) {
          setOnSaleLoading(false);
          notifyError(error.response.data.message);
        }
      } else {
        notifyError("You do not own this NFT.");
      }
    } else {
      notifyError("Please activate this house");
    }
  };

  const setHouseToOnSale = async () => {
    try {
      approve(chainId, ADMIN_WALLET_ADDRESS[chainId], house.houseId);
    } catch (error: any) {
      console.log("Setting on-sale error", error);
      setSaleOpen(false);
      setOnSaleLoading(false);
      notifyError(error.response.data.message);
    }
  };

  const extendHarvestLimit = async (landAmount: number) => {
    try {
      if (landAmount > Number(formatEther(userLandAmount))) {
        return notifyError('Insufficient LAND amount')
      }
      if (nftCredits < landAmount * 4) {
        return notifyError(`Insufficient NFT Credits`);
      }

      const { data: transactionData } = await axios.post('/house/get-transaction-for-house-mint', {
        assetAmount: landAmount * 4
      })

      setExtendLandAmount(landAmount)
      setTransactionNonce(transactionData.nonce)
      sendTransaction(transactionData.transaction)
    } catch (error: any) {
      console.log(error)
      notifyError(error.response.data.message);
    }
  }

  return {
    activate,
    deactivate,
    renameNft,
    setOnSale,
    onSaleHandler,
    extendHarvestLimit
  }
}
