import React, { useState, useEffect } from "react";
import axios from "../../../../helper/axios";
import { PremiumNft } from "./PremiumNft";
import marble from "../../../../assets/img/marketplace-property/marble.png";
import pool from "../../../../assets/img/marketplace-property/pool.png";
import windfarm from "../../../../assets/img/marketplace-property/tile.png";
import { useGlobalContext } from "../../../../contexts/GlobalContext";
import { useLandshareNftContext } from "../../../../contexts/LandshareNftContext";
import { getDependencyItemInstances } from "../../../../helper/validator";
import "./PremiumNfts.css";
import { ethers } from "ethers";

export const PremiumNfts = () => {
  const {
    oneDayTime,
    signer,
    account,
    provider,
    userResource,
    setUserResource,
    notifySuccess,
    notifyError,
    landTokenV2Contract,
    yieldUpgradesList,
    productionUpgradesList,
    boostItemsList,
    premiumUpgradesList
  } = useGlobalContext();
  const images = {
    "Porcelain Tile": windfarm,
    "Pool Table": pool,
    "Marble Countertops": marble
  }
  const {
    contract: {
      porcelainTileNewContract,
      poolTableNewContract,
      marbleCounteropsListNewContract,
    },
    address: { marketplaceAddress }
  } = useLandshareNftContext();
  const [premiumNfts, setPremiumNfts] = useState([]);
  const [loader, setLoader] = useState("");
  const [amountMinted, setAmountMinted] = useState({
    "Porcelain Tile": 0,
    "Pool Table": 0,
    "Marble Countertops": 0
  });
  const [mintCap, setMintCap] = useState({
    "Porcelain Tile": 25,
    "Pool Table": 25,
    "Marble Countertops": 25,
  });

  useEffect(() => {
    const premiumUpgrades = []
    for (let premiumUpgrade of premiumUpgradesList) {
      const depencencies = getDependencyItemInstances([
        ...yieldUpgradesList,
        ...productionUpgradesList,
        ...boostItemsList,
        ...premiumUpgradesList,
      ], premiumUpgrade.id, oneDayTime)
      premiumUpgrades.push({
        ...premiumUpgrade,
        name: premiumUpgrade.name,
        multiplier: premiumUpgrade.buyReward[9],
        imgSrc: images[premiumUpgrade.name],
        infoText:
          `${premiumUpgrade.name} NFT increases the house multiplier by +${premiumUpgrade.buyReward[9]}, requires ${depencencies[0].name}`,
        price: premiumUpgrade.buy[1]
      })
    }

    setPremiumNfts(premiumUpgrades)
  }, [premiumUpgradesList])

  useEffect(() => {
    (async () => {
      if (!account) return
      try {
        const { data: prCap } = await axios.get('/setting/porcelain-tile-cap');
        const { data: mcCap } = await axios.get('/setting/marble-counterops-cap');
        const { data: ptCap } = await axios.get('/setting/pool-table-cap');
        
        setMintCap({
          "Porcelain Tile": Number(prCap),
          "Pool Table": Number(ptCap),
          "Marble Countertops": Number(mcCap),
        })
      } catch (error) {
        console.log('error', error)
      }
    })()
  }, [account])

  const mintPremiumNFT = async (item) => {
    try {
      if (amountMinted[item.name] >= mintCap[item.name]) {
        setLoader("");
        notifyError(`${item.name} Nft minted as a max value.`)
      }

      const { data: transactionData } = await axios.post('/has-item/get-item-transaction', {
        itemId: item.id
      })

      const sendedTransaction = await signer.sendTransaction(transactionData.transaction)
      sendedTransaction.wait().then(async (receipt) => {
        if (receipt.status) {
          const { data } = await axios.post('/has-item/mint-premium-nft', {
            itemId: item.id,
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
            nonce: transactionData.nonce
          })

          if (data) {
            const landTokenV2Balance = await landTokenV2Contract.balanceOf(account);
  
            setUserResource((prevState) => ({
              ...prevState,
              landTokenV2: landTokenV2Balance,
            }))
  
            await getAmountMintedValue();
            setLoader("");
            notifySuccess(`Mint ${item.name} successfully`)
          }
        } else {
          setLoader("");
          notifyError(`Mint ${item.name} Error`);
        }
      })
    } catch (error) {
      console.log(error)
      setLoader("");
      notifyError(error.response.data.message);
    }
  }

  const mintPremiumNFTHandler = async (item) => {
    try {
      setLoader(item.name);
      const amount = item.buy[1]

      if (Number(amount) > ethers.utils.formatEther(userResource.landTokenBalance)) {
        setLoader("")
        return notifyError("Not enough LAND tokens");
      } else {
        await mintPremiumNFT(item);
      }
    } catch (error) {
      console.log(error)
      setLoader("");
      notifyError(`Mint ${item.name} Error`);
    }
  }

  const getAmountMintedValue = async () => {
    const prAmountMinted = await porcelainTileNewContract.totalSupply();
    const ptAmountMinted = await poolTableNewContract.totalSupply();
    const mcAmountMinted = await marbleCounteropsListNewContract.totalSupply();

    setAmountMinted(((prevState) => ({
      ...prevState,
      "Porcelain Tile": prAmountMinted.toString(),
      "Pool Table": ptAmountMinted.toString(),
      "Marble Countertops": mcAmountMinted.toString()
    })));
  };

  useEffect(() => {
    if (!signer) return;

    getAmountMintedValue();
  }, [signer]);

  return (
    <div className="mpremium-items-section my-5">
      {premiumNfts.map((item, index) => (
        <PremiumNft
          key={`mpremium-item-${index}`}
          amountMinted={amountMinted[item.name]}
          mintCap={mintCap[item.name]}
          premiumNft={item}
          loader={loader}
          onSubmit={() => mintPremiumNFTHandler(item)}
        />
      ))}
    </div>
  );
};
