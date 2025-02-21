import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import ReactLoading from "react-loading";
import NftDetails from "./detail";
import Topbar from "../../common/topbar";
import YouOwn from "../../common/you-own";
import MainTabs from "../../common/tabs";
import GamePremiumNfts from "../game-premium-nfts";
import UpgradeListTable from "./upgrade-list-table";
import ProductionUpgrade from "../production-upgrade";
import YieldUpgrades from "../yield-upgrade";
import { useTheme } from "next-themes";
import ConnectWallet from "../../connect-wallet";
import useGetHouse from "../../../hooks/nft-game/axios/useGetHouse";
import useLogin from "../../../hooks/nft-game/axios/useLogin";

const NftPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, address } = useAccount();
  const {
    isAuthenticated,
  } = useGlobalContext();

  const router = useRouter()
  const { houseId } = router.query as { houseId: string };
  const { isLoading: isLoginLoading, checkIsAuthenticated } = useLogin();
  const { house, setHouse, getHouse } = useGetHouse(houseId);

  useEffect(() => {
    checkIsAuthenticated(address)
  }, [address])

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
        <GamePremiumNfts
          house={house}
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

  const getHousesData = async () => {
    setIsLoading(true);
    getHouse();

    setTimeout(() => {
      setIsLoading(false);
    }, 1500)
  }

  useEffect(() => {
    if (!isAuthenticated || !isConnected) setIsLoading(false)
    else setIsLoading(true)
  }, [isAuthenticated, isConnected])

  useEffect(() => {
    if (!isConnected) return;
    if (isLoginLoading) return;
    if (!isAuthenticated) return;

    getHousesData();
  }, [isAuthenticated, isLoginLoading, isConnected]);

  return (
    <>
      {isLoginLoading || isLoading ? (
        <div className="flex w-full min-h-[60vh] h-full items-center justify-center">
          <ReactLoading type="bars" color="#61cd81" />
        </div>
      ) : (
        <>
          <div className="relative max-w-[1200px] px-0 m-auto flex flex-col pt-0 bg-primary px-2">
            {(!isLoginLoading && (!isConnected || !isAuthenticated)) ? (
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
                  <div className="mainTabs-styles mb-[30px] xl:mb-0 lg:mb-0">
                    <MainTabs tabItems={tabItems} />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {isConnected && isAuthenticated && (
        <YouOwn />
      )}
    </>
  );
};

export default NftPage;
