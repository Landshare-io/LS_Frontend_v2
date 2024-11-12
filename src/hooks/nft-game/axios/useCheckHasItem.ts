import { useState, useEffect } from "react";
import axios from "./nft-game-axios";

export default function useCheckHasItem(item: any, houseId: number | string) {
  const [hasItem, setHasItem] = useState<any>({})

  useEffect(() => {
    if (typeof houseId === "undefined" || houseId === '') return
    if (typeof item !== 'undefined' && typeof item.id !== 'undefined') {
      const fetchItem = async () => {
        const { data } = await axios.get(`/has-item/find-item-and-house-and-user?itemId=${item.id}&houseId=${houseId}`);
        setHasItem(data);
      };
      fetchItem();
    }
  }, [item, houseId]);

  return hasItem
}
