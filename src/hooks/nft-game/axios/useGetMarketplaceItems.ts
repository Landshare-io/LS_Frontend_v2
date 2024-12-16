import { useState, useEffect } from "react"
import { useAccount } from "wagmi";
import axios from "./nft-game-axios";
import useGetGameItems from "./useGetGameItems";
import useLogin from "./useLogin";
import marble from "../../../../public/img/marketplace-property/marble.png";
import pool from "../../../../public/img/marketplace-property/pool.png";
import tile from "../../../../public/img/marketplace-property/tile.png";

let productsState: any[] = []
let premiumProductsState: any[] = []

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetMarketplaceItems(setIsItemsLoading: Function) {
  const { address } = useAccount()
  const [products, setProducts] = useState<any[]>([])
  const [premiumProducts, setPremiumProducts] = useState<any[]>([])
  const { premiumUpgradesList } = useGetGameItems()
  const { checkIsAuthenticated } = useLogin()
  const images: Record<string, any> = {
    "Porcelain Tile": tile,
    "Pool Table": pool,
    "Marble Countertops": marble
  }

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setProducts(productsState)
      setPremiumProducts(premiumProductsState)
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateProducts = (newProducts: any[]) => {
    productsState = newProducts;
    notifySubscribers();
  };

  const updatePremiumProducts = (newPremiumProducts: any[]) => {
    premiumProductsState = newPremiumProducts;
    notifySubscribers();
  };

  useEffect(() => {
    getProducts("all_active")
  }, [premiumUpgradesList])

  const getProducts = async (data: any) => {
    if (premiumUpgradesList.length > 0) {
      try {
        setIsItemsLoading(true)
        const tempPremiumProducts = []
        const { data: productItems } = await axios.get(`/house/get-market-items/${data?.searchType ?? 'all'}`)
        const { data: premiumItems } = await axios.get('/premium-nft-marketplace')

        if (data.sortType == "price") {
          productItems.sort((a: any, b: any) => a.salePrice - b.salePrice);
        }

        for (let i = 0; i < premiumItems.length; i++) {
          const premiumUpgradeData = premiumUpgradesList.filter((pItem: any) => pItem.id == premiumItems[i].type)[0]
          tempPremiumProducts.push({
            ...premiumUpgradeData,
            ...premiumItems[i],
            imgSrc: images[premiumUpgradeData.name],
          })
        }
        updateProducts(productItems);
        updatePremiumProducts(tempPremiumProducts)
        setTimeout(() => {
          setIsItemsLoading(false);
        }, 100);
      } catch (error) {
        console.log(error)
        checkIsAuthenticated(address)
      }
    }
  }

  return {
    products,
    premiumProducts,
    getProducts
  }
}