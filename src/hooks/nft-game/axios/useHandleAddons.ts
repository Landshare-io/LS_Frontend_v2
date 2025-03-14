import { useEffect, useState } from "react";
import { useDisconnect, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";
import axios from "./nft-game-axios";
import { 
  getItemDurationWithDeadTime,
  validateItemDateWithDeadTime,
  validateResource,
  validateItemDate,
  validateDependency
} from "../../../utils/helpers/validator";
import useGetSetting from "./useGetSetting";
import useGetResource from "./useGetResource";
import useBalanceOfLand from "../../contract/LandTokenContract/useBalanceOf"
import { useGlobalContext } from "../../../context/GlobalContext";
import { PROVIDERS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments";

export default function useHandleAddons(chainId: number, address: Address | undefined, house: any, setHouse: Function, setIsLoading: Function) {
  const { disconnect } = useDisconnect()
  const { notifyError, notifySuccess } = useGlobalContext()
  const { resource, setResource } = useGetResource()
  const { oneDayTime } = useGetSetting()
  const { refetch: refetchBalance } = useBalanceOfLand({ chainId, address })
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()
  const [signNonce, setSignNonce] = useState(0)
  const [handleItem, setHandleItem] = useState<any>({})

  const { isSuccess: sendTxSuccess } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: sendTransactionTx,
    chainId: chainId
  });

  useEffect(() => {
    (async () => {
      if (signNonce) {
        if (isSendTransactionError) {
          setSignNonce(0)
          setIsLoading({ type: -1, loading: false });
          notifyError(`Buy ${handleItem.name} Error`);
        } else if (sendTransactionTx) {
          if (sendTxSuccess) {
            try {
                const { data } = await axios.post('/has-item/buy-item-with-land', {
                  houseId: house.id,
                  itemId: handleItem.id,
                  hasItemId: handleItem.hasItemId,
                  nonce: signNonce
                })
  
                await refetchBalance()
                setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])
      
                setHouse((prevState: any) => ({
                  ...prevState,
                  yieldUpgrades: data.yieldUpgrades,
                  lastDurability: data.lastDurability,
                  multiplier: data.multiplier,
                  maxDurability: data.maxDurability
                }))
                setSignNonce(0)
                setIsLoading({ type: -1, loading: false });
                notifySuccess(`${handleItem.name} purchased successfully`)
            } catch (error: any) {
              console.log(`Buy ${handleItem.name} Error: `, error);
              setSignNonce(0)
              setIsLoading({ type: -1, loading: false });
              notifyError(`Buy ${handleItem.name} Error`);
            }
          }
        }
      }
    })()
  }, [isSendTransactionError, signNonce, sendTransactionTx, sendTxSuccess])

  const handleFireplace = async (isOwn: boolean, item: any, lumberCount: number) => {
    setIsLoading({ type: item.id, loading: true });
    let cost
    if (validateItemDateWithDeadTime(item) == -1) {
      cost = item.buy.slice(2, 7)
    } else {
      cost = [0, lumberCount, 0, 0, 0];
    }

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

    const firepitRemainDays = getItemDurationWithDeadTime(item, oneDayTime)
    if (Number(firepitRemainDays) > item.buy[10]) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Exceed Frontload Lumbers");
    }

    if (await validateResource(resource, cost)) {
      if ((validateItemDateWithDeadTime(item) == -1) || Number(lumberCount) > 0) {
        if (Number(lumberCount) + Number(firepitRemainDays) <= item.buy[10]) {
          try {
            const { data } = await axios.post(`/has-item/yield-fireplace`, {
              houseId: house.id,
              itemId: item.id,
              hasItemId: item.hasItemId,
              lumberCount: lumberCount
            })
  
            setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])
    
            setHouse((prevState: any) => ({
              ...prevState,
              yieldUpgrades: data.yieldUpgrades,
              lastDurability: data.lastDurability,
              multiplier: data.multiplier,
              maxDurability: data.maxDurability
            }))
            setIsLoading({ type: -1, loading: false });
  
            notifySuccess(`Updated ${data.name} status successfully`)
          } catch (error: any) {
            console.log(error)
            notifyError(error.response.data.message)
          }
        } else {
          setIsLoading({ type: -1, loading: false });
          notifyError(`Max lumber limit is ${item.buy[10]}.`);
        }
      } else {
        setIsLoading({ type: -1, loading: false });
        notifyError("Min lumber count is 1.");
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      notifyError("Not enough resource");
    }
  }

  const fertilizeGardenAction = async (isOwn: boolean, item: any) => {
    setIsLoading({ type: 2, isLoading: true });

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

    if (!validateItemDate(house.yieldUpgrades.filter((yItem: any) => yItem.name == 'Garden' && yItem.specialButtonName == '')[0], oneDayTime)) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Garden shoule be active");
    }

    if (await validateResource(resource, item.buy.slice(2, 7))) {
      try {
        const { data } = await axios.post('/has-item/buy-yield', {
          houseId: house.id,
          itemId: item.id,
          hasItemId: item.hasItemId
        })

        setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

        setHouse((prevState: any) => ({
          ...prevState,
          yieldUpgrades: data.yieldUpgrades,
          lastDurability: data.lastDurability,
          multiplier: data.multiplier,
          maxDurability: data.maxDurability
        }))
        setIsLoading({ type: -1, loading: false });

        notifySuccess(`Fertilize ${data.name} successfully`)
      } catch (error: any) {
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

  const buyAddon = async (isOwn: boolean, item: any) => {
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

    if (validateDependency(house, item.id, oneDayTime)) {
      if (await validateResource(resource, item.buy.slice(2, 7))) {
        try {
          const { data } = await axios.post('/has-item/buy-yield', {
            houseId: house.id,
            itemId: item.id,
            hasItemId: item.hasItemId
          })

          setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

          setHouse((prevState: any) => ({
            ...prevState,
            yieldUpgrades: data.yieldUpgrades,
            lastDurability: data.lastDurability,
            multiplier: data.multiplier,
            maxDurability: data.maxDurability
          }))
          setIsLoading({ type: -1, loading: false });
          notifySuccess(`${data.name} purchased successfully`)
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

  const salvageAddon = async (isOwn: boolean, addonId: number, hasSalvageAddonId: number) => {
    setIsLoading({ type: addonId, loading: true });

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

    if (house.yieldUpgrades.filter((yItem: any) => yItem.id == addonId).length < 1) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Addon doesn't exist");
    } 

    if (house.yieldUpgrades.filter((yItem: any) => yItem.hasItemId == hasSalvageAddonId).length < 1) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("You didn't buy this addon item.");
    } 

    if (house.deadTime) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("House is inactive or on sale");
    }

    if (await validateResource(resource, house.yieldUpgrades.filter((yItem: any) => yItem.hasItemId == hasSalvageAddonId)[0].sell.slice(2, 7))) {
      try {
        const { data } = await axios.post('/has-item/sell-yield', {
          houseId: house.id,
          itemId: addonId,
          hasItemId: hasSalvageAddonId
        })

        setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

        setHouse((prevState: any) => ({
          ...prevState,
          yieldUpgrades: data.yieldUpgrades,
          lastDurability: data.lastDurability,
          multiplier: data.multiplier,
          maxDurability: data.maxDurability
        }))
        setIsLoading({ type: -1, loading: false });
        notifySuccess(`Salvage ${data.name} successfully`)
      } catch (error: any) {
        console.log(error)
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

  const buyTreeAddonHandler = async (item: any) => {
    try {
      setHandleItem(item)
      const { data: transactionData } = await axios.post('/has-item/get-item-transaction', {
        itemId: item.id
      })

      setSignNonce(transactionData.nonce)
      sendTransaction(transactionData.transaction)
    } catch (error) {
      console.log("Buy Tree Addon Error: ", error);
      setIsLoading({ type: -1, loading: false });
      notifyError("Buy Tree Addon Error");
    }
  };

  return {
    buyAddon,
    handleFireplace,
    fertilizeGardenAction,
    salvageAddon,
    buyTreeAddonHandler
  }
}