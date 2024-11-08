import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import ReactLoading from "react-loading";
import NftDetails from "./detail";
import Topbar from "../../common/topbar";
import YouOwn from "../../common/you-own";
import MainTabs from "../../components/common/tab/Tab";
import PremiumNfts from "../../mint-premium-nfts";
import UpgradeListTable from "./upgrade-list-table";

import ProductionUpgrade from "../production-upgrade";
import YieldUpgrades from "../yield-upgrade";
import { useGlobalContext } from "../../../context/GlobalContext";
import ConnectWallet from "../../connect-wallet";
import useGetHouse from "../../../hooks/nft-game/axios/useGetHouse";

const NftPage = () => {
  const { isConnected } = useAccount();
  const {
    isAuthenticated,
  } = useGlobalContext();

  const router = useRouter()
  const { houseId } = router.query as { houseId: string };
  const { house, setHouse, getHouse, isLoading: isPageLoading } = useGetHouse(houseId);


  const tabItems = [
    {
      id: "Yield Upgrades",
      children: (
        <YieldUpgrades
          house={house}
          setHouse={setHouse}
        />
      ),
    },
    {
      id: "Production Upgrades",
      children: (
        <ProductionUpgrade
          house={house}
          setHouse={setHouse}
        />
      ),
    },
    {
      id: "Premium Upgrades",
      children: (
        <PremiumNfts
          house={house}
          getHouse={getHouse}
        />
      ),
    },
    {
      id: "Upgrade List Table",
      children: (
        <UpgradeListTable
          house={house}
        />
      ),
    },
  ];


  useEffect(() => {
    if (!isAuthenticated) return;
    if (!house.isActivated) return;

    // const interval = setInterval(() => {
    getHouse();
    // }, 60000);

    // return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <>
      {isPageLoading ? (
        <div className="flex w-full min-h-[60vh] h-full items-center justify-center">
          <ReactLoading type="bars" color="#61cd81" />
        </div>
      ) : (
        <>
          <div className="relative max-w-[1200px] px-0 m-auto flex flex-col pt-0 bg-primary">
            {(!isAuthenticated) ? (
              <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
                <ConnectWallet />
              </div>
            ) : (
              <>
                <Topbar isNftList={false} />
                <NftDetails
                  house={house}
                  setHouse={setHouse}
                  getHouse={getHouse}
                />
                {house.name && (
                  <div className="mainTabs-styles">
                    <MainTabs tabItems={tabItems} />
                  </div>
                )}
              </>
            )}
          </div>
          {isConnected && isAuthenticated && (
            <YouOwn />
          )}
        </>
      )}
    </>
  );
};

export default NftPage;
