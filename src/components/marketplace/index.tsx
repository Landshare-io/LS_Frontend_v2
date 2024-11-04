import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import backendAxios from "../../helper/axios";
import Topbar from "../Nft/topbar/Topbar";
import { useScreenFixedProvider } from "../../contexts/ScreenFixedProvider";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useLandshareNftContext } from "../../contexts/LandshareNftContext";
import YouOwn from "../Nft/YouOwn";
import { MarketplaceItems } from "./MarketplaceItems/MarketplaceItems";
import { PremiumNftItems } from "./PremiumNftItems/PremiumNftItems";
import { SelectarrowIcon } from "../../components/common/Icons";
import ConnectWallet from "../../components/ConnectWallet";
import "../Nft/nftList/Maintenance.css";
import MintModal from "../../components/mintModal";
import marble from "../../assets/img/marketplace-property/marble.png";
import pool from "../../assets/img/marketplace-property/pool.png";
import tile from "../../assets/img/marketplace-property/tile.png";
import useGetMarketplaceItems from "../../hooks/nft-game/axios/useGetMarketplaceItems";
import './Marketplace.css'

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const [isItemsLoading, setIsItemsLoading] = useState(true);
  const {
    getProducts,
    products,
    premiumProducts
  } = useGetMarketplaceItems(setIsItemsLoading)

  const { setNftRoute, setShowNftFooter } = useScreenFixedProvider();
  const {
    signer,
    account,
    isDarkMode,
    userResource,
    isAuthenticated,
    checkIsAuthenticated,
    premiumUpgradesList
  } = useGlobalContext();

  const [searchData, setSearchData] = useState({
    searchType: "all_active",
    sortType: "date",
  });

  const images = {
    "Porcelain Tile": tile,
    "Pool Table": pool,
    "Marble Countertops": marble
  }

  useEffect(() => {
    if (signer && isAuthenticated == false) { checkIsAuthenticated() }
  }, [signer])

  useEffect(() => {
    setNftRoute(true);
    setShowNftFooter(true);
    return () => {
      setNftRoute(false);
      setShowNftFooter(false);
    };
  }, []);


  const changeMarketplaceView = (value) => {
    setIsItemsLoading(true);
    getProducts({
      searchType: value,
      sortType: searchData.sortType,
    });
    setSearchData((preState) => ({
      ...preState,
      searchType: value,
    }));
  };

  const changeMarketplaceSort = (value) => {
    setIsItemsLoading(true);
    getProducts({
      searchType: searchData.searchType,
      sortType: value,
    });
    setSearchData((preState) => ({
      ...preState,
      sortType: value,
    }));
  };

  return (
    <>
      <div className="section-container nft-game-container pt-0">
        {signer === undefined || (!isConnected && setIsLoading == false) ? (
          <div className="text-center min-h-60vh d-flex flex-column justify-content-center align-items-center">
            <ConnectWallet />
          </div>
        ) : (
          <>
            <Topbar isNftList={true} />

            <div className="d-flex w-100 overflow-auto scrollbar-style flex-wrap align-items-center justify-conetent-between px-2 marketplace-wrapper">
              <span className="fw-bold fs-md">House NFTs</span>
              <div className="divider w-100 d-block d-md-none d my-3"></div>
              <div className="d-flex ms-md-4 marketplace-input-wrapper flex-nowrap flex-grow-1 justify-content-start justify-content-md-end marketplace-filter">
                <div className="d-flex ms-sm-4 ms-1 align-items-center">
                  <label
                    htmlFor="marketplace-view"
                    className={`d-inline-block white-space-nowrap me-1 fs-16 fw-500 ${isDarkMode ? "text-[#eaf3f3]" : "text-[#131414]"}`}
                  >
                    View:
                  </label>
                  <div className="position-relative marketplace-view-section me-2">
                    <select
                      className={`form-select ${isDarkMode ? "text-[#eaf3f3]" : "text-[#131414]"}`}
                      name="marketplace-view"
                      id="marketplace-view"
                      onChange={(e) => changeMarketplaceView(e.target.value)}
                    >
                      <option value="all">Available NFTs</option>
                      <option value="mine">My NFTs</option>
                    </select>
                    <SelectarrowIcon />
                  </div>
                </div>
                <div className="d-flex ms-sm-4 ms-1 align-items-center">
                  <label
                    htmlFor="marketplace-sort"
                    className={`d-inline-block white-space-nowrap me-1 fs-16 fw-500 ${isDarkMode ? "text-[#eaf3f3]" : "text-[#131414]"}`}
                  >
                    Sort by:
                  </label>
                  <div className="position-relative marketplace-sort-section me-2">
                    <select
                      className={`form-select ${isDarkMode ? "text-[#eaf3f3]" : "text-[#131414]"}`}
                      name="marketplace-sort"
                      id="marketplace-sort"
                      onChange={(e) => changeMarketplaceSort(e.target.value)}
                    >
                      <option value="date">Date</option>
                      <option value="price">Price</option>
                    </select>
                    <SelectarrowIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className="divider d-block w-100 mb-4 my-3"></div>

            <MarketplaceItems
              isLoading={isItemsLoading}
              products={products}
              getProducts={getProducts}
            />

            {/* <div className="d-flex w-100 overflow-auto scrollbar-style flex-wrap align-items-center justify-conetent-between px-2 marketplace-wrapper mt-4">
              <span className="fw-bold fs-md">Premium Upgrades</span>
            </div>
            <div className="divider d-block w-100 mb-4 my-3"></div>
            <PremiumNftItems
              isLoading={isItemsLoading}
              products={premiumProducts}
              getProducts={getProducts}
            /> */}
          </>
        )}
      </div>
      {signer !== "undefined" && isConnected && (
        <YouOwn
          resource={userResource.resource}
          maxPowerLimit={userResource.maxPowerLimit}
          landTokenBalance={userResource.landTokenBalance}
        />
      )}
    </>
  );
};
