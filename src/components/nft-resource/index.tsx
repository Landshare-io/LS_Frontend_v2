import numeral from "numeral";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useChainId } from "wagmi";
import ReactLoading from "react-loading";
import { useAccount } from "wagmi";
import { bsc } from "viem/chains";
import backendAxios from "../../hooks/nft-game/axios/nft-game-axios";
import { ChargeIcon, LumberIcon } from "../common/icons/nft";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useSetPremiumNftSaleHandler from "../../hooks/nft-game/nft-resource/useSetPremiumNftSaleHandler";
import { useTheme } from "next-themes";
import Topbar from "../common/topbar";
import YouOwn from "../common/you-own";
import ResourceCard from "./resource-card";
import { BigNumberish, formatEther } from "ethers";
import ConnectWallet from "../connect-wallet";
import { validateResource } from "../../utils/helpers/validator";
import PremiumNft from "../premium-nft";
import Button from "../common/button";
import { QuestionIcon } from "../common/icons";
import useGetPremiumNfts from "../../hooks/nft-game/premium-nfts/useGetPremiumNfts";
import useGetSetting from "../../hooks/nft-game/axios/useGetSetting";
import useGetLumberGatherStatus from "../../hooks/nft-game/axios/useGetLumberGatherStatus";
import useGetResource from "../../hooks/nft-game/axios/useGetResource";
import useGetPrice from "../../hooks/get-apy/useGetPrice";
import useBuyPowerWithLandToken from "../../hooks/nft-game/nft-resource/useBuyPowerWithLandToken";
import { BOLD_INTER_TIGHT, PREMIUM_NFT_CONTRACT_ADDRESS } from "../../config/constants/environments";
import sadEmoji from "../../../public/icons/sad_emoji.png";
import sadEmojiWhite from "../../../public/icons/sad_emoji_white.png";
import resourceLandshare from "../../../public/icons/resource-landshare.png";
import resourceLumber from "../../../public/icons/resource-lumber.png";
import resourcePower from "../../../public/icons/resource-power.png";
import marble from "../../../public/img/marketplace-property/marble.png";
import pool from "../../../public/img/marketplace-property/pool.png";
import tile from "../../../public/img/marketplace-property/tile.png";
import { useGlobalContext } from "../../context/GlobalContext";

