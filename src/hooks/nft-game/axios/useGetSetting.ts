import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";

let oneDayTimeState = 864000
let harvestCostState = 20
let premiumAbleTimeState = 7776000
let premiumAttachPriceState = 5
let houseSlotsState = 5
let userActivatedSlotsState = 2
let buySlotCostState = 15
let minAssetAmountState = 200
let withdrawStakedCostState = '25,0,0,0,0'
let powerPerLumberState = 15; 
let powerPerLandtokenState = 50; 
let premiumMintCapState = {
  "Porcelain Tile": 25,
  "Pool Table": 25,
  "Marble Countertops": 25,
}

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetSetting() {
  const { isAuthenticated } = useGlobalContext()
  const [oneDayTime, setOneDayTime] = useState(oneDayTimeState)
  const [harvestCost, setHarvestCost] = useState(harvestCostState)
  const [premiumAbleTime, setPremiumAbleTime] = useState(premiumAbleTimeState)
  const [premiumAttachPrice, setPremiumAttachPrice] = useState(premiumAttachPriceState)
  const [houseSlots, setHouseSlots] = useState(houseSlotsState)
  const [userActivatedSlots, setUserActivatedSlots] = useState(userActivatedSlotsState)
  const [buySlotCost, setBuySlotCost] = useState(buySlotCostState)
  const [minAssetAmount, setMinAssetAmount] = useState(minAssetAmountState)
  const [withdrawStakedCost, setWithdrawStakedCost] = useState(withdrawStakedCostState)
  const [powerPerLumber, setPowerPerLumber] = useState(powerPerLumberState);
  const [powerPerLandtoken, setPowerPerLandtoken] = useState(powerPerLandtokenState);
  const [premiumMintCap, setPremiumMintCap] = useState(premiumMintCapState);

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setOneDayTime(oneDayTimeState)
      setHarvestCost(harvestCostState)
      setPremiumAbleTime(premiumAbleTimeState)
      setPremiumAttachPrice(premiumAttachPriceState)
      setHouseSlots(houseSlotsState)
      setUserActivatedSlots(userActivatedSlotsState)
      setBuySlotCost(buySlotCostState)
      setMinAssetAmount(minAssetAmountState)
      setWithdrawStakedCost(withdrawStakedCostState)
      setPowerPerLumber(powerPerLumberState)
      setPowerPerLandtoken(powerPerLandtokenState)
      setPremiumMintCap(premiumMintCapState)
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateOneDayTime = (newOneDayTime: number) => {
    oneDayTimeState = newOneDayTime;
    notifySubscribers();
  };

  const updateHarvestCost = (newHarvestCost: number) => {
    harvestCostState = newHarvestCost;
    notifySubscribers();  
  };

  const updatePremiumAbleTime = (newPremiumAbleTime: number) => {
    premiumAbleTimeState = newPremiumAbleTime;
    notifySubscribers();  
  };

  const updatePremiumAttachPrice = (newPremiumAttachPrice: number) => {
    premiumAttachPriceState = newPremiumAttachPrice;
    notifySubscribers();  
  };

  const updateHouseSlots = (newHouseSlots: number) => {
    houseSlotsState = newHouseSlots;
    notifySubscribers();  
  };

  const updateUserActivatedSlots = (newUserActivatedSlots: number) => {
    userActivatedSlotsState = newUserActivatedSlots;
    notifySubscribers();  
  };

  const updateBuySlotCost = (newBuySlotCost: number) => {
    buySlotCostState = newBuySlotCost;
    notifySubscribers();  
  };

  const updateMinAssetAmount = (newMinAssetAmount: number) => {
    minAssetAmountState = newMinAssetAmount;
    notifySubscribers();  
  };

  const updateWithdrawStakedCost = (newWithdrawStakedCost: string) => {
    withdrawStakedCostState = newWithdrawStakedCost;
    notifySubscribers();  
  };

  const updatePowerPerLumber = (newPowerPerLumber: number) => {
    powerPerLumberState = newPowerPerLumber;
    notifySubscribers();  
  };

  const updatePowerPerLandtoken = (newPowerPerLandtoken: number) => {
    powerPerLandtokenState = newPowerPerLandtoken;
    notifySubscribers();  
  };

  const updatePremiumMintCap = (newPremiumMintCap: any) => {
    premiumMintCapState = newPremiumMintCap;
    notifySubscribers();  
  };

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
      const { data: prCap } = await axios.get('/setting/porcelain-tile-cap');
      const { data: mcCap } = await axios.get('/setting/marble-counterops-cap');
      const { data: ptCap } = await axios.get('/setting/pool-table-cap');

      updateOneDayTime(data.value)
      updateHarvestCost(Number(harvestData))
      updatePremiumAbleTime(Number(premiumNftAbleTime))
      updatePremiumAttachPrice(Number(premiumNftAttachPrice))
      updateHouseSlots(Number(getMaxHouseSlots))
      updateUserActivatedSlots(Number(activatedSlots))
      updateBuySlotCost(Number(getSlotCost))
      updateMinAssetAmount(Number(getMinAssetAmount))
      updateWithdrawStakedCost(getWithdrawStakedCost)
      updatePowerPerLumber(Number(gatherPowerCost.value))
      updatePowerPerLandtoken(powerLand)
      updatePremiumMintCap({
        "Porcelain Tile": prCap,
        "Pool Table": ptCap,
        "Marble Countertops": mcCap,
      })
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
    premiumMintCap,
    getGameSetting,
    setOneDayTime: updateOneDayTime,
    setHarvestCost: updateHarvestCost,
    setPremiumAbleTime: updatePremiumAbleTime,
    setPremiumAttachPrice: updatePremiumAttachPrice,
    setHouseSlots: updateHouseSlots,
    setUserActivatedSlots: updateUserActivatedSlots,
    setBuySlotCost: updateBuySlotCost,
    setMinAssetAmount: updateMinAssetAmount,
    setWithdrawStakedCost: updateWithdrawStakedCost,
    setPowerPerLumber: updatePowerPerLumber,
    setPowerPerLandtoken: updatePowerPerLandtoken,
    setPremiumMintCa: updatePremiumMintCap
  }
}
