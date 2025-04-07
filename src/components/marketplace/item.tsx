import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import numeral from "numeral";
import { useChainId, useAccount } from "wagmi";
import ReactLoading from "react-loading";
import useBuyHouse from "../../hooks/nft-game/axios/useBuyHouse";
import ReparingStatus from "../nft-game/reparing-status";
import Button from "../common/button";
import { InfoIconMarketPlaceItem } from "../common/icons/index";
import useCheckHasLandscaping from "../../hooks/nft-game/axios/useCheckHasLandscaping";
import useCheckHasGarden from "../../hooks/nft-game/axios/useCheckHasGarden";
import useGetPrice from "../../hooks/get-apy/useGetPrice";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import HouseNft from "../../../public/img/house/house_big.webp";
import HouseRareNft from "../../../public/img/house/house_rare_big.webp";
import HouseLandNft from "../../../public/img/house/house_land_big.webp";
import HouseLandRareNft from "../../../public/img/house/house_land_rare_big.webp";
import HouseGardenNft from "../../../public/img/house/house_garden_big.webp";
import HouseGardenRareNft from "../../../public/img/house/house_garden_rare_big.webp";
import HouseBNft from "../../../public/img/house/houseB.webp";
import HouseBRareNft from "../../../public/img/house/houseB_rare.webp";
import HouseBLandNft from "../../../public/img/house/houseB_land.webp";
import HouseBLandRareNft from "../../../public/img/house/houseB_land_rare.webp";
import HouseBGardenNft from "../../../public/img/house/houseB_garden.webp";
import HouseBGardenRareNft from "../../../public/img/house/houseB_garden_rare.webp";
import HouseCNft from "../../../public/img/house/houseC.webp"
import HouseCRareNft from "../../../public/img/house/houseC_rare.webp"
import HouseDNft from "../../../public/img/house/houseD.webp";
import HouseDRareNft from "../../../public/img/house/houseD_rare.webp";

interface MarketplaceItemProps {
  product: any;
  getProducts: Function;
}

