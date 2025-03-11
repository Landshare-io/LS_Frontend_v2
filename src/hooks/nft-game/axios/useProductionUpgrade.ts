import { useEffect, useState } from "react";
import { useDisconnect, useChainId } from "wagmi";
import { BigNumberish, formatEther } from "ethers";
import { Address } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import axios from "./nft-game-axios";
import useGetResource from "./useGetResource";
import useBalanceOfLandToken from "../../contract/LandTokenContract/useBalanceOf";
import { validateResource, validateItemDate, validateDependency } from "../../../utils/helpers/validator";
import { useGlobalContext } from "../../../context/GlobalContext";
import { PROVIDERS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments";

export default function useProductionUpgrade(house: any, setHouse: Function, address: Address | undefined, setIsLoading: Function) {
  const [handymanItem, setHandymanItem] = useState<any>({})
  const [transactionNonce, setTransactionNonce] = useState(0)
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { notifyError, notifySuccess } = useGlobalContext()
  const { resource, setResource, maxPowerLimit } = useGetResource()
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()
  const { isSuccess: sendTxSuccess, data: sendTxData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: sendTransactionTx,
    chainId: chainId
  });
  const { data: landTokenBalance, refetch: refetchLandBalance } = useBalanceOfLandToken({ chainId, address }) as { data: BigNumberish, refetch: Function }

  useEffect(() => {
    (async () => {
      try {
        if (transactionNonce) {
          if (isSendTransactionError) {
            setIsLoading({ type: -1, loading: false });
            setTransactionNonce(0)
            notifyError("Buy Addon Error");
          } else if (sendTransactionTx) {
            if (sendTxData) {
              if (sendTxSuccess) {
                const receipt = await PROVIDERS[chainId].getTransactionReceipt(sendTransactionTx);
        
                if (receipt.status) {
                  const { data } = await axios.post('/has-item/buy-item-with-land', {
                    houseId: house.id,
                    itemId: handymanItem.id,
                    hasItemId: handymanItem.hasItemId,
                    txHash: receipt.transactionHash,
                    blockNumber: receipt.blockNumber,
                    nonce: transactionNonce
                  })
        
                  setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])
                  await refetchLandBalance()
                  setHouse((prevState: any) => ({
                    ...prevState,
                    productionUpgrades: data.productionUpgrades,
                    lastDurability: data.lastDurability,
                    multiplier: data.multiplier,
                    maxDurability: data.maxDurability
                  }))
                  setTransactionNonce(0)
                  setIsLoading({ type: -1, loading: false });
                  notifySuccess(`${handymanItem.name} purchased successfully`)
                } else {
                  setIsLoading({ type: -1, loading: false });
                  setTransactionNonce(0)
                  notifyError("Buy Addon Error");
                }
              } else {
                setIsLoading({ type: -1, loading: false });
                setTransactionNonce(0)
                notifyError("Buy Addon Error");
              }
            }
          }
        }
      } catch (error) {
        setIsLoading({ type: -1, loading: false });
        setTransactionNonce(0)
        notifyError("Buy Addon Error");
      }
    })()
  }, [transactionNonce, sendTransactionTx, sendTxData, sendTxSuccess])

  const buyToolshed = async (toolshed: any) => {
    setIsLoading({ type: toolshed.id, loading: true });

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please Activate First");
    }

    if (house.deadTime) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("House is inactive or on sale");
    }

    if (await validateResource(resource, toolshed.buy.slice(2, 7))) {
      try {
        const { data } = await axios.post('/has-item/buy-toolshed', {
          houseId: house.id,
          itemId: toolshed.id,
          repairAmount: house.maxDurability - house.lastDurability
        })

        setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

        setHouse((prevState: any) => ({
          ...prevState,
          productionUpgrades: data.productionUpgrades,
          activeToolshedType: data.activeToolshedType,
          repairCost: data.repairCost
        }))
        setIsLoading({ type: -1, loading: false });
      } catch (error: any) {
        setIsLoading({ type: -1, loading: false });
        if (error.response?.data.status == 401) {
          localStorage.removeItem("jwtToken-v2");
          disconnect();
          return notifyError(`Unautherized error`);
        } else
          return notifyError(error.response.data.message);
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      notifyError("Not enough resource");
    }
  };

  const switchToolshed = async (toolshed: any) => {
    setIsLoading({ type: toolshed.id, loading: true });

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please Activate First");
    }

    if (house.deadTime) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("House is inactive or on sale");
    }

    if (!toolshed.hasItemId) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Did not buy yet");
    }

    if (house.activeToolshedType == toolshed.id) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Already actived this one.");
    }

    if (await validateResource(resource, toolshed.sell.slice(2, 7))) {
      try {
        const { data } = await axios.post('/has-item/switch-toolshed', {
          houseId: house.id,
          itemId: toolshed.id,
          repairAmount: house.maxDurability - house.lastDurability
        })

        setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

        setHouse((prevState: any) => ({
          ...prevState,
          productionUpgrades: data.productionUpgrades,
          activeToolshedType: data.activeToolshedType,
          repairCost: data.repairCost
        }))
        setIsLoading({ type: -1, loading: false });
      } catch (error: any) {
        setIsLoading({ type: -1, loading: false });
        if (error.response?.data.status == 401) {
          localStorage.removeItem("jwtToken-v2");
          disconnect();
          return notifyError(`Unautherized error`);
        } else
          return notifyError(error.response.data.message);
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      notifyError("Not enough resource");
    }
  };

  const hireHandymanAction = async (item: any, isOwn: boolean, oneDayTime: number) => {
    setIsLoading({ type: item.id, loading: true });

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please Activate First");
    }

    if (!isOwn) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("You are not an owner of this house");
    }

    if (house.deadTime) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("House is inactive or on sale");
    }

    if (validateItemDate(item, oneDayTime)) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("You've already buy this addon");
    }

    if (house.currentDurability < house.maxDurability) {
      const amount = item.buy[1]

      if (await validateResource(resource, item.buy.slice(2, 7))) {
        if (Number(amount) > Number(formatEther(landTokenBalance.toString()))) {
          setIsLoading({ type: -1, loading: false });
          return notifyError("Not enough LAND tokens");
        } else {
          await hireHandymanCall(item);
        }
      } else {
        setIsLoading({ type: -1, loading: false });
        notifyError("Not enough resource");
      }
    }
  };

  const hireHandymanCall = async (item: any) => {
    try {
      setHandymanItem(item)
      const { data: transactionData } = await axios.post('/has-item/get-item-transaction', {
        itemId: item.id
      })
      
      setTransactionNonce(transactionData.nonce)
      await sendTransaction(transactionData.transaction)
    } catch (error: any) {
      console.log("Buy Addon Error: ", error);
      setIsLoading({ type: -1, loading: false });
      notifyError(error.response.data.message);
    }
  };

  const buyProductionItem = async (item: any, oneDayTime: number) => {
    setIsLoading({ type: item.id, loading: true });

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please Activate First");
    }

    if (house.deadTime) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("House is inactive or on sale");
    }

    if (validateItemDate(item, oneDayTime)) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("You've already buy this addon");
    }

    if (validateDependency(house, item.id, oneDayTime)) {
      if (await validateResource(resource, item.buy.slice(2, 7))) {
        try {
          const { data } = await axios.post(`/has-item/buy-yield`, {
            houseId: house.id,
            itemId: item.id,
            hasItemId: item.hasItemId
          })
          setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

          let repairCost = house.repairCost
          if (item.name == "Generator") {
            const { data: updatedCost } = await axios.post(`/house/get-repair-cost/${house.id}`, {
              repairPercent: house.maxDurability - house.lastDurability
            })
            repairCost = updatedCost.repairCost
          }
          setHouse((prevState: any) => ({
            ...prevState,
            productionUpgrades: data.productionUpgrades,
            lastDurability: data.lastDurability,
            maxDurability: Number(prevState.maxDurability) + Number(item.buyReward[8] * 100),
            repairCost: repairCost
          }))
          
          setIsLoading({ type: -1, loading: false });
        } catch (error: any) {
          setIsLoading({ type: -1, loading: false });
          if (error.response?.data.status == 401) {
            localStorage.removeItem("jwtToken-v2");
            disconnect();
            return notifyError(`Unautherized error`);
          } else
            return notifyError(error.response.data.message);
        }
      } else {
        setIsLoading({ type: -1, loading: false });
        notifyError("Not enough resource");
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      notifyError("Requires dependency");
    }
  };

  const repairConcreteFoundation = async (concreateItem: any, repairItem: any, oneDayTime: number) => {
    setIsLoading({ type: repairItem.id, loading: true });

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please Activate First");
    }

    if (house.deadTime) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("House is inactive or on sale");
    }

    let cost
    if (validateItemDate(concreateItem, oneDayTime)) {
      cost = repairItem.buy.slice(2, 7)
    } else {
      cost = concreateItem.buy.slice(2, 7)
    }

    if (validateDependency(house, repairItem.id, oneDayTime)) {
      if (await validateResource(resource, cost)) {
        try {
          const { data } = await axios.post(`/has-item/repair-concrete-foundation`, {
            houseId: house.id,
            repairItemId: repairItem.id,
            hasRepairItemId: repairItem.hasItemId,
            hasFoundationId: concreateItem.hasItemId,
            foundationId: concreateItem.id,
          })
          setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

          setHouse((prevState: any) => ({
            ...prevState,
            productionUpgrades: data.productionUpgrades
          }))
          setIsLoading({ type: -1, loading: false });
        } catch (error: any) {
          setIsLoading({ type: -1, loading: false });
          if (error.response?.status == 401) {
            localStorage.removeItem("jwtToken-v2");
            disconnect();
            return notifyError(`Unautherized error`);
          } else
            return notifyError(error.response.data.message);
        }
      } else {
        setIsLoading({ type: -1, loading: false });
        notifyError("Not enough resource");
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      notifyError("Requires dependency");
    }
  }

  const buyProductionOfUser = async (item: any, oneDayTime: number) => {
    setIsLoading({ type: item.id, loading: true });

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please Activate First");
    }

    if (house.deadTime) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("House is inactive or on sale");
    }

    if (validateItemDate(item, oneDayTime)) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("You've already buy this addon");
    }

    if (validateDependency(house, item.id, oneDayTime)) {
      if (await validateResource(resource, item.buy.slice(2, 7))) {
        try {
          const { data } = await axios.post(`/has-item/buy-production-of-user`, {
            houseId: house.id,
            itemId: item.id
          })
          setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

          setHouse((prevState: any) => ({
            ...prevState,
            productionUpgrades: data.productionUpgrades
          }))
          setIsLoading({ type: -1, loading: false });
        } catch (error: any) {
          setIsLoading({ type: -1, loading: false });
          if (error.response?.data.status == 401) {
            localStorage.removeItem("jwtToken-v2");
            disconnect();
            return notifyError(`Unautherized error`);
          } else
            return notifyError(error.response.data.message);
        }
      } else {
        setIsLoading({ type: -1, loading: false });
        notifyError("Not enough resource");
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      notifyError("Requires dependency");
    }
  };

  const burnLumber = async (lumber: number, item: any, oneDayTime: number) => {
    setIsLoading({ type: item.id, loading: true });

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please Activate First");
    }

    if (house.deadTime) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("House is inactive or on sale");
    }

    if (lumber < 1) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Burning lumber count should be more than 1.");
    }

    if ((Number(resource[0]) + Number(lumber * item.buyReward[2])) > Number(maxPowerLimit)) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Couldn't more than max power limit.");
    }

    if (validateDependency(house, item.id, oneDayTime)) {
      if (await validateResource(resource, [0, lumber, 0, 0, 0])) {
        try {
          const { data } = await axios.post(`/has-item/burn-lumber-for-power`, {
            lumber,
            itemId: item.id
          })
          setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

          setIsLoading({ type: -1, loading: false });
        } catch (error: any) {
          setIsLoading({ type: -1, loading: false });
          if (error.response?.data.status == 401) {
            localStorage.removeItem("jwtToken-v2");
            disconnect();
            return notifyError(`Unautherized error`);
          } else
            return notifyError(error.response.data.message);
        }
      } else {
        setIsLoading({ type: -1, loading: false });
        notifyError("Not enough resource");
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      notifyError("Requires dependency");
    }
  };

  return {
    burnLumber,
    buyToolshed,
    switchToolshed,
    hireHandymanAction,
    buyProductionItem,
    repairConcreteFoundation,
    buyProductionOfUser
  }
}