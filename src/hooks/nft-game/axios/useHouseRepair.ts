import { useDisconnect } from "wagmi";
import numeral from "numeral";
import useGetHouses from "./useGetHouses";
import useGetResource from "./useGetResource";
import { validateResource } from "../../../utils/helpers/validator";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useHouseRepair(setIsLoading: Function) {
  const { disconnect } = useDisconnect()
  const { notifyError, notifyInfo, notifySuccess } = useGlobalContext()
  const { resource, setResource } = useGetResource()
  const { getHouses } = useGetHouses()

  const repair = async (house: any) => {
    if (!house.isActivated) {
      return notifyError("Please Activate First");
    }

    if (house.lastDurability == house.maxDurability) {
      setIsLoading(false);
      return notifyInfo("You already repaired to max");
    }

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading(false);
      return notifyError("Please login!");
    }

    if (house.onSale) {
      setIsLoading(false);
      return notifyError("Your house is in the marketplace!");
    }

    const displayPercent = house.maxDurability - house.lastDurability

    if (displayPercent > 0) {
      if (Number(house.lastDurability) + Number(displayPercent) > Number(house.maxDurability)) {
        return notifyError("Overflow maximium durability");
      }

      if (Number(house.maxDurability) - Number(house.lastDurability) >= 10) {
        if (Number(displayPercent) < 10)
          return notifyError("Should repair at least 10%");
      } else {
        if (
          Number(house.lastDurability) + Number(displayPercent) != Number(house.maxDurability)
        )
          return notifyError("Should repair to max durability");
      }

      try {
        const { data } = await axios.post(`/house/get-repair-cost/${house.id}`, {
          repairPercent: displayPercent
        })

        if (await validateResource(resource, data.repairCost)) {
          setIsLoading(true);
          const { data } = await axios.post(`/house/repair/${house.id}`, {
            repairPercent: displayPercent
          });

          setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])
          await getHouses();

          notifySuccess(
            `${numeral(displayPercent)
              .format("0.[00]")
              .toString()}% repaired successfully!`
          );
          setIsLoading(false);
        } else {
          setIsLoading(false);
          return notifyError("Not enough resources");
        }
      } catch (error: any) {
        setIsLoading(false);
        if (error.response?.data.status == 401) {
          localStorage.removeItem("jwtToken-v2");
          disconnect();
          return notifyError(`Unautherized error`);
        } else {
          console.log(error)
          return notifyError(error.response.data.message);
        }
      }
    } else {
      setIsLoading(false);
      return notifyError("Please enter repair amount");
    }
  };

  return { repair }
}