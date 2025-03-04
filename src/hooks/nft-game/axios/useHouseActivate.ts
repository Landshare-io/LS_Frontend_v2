import { useDisconnect } from "wagmi";
import axios from "./nft-game-axios";
import useGetHouses from "./useGetHouses";
import useGetUserData from "./useGetUserData";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetSetting from "./useGetSetting";

export default function useHouseActivate(setIsActivating: Function) {
  const { disconnect } = useDisconnect()
  const { notifyError, notifySuccess } = useGlobalContext()
  const { houses, getHouses } = useGetHouses()
  const { userData, getUserData } = useGetUserData()
  const { getLandRemaining } = useGetSetting()

  const activate = async (house: any) => {
    setIsActivating(true)

    if (house.isActivated) {
      setIsActivating(false)
      return notifyError("Already activated");
    }

    if (house.userId != userData.id) {
      setIsActivating(false)
      return notifyError("You are not house owner");
    }

    if (house.isActivated) {
      setIsActivating(false)
      return notifyError("You have already activated this house type");
    }

    const hTypeItems: number[] = []
    if (house.type == 1 || house.type == 2) {
      hTypeItems.push(1)
      hTypeItems.push(2)
    } else if (house.type == 3 || house.type == 4) {
      hTypeItems.push(3)
      hTypeItems.push(4)
    } else if (house.type == 5 || house.type == 6) {
      hTypeItems.push(5)
      hTypeItems.push(6)
    }

    if (houses.filter(hItem => hTypeItems.includes(hItem.type) && hItem.isActivated).length > 0) {
      setIsActivating(false)
      return notifyError("You have already activated this house type");
    }

    try {
      await axios.patch(`/house/${house.id}`, {
        isActivated: true,
        lastRepairTime: new Date()
      })

      await getHouses();
      await getLandRemaining();
      await getUserData();
      setIsActivating(false)
      return notifySuccess("Activated successfully!");
    } catch (error: any) {
      console.log(error)
      setIsActivating(false)
      if (error.response?.data.status == 401) {
        localStorage.removeItem("jwtToken-v2");
        disconnect();
        return notifyError(`Unautherized error`);
      } else
        return notifyError(error.response.data.message);
    }
  };

  return { activate }
}