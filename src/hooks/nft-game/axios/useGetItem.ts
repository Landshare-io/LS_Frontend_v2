import { useState, useEffect } from "react";
import axios from "./nft-game-axios";

export default function useGetItem(itemName: string) {
  const [itemData, setItemData] = useState<any>({})

  useEffect(() => {
    if (itemName) {
      const fetchItem = async () => {
        const { data } = await axios.post(`/item/one`, { name: itemName });
        setItemData(data);
      };
      fetchItem();
    }
  }, [itemName]);

  return itemData
}
