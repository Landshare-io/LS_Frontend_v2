import { useState, useEffect } from "react"
import { parseUnits } from "ethers";
import { 
  useAccount, 
  useWaitForTransactionReceipt, 
  useSendTransaction 
} from "wagmi";
import { Address } from "viem"
import axios from "./nft-game-axios"
import useGetHouse from "./useGetHouse"
import useGetSetting from "./useGetSetting"
import useGetGameItems from "./useGetGameItems"
import useGetItemsByOwner from "../../contract/PremiumNftContract/useGetItemsByOwner"
import useBalanceOf from "../../contract/LandTokenContract/useBalanceOf";
import useApproveOfLandToken from "../../contract/LandTokenContract/useApprove";
import useApproveOfPremiumNft from "../../contract/PremiumNftContract/useApprove";
import { useGlobalContext } from "../../../context/GlobalContext"
import { 
  getDependencyItemInstances, 
  validatePremiumNftItem,
  getHasPremiumNftIds,
  getPremiumNftAbleItem
} from "../../../utils/helpers/validator"
import { PREMIUM_NFT_CONTRACT_ADDRESS, PROVIDERS, ADMIN_WALLET_ADDRESS } from "../../../config/constants/environments"
import marble from "../../../../public/img/marketplace-property/marble.png";
import pool from "../../../../public/img/marketplace-property/pool.png";
import windfarm from "../../../../public/img/marketplace-property/tile.png";

