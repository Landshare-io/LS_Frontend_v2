import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";

let userDataState = {
  id: null,
  activatedSlots: 2,
  depositedBalance: 0,
}
let facilitiesState: any[] = []

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetUserData() {
  const [userData, setUserData] = useState(userDataState);
  const [facilities, setFacilities] = useState<any[]>(facilitiesState)
  const { isAuthenticated } = useGlobalContext()

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setUserData(userDataState)
      setFacilities(facilitiesState)
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateUserData = (newUserData: any) => {
    userDataState = newUserData;
    notifySubscribers();
  };

  const updateFacilities = (newFacilities: any[]) => {
    facilitiesState = newFacilities;
    notifySubscribers();
  };

  const getUserData = async () => {
    try {
      const { data: userInfo } = await axios.get(`/user/get-detail`)
      const { data: facilityData } = await axios.get(`/user/facility`)

      updateUserData(userInfo)
      updateFacilities(facilityData.sort((a: any, b: any) => a.sortingId - b.sortingId))
    } catch (error: any) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     getUserData()
  //   }
  // }, [isAuthenticated])

  return {
    userData,
    facilities,
    getUserData,
    setFacilities: updateFacilities,
    setUserData: updateUserData
  }
}
