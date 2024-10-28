import { useState, useEffect } from "react";
import axios from "./nft-game-axios";

export default function useCheckHasItem(item: any, houseId: number) {
  const [hasItem, setHasItem] = useState<any>({})

  useEffect(() => {
    if (item) {
      const fetchItem = async () => {
        const { data } = await axios.get(`/has-item/find-item-and-house-and-user?itemId=${item.id}&houseId=${houseId}`);
        setHasItem(data);
      };
      fetchItem();
    }
  }, [item]);

  return hasItem
}
