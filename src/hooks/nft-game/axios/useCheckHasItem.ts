import { useState, useEffect } from "react";
import axios from "./nft-game-axios";

let hasItemState = {}

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useCheckHasItem(item: any, houseId: number | string) {
  const [hasItem, setHasItem] = useState<any>(hasItemState)

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setHasItem(hasItemState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateHasItem = (newHasItem: boolean) => {
    hasItemState = newHasItem;
    notifySubscribers();
  };

  useEffect(() => {
    if (typeof houseId === "undefined" || houseId === '') return
    if (typeof item !== 'undefined' && typeof item.id !== 'undefined') {
      const fetchItem = async () => {
        try {
          const { data } = await axios.get(`/has-item/find-item-and-house-and-user?itemId=${item.id}&houseId=${houseId}`);
          updateHasItem(data);
        } catch (error: any) {}
      };
      fetchItem();
    }
  }, [item, houseId]);

  return hasItem
}
