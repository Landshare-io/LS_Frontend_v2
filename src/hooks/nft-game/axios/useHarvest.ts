import { useDisconnect } from "wagmi";
import numeral from "numeral";
import axios from "./nft-game-axios";
import { validateResource } from "../../../utils/helpers/validator";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetGameItems from "./useGetGameItems";
import useGetResource from "./useGetResource";


export default function useHarvest(setHarvestLoading: Function) {
  const { disconnect } = useDisconnect()
  const { notifyError, notifySuccess } = useGlobalContext()
  const { userReward, resource, setUserReward, setResource } = useGetResource()
  const { boostItemsList } = useGetGameItems()

  const harvest = async (landRemaining: number, totalHarvestCost: number, selectedResource: boolean[], setSelectedResource: Function) => {
    if (totalHarvestCost === 0) {
      setHarvestLoading(false);
      return notifyError("Select resources to harvest");
    }

    if (selectedResource[4] && (landRemaining === 0 || userReward[4] > landRemaining)) {
      setHarvestLoading(false);
      return notifyError("No harvest allowed")
    }

    setHarvestLoading(true);
    if (await validateResource(resource, [totalHarvestCost, 0, 0, 0, 0])) {
      try {
        const pastUserReward = userReward

        const { data } = await axios.post(`/user-reward/harvest`, {
          harvestItem: [...selectedResource, selectedResource[4] ? pastUserReward[4] : 0]
        })

        const harvestMessages: any[] = []
        selectedResource.map((sR, type) => {
          if (sR) {
            harvestMessages.push(`${numeral(pastUserReward[type]).format('0.[00]')} ${boostItemsList[type].name.split(' ')[0]}`)
          }
        })

        setResource([data.resourceData.power, data.resourceData.lumber, data.resourceData.brick, data.resourceData.concrete, data.resourceData.steel])
        setUserReward([data.userReward.lumber, data.userReward.brick, data.userReward.concrete, data.userReward.steel, data.userReward.token])
        setSelectedResource([false, false, false, false, false])
        setHarvestLoading(false);

        return notifySuccess(harvestMessages.join(', ') + ' harvested successfully.')
      } catch (error: any) {
        setHarvestLoading(false);
        console.log(error.response.data.message, error)
        if (error.response?.data.status == 401) {
          localStorage.removeItem("jwtToken-v2");
          disconnect();
          return notifyError(`Unautherized error`);
        } else
          return notifyError(error.response.data.message);
      }
    } else {
      setHarvestLoading(false);
      return notifyError("Not enough resource");
    }
  }

  return {
    harvest
  }
}
