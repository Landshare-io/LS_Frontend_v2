import { useDisconnect } from "wagmi";
import axios from "./nft-game-axios";
import { validateResource } from "../../../utils/helpers/validator";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetResource from "./useGetResource";

export default function useBuyOverdrive(setIsLoading: Function) {
  const { disconnect } = useDisconnect();
  const { notifyError, notifySuccess } = useGlobalContext()
  const {resource, setResource, boostItem, setBoostItem} = useGetResource()

  const buyOverdrive = async (selectedOverdrive: any, setSelectedOverdrive: Function) => {
    if (await validateResource(resource, selectedOverdrive.buy.slice(2, 7))) {
      try {
        setIsLoading({ type: selectedOverdrive.id, loading: true });
        const { data } = await axios.post('/has-item/boost', {
          itemId: selectedOverdrive.id,
          boostItemId: boostItem.hasItem
        })

        setBoostItem({
          item: data.item,
          hasItem: data.hasItem
        })
        setResource([data.resourceData.power, data.resourceData.lumber, data.resourceData.brick, data.resourceData.concrete, data.resourceData.steel])
        setIsLoading({ type: -1, loading: false });
        setSelectedOverdrive(null)
        return notifySuccess(`${selectedOverdrive.name} purchased successfully!`)
      } catch (error: any) {
        setIsLoading({ type: -1, loading: false });
        if (error.response?.data.status == 401) {
          localStorage.removeItem("jwtToken-v2");
          disconnect();
          return notifyError(`Unautherized error`);
        }
        return notifyError(error.response.data.message)
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Not enough resource");
    }
  }

  return { buyOverdrive }
}
