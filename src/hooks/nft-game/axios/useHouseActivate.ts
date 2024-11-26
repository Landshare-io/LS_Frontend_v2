import { useDisconnect } from "wagmi";
import axios from "./nft-game-axios";
import useGetHouses from "./useGetHouses";
import useGetUserData from "./useGetUserData";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useHouseActivate(setIsActivating: Function) {
  const { disconnect } = useDisconnect()
  const { notifyError, notifySuccess } = useGlobalContext()
  const { houses, getHouses } = useGetHouses()
  const { userData, getUserData } = useGetUserData()

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

    try {
      await axios.patch(`/house/${house.id}`, {
        isActivated: true,
        lastRepairTime: new Date()
      })

      await getHouses();
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