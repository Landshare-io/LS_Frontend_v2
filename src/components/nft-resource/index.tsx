import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import ReactLoading from "react-loading";
import { useAccount, useDisconnect } from "wagmi";
import backendAxios from "../../hooks/nft-game/axios/nft-game-axios";
import ResourceLandshare from "../../assets/img/icons/resource-landshare.png";
import ResourceLumber from "../../assets/img/icons/resource-lumber.png";
import ResourcePower from "../../assets/img/icons/resource-power.png";

import { useGlobalContext } from "../../contexts/GlobalContext";
import { useLandshareNftContext } from "../../contexts/LandshareNftContext";
import { useScreenFixedProvider } from "../../contexts/ScreenFixedProvider";
import { ChargeIcon, LumberIcon } from "../common/icons/nft";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useGetItemsByOwner from "../../hooks/contract/PremiumNftContract/useGetItemsByOwner";

import Topbar from "../common/topbar";
import YouOwn from "../common/you-own";
import "./NftResource.css";
import ResourceCard from "./resource-card";
import { BigNumberish, ethers } from "ethers";
import ConnectWallet from "../connect-wallet";
import marble from "../../assets/img/marketplace-property/marble.png";
import pool from "../../assets/img/marketplace-property/pool.png";
import tile from "../../assets/img/marketplace-property/tile.png";
import {
  validateItemOneDay,
  getMaxItemDate,
  getRemainingTime,
  validateResource,
  getHasPremiumNftIds,
  getPremiumNftAbleItems
} from "../../utils/helpers/validator";
import PremiumNft from "../premium-nft";
import { QuestionIcon } from "../common/icons";
import sadEmoji from "../../assets/img/icons/sad_emoji.png";
import sadEmojiWhite from "../../assets/img/icons/sad_emoji_white.png";
import { PORCELAIN_TILE_CONTRACT_ADDRESS, POOL_TALBE_CONTRACT_ADDRESS, MARBLE_COUNTEROPS_CONTRACT_ADDRESS } from "../../config/constants/environments";