let premiumNftsState: any[] = []

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useHandlePremiumNft(chainId: number, address: Address | undefined, setLoader: Function, house: any) {
  const [premiumNft, setPremiumNft] = useState<any>(null)
  const [attachStatus, setAttachStatus] = useState('')
  const [transactionNonce, setTransactionNonce] = useState(0)
  const [premiumNftId, setPremiumNftId] = useState(0)
  const { premiumAttachPrice, premiumAbleTime } = useGetSetting()
  const [premiumNfts, setPremiumNfts] = useState<any[]>(premiumNftsState);
  const { isConnected } = useAccount();
  const { isAuthenticated, notifyError, notifySuccess } = useGlobalContext()
  const { data: landTokenBalance, refetch } = useBalanceOf({ chainId, address })
  const { approve, data: approveTx } = useApproveOfLandToken()
  const { approve: premiumNftApprove, data: premiumNftApproveTx } = useApproveOfPremiumNft()
  const { sendTransaction, data: sendTransactionTx, error: sendTransactionError } = useSendTransaction()
  const { getHouse } = useGetHouse(house.id)

  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: chainId
  });
  const { isSuccess: premiumNftApproveSuccess, data: premiumNftApproveStatusData } = useWaitForTransactionReceipt({
    hash: premiumNftApproveTx,
    chainId: chainId
  });
  const {
    yieldUpgradesList,
    productionUpgradesList,
    boostItemsList,
    premiumUpgradesList
  } = useGetGameItems()
  const images: Record<string, any> = {
    "Porcelain Tile": windfarm,
    "Pool Table": pool,
    "Marble Countertops": marble
  }

  const porcelainItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId], address)
  const poolTableItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId], address)
  const marbleItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId], address)
  const contractItem: Record<string, any> = {
    "Porcelain Tile": porcelainItems,
    "Pool Table": poolTableItems,
    "Marble Countertops": marbleItems
  }

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setPremiumNfts(premiumNftsState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updatePremiumNfts = (newPremiumNfts: any) => {
    premiumNftsState = newPremiumNfts;
    notifySubscribers();
  };

  useEffect(() => {
    if (typeof address == 'undefined') return
    gettingPremiumItems()
  }, [address])

  useEffect(() => {
    (async () => {
      if (premiumNftApproveTx) {
        if (premiumNftApproveStatusData) {
          if (premiumNftApproveSuccess) {
            try {
              const receipt = await PROVIDERS[chainId].getTransactionReceipt(approveTx);

              if (receipt.status) {
                const amount = parseUnits(premiumAttachPrice.toString(), 18)
                approve(chainId, ADMIN_WALLET_ADDRESS[chainId], amount);
              } else {
                setLoader('');
                notifyError('Approve Error');
              }
            } catch (error: any) {
              setLoader('')
              notifyError('Approve Error');
            }
          }
        }
      }
    })()
  }, [premiumNftApproveSuccess, premiumNftApproveStatusData, premiumNftApproveTx])

  useEffect(() => {
    (async () => {
      if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            try {
              const receipt = await PROVIDERS[chainId].getTransactionReceipt(approveTx);

              if (receipt.status) {
                try {
                  const { data: transactionData } = await axios.post('/house/get-attach-premium-nft-transaction', {
                    itemId: premiumNft.id
                  })
                  setTransactionNonce(transactionData.nonce)
                  sendTransaction(transactionData.transaction)
                } catch (error) {
                  
                }
              } else {
                setLoader('');
                notifyError('Approve Error');
              }
            } catch (error: any) {
              setLoader('')
              notifyError('Approve Error');
            }
          }
        }
      }
    })()
  }, [approveSuccess, approveStatusData, approveTx])

  useEffect(() => {
    if (transactionNonce) {
      if (sendTransactionError) {
        setLoader('')
        setTransactionNonce(0)
        notifyError(`Attach ${premiumNft.name} failed`);
      }
    }
  }, [transactionNonce, sendTransactionError])

  useEffect(() => {
    (async () => {
      if (transactionNonce) {
        if (sendTransactionTx) {
          const receipt = await PROVIDERS[chainId].getTransactionReceipt(sendTransactionTx);
  
          if (receipt.status) {
            try {
              await axios.post(`/has-premium-nft/${attachStatus}`, 
              attachStatus == 'reattach-premium-nft-house' ? {
                hasItemId: premiumNft.hasItemId,
                houseId: house.id
              } : {
                itemId: premiumNft.id,
                houseId: house.id,
                nftId: premiumNftId,
                nonce: transactionNonce
              })
  
              await refetch()
              await getHouse()
              await gettingPremiumItems();
              setLoader('')
              setTransactionNonce(0)
              notifySuccess(`Attach ${premiumNft.name} successfully`);
            } catch (error: any) {
              console.log(error)
              setTransactionNonce(0)
              notifyError(`Attach ${premiumNft.name} failed`);
            }
          } else {
            setLoader('');
            setTransactionNonce(0)
            notifyError(`Attach ${premiumNft.name} failed`);
          }
        }
      }
    })()
  }, [transactionNonce, sendTransactionTx])

  const gettingPremiumItems = async () => {
    if (!house.premiumUpgrades) return;

    const premiumUpgrades = []
    for (let premiumUpgrade of house.premiumUpgrades) {
      const depencencies = getDependencyItemInstances([
        ...yieldUpgradesList,
        ...productionUpgradesList,
        ...boostItemsList,
        ...premiumUpgradesList,
      ], premiumUpgrade.id)
      const hasPremiumNftItem = validatePremiumNftItem(premiumUpgrade, premiumAbleTime)
      const { data: backendItems } = await axios.get(`/has-premium-nft/get-user-premium-nfts/${premiumUpgrade.id}`)
      const onChainItemsData = contractItem[premiumUpgrade.name]

      premiumUpgrades.push({
        ...premiumUpgrade,
        name: premiumUpgrade.name,
        multiplier: premiumUpgrade.buyReward[9],
        imgSrc: images[premiumUpgrade.name],
        infoText:
          `${premiumUpgrade?.name ?? ''} NFT increases the house multiplier by +${premiumUpgrade.buyReward[9]}, requires ${depencencies[0]?.name}`,
        price: premiumUpgrade.buy[1],
        hasNft: hasPremiumNftItem,
        onChainItems: onChainItemsData.map((item: number) => item.toString()),
        backendItems
      })
    }

    updatePremiumNfts(premiumUpgrades)
  }

  const attachePremiumNftHandler = async (item: any) => {
    try {
      if (!isAuthenticated || !isConnected) return;
  
      if (Number(landTokenBalance) >= premiumAttachPrice) {
        setLoader(item.name)
        setPremiumNft(item)
        const hasNftIds = getHasPremiumNftIds(item.backendItems, premiumAbleTime)
        const nftId = getPremiumNftAbleItem(item.onChainItems, hasNftIds)
        setPremiumNftId(nftId)
        if (item.hasItemId) {
          setAttachStatus('reattach-premium-nft-house')
          const amount = parseUnits(premiumAttachPrice.toString(), 18)
          approve(chainId, ADMIN_WALLET_ADDRESS[chainId], amount);
        } else {
          if (nftId == -1) {
            setLoader('')
            return notifyError(`No ${item.name} NFT Found`);
          } else {
            setAttachStatus('attach-premium-nft-house')
            premiumNftApprove(chainId, item.name, nftId)
          }
        }
      } else {
        notifyError("Not Enough LAND Token");
      }
    } catch (error: any) {
      setLoader('')
      console.log("Error", error);
      notifyError(error.response.data.message);
    }
  };

  const detachPremiumNftHandler = async (item: any) => {
    try {
      setLoader(item.name)
      const { data } = await axios.post('/has-premium-nft/detach-premium-nft-house', {
        itemId: item.id,
        houseId: house.id
      })

      await getHouse()
      gettingPremiumItems();
      setLoader('')
      notifySuccess(`Detached ${item.name} successfully`);
    } catch (error: any) {
      setLoader('')
      console.log("Approve Error", error);
      notifyError(error.response.data.message);
    }
  }

  return {
    premiumNfts,
    detachPremiumNftHandler,
    attachePremiumNftHandler
  }
}