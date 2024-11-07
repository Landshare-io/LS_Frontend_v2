import React, { useState, useEffect } from "react";
import Link from "next/link";
import numeral from "numeral";
import { useChainId, useAccount } from "wagmi";
import ReactLoading from "react-loading";

import useBuyHouse from "../../hooks/nft-game/axios/useBuyHouse";

import { withRouter } from "react-router-dom";
import backendAxios from "../../../helper/axios";
import { useGlobalContext } from "../../../contexts/GlobalContext";
import { useLandshareNftContext } from "../../../contexts/LandshareNftContext";
import { ReparingStatus } from "../../Nft/reparingStatus/ReparingStatus";
import HouseNft from "../../../assets/img/house/house_big.bmp";
import HouseRareNft from "../../../assets/img/house/house_rare_big.bmp";
import HouseLandNft from "../../../assets/img/house/house_land_big.bmp";
import HouseLandRareNft from "../../../assets/img/house/house_land_rare_big.bmp";
import HouseGardenNft from "../../../assets/img/house/house_garden_big.bmp";
import HouseGardenRareNft from "../../../assets/img/house/house_garden_rare_big.bmp";
import HouseBNft from "../../../assets/img/house/houseB.bmp";
import HouseBRareNft from "../../../assets/img/house/houseB_rare.bmp";
import HouseBLandNft from "../../../assets/img/house/houseB_land.bmp";
import HouseBLandRareNft from "../../../assets/img/house/houseB_land_rare.bmp";
import HouseBGardenNft from "../../../assets/img/house/houseB_garden.bmp";
import HouseBGardenRareNft from "../../../assets/img/house/houseB_garden_rare.bmp";
import HouseCNft from "../../../assets/img/house/houseC.bmp"
import HouseCRareNft from "../../../assets/img/house/houseC_rare.bmp"

import "./MarketplaceItem.css";
import { InfoIconMarketPlaceItem } from "../../../components/common/Icons";
import { ethers } from "ethers";

