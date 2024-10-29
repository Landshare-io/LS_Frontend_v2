import { useState } from "react";
import axios from "./nft-game-axios";

export default function useGetUserData() {
  const [userData, setUserData] = useState({
    activatedSlots: 2,
    depositedBalance: 0,
  });
  const [facilities, setFacilities] = useState<any[]>([])

  const getUserData = async () => {
    try {
      const { data: userInfo } = await axios.get(`/user/get-detail`)
      const { data: facilityData } = await axios.get(`/user/facility`)

      setUserData(userInfo)
      setFacilities(facilityData)
    } catch (error: any) {
      console.log(error.response.data.message, error)
    }
  }

  return {
    userData,
    facilities,
    getUserData
  }
}
