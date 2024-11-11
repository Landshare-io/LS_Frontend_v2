import { Address } from "viem";
import axios from "./nft-game-axios";
import useGetUserData from "./useGetUserData";
import useGetResource from "./useGetResource";
import useLogin from "./useLogin";
import { validateResource } from "../../../utils/helpers/validator";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useHandleFacilities(address: Address | undefined) {
  const { checkIsAuthenticated } = useLogin()
  const { facilities, setFacilities } = useGetUserData()
  const { resource, setResource, setMaxPowerLimit } = useGetResource()
  const { notifyError, notifySuccess } = useGlobalContext()

  const buyOrUpgradeFacility = async (type: number) => {
    if (!facilities[type].nextFacility) return notifyError(`Your ${facilities[type].currentFacility.name} level is max.`)

    if (await validateResource(resource, facilities[type].nextFacility?.buy.slice(2, 7))) {
      try {
        const { data } = await axios.post('/has-item/upgrade-facility', {
          nextFacilityId: facilities[type].nextFacility.id,
          currentHasItemId: facilities[type].hasFacilityId
        })

        setFacilities((prevState) => ([
          ...prevState.slice(0, type),
          {
            ...prevState[type],
            currentFacility: data.currentFacility,
            nextFacility: data.nextFacility,
            hasFacilityId: data.hasFacilityId,
          },
          ...prevState.slice(type + 1)
        ]))

        setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])
        setMaxPowerLimit((prevState) => type == 0 ? data.currentFacility.rewardLimit[2] : prevState)
        return notifySuccess(`Upgraded ${data.currentFacility.name} successfully!`)
      } catch (error: any) {
        if (error.response?.data.status == 401) {
          checkIsAuthenticated(address)
        } else
          return notifyError(error.response.data.message);
      }
    } else {
      return notifyError('Insufficient resources.')
    }
  }

  return { buyOrUpgradeFacility }
}
