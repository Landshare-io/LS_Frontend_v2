import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useGetSetting() {
  const { isAuthenticated } = useGlobalContext()
  const [oneDayTime, setOneDayTime] = useState(86400)
  const [harvestCost, setHarvestCost] = useState(20)
  const [premiumAbleTime, setPremiumAbleTime] = useState(7776000)
  const [premiumAttachPrice, setPremiumAttachPrice] = useState(5)
  const [houseSlots, setHouseSlots] = useState(5)
  const [userActivatedSlots, setUserActivatedSlots] = useState(2)
  const [buySlotCost, setBuySlotCost] = useState(15)
  const [minAssetAmount, setMinAssetAmount] = useState(200)
  const [withdrawStakedCost, setWithdrawStakedCost] = useState('25,0,0,0,0')
  const [powerPerLumber, setPowerPerLumber] = useState(15);
  const [powerPerLandtoken, setPowerPerLandtoken] = useState(50);

  useEffect(() => {
    if (isAuthenticated) {
      getGameSetting()
    }
  }, [isAuthenticated])

  const getGameSetting = async () => {
    try {
      if (!isAuthenticated) return
      const { data } = await axios.get('/setting/get-one-day')
      const { data: powerLand } = await axios.get('/user/buy-power-cost')
      const { data: harvestData } = await axios.get('/setting/get-harvest-cost')
      const { data: premiumNftAbleTime } = await axios.get('/setting/get-premium-able-time')
      const { data: premiumNftAttachPrice } = await axios.get('/setting/get-premium-attach-price')
      const { data: getMaxHouseSlots } = await axios.get('/setting/get-max-house-slots');
      const { data: activatedSlots } = await axios.get('/user/activated-slots');
      const { data: getSlotCost } = await axios.get('/setting/get-buy-slot-cost');
      const { data: getMinAssetAmount } = await axios.get('/setting/minium-asset-amount')
      const { data: getWithdrawStakedCost } = await axios.get('/setting/withdraw-asset-token-cost')
      const { data: gatherPowerCost } = await axios.get('/setting/get-gather-power-cost');

      setOneDayTime(data.value)
      setHarvestCost(Number(harvestData))
      setPremiumAbleTime(Number(premiumNftAbleTime))
      setPremiumAttachPrice(Number(premiumNftAttachPrice))
      setHouseSlots(Number(getMaxHouseSlots))
      setUserActivatedSlots(Number(activatedSlots))
      setBuySlotCost(Number(getSlotCost))
      setMinAssetAmount(Number(getMinAssetAmount))
      setWithdrawStakedCost(getWithdrawStakedCost)
      setPowerPerLumber(Number(gatherPowerCost.value))
      setPowerPerLandtoken(powerLand)
    } catch (error: any) {
      console.log(error.response.data.message, error)
    }
  }

  return {
    oneDayTime,
    harvestCost,
    premiumAbleTime,
    premiumAttachPrice,
    houseSlots,
    userActivatedSlots,
    buySlotCost,
    minAssetAmount,
    withdrawStakedCost,
    powerPerLumber,
    powerPerLandtoken,
    getGameSetting
  }
}
