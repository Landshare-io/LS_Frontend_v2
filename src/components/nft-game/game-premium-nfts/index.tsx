import React, { useState, useEffect } from "react";
import { utils } from 'ethers'
import axios from "../../../helper/axios";
import { PremiumNft } from "./PremiumNft";
import marble from "../../../assets/img/marketplace-property/marble.png";
import pool from "../../../assets/img/marketplace-property/pool.png";
import windfarm from "../../../assets/img/marketplace-property/tile.png";
import { useGlobalContext } from "../../../contexts/GlobalContext";
import { useLandshareNftContext } from "../../../contexts/LandshareNftContext";
import { useHistory } from "react-router-dom";
import {
  validatePremiumNftItem,
  validateDependency,
  getDependencyItemInstances,
  getPremiumNftAbleItem,
  getHasPremiumNftIds
} from "../../../helper/validator";
import useGetHouse from "../../../hooks/nft-game/axios/useGetHouse";
import "./premiumNfts.css";

interface GamePremiumNftsProps {
  house: any
}

export default function GamePremiumNfts({
  house
}: GamePremiumNftsProps) {
  const { getHouse } = useGetHouse(house.id)
  const {
    signer,
    account,
    provider,
    notifySuccess,
    notifyError,
    userResource,
    setUserResource,
    premiumAbleTime,
    premiumAttachPrice,
    yieldUpgradesList,
    productionUpgradesList,
    boostItemsList,
    premiumUpgradesList,
    oneDayTime,
    landTokenV2Contract
  } = useGlobalContext();
  const {
    contract: {
      porcelainTileNewContract,
      poolTableNewContract,
      marbleCounteropsListNewContract
    }
  } = useLandshareNftContext();

  const contracts = {
    "Porcelain Tile": porcelainTileNewContract,
    "Pool Table": poolTableNewContract,
    "Marble Countertops": marbleCounteropsListNewContract
  }

  const images = {
    "Porcelain Tile": windfarm,
    "Pool Table": pool,
    "Marble Countertops": marble
  }
  const [premiumNfts, setPremiumNfts] = useState([]);
  const [loader, setLoader] = useState("");
  let history = useHistory();

  const attachePremiumNftHandler = async (item) => {
    if (!signer) return;

    if (userResource.landTokenBalance >= premiumAttachPrice) {
      setLoader(item.name)
      await attachePremiumNftToHouse(item);
    } else {
      notifyError("Not Enough LAND Token");
    }
  };

  const attachePremiumNftToHouse = async (item) => {
    try {
      const hasNftIds = getHasPremiumNftIds(item.backendItems, premiumAbleTime)
      const nftId = getPremiumNftAbleItem(item.onChainItems, hasNftIds)
      if (item.hasItemId) {
        const amount = utils.parseUnits(premiumAttachPrice.toString(), 18)
        const transaction = await landTokenV2Contract.approve(
          process.env.REACT_APP_ADMIN_WALLET_ADDRESS,
          amount
        );
        const receipt = await transaction.wait();
        if (receipt.status) {
          try {
            const { data: transactionData } = await axios.post('/house/get-attach-premium-nft-transaction', {
              itemId: item.id
            })
            const sendedTransaction = await signer.sendTransaction(transactionData.transaction)
            sendedTransaction.wait().then(async (receipt) => {
              if (receipt.status) {
                await axios.post('/has-premium-nft/reattach-premium-nft-house', {
                  hasItemId: item.hasItemId
                })

                const landTokenV2Balance = await landTokenV2Contract.balanceOf(account);

                setUserResource((prevState) => ({
                  ...prevState,
                  landTokenV2: landTokenV2Balance,
                }))
                await getHouse(house.id)
                gettingPremiumItems();
                setLoader('')
                notifySuccess(`Attach ${item.name} successfully`);
              }
            })
          } catch (error) {
            setLoader('')
            notifyError(`Attach ${item.name} failed`);
            notifyError("Buy house failed");
          }
        }
      } else {
        if (nftId == -1) {
          setLoader('')
          return notifyError(`No ${item.name} NFT Found`);
        } else {
          const transaction = await contracts[item.name].approve(
            process.env.REACT_APP_ADMIN_WALLET_ADDRESS,
            nftId
          );
          const receiptApproveNFT = await transaction.wait();
          if (receiptApproveNFT.status) {
            const amount = utils.parseUnits(premiumAttachPrice.toString(), 18)
            const transaction = await landTokenV2Contract.approve(
              process.env.REACT_APP_ADMIN_WALLET_ADDRESS,
              amount
            );
            const receipt = await transaction.wait();
            if (receipt.status) {
              try {
                const { data: transactionData } = await axios.post('/house/get-attach-premium-nft-transaction', {
                  itemId: item.id
                })
                const sendedTransaction = await signer.sendTransaction(transactionData.transaction)
                sendedTransaction.wait().then(async (receipt) => {
                  if (receipt.status) {
                    await axios.post('/has-premium-nft/attach-premium-nft-house', {
                      itemId: item.id,
                      houseId: house.id,
                      nftId,
                      nonce: transactionData.nonce,
                    })
  
                    const landTokenV2Balance = await landTokenV2Contract.balanceOf(account);
  
                    setUserResource((prevState) => ({
                      ...prevState,
                      landTokenV2: landTokenV2Balance,
                    }))
                    await getHouse(house.id)
                    gettingPremiumItems();
                    setLoader('')
                    notifySuccess(`Attach ${item.name} successfully`);
                  } else {
                    setLoader('')
                    notifyError(`Attach ${item.name} failed`);
                  }
                }
                )
              } catch (buyError) {
                console.log(buyError);
                setLoader('')
                notifyError(buyError.response.data.message);
              }
            } else {
              setLoader('')
              notifyError(`Attach ${item.name} failed`);
            }
          } else {
            setLoader('')
            notifyError("Approve error");
          }
        }
      }
    } catch (error) {
      setLoader('')
      console.log("Approve Error", error);
      notifyError(error.response.data.message);
    }
  }

  const detachPremiumNftHandler = async (item) => {
    try {
      setLoader(item.name)
      const { data } = await axios.post('/has-premium-nft/detach-premium-nft-house', {
        itemId: item.id,
        houseId: house.id
      })

      await getHouse(house.id)
      gettingPremiumItems();
      setLoader('')
      notifySuccess(`Detached ${item.name} successfully`);
    } catch (error) {
      setLoader('')
      console.log("Approve Error", error);
      notifyError(error.response.data.message);
    }
  }

  const gettingPremiumItems = async () => {
    if (!house.premiumUpgrades) return;

    const premiumUpgrades = []
    for (let premiumUpgrade of house.premiumUpgrades) {
      const depencencies = getDependencyItemInstances([
        ...yieldUpgradesList,
        ...productionUpgradesList,
        ...boostItemsList,
        ...premiumUpgradesList,
      ], premiumUpgrade.id, oneDayTime)
      const hasPremiumNftItem = validatePremiumNftItem(premiumUpgrade, premiumAbleTime)
      const { data: backendItems } = await axios.get(`/has-premium-nft/get-user-premium-nfts/${premiumUpgrade.id}`)
      const onChainItemsData = await contracts[premiumUpgrade.name].getItemsByOwner(account)

      premiumUpgrades.push({
        ...premiumUpgrade,
        name: premiumUpgrade.name,
        multiplier: premiumUpgrade.buyReward[9],
        imgSrc: images[premiumUpgrade.name],
        infoText:
          `${premiumUpgrade?.name ?? ''} NFT increases the house multiplier by +${premiumUpgrade.buyReward[9]}, requires ${depencencies[0]?.name}`,
        price: premiumUpgrade.buy[1],
        hasNft: hasPremiumNftItem,
        onChainItems: onChainItemsData.map(item => item.toString()),
        backendItems
      })
    }

    setPremiumNfts(premiumUpgrades)
  }

  useEffect(() => {
    gettingPremiumItems()
  }, [house, premiumUpgradesList])

  return (
    <>
      {premiumNfts.length > 0 ? (
        <div className="premium-items-section my-5">
          {premiumNfts.map((item, index) => (
            <PremiumNft
              key={`premium-item-${index}`}
              premiumNft={item}
              loader={loader}
              onSubmit={() => item.hasNft ? detachPremiumNftHandler(item) : attachePremiumNftHandler(item)}
            />
          ))}
          <div className="need-more-card">
            <h2 className="text-tw-text-primary">Need More Upgrades?</h2>
            <p className="need-more-card-desc text-tw-text-secondary">Check Our Marketplace</p>
            <button
              className="btn btn-secondary w-auto px-4 py-2 br-md fs-xs fw-700"
              onClick={() => history.push("/marketplace")}
            >
              GO TO MARKETPLACE
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="need-more-card">
            <h2>Need More Upgrades?</h2>
            <p className="need-more-card-desc">Check Our Marketplace</p>
            <button
              className="btn btn-secondary w-auto px-4 py-2 br-md fs-xs fw-700"
              onClick={() => history.push("/marketplace")}
            >
              GO TO MARKETPLACE
            </button>
          </div>
        </div>
      )}
    </>
  );
};