const MarketplaceItem = ({
  product,
  getProducts,
}) => {
  const { address } = useAccount()
  const chainId = useChainId();
  const {
    signer,
    account,
    provider,
    notifySuccess,
    notifyError,
    landTokenV2Contract,
    userResource,
    setUserResource,
    checkHasLandscaping,
    checkHasGarden,
    price
  } =
    useGlobalContext();
  const {
    contract: { marketplaceContract },
    address: { marketplaceAddress },
  } = useLandshareNftContext();
  const [isLoading, setIsLoading] = useState(false);
  const totalMultiplier = numeral(product.multiplier).format("0.[00]").toString()
  const [tokenPriceUSD, setTokenPriceUSD] = useState("0")
  const [hasLandscaping, setHasLandscaping] = useState(false)
  const [hasGarden, setHasGarden] = useState(false)

  const { buyProduct } = useBuyHouse(chainId, product, address, setIsLoading, getProducts);

  useEffect(() => {
    if (price) {
      setTokenPriceUSD(numeral(Number(price)).format("0.[000]"))
    // (async () => {
    //   const tokenPriceData = await axios(gameSetting.landshareCostApi);

    //   setTokenPriceUSD(numeral(
    //     Number(tokenPriceData.data.landshare.usd)
    //   ).format("0.[000]"));
    // })()
    }
    
  }, [price])

  const getHouseImageUrl = () => {
    if (product) {
      if (product.isRare) {
        if (product.isActivated && (hasLandscaping)) {
          if (hasGarden) {
            return (product.type == 1 || product.type == 2)
              ? HouseGardenRareNft
              : (product.type == 3 || product.type == 4) ? HouseBGardenRareNft : HouseCRareNft;
          } else {
            return (product.type == 1 || product.type == 2)
              ? HouseLandRareNft
              : (product.type == 3 || product.type == 4) ? HouseBLandRareNft : HouseCRareNft;
          }
        } else {
          return (product.type == 1 || product.type == 2) ? HouseRareNft : (product.type == 3 || product.type == 4) ? HouseBRareNft : HouseCRareNft;
        }
      } else {
        if (product.isActivated && (hasLandscaping)) {
          if (hasGarden) {
            return (product.type == 1 || product.type == 2) ? HouseGardenNft : (product.type == 3 || product.type == 4) ? HouseBGardenNft : HouseCNft;
          } else {
            return (product.type == 1 || product.type == 2) ? HouseLandNft : (product.type == 3 || product.type == 4) ? HouseBLandNft : HouseCNft;
          }
        } else {
          return (product.type == 1 || product.type == 2) ? HouseNft : (product.type == 3 || product.type == 4) ? HouseBNft : HouseCNft;
        }
      }
    }
    return (product.type == 1 || product.type == 2) ? HouseNft : (product.type == 3 || product.type == 4) ? HouseBNft : HouseCNft;
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

  useEffect(() => {
    (async () => {
      if (!product.isActivated) return

      const tempHasLandscaping = await checkHasLandscaping(product.id)
      const tempHasGarden = await checkHasGarden(product.id)

      setHasLandscaping(tempHasLandscaping)
      setHasGarden(tempHasGarden)
    })()
  }, [product])

  return (
    <div className="marketplace-item cards-hover-animation d-flex flex-column">
      <div className="marketplace-header position-relative">
        <div className="marketplace-title position-absolute top-0 w-100 text-center p-2">
          {getHouseName()}
        </div>
    
        <img
          src={getHouseImageUrl()}
          alt="marketplace-image-house"
          className="marketplace_img-house "
        />
     
        <div className="d-flex align-items-end position-absolute w-100 justify-content-between card-current-multipler">
          <div className="current-multiplier">
            <span className="value fs-14 fw-600">
              x
              {numeral(totalMultiplier).format("0.[0]").toString()}{" "}
            </span>
            <span className="label fw-600">LAND &nbsp;Yield/Year</span>
          </div>
          <div className="mb-1 info-icon">
            <Link to={generateURL()}>
              <InfoIconMarketPlaceItem />
            </Link>
          </div>
        </div>
      </div>
      <div className="nft-house-body d-flex flex-column p-3">
        <div className="nft-house-content">
          <div className="d-flex justify-content-between nft-house-durability align-items-end pb-2">
            <div className="house-item-label1 fs-15 fw-600 d-flex justify-content-between pe-1 dark:text-tw-text-secondary">
              <span>Durability</span>
            </div>
            <ReparingStatus
              max={product.maxDurability}
              now={product.lastDurability}
              usePercentWidth={true}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end pe-2 pt-1 ">
          <div className="house-item-label2 fs-xxs fw-600 dark:text-tw-text-secondary">Remaining</div>
          <div className="house-item-value fs-xxs fw-600">
            {(Number(product.tokenHarvestLimit) + Number(product.extendedBalance) - Number(product.totalHarvestedToken)).toFixed(2)}
          </div>
        </div>
        <div className="d-flex pt-3 w-100 justify-content-sm-end marketplace-buy market-buy">
          <div className="d-flex switch-btn  active align-items-center position-relative">
            <div className="d-block fs-14 text-black-700 align-items-end justify-content-center">
              <div>
                <span className="fs-14 fw-600">
                  {product.salePrice}
                </span>
                <span className="fs-10 fw-600 ms-1"> LAND</span>
              </div>
              <div>
                <span className="fs-12 fw-500 text-muted">
                  ${(product.salePrice * tokenPriceUSD).toFixed(2)}
                </span>
                <span className="fs-10 fw-500 ms-1 text-muted">USD</span>
              </div>
            </div>
            <button
              onClick={buyProduct}
              disabled={
                isLoading ||
                product.seller.toLowerCase() == account.toLowerCase() ||
                product.state == 1
              }
              className={`btn btn-switch-sale fs-16 fw-700 d-flex align-items-center justify-content-center position-absolute 
              ${product.seller.toLowerCase() == account.toLowerCase() ||
                  product.state == 1
                  ? "item-owned"
                  : ""
                }`}
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
              ) : product.seller.toLowerCase() == account.toLowerCase() ? (
                "OWNED"
              ) : (
                "BUY"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(MarketplaceItem);