export default function MarketplaceItem({
  product,
  getProducts,
}: MarketplaceItemProps) {
  const { address } = useAccount()
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const totalMultiplier = numeral(product.multiplier).format("0.[00]").toString()
  const [tokenPriceUSD, setTokenPriceUSD] = useState("0")
  const hasLandscaping = useCheckHasLandscaping(product.id)
  const hasGarden = useCheckHasGarden(product.id)
  const { price } = useGetPrice(chainId)
  const { buyProduct } = useBuyHouse(chainId, product, address, setIsLoading, getProducts);

  useEffect(() => {
    if (price) {
      setTokenPriceUSD(numeral(Number(price)).format("0.[000]"))
    }
    
  }, [price])

  const getHouseImageUrl = () => {
    if (product) {
      if (product.isRare) {
        if (product.isActivated && (hasLandscaping)) {
          if (hasGarden) {
            return (product.type == 1 || product.type == 2)
              ? HouseGardenRareNft
              : (product.type == 3 || product.type == 4) ? HouseBGardenRareNft : 
              (product.type == 5 || product.type == 6) ? HouseCRareNft : HouseDRareNft;
          } else {
            return (product.type == 1 || product.type == 2)
              ? HouseLandRareNft
              : (product.type == 3 || product.type == 4) ? HouseBLandRareNft :
              (product.type == 5 || product.type == 6) ? HouseCRareNft : HouseDRareNft;
          }
        } else {
          return (product.type == 1 || product.type == 2) ? HouseRareNft : (product.type == 3 || product.type == 4) ? HouseBRareNft : (product.type == 5 || product.type == 6) ? HouseCRareNft : HouseDRareNft;
        }
      } else {
        if (product.isActivated && (hasLandscaping)) {
          if (hasGarden) {
            return (product.type == 1 || product.type == 2) ? HouseGardenNft : (product.type == 3 || product.type == 4) ? HouseBGardenNft :
              (product.type == 5 || product.type == 6) ? HouseCNft : HouseDNft;
          } else {
            return (product.type == 1 || product.type == 2) ? HouseLandNft : (product.type == 3 || product.type == 4) ? HouseBLandNft : 
              (product.type == 5 || product.type == 6) ? HouseCNft : HouseDNft;
          }
        } else {
          return (product.type == 1 || product.type == 2) ? HouseNft : (product.type == 3 || product.type == 4) ? HouseBNft : 
            (product.type == 5 || product.type == 6) ? HouseCNft : HouseDNft;
        }
      }
    }
    return (product.type == 1 || product.type == 2) ? HouseNft : (product.type == 3 || product.type == 4) ? HouseBNft : (product.type == 5 || product.type == 6) ? HouseCNft : HouseDNft;
  };

  const getHouseName = () => {
    let name = product.name.length > 10
      ? `${product.name.slice(0, 10)}... ${product.isRare
        ? `Rare #${Number(product.typeId) + 1}`
        : `#${Number(product.typeId) + 1}`
      }`
      : `${product.name} ${product.isRare
        ? `Rare #${Number(product.typeId) + 1}`
        : `#${Number(product.typeId) + 1}`
      }`
    return name;
  };

  const generateURL = () => {
    let url = "./nft/";
    const itemID = Number(product.id);
    url += itemID.toString();
    return url;
  };

  return (
    <div className="w-full md:max-w-[251px] rounded-[16px] overflow-hidden duration-300 transition-all ease-in hover:shadow-[0_0_17px_0_rgba(0,0,0,0.527)]">
      <div className="h-[249px] relative">
        <div className={`bg-[#c4c4c433] text-[#fff] rounded-top-[16px] absolute top-0 w-full text-center p-2 ${BOLD_INTER_TIGHT.className}`}>
          {getHouseName()}
        </div>
        <Image
          src={getHouseImageUrl()}
          alt="marketplace-image-house"
          className="w-full h-full"
        />
     
        <div className="flex items-end absolute w-full justify-between px-[10px] bottom-[10px]">
          <div>
            <span className="text-[#fff] text-[14px] font-semibold leading-[18px] align-text-bottom">
              x
              {numeral(totalMultiplier).format("0.[0]").toString()}{" "}
            </span>
            <span className="text-[#fff] text-[10px] font-semibold pl-[2pz] align-text-bottom">LAND &nbsp;Yield/Year</span>
          </div>
          <div className="mb-1">
            <Link href={generateURL()}>
              <InfoIconMarketPlaceItem />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#6f8e9d66] p-[12px] flex flex-col">
        <div>
          <div className="flex justify-between items-end pb-2">
            <div className="w-[50%] text-[15px] font-semibold flex justify-between pr-1 dark:text-text-secondary">
              <span className="text-[#0b6c96] text-[14px] font-semibold dark:text-text-secondary">Durability</span>
            </div>
            <ReparingStatus
              max={product.maxDurability}
              now={product.lastDurability}
            />
          </div>
        </div>
        <div className="flex justify-between items-end pr-2 pt-1 ">
          <div className="text-[#0b6c96] text-[14px] font-semibold dark:text-text-secondary">Remaining</div>
          <div className="text-[#00000080] text-[14px] font-semibold">
            {(Number(product.tokenHarvestLimit) + Number(product.extendedBalance) - Number(product.totalHarvestedToken)).toFixed(2)}
          </div>
        </div>
        <div className="flex px-[5px] pt-3 justify-between items-center">
          <div className="block text-[14px] text-[#000000b3] items-end justify-center">
            <div>
              <span className="text-[14px] font-semibold">
                {product.salePrice}
              </span>
              <span className="text-[10px] font-semibold ms-1"> LAND</span>
            </div>
            <div>
              <span className="text-[12px] font-normal">
                ${(product.salePrice * Number(tokenPriceUSD)).toFixed(2)}
              </span>
              <span className="text-[10px] font-normal ml-1">USD</span>
            </div>
          </div>
          <Button
            onClick={buyProduct}
            disabled={
              isLoading ||
              product.seller.toLowerCase() == address?.toString().toLowerCase() ||
              product.state == 1
            }
            className={`w-[115px] h-[40px] text-[#fff] hover:text-primary-green bg-primary-green hover:bg-transparent border-[2px] border-primary-green flex items-center justify-center rounded-[24px] 
            ${product.seller.toLowerCase() == address?.toString().toLowerCase() ?
                (product.state == 1
                ? "!bg-[#8f8f8f] !border-[#8f8f8f]"
                : "hover:text-[#0B6C96] bg-[#0B6C96] border-[#0B6C96]") : ""
              }`}
            textClassName={`text-[16px] ${BOLD_INTER_TIGHT.className}`}
          >
            {isLoading ? (
              <ReactLoading
                type="spin"
                className="me-2 button-spinner"
                width="24px"
                height="24px"
              />
            ) : product.state == 1 ? (
              "SOLD"
            ) : product.seller.toLowerCase() == address?.toString().toLowerCase() ? (
              "OWNED"
            ) : (
              "BUY"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