export const NftResource = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId()
  const { setNftRoute, setShowNftFooter } = useScreenFixedProvider();
  const {
    settingContract,
    resourceContract,
    notifySuccess,
    notifyError,
    signer,
    userResource,
    setUserResource,
    provider,
    oneDayTime,
    premiumUpgradesList,
    premiumAbleTime,
    price,
    isDarkMode
  } = useGlobalContext();
  const {
    contract: {
      porcelainTileNewContract,
      poolTableNewContract,
      marbleCounteropsListNewContract
    }
  } = useLandshareNftContext();
  const { data: landTokenV2Balance } = useBalanceOfLandToken({ chainId, address }) as { data: BigNumberish }

  const itemsByOwnerOfPorcelain = useGetItemsByOwner(chainId, PORCELAIN_TILE_CONTRACT_ADDRESS[chainId], address)
  const itemsByOwnerOfPool = useGetItemsByOwner(chainId, POOL_TALBE_CONTRACT_ADDRESS[chainId], address)
  const itemsByOwnerOfMarble = useGetItemsByOwner(chainId, MARBLE_COUNTEROPS_CONTRACT_ADDRESS[chainId], address)

  const itemsByOwnerOfPremiumNft: Record<any, any> = {
    "Porcelain Tile": itemsByOwnerOfPorcelain,
    "Pool Table": itemsByOwnerOfPool,
    "Marble Countertops": itemsByOwnerOfMarble
  }
  const [gatheringLumberStatus, setGatheringLumberStatus] = useState({
    canGather: true,
    remainingTime: 0,
  });
  const images: Record<any, any> = {
    "Porcelain Tile": tile,
    "Pool Table": pool,
    "Marble Countertops": marble
  }
  const [isLoading, setIsLoading] = useState([false, false]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [powerToBuy, setPowerToBuy] = useState("5");
  const [gatheringLumber, setGatheringLumber] = useState("1");
  const [landtokenPrice, setLandtokenPrice] = useState("");
  const [isHavingTree, setIsHavingTree] = useState(false);
  const [powerPerLandtoken, setPowerPerLandtoken] = useState(
    50
  );
  const [powerPerLumber, setPowerPerLumber] = useState(
    15
  );
  const [todayLumber, setTodayLumber] = useState(0);
  const [premiumNfts, setPremiumNfts] = useState([]);
  const [loader, setLoader] = useState('')

  useEffect(() => {
    (async () => {
      const { data } = await backendAxios.get('/user/buy-power-cost')

      setPowerPerLandtoken(data)
    })()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    setNftRoute(true);
    setShowNftFooter(true);
    loadSetting();
    setGatherStatus();
    return () => {
      setShowNftFooter(false);
      setNftRoute(false);
    };
  }, []);

  const gettingPremiumItems = async () => {
    const premiumUpgrades = []
    for (let premiumUpgrade of premiumUpgradesList) {
      const { data: backendItems } = await backendAxios.get(`/has-premium-nft/get-user-premium-nfts/${premiumUpgrade.id}`)
      const { data: marketplaceItems } = await backendAxios.get(`/premium-nft-marketplace/${premiumUpgrade.id}`)
      const onChainItemsData = itemsByOwnerOfPremiumNft[premiumUpgrade.name]

      const hasNftIds = getHasPremiumNftIds(backendItems, premiumAbleTime)
      const ableNftIds = getPremiumNftAbleItems(onChainItemsData, hasNftIds)

      for (let i = 0; i < ableNftIds.length; i++) {
        premiumUpgrades.push({
          ...premiumUpgrade,
          name: premiumUpgrade.name,
          multiplier: premiumUpgrade.buyReward[9],
          imgSrc: images[premiumUpgrade.name],
          price: premiumUpgrade.buy[1],
          onChainId: ableNftIds[i].toString(),
          marketplaceItem:
            marketplaceItems.filter(item => item.type == premiumUpgrade.id && item.nftId == ableNftIds[i].toString()).length > 0 ?
              marketplaceItems.filter(item => item.type == premiumUpgrade.id && item.nftId == ableNftIds[i].toString())[0].id :
              -1
        })
      }
    }
    setPremiumNfts(premiumUpgrades)
  }

  useEffect(() => {
    if (!signer) return;
    getLandtokenPrice();
    getHavingTreeData();
    setGatherStatus();
  }, [signer]);

  useEffect(() => {
    if (!signer) return;

    gettingPremiumItems();
  }, [signer, premiumUpgradesList])

  useEffect(() => {
    const interval = setInterval(() => {
      getLandtokenPrice();
      getHavingTreeData();
      setGatherStatus();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const loadSetting = async () => {
    try {
      const { data } = await backendAxios.get('/setting/get-gather-power-cost');

      setPowerPerLumber(Number(data.value));
    } catch (error) {
      console.log(error.response.data.message, error)
    }
  };

  const getHavingTreeData = async () => {
    try {
      const { data } = await backendAxios.get('/has-item/having-tree');

      setIsHavingTree(data);
    } catch (error) {
      console.log(error.response.data.message, error)
    }
  };

  async function setGatherStatus() {
    try {
      const { data: gatherItems } = await backendAxios.get('/has-item/gather-status')
      const maxCountToGather = isHavingTree ? 3 : 2;
      let countGatheredToday = 0;

      for (const gatherItem of gatherItems) {
        if (validateItemOneDay(gatherItem, oneDayTime)) {
          countGatheredToday++
        }
      }
      if (countGatheredToday >= maxCountToGather) {
        setGatheringLumberStatus({
          canGather: false,
          remainingTime: getRemainingTime(getMaxItemDate(gatherItems), oneDayTime)
        })
      } else {
        setGatheringLumberStatus({
          canGather: true,
          remainingTime: 0
        })
      }
      setTodayLumber(countGatheredToday);
    } catch (error) {
      console.log(error.response.data.message, error)
    }
  }

  const buyPowerWithLandtoken = async () => {
    try {
      const requiredLandToken = numeral(powerToBuy / powerPerLandtoken).format('0.[00]')
      const { data: transactionData } = await backendAxios.post('/has-item/get-buy-power-transaction', {
        requiredLandToken: requiredLandToken
      })

      const sendedTransaction = await signer.sendTransaction(transactionData.transaction)
      sendedTransaction.wait().then(async (receipt) => {
        if (receipt.status) {
          const { data } = await backendAxios.post('/has-item/buy-power-with-land', {
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
            requiredLandToken: requiredLandToken,
            nonce: transactionData.nonce
          })

          setUserResource((prevState) => ({
            ...prevState,
            landTokenV2: landTokenV2Balance,
            resource: [data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel],
          }))

          setIsLoading([false, false]);
          notifySuccess(`Bought ${powerToBuy} Power successfully!`)
        } else {
          setIsLoading([false, false]);
          notifyError("Buy Power Error");
        }
      })
    } catch (error: any) {
      console.log("Buy Power Error: ", error);
      setIsLoading([false, false]);
      notifyError(error.response.data.message);
    }
  };

  const buyPower = async () => {
    setIsLoading([true, false]);
    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading([false, false]);
      return notifyError("Please login!");
    }

    if (Number(userResource.resource[0]) + Number(powerToBuy) >= Number(userResource.maxPowerLimit)) {
      setIsLoading([false, false]);
      return notifyError("Couldn't buy power more than max limit");
    }

    const requiredLandToken = numeral(powerToBuy / powerPerLandtoken).format('0.[00]')

    if (Number(requiredLandToken) > userResource.landTokenBalance) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Not enough LAND tokens");
    } else {
      await buyPowerWithLandtoken();
    }
  };

  const gatherLumber = async () => {
    setIsLoading([false, true]);
    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading([false, false]);
      return notifyError("Please login!");
    }

    if ((gatheringLumber >= 1) && (gatheringLumber <= 3)) {
      const maxCountToGather = isHavingTree ? 3 : 2;
      if (Number(todayLumber) + Number(gatheringLumber) <= maxCountToGather) {
        if (await validateResource(userResource, [Number(powerPerLumber) * gatheringLumber, 0, 0, 0, 0])) {
          try {
            const { data } = await backendAxios.post('/has-item/gather-lumber', {
              gatheringLumber: gatheringLumber
            })

            setUserResource((prevState) => ({
              ...prevState,
              resource: [data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel],
            }))
            await setGatherStatus()
            notifySuccess(`Gather ${gatheringLumber} Lumber successfully`)
            setIsLoading([false, false]);
          } catch (error) {
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

  const setPremiumNftsOnSale = async (item, price) => {
    setLoader(`${item.id}-${item.onChainId}`) // type-onChainId
    try {
      const isApprovedForAll = await contracts[item.name].isApprovedForAll(
        address,
        process.env.REACT_APP_ADMIN_WALLET_ADDRESS
      );

      if (!isApprovedForAll) {
        const transaction = await contracts[item.name].setApprovalForAll(process.env.REACT_APP_ADMIN_WALLET_ADDRESS, true);
        const receipt = await transaction.wait()
        if (receipt.status) {
          await setPremiumNftToOnSale(item, price);
        } else {
          setLoader('');
          notifyError("Approve error");
        }
      } else {
        await setPremiumNftToOnSale(item, price);
      }
    } catch (error) {
      setLoader('');
      return notifyError(`Set on-sale ${item.name} #${item.onChainId} was failed`);
    }
  }

  const setPremiumNftToOnSale = async (item, price) => {
    try {
      const approveTransaction = await contracts[item.name].approve(process.env.REACT_APP_ADMIN_WALLET_ADDRESS, item.onChainId);
      const approveReceipt = await approveTransaction.wait()
      if (approveReceipt.status) {
        const { data } = await backendAxios.post('/premium-nft-marketplace', {
          type: item.id,
          nftId: item.onChainId,
          price: price
        })

        await gettingPremiumItems()
        notifySuccess(`Set on-sale ${item.name} #${item.onChainId} successfully`)
        setLoader('')
      } else {
        setLoader('');
        notifyError("Approve error");
      }
    } catch (error) {
      console.log(error)
      setLoader('');
      return notifyError(error.response.data.message);
    }
  }

  const setPremiumNftsOffSale = async (item) => {
    setLoader(`${item.id}-${item.onChainId}`) // type-onChainId
    try {
      const { data } = await backendAxios.delete(`/premium-nft-marketplace?type=${item.id}&nftId=${item.onChainId}`)

      await gettingPremiumItems()
      notifySuccess(`Set off-sale ${item.name} #${item.onChainId} successfully`)
      setLoader('')
    } catch (error) {
      setLoader('');
      return notifyError(error.response.data.message);
    }
  }

  const getLandtokenPrice = async () => {
    // const tokenPriceData = await axios.get(gameSetting.landshareCostApi);
    // let tokenPriceUSD = numeral(
    //   Number(tokenPriceData.data.landshare.usd)
    // ).format("0.[000]");
    // setLandtokenPrice(tokenPriceUSD);
    setLandtokenPrice(numeral(
      Number(price)).format("0.[000]"))
  };

  return (
    <>
      <section className={`${isDarkMode ? "dark" : ""} bg-tw-primary text-tw-text-primary`}>
        <div className="nft-game-container d-flex flex-column pt-0">
          {(typeof signer === "undefined" || !isConnected) ? (
            <div className="text-center min-h-60vh d-flex flex-column justify-content-center align-items-center">
              <ConnectWallet />
            </div>
          ) : (
            <>
              <Topbar isNftList />
              <span className="fw-bold fs-md">Resources</span>
              <div className={`h-0 border-b ${isDarkMode ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} d-block w-100 mb-5 mt-3`}></div>
              <div
                className={`d-flex w-100 min-h-60vh h-100 align-items-center justify-content-center ${isPageLoading ? "page-loading" : "page-loading-disable"
                  }`}
              >
                <ReactLoading type="bars" color="#61cd81" />
              </div>
              <div
                className={`resources-section mb-5 ${!isPageLoading ? "page-loading" : "page-loading-disable"
                  }`}
              >
                <ResourceCard
                  title="LAND TOKENS"
                  subTitle={`Your Balance: ${numeral(
                    Number(
                      ethers.utils.formatEther(
                        userResource.landTokenBalance.toString()
                      )
                    )
                  )
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
                      <span className={`fs-14 fw-500 ${isDarkMode ? "#bdbdbd" : "#545454"} text-center`}>
                        Use LAND Tokens to purchase additional power or repair
                        your house.
                      </span>
                      <div className="resource-selectable d-flex justify-content-center align-items-center position-absolute">
                        <a
                          href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"
                          target="_blank"
                        >
                          <button className="btn nav-btn fs-16 fw-600 text-tw-button-text-secondary">
                            BUY
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </ResourceCard>
                <ResourceCard
                  title="Power"
                  subTitle={`${numeral(userResource.resource[0].toString()).format("0.[00]")} / 
                  ${userResource.maxPowerLimit.toString()}`}
                  imgSrc={ResourcePower}
                  cost={{
                    value: Number(numeral(powerPerLandtoken).format('0.[00]')),
                    description: "Power/LAND",
                  }}
                  background="linear-gradient(180deg, #4896F1 0%, rgba(119, 161, 210, 0.55) 100%)"
                >
                  <div className="d-flex flex-column resource-body justify-content-between">
                    <div className="d-flex flex-column gather-power-resource bg-tw-secondary position-relative resource-body-content">
                      <div className="gather-resource-content">
                        <div className="d-flex justify-content-start align-items-center">
                          <span className="status-label me-2 text-tw-text-secondary">POWER: </span>
                          <input
                            className={`lumber-count me-1 ${isDarkMode ? "bg-gray-600" : ""}`}
                            type="number"
                            step="1"
                            value={powerToBuy}
                            onChange={(e) => setPowerToBuy(e.target.value)}
                          />
                          <ChargeIcon iconColor={isDarkMode && "#cec9c9"} />
                        </div>
                        <div className="divider w-100"></div>
                        <div className="d-flex justify-content-start">
                          <div>
                            <span className="status-label me-2 text-tw-text-secondary">Cost: </span>
                            <span className={`${isDarkMode ? "text-[#cec9c9]" : "text-[#323131]"} text-[14px] font-[600] mr-[4px]`}>{`${numeral(
                              Number(powerToBuy) / Number(powerPerLandtoken)
                            ).format("0.[0000]")} LAND`}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`btn nav-btn w-100 buy-or-upgrade-btn position-absolute green text-tw-button-text-secondary ${isLoading[0]
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
                    <div className="d-flex flex-column gather-lumber-resource bg-tw-secondary position-relative resource-body-content">
                      <div className="gather-resource-content">
                        <div className="d-flex justify-content-start align-items-center">
                          <span className="status-label me-2 text-tw-text-secondary">Gather: </span>
                          <input
                            className={`lumber-count me-1 ${isDarkMode ? "bg-gray-600" : ""}`}
                            type="number"
                            step="1"
                            max={isHavingTree ? "3" : "2"}
                            disabled={!gatheringLumberStatus.canGather}
                            value={gatheringLumber}
                            onChange={(e) => setGatheringLumber(e.target.value)}
                          />
                          <LumberIcon iconColor={isDarkMode && "#cec9c9"} />
                        </div>
                        <div className="divider w-100"></div>
                        <div className="d-flex justify-content-start">
                          <div>
                            <span className="status-label me-2 text-tw-text-secondary">Cost: </span>
                            <span className={`${isDarkMode ? "text-[#cec9c9]" : "text-[#323131]"} text-[14px] font-[600]`}>
                              {Number(gatheringLumber) * Number(powerPerLumber)}{" "}
                              <ChargeIcon iconColor={isDarkMode && "#cec9c9"} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`btn nav-btn w-100 buy-or-upgrade-btn position-absolute yellow text-tw-button-text-secondary ${isLoading[1]
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
              <div className={`h-0 border-b ${isDarkMode ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} d-block w-100 mb-5 mt-3`}></div>
              {premiumNfts.length > 0 ? (
                <div className="premium-items-section my-2">
                  {premiumNfts.map((item, index) => (
                    <PremiumNft
                      key={`premium-item-${index}`}
                      premiumNft={item}
                      loader={loader}
                      onSubmit={(item, price) =>
                        item.marketplaceItem !== -1 ?
                          setPremiumNftsOffSale(item) : setPremiumNftsOnSale(item, price)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="d-flex w-100 h-100 align-items-center justify-content-center no-item-ui">
                  <div className="no-item-text text-gray-500">No NFTs Found</div>
                  <img src={isDarkMode ? sadEmojiWhite : sadEmoji} alt="Sad Emoji" />
                  <div className="no-item-link">
                    <a
                      href="https://docs.landshare.io/"
                      target="_blank"
                      className={`no-item-hyper text-tw-text-secondary"}`}
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