export default function NftResource() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId()
  const {
    notifySuccess,
    notifyError,
    isAuthenticated
  } = useGlobalContext();
  const { theme } = useTheme();

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
        <div className="max-w-[1200px] px-0 m-auto flex flex-col pt-0 xl:px-[2px] px-[10px]">
          {(!isConnected) ? (
            <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
              <ConnectWallet />
            </div>
          ) : (
            <>
              <Topbar isNftList />
              <span className={`text-[24px] ${BOLD_INTER_TIGHT.className} px-2`}>Resources</span>
              <div className={`h-0 border-b ${theme == 'dark' ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} block w-full mb-12 px-2 my-3`}></div>
              <div className="flex w-full flex-col md:flex-row overflow-auto flex-wrap items-center justify-between px-2">
              
              
              <div
                className={`flex w-full min-h-[60vh] h-full items-center justify-center ${isPageLoading ? "grid" : "hidden"}`}
              >
                <ReactLoading type="bars" color="#61cd81" />
              </div>
              <div className="flex flex-row overflow-auto md:grid [@media(max-width:930px)]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-1 pb-5 last:m-0 mb-12">
                <ResourceCard
                  title="LAND TOKENS"
                  subTitle={`Your Balance: ${numeral(Number(formatEther(landTokenBalance.toString())))
                    .format("0.[00]")
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} LAND`}
                  imgSrc={resourceLandshare}
                  cost={{
                    value: numeral(Number(landtokenPrice)).format("0.[00]"),
                    description: "USD/LAND",
                  }}
                  cardClassName="bg-gradient-to-b from-[#31AF52] to-[#80CED9]"
                >
                  <div className="flex flex-col bg-[#6f8e9d66] h-[160px] justify-between py-[17px] px-[8px]">
                    <div className="relative flex flex-col items-center h-full">
                      <span className="text-[14px] font-medium text-center">
                        Use LAND Tokens to purchase additional power or repair your house.
                      </span>
                      <div className="bottom-0 left-[50%] translate-x-[-50%] flex justify-center items-center absolute">
                        <a
                          className="text-[#fff] no-underline"
                          href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"
                          target="_blank"
                        >
                          <Button className="text-[16px] font-semibold bg-[#61cd81] w-[171px] h-[40px] text-button-text-secondary rounded-[20px]">
                            BUY
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </ResourceCard>
                <ResourceCard
                  title="Power"
                  subTitle={`${numeral(resource[0].toString()).format("0.[00]")} / 
                  ${maxPowerLimit.toString()}`}
                  imgSrc={resourcePower}
                  cost={{
                    value: numeral(powerPerLandtoken).format('0.[00]'),
                    description: "Power/LAND",
                  }}
                  cardClassName="bg-gradient-to-b from-[#4896F1] to-[#77a1d28c]"
                >
                  <div className="flex flex-col resource-body bg-[#6f8e9d66] h-[160px] justify-between py-[17px] px-[8px]">
                    <div className="flex flex-col border-b-[2px] border-[#61cd81] rounded-[25px] border-[2px] border-[#61cd81] pt-[10px] bg-secondary relative h-[125px]">
                      <div className="px-[13px]">
                        <div className="flex justify-start items-center">
                          <span className="text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] mr-2 text-text-secondary">POWER: </span>
                          <input
                            className={`px-[5px] max-w-[50px] border-[1px] border-[#8d8d8d] rounded-[5px] text-[0.8rem] px-[5px] text-right focus-visible:outline-0 focus-visible:shadow-md mr-1 ${theme == 'dark' ? "bg-gray-600" : ""}`}
                            type="string"
                            step="1"
                            value={powerToBuy}
                            onChange={(e) => setPowerToBuy(e.target.value)}
                          />
                          <ChargeIcon iconColor={theme == 'dark' ? "#cec9c9" : ''} />
                        </div>
                        <div className="border-b-[1px] border-[#00000050] my-[5px] w-full"></div>
                        <div className="flex justify-start">
                          <div>
                            <span className="text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] mr-2 text-text-secondary">Cost: </span>
                            <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[14px] font-[600] mr-[4px]`}>
                              {`${numeral(Number(powerToBuy) / Number(powerPerLandtoken)).format("0.[0000]")} LAND`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute bg-[#61cd81] border-[2px] border-[#61cd81] text-button-text-secondary rounded-[20px] ${isLoading[0]
                          ? "flex justify-center items-center"
                          : ""
                          }`}
                        onClick={buyPower}
                        disabled={isLoading[0]}
                      >
                        {isLoading[0] ? (
                          <div className='flex justify-center items-center'>
                            <ReactLoading
                              type="spin"
                              className="mr-2 mb-[4px]"
                              width="24px"
                              height="24px"
                            />
                            <span className="font-semibold">Loading</span>
                          </div>
                        ) : (
                          "BUY"
                        )}
                      </Button>
                    </div>
                  </div>
                </ResourceCard>
                <ResourceCard
                  title="Gather Lumber"
                  subTitle={
                    gatheringLumberStatus.canGather
                      ? `Available: ${isHavingTree ? 3 - todayLumber : 2 - todayLumber
                      } Lumber`
                      : `Cooldown: 
                        ${parseInt(((Number(gatheringLumberStatus.remainingTime) / Number(oneDayTime)) * 24).toString())} : 
                        ${((Number(gatheringLumberStatus.remainingTime) / oneDayTime) * 24 - parseInt(((Number(gatheringLumberStatus.remainingTime) / Number(oneDayTime)) * 24).toString())) * 60 >= 10
                        ? ""
                        : "0"
                      }${(((Number(gatheringLumberStatus.remainingTime) / Number(oneDayTime)) * 24 - Number(parseInt(((Number(gatheringLumberStatus.remainingTime) / Number(oneDayTime)) * 24).toString()))) * 60)}`
                  }
                  imgSrc={resourceLumber}
                  cost={{
                    value: `1 Lumber/${powerPerLumber} Power`,
                    description: "",
                  }}
                  cardClassName="bg-gradient-to-b from-[#A27E23] to-[#a794538c]"
                >
                  <div className="flex flex-col bg-[#6f8e9d66] h-[160px] justify-between py-[17px] px-[8px]">
                    <div className="flex flex-col rounded-[25px] border-[2px] border-[#ec9821] pt-[10px] bg-secondary relative h-[125px]">
                      <div className="px-[13px]">
                        <div className="flex justify-start items-center">
                          <span className="text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] mr-2 text-text-secondary">Gather: </span>
                          <input
                            className={`px-[5px] max-w-[50px] border-[1px] border-[#8d8d8d] rounded-[5px] text-[0.8rem] px-[5px] text-right focus-visible:outline-0 focus-visible:shadow-md mr-1 ${theme == 'dark' ? "bg-gray-600" : ""}`}
                            type="string"
                            step="1"
                            max={isHavingTree ? "3" : "2"}
                            disabled={!gatheringLumberStatus.canGather}
                            value={gatheringLumber}
                            onChange={(e) => setGatheringLumber(e.target.value)}
                          />
                          <LumberIcon iconColor={theme == 'dark' ? "#cec9c9" : ''} />
                        </div>
                        <div className="border-b-[1px] border-[#00000050] w-full my-[5px]"></div>
                        <div className="flex justify-start">
                          <div className="flex items-center">
                            <span className="text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] mr-2 text-text-secondary">Cost: </span>
                            <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} flex items-center gap-[2px] text-[14px] font-semibold`}>
                              {Number(gatheringLumber) * Number(powerPerLumber)}{" "}
                              <ChargeIcon iconColor={theme == 'dark' ? "#cec9c9" : ''} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute bg-[#ec9821] border-[2px] border-[#ec9821] text-button-text-secondary rounded-[20px] ${isLoading[1]
                          ? "d-flex justify-content-center align-items-center"
                          : ""
                          }`}
                        onClick={gatherLumber}
                        disabled={
                          !gatheringLumberStatus.canGather || isLoading[1]
                        }
                      >
                        {isLoading[1] ? (
                          <div className='flex justify-center items-center'>
                            <ReactLoading
                              type="spin"
                              className="mr-2 mb-[4px]"
                              width="24px"
                              height="24px"
                            />
                            <span className="font-semibold">Loading</span>
                          </div>
                        ) : (
                          "Gather"
                        )}
                      </Button>
                    </div>
                  </div>
                </ResourceCard>
                {/* <TokenCard /> */}
              </div>
              
              </div>
              <span className={`text-[24px] ${BOLD_INTER_TIGHT.className} px-2 sm:mt-8`}>Premium Upgrades</span>
              <div className={`h-0 border-b ${theme == 'dark' ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} block w-full mb-12 mt-4 px-2`}></div>
              {premiumNfts.length > 0 ? (
                <div className="flex pb-[20px] mlg:grid mlg:grid-cols-[minmax(257px,max-content),minmax(257px,max-content)] mlg:justify-between mlg:gap-[4rem] lg:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] xl:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] my-2">
                  {premiumNfts.map((item, index) => (
                    <PremiumNft
                      key={`premium-item-${index}`}
                      premiumNft={item}
                      loader={loader}
                      onSubmit={(item: any, price: number) =>
                        item.marketplaceItem !== -1 ?
                          setPremiumNftsOffSale(item) : setPremiumNftsOnSale(item.name, item, price)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="flex w-full h-full items-center justify-center flex flex-col min-h-[40vh]">
                  <div className={`text-[20px] mb-[20px] text-gray-500 ${BOLD_INTER_TIGHT.className}`}>No NFTs Found</div>
                  <Image src={theme == 'dark' ? sadEmojiWhite : sadEmoji} alt="Sad Emoji" />
                  <div className="flex justify-center items-center mt-[20px]">
                    <a
                      href="https://docs.landshare.io/"
                      target="_blank"
                      className="text-center text-[16px] mr-[5px] text-text-secondary"
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
