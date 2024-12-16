import { useState, useEffect } from "react";
import axios from "./nft-game-axios";

let itemDataState = {}

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetItem(itemName: string) {
  const [itemData, setItemData] = useState<any>(itemDataState)

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setItemData(itemDataState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateItemData = (newItemData: any[]) => {
    itemDataState = newItemData;
    notifySubscribers();
  };

  useEffect(() => {
    if (itemName) {
      const fetchItem = async () => {
        const { data } = await axios.post(`/item/one`, { name: itemName });
        updateItemData(data);
      };
      fetchItem();
    }
  }, [itemName]);

  return itemData
}
