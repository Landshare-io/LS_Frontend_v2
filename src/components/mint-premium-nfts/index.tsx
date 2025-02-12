import React, { useState, useEffect } from "react";
import { useChainId, useAccount } from "wagmi";
import { BigNumberish, formatEther } from "ethers";
import PremiumNft from "./premium-nft";
import marble from "../../../public/img/marketplace-property/marble.png";
import pool from "../../../public/img/marketplace-property/pool.png";
import windfarm from "../../../public/img/marketplace-property/tile.png";
import { useTheme } from "next-themes";
import { getDependencyItemInstances } from "../../utils/helpers/validator";
import useGetGameItems from "../../hooks/nft-game/axios/useGetGameItems";
import useTotalSupply from "../../hooks/contract/PremiumNftContract/useTotalSupply";
import useGetSetting from "../../hooks/nft-game/axios/useGetSetting";
import useMintPremiumNft from "../../hooks/nft-game/premium-nfts/useMintPremiumNft";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";
import { PREMIUM_NFT_CONTRACT_ADDRESS } from "../../config/constants/environments";

export default function PremiumNfts() {
  const { address } = useAccount()
  const chainId = useChainId();
  const {
    notifyError
  } = useGlobalContext();
  const { 
    yieldUpgradesList,
    productionUpgradesList,
    boostItemsList,
    premiumUpgradesList
  } = useGetGameItems()
  const [premiumNfts, setPremiumNfts] = useState<any[]>([]);
  const [loader, setLoader] = useState("");
  const { oneDayTime, premiumMintCap } = useGetSetting() as { oneDayTime: number, premiumMintCap: Record<string, number> }
  const { data: porcelainItems } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId]) as { data: BigNumberish }
  const { data: poolTableItems } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId]) as { data: BigNumberish }
  const { data: marbleItems } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId]) as { data: BigNumberish }
  const { data: landTokenBalance } = useBalanceOfLandToken({ chainId, address }) as { data: BigNumberish }
  const { mint } = useMintPremiumNft(chainId, address, setLoader)
  const amountMinted: Record<string, BigNumberish> = {
    "Porcelain Tile": porcelainItems,
    "Pool Table": poolTableItems,
    "Marble Countertops": marbleItems
  }

  const images: Record<string, any> = {
    "Porcelain Tile": windfarm,
    "Pool Table": pool,
    "Marble Countertops": marble
  }

  useEffect(() => {
    const premiumUpgrades = []
    for (let premiumUpgrade of premiumUpgradesList) {
      const depencencies = getDependencyItemInstances([
        ...yieldUpgradesList,
        ...productionUpgradesList,
        ...boostItemsList,
        ...premiumUpgradesList,
      ], premiumUpgrade.id)
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

  const mintPremiumNFTHandler = async (item: any) => {
    try {
      setLoader(item.name);
      const amount = item.buy[1]

      if (Number(amount) > Number(formatEther(landTokenBalance))) {
        setLoader("")
        return notifyError("Not enough LAND tokens");
      } else {
        if (Number(amountMinted[item.name]) >= Number(premiumMintCap[item.name])) {
          setLoader("");
          notifyError(`${item.name} Nft minted as a max value.`)
        }
        await mint(item);
      }
    } catch (error) {
      console.log(error)
      setLoader("");
      notifyError(`Mint ${item.name} Error`);
    }
  }

  return (
    <div className="flex gap-[20px] overflow-x-scroll pb-[10px] mb-[70px] mlg:grid mlg:grid-cols-[minmax(257px,max-content),minmax(257px,max-content)] md:justify-between mlg:gap-[4rem] lg:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] my-5">
      {premiumNfts.map((item, index) => (
        <PremiumNft
          key={`mpremium-item-${index}`}
          amountMinted={Number(amountMinted[item.name])}
          mintCap={premiumMintCap[item.name]}
          premiumNft={item}
          loader={loader}
          onSubmit={() => mintPremiumNFTHandler(item)}
        />
      ))}
    </div>
  );
};
