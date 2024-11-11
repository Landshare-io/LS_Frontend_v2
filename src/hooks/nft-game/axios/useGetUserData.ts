import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useGetUserData() {
  const [userData, setUserData] = useState({
    id: null,
    activatedSlots: 2,
    depositedBalance: 0,
  });
  const [facilities, setFacilities] = useState<any[]>([])
  const { isAuthenticated } = useGlobalContext()

  const getUserData = async () => {
    try {
      const { data: userInfo } = await axios.get(`/user/get-detail`)
      const { data: facilityData } = await axios.get(`/user/facility`)

      setUserData(userInfo)
      setFacilities(facilityData.sort((a: any, b: any) => a.sortingId - b.sortingId))
    } catch (error: any) {
      console.log(error.response.data.message, error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getUserData()
    }
  }, [isAuthenticated])

  return {
    userData,
    facilities,
    getUserData,
    setFacilities,
    setUserData
  }
}
