import { useDisconnect } from "wagmi";
import numeral from "numeral";
import useGetHouses from "./useGetHouses";
import useGetResource from "./useGetResource";
import { validateResource } from "../../../utils/helpers/validator";
import axios from "./nft-game-axios";
import { useTheme } from "next-themes";

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

  const repairWithAmount = async (house: any, setHouse: Function, setDisplayPercent: Function, repairPercent: number) => {
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

    if (repairPercent > 0) {
      if (Number(house.lastDurability) + Number(repairPercent) > Number(house.maxDurability)) {
        return notifyError("Overflow maximium durability");
      }

      if (Number(house.maxDurability) - Number(house.lastDurability) >= 10) {
        if (Number(repairPercent) < 10)
          return notifyError("Should repair at least 10%");
      } else {
        if (
          Number(house.lastDurability) + Number(repairPercent) != Number(house.maxDurability)
        )
          return notifyError("Should repair to max durability");
      }

      if (await validateResource(resource, house.repairCost)) {
        try {
          setIsLoading(true);
          const { data } = await axios.post(`/house/repair/${house.id}`, {
            repairPercent: repairPercent
          });

          setHouse((prevState: any) => ({
            ...prevState,
            lastDurability: data.lastDurability,
            lastRepairTime: data.lastRepairTime
          }))

          setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])

          setDisplayPercent(
            house.maxDurability - Number(data.lastDurability)
          );
          changeRepairAmount(house, setHouse, setDisplayPercent, house.maxDurability - Number(data.lastDurability))
          notifySuccess(
            `${numeral(repairPercent)
              .format("0.[00]")
              .toString()}% repaired successfully!`
          );
          setIsLoading(false);
        } catch (error: any) {
          setIsLoading(false);
          if (error.response?.data.status == 401) {
            localStorage.removeItem("jwtToken-v2");
            disconnect();
            return notifyError(`Unautherized error`);
          } else
            return notifyError(error.response.data.message);
        }
      } else {
        setIsLoading(false);
        return notifyError("Not enough resources");
      }
    } else {
      setIsLoading(false);
      return notifyError("Please enter repair amount");
    }
  }

  const changeRepairAmount = async (house: any, setHouse: Function, setDisplayPercent: Function, percent: number) => {
    if (percent > (house.maxDurability - house.lastDurability)) {
      percent = house.maxDurability - house.lastDurability;
    }

    try {
      if (Number(percent) >= 0.1) {
        const { data } = await axios.post(`/house/get-repair-cost/${house.id}`, {
          repairPercent: percent
        })

        setHouse((prevState: any) => ({
          ...prevState,
          repairCost: data.repairCost
        }));
      } else {
        setDisplayPercent(0);
        setHouse((prevState: any) => ({
          ...prevState,
          repairCost: [0, 0, 0, 0, 0]
        }));
      }
    } catch (error: any) {
      if (error.response?.data.status == 401) {
        localStorage.removeItem("jwtToken-v2");
        disconnect();
        return notifyError(`Unautherized error`);
      } else
        return notifyError(error.response.data.message);
    }
  };

  return { repair, repairWithAmount, changeRepairAmount }
}