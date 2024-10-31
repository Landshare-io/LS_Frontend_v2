import { useDisconnect } from "wagmi";
import axios from "./nft-game-axios";
import useGetUserData from "./useGetUserData";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useHandleHouse(house: any, setHouse: Function, setIsLoading: Function) {
  const { disconnect } = useDisconnect();
  const { userData, getUserData } = useGetUserData()
  const { notifyError, notifySuccess } = useGlobalContext()

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

  return {
    activate,
    deactivate,
    renameNft
  }
}