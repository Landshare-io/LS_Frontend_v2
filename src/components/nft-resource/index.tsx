import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import ReactLoading from "react-loading";
import { useAccount } from "wagmi";
import { bsc } from "viem/chains";
import backendAxios from "../../hooks/nft-game/axios/nft-game-axios";
import { ChargeIcon, LumberIcon } from "../common/icons/nft";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useSetPremiumNftSaleHandler from "../../hooks/nft-game/nft-resource/useSetPremiumNftSaleHandler";
import { useGlobalContext } from "../../context/GlobalContext";
import Topbar from "../common/topbar";
import YouOwn from "../common/you-own";
import "./NftResource.css";
import ResourceCard from "./resource-card";
import { BigNumberish, formatEther } from "ethers";
import ConnectWallet from "../connect-wallet";
import { validateResource } from "../../utils/helpers/validator";
import PremiumNft from "../premium-nft";
import { QuestionIcon } from "../common/icons";
import sadEmoji from "../../assets/img/icons/sad_emoji.png";
import sadEmojiWhite from "../../assets/img/icons/sad_emoji_white.png";
import useGetPremiumNfts from "../../hooks/nft-game/premium-nfts/useGetPremiumNfts";
import useGetSetting from "../../hooks/nft-game/axios/useGetSetting";
import useGetLumberGatherStatus from "../../hooks/nft-game/axios/useGetLumberGatherStatus";
import useGetResource from "../../hooks/nft-game/axios/useGetResource";
import useGetPrice from "../../hooks/get-apy/useGetPrice";
import useBuyPowerWithLandToken from "../../hooks/nft-game/nft-resource/useBuyPowerWIthLandToken";
import { BOLD_INTER_TIGHT, PREMIUM_NFT_CONTRACT_ADDRESS } from "../../config/constants/environments";

import ResourceLandshare from "../../assets/img/icons/resource-landshare.png";
import ResourceLumber from "../../assets/img/icons/resource-lumber.png";
import ResourcePower from "../../assets/img/icons/resource-power.png";
import marble from "../../assets/img/marketplace-property/marble.png";
import pool from "../../assets/img/marketplace-property/pool.png";
import tile from "../../assets/img/marketplace-property/tile.png";

