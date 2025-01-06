import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Topbar from "../common/topbar";
import YouOwn from "../common/you-own";
import MarketplaceItems from "./items"
import ConnectWallet from "../connect-wallet";
import { SelectarrowIcon } from "../common/icons/index";
import useGetMarketplaceItems from "../../hooks/nft-game/axios/useGetMarketplaceItems";
import useLogin from "../../hooks/nft-game/axios/useLogin";
import { useGlobalContext } from "../../context/GlobalContext";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function MarketplacePage() {
  const { isConnected, address } = useAccount();
  const [isItemsLoading, setIsItemsLoading] = useState(true);
  const {
    getProducts,
    products,
  } = useGetMarketplaceItems(setIsItemsLoading)
  const { checkIsAuthenticated, isLoading: isLoginLoading } = useLogin()
  const {
    theme,
    isAuthenticated
  } = useGlobalContext();
  const [searchData, setSearchData] = useState({
    searchType: "all_active",
    sortType: "date",
  });

  useEffect(() => {
    if (isConnected && isAuthenticated == false) { checkIsAuthenticated(address) }
  }, [isConnected])


  const changeMarketplaceView = (value: string) => {
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

  const changeMarketplaceSort = (value: string) => {
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
      <div className="relative max-w-[1200px] m-auto pt-0">
        {(!isLoginLoading && !isConnected && isItemsLoading == false) ? (
          <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
            <ConnectWallet />
          </div>
        ) : (
          <>
            <Topbar isNftList={true} />
            <div className="flex w-full flex-col md:flex-row overflow-auto flex-wrap items-center justify-between px-2">
              <span className={`text-[24px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>House NFTs</span>
              <div className="border-b-[1px] border-[#00000050] w-full hidden md:block my-3"></div>
              <div className="grid grid-cols-2">
                <div className="flex ms-4 sm:ms-1 items-center">
                  <label
                    htmlFor="marketplace-view"
                    className={`inline-block whitespace-nowrap mr-1 text-[16px] ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"}`}
                  >
                    View:
                  </label>
                  <div className="relative mr-2">
                    <select
                      className={`cursor-pointer w-full whitespace-nowrap text-ellipsis overflow-hidden py-[0.375rem] pl-[0.75rem] pr-[2.25rem] appearance-none bg-transparent bg-none focus-visible:outline-none ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"}`}
                      name="marketplace-view"
                      id="marketplace-view"
                      onChange={(e) => changeMarketplaceView(e.target.value)}
                    >
                      <option value="all" className="text-black">Available NFTs</option>
                      <option value="mine" className="text-black">My NFTs</option>
                    </select>
                    <SelectarrowIcon className="absolute right-[4px] top-[50%] translate-y-[-50%]" />
                  </div>
                </div>
                <div className="flex ms-4 sm:ms-1 items-center">
                  <label
                    htmlFor="marketplace-sort"
                    className={`inline-block whitespace-nowrap mr-1 text-[16px] ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"}`}
                  >
                    Sort by:
                  </label>
                  <div className="relative mr-2">
                    <select
                      className={`cursor-pointer whitespace-nowrap text-ellipsis py-[0.375rem] pl-[0.75rem] pr-[2.25rem] appearance-none bg-transparent bg-none focus-visible:outline-none ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"}`}
                      name="marketplace-sort"
                      id="marketplace-sort"
                      onChange={(e) => changeMarketplaceSort(e.target.value)}
                    >
                      <option value="date" className="text-black">Date</option>
                      <option value="price" className="text-black">Price</option>
                    </select>
                    <SelectarrowIcon className="absolute right-[4px] top-[50%] translate-y-[-50%]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b-[1px] border-[#00000050] block w-full mb-4 my-3"></div>

            <MarketplaceItems
              isLoading={isItemsLoading}
              products={products}
              getProducts={getProducts}
            />
          </>
        )}
      </div>
      {isConnected && !isLoginLoading && (
        <YouOwn />
      )}
    </>
  );
};