export const NftResource = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId()
  const {
    notifySuccess,
    notifyError,
    theme,
    isAuthenticated
  } = useGlobalContext();

  const { data: landTokenBalance, refetch: refetchBalance } = useBalanceOfLandToken({ chainId, address }) as { data: BigNumberish, refetch: Function }
  const { premiumNfts } = useGetPremiumNfts(chainId, address)
  const { powerPerLumber, oneDayTime, powerPerLandtoken } = useGetSetting()
  const { gatheringLumberStatus, todayLumber, isHavingTree, getHavingTreeData, setGatherStatus } = useGetLumberGatherStatus(oneDayTime)
  const { setPremiumNftsOnSale, isLoading: loader, setPremiumNftsOffSale } = useSetPremiumNftSaleHandler(chainId, address)
  const { resource, maxPowerLimit, setResource } = useGetResource()
  const { price } = useGetPrice(bsc.id)
  const landtokenPrice = numeral(Number(price)).format("0.[000]")

  const images: Record<any, any> = {
    "Porcelain Tile": tile,
    "Pool Table": pool,
    "Marble Countertops": marble
  }
  const [isLoading, setIsLoading] = useState([false, false]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [powerToBuy, setPowerToBuy] = useState("5");
  const [gatheringLumber, setGatheringLumber] = useState("1");

  const { buyPowerWithLandtoken } = useBuyPowerWithLandToken(chainId, refetchBalance, setIsLoading)

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    setGatherStatus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getHavingTreeData();
      setGatherStatus();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const buyPower = async () => {
    setIsLoading([true, false]);
    if (!isAuthenticated) {
      setIsLoading([false, false]);
      return notifyError("Please login!");
    }

    if (Number(resource[0]) + Number(powerToBuy) >= Number(maxPowerLimit)) {
      setIsLoading([false, false]);
      return notifyError("Couldn't buy power more than max limit");
    }

    const requiredLandToken = numeral(Number(powerToBuy) / powerPerLandtoken).format('0.[00]')

    if (Number(requiredLandToken) > Number(landTokenBalance)) {
      setIsLoading([false, false]);
      return notifyError("Not enough LAND tokens");
    } else {
      await buyPowerWithLandtoken(powerToBuy, powerPerLandtoken);
    }
  };

  const gatherLumber = async () => {
    setIsLoading([false, true]);
    if (!isAuthenticated) {
      setIsLoading([false, false]);
      return notifyError("Please login!");
    }

    if ((Number(gatheringLumber) >= 1) && (Number(gatheringLumber) <= 3)) {
      const maxCountToGather = isHavingTree ? 3 : 2;
      if (Number(todayLumber) + Number(gatheringLumber) <= maxCountToGather) {
        if (await validateResource(resource, [Number(powerPerLumber) * Number(gatheringLumber), 0, 0, 0, 0])) {
          try {
            const { data } = await backendAxios.post('/has-item/gather-lumber', {
              gatheringLumber: gatheringLumber
            })

            setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])
            await setGatherStatus()
            notifySuccess(`Gather ${gatheringLumber} Lumber successfully`)
            setIsLoading([false, false]);
          } catch (error: any) {
            console.log(error)
            setIsLoading([false, false]);
            return notifyError(error.response.data.message);
          }
        } else {
          setIsLoading([false, false]);
          return notifyError("No enough power amount");
        }
      } else {
        setIsLoading([false, false]);
        return notifyError("Exceed limit of gathering per day");
      }
    } else {
      setIsLoading([false, false]);
      return notifyError("You can gather limit is 3 lumbers");
    }
  };

  return (
    <>
      <section className="bg-primary text-text-primary">
        <div className="max-w-[1200px] px-0 m-auto flex flex-col pt-0">
          {(!isConnected) ? (
            <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
              <ConnectWallet />
            </div>
          ) : (
            <>
              <Topbar isNftList />
              <span className={`text-[16px] ${BOLD_INTER_TIGHT.className}`}>Resources</span>
              <div className={`h-0 border-b ${theme == 'dark' ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} block w-full mb-5 mt-3`}></div>
              <div
                className={`flex w-full min-h-[60vh] h-full items-center justify-center ${isPageLoading ? "grid" : "hidden"}`}
              >
                <ReactLoading type="bars" color="#61cd81" />
              </div>
              <div
                className={`flex pb-[20px] mlg:grid mlg:grid-cols-[minmax(251px, max-content),minmax(251px, max-content)] mlg:justify-between mlg:gap-[4rem] lg:grid-cols-[minmax(251px, max-content),minmax(251px, max-content),minmax(251px, max-content)] xl:grid-cols-[minmax(251px, max-content),minmax(251px, max-content),minmax(251px, max-content),minmax(251px, max-content)] mb-5 ${!isPageLoading ? "grid" : "hidden"}`}
              >
                <ResourceCard
                  title="LAND TOKENS"
                  subTitle={`Your Balance: ${numeral(Number(formatEther(landTokenBalance.toString())))
                    .format("0.[00]")
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} LAND`}
                  imgSrc={ResourceLandshare}
                  cost={{
                    value: numeral(Number(landtokenPrice)).format("0.[00]"),
                    description: "USD/LAND",
                  }}
                  background="linear-gradient(180deg, #31AF52 0%, #80CED9 100%)"
                >
                  <div className="d-flex flex-column resource-body justify-content-between">
                    <div className="position-relative d-flex flex-column align-items-center  h-100">
                      <span className={`fs-14 fw-500 ${theme == 'dark' ? "#bdbdbd" : "#545454"} text-center`}>
                        Use LAND Tokens to purchase additional power or repair
                        your house.
                      </span>
                      <div className="resource-selectable d-flex justify-content-center align-items-center position-absolute">
                        <a
                          href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"
                          target="_blank"
                        >
                          <button className="btn nav-btn fs-16 fw-600 text-button-text-secondary">
                            BUY
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </ResourceCard>
                <ResourceCard
                  title="Power"
                  subTitle={`${numeral(resource[0].toString()).format("0.[00]")} / 
                  ${maxPowerLimit.toString()}`}
                  imgSrc={ResourcePower}
                  cost={{
                    value: Number(numeral(powerPerLandtoken).format('0.[00]')),
                    description: "Power/LAND",
                  }}
                  background="linear-gradient(180deg, #4896F1 0%, rgba(119, 161, 210, 0.55) 100%)"
                >
                  <div className="d-flex flex-column resource-body justify-content-between">
                    <div className="d-flex flex-column gather-power-resource bg-secondary position-relative resource-body-content">
                      <div className="gather-resource-content">
                        <div className="d-flex justify-content-start align-items-center">
                          <span className="status-label me-2 text-text-secondary">POWER: </span>
                          <input
                            className={`lumber-count me-1 ${theme == 'dark' ? "bg-gray-600" : ""}`}
                            type="number"
                            step="1"
                            value={powerToBuy}
                            onChange={(e) => setPowerToBuy(e.target.value)}
                          />
                          <ChargeIcon iconColor={theme == 'dark' && "#cec9c9"} />
                        </div>
                        <div className="divider w-100"></div>
                        <div className="d-flex justify-content-start">
                          <div>
                            <span className="status-label me-2 text-text-secondary">Cost: </span>
                            <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[14px] font-[600] mr-[4px]`}>{`${numeral(
                              Number(powerToBuy) / Number(powerPerLandtoken)
                            ).format("0.[0000]")} LAND`}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`btn nav-btn w-100 buy-or-upgrade-btn position-absolute green text-button-text-secondary ${isLoading[0]
                          ? "d-flex justify-content-center align-items-center"
                          : ""
                          }`}
                        onClick={buyPower}
                        disabled={isLoading[0]}
                      >
                        {isLoading[0] ? (
                          <>
                            <ReactLoading
                              type="spin"
                              className="me-2 button-spinner"
                              width="24px"
                              height="24px"
                            />
                            <span className="upgrade-status">Loading</span>
                          </>
                        ) : (
                          "BUY"
                        )}
                      </button>
                    </div>
                  </div>
                </ResourceCard>
                <ResourceCard
                  title="Gather Lumber"
                  subTitle={
                    gatheringLumberStatus.canGather
                      ? `Available: ${isHavingTree ? 3 - todayLumber : 2 - todayLumber
                      } Lumber`
                      : `Cooldown: ${parseInt(
                        (gatheringLumberStatus.remainingTime /
                          oneDayTime) *
                        24
                      )} : ${((gatheringLumberStatus.remainingTime /
                        oneDayTime) *
                        24 -
                        parseInt(
                          (gatheringLumberStatus.remainingTime /
                            oneDayTime) *
                          24
                        )) *
                        60 >=
                        10
                        ? ""
                        : "0"
                      }${parseInt(
                        ((gatheringLumberStatus.remainingTime /
                          oneDayTime) *
                          24 -
                          parseInt(
                            (gatheringLumberStatus.remainingTime /
                              oneDayTime) *
                            24
                          )) *
                        60
                      )}`
                  }
                  imgSrc={ResourceLumber}
                  cost={{
                    value: `1 Lumber/${powerPerLumber} Power`,
                    description: "",
                  }}
                  background="linear-gradient(180deg, #A27E23 0%, rgba(167, 148, 83, 0.55) 100%)"
                >
                  <div className="d-flex flex-column resource-body justify-content-between">
                    <div className="d-flex flex-column gather-lumber-resource bg-secondary position-relative resource-body-content">
                      <div className="gather-resource-content">
                        <div className="d-flex justify-content-start align-items-center">
                          <span className="status-label me-2 text-text-secondary">Gather: </span>
                          <input
                            className={`lumber-count me-1 ${theme == 'dark' ? "bg-gray-600" : ""}`}
                            type="number"
                            step="1"
                            max={isHavingTree ? "3" : "2"}
                            disabled={!gatheringLumberStatus.canGather}
                            value={gatheringLumber}
                            onChange={(e) => setGatheringLumber(e.target.value)}
                          />
                          <LumberIcon iconColor={theme == 'dark' && "#cec9c9"} />
                        </div>
                        <div className="divider w-100"></div>
                        <div className="d-flex justify-content-start">
                          <div>
                            <span className="status-label me-2 text-text-secondary">Cost: </span>
                            <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[14px] font-[600]`}>
                              {Number(gatheringLumber) * Number(powerPerLumber)}{" "}
                              <ChargeIcon iconColor={theme == 'dark' && "#cec9c9"} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`btn nav-btn w-100 buy-or-upgrade-btn position-absolute yellow text-button-text-secondary ${isLoading[1]
                          ? "d-flex justify-content-center align-items-center"
                          : ""
                          }`}
                        onClick={gatherLumber}
                        disabled={
                          !gatheringLumberStatus.canGather || isLoading[1]
                        }
                      >
                        {isLoading[1] ? (
                          <>
                            <ReactLoading
                              type="spin"
                              className="me-2 button-spinner"
                              width="24px"
                              height="24px"
                            />
                            <span className="upgrade-status">Loading</span>
                          </>
                        ) : (
                          "Gather"
                        )}
                      </button>
                    </div>
                  </div>
                </ResourceCard>
                {/* <TokenCard /> */}
              </div>
              <span className="fw-bold fs-md">Premium Upgrades</span>
              <div className={`h-0 border-b ${theme == 'dark' ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} d-block w-100 mb-5 mt-3`}></div>
              {premiumNfts.length > 0 ? (
                <div className="premium-items-section my-2">
                  {premiumNfts.map((item, index) => (
                    <PremiumNft
                      key={`premium-item-${index}`}
                      premiumNft={item}
                      loader={loader}
                      onSubmit={(item: any, price: number) =>
                        item.marketplaceItem !== -1 ?
                          setPremiumNftsOffSale(item) : setPremiumNftsOnSale(PREMIUM_NFT_CONTRACT_ADDRESS[item.name][chainId], item, price)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="d-flex w-100 h-100 align-items-center justify-content-center no-item-ui">
                  <div className="no-item-text text-gray-500">No NFTs Found</div>
                  <img src={theme == 'dark' ? sadEmojiWhite : sadEmoji} alt="Sad Emoji" />
                  <div className="no-item-link">
                    <a
                      href="https://docs.landshare.io/"
                      target="_blank"
                      className={`no-item-hyper text-text-secondary"}`}
                    >
                      Learn More
                    </a>{" "}
                    <QuestionIcon />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      {isConnected && (
        <YouOwn />
      )}
    </>
  );
};
