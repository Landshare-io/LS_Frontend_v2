import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import numeral from "numeral";
import ReactModal from "react-modal";
import Slider from "react-slick";
import { useAccount, useChainId } from "wagmi";
import Topbar from "../common/topbar";
import YouOwn from "../common/you-own";
import { ChargeIcon } from "../common/icons/nft";
import RewardHarvest from "./reward-harvest";
import NftItems from "./nft/nft-items";
import ConnectWallet from "../connect-wallet";
import ProductionFacilities from "./facilities";
import NftItem from "./nft/nft-item";
import InputCost from "../common/input-cost";
import { BigNumberish, formatEther } from "ethers";
import Button from "../common/button";
import { BOLD_INTER_TIGHT, MAJOR_WORK_CHAINS } from "../../config/constants/environments";
import useGetHouses from "../../hooks/nft-game/axios/useGetHouses";
import useBalanceOfAsset from "../../hooks/contract/RWAContract/useBalanceOf";
import useBalanceOfLand from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useLogin from "../../hooks/nft-game/axios/useLogin";
import useGetResource from "../../hooks/nft-game/axios/useGetResource";
import useStakedBalance from "../../hooks/contract/AssetStakeContract/useStakedBalance";
import useHarvest from "../../hooks/nft-game/axios/useHarvest";
import useHandleBuyHouseSlots from "../../hooks/nft-game/axios/useHandleBuyHouseSlots";
import useGetSetting from "../../hooks/nft-game/axios/useGetSetting";
import useStake from "../../hooks/nft-game/axios/useStake";
import useGetNftCredits from "../../hooks/nft-game/apollo/useGetNftCredits";
import useWithdrawAsset from "../../hooks/nft-game/axios/useWithdrawAsset";
import useSecondaryTradingLimitOf from "../../hooks/contract/RWAContract/useSecondaryTradingLimitOf";
import { useGlobalContext } from "../../context/GlobalContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "next-themes";

const NFT_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/nft']

export default function InventoryPage() {
	const chainId = useChainId()
  const {
    isAuthenticated,
    notifyError,	
  } = useGlobalContext();
  const { theme } = useTheme();
  const { isConnected, address } = useAccount();
	const [harvestLoading, setHarvestLoading] = useState(false);
	const [buyHouseSlotLoading, setBuyHouseSlotLoading] = useState(false)
	const [depositLoading, setDepositLoading] = useState(false)
	const [withdrawLoading, setWithdrawLoading] = useState(false)
	const [depositAmount, setDepositAmount] = useState<number | string>("");
	const [depositedBalance, setDepositedBalance] = useState<number | string>("");

	const { houses: houseItems, getHouses } = useGetHouses()
	const { data: maxAssetTokenBalance, refetch: refetchDepositAmount } = useBalanceOfAsset(chainId, address) as { data: number, refetch: Function }
	const { data: landTokenBalance, refetch: refetchLandAmount } = useBalanceOfLand({ chainId, address }) as { data: BigNumberish, refetch: Function }
	const { data: stakedBalance, refetch: updateDepositedBalance } = useStakedBalance(chainId, address) as { data: number, refetch: Function }
	const { isLoading: isLoginLoading, checkIsAuthenticated } = useLogin()
	const { userReward, getResources } = useGetResource()
	const { harvest } = useHarvest(setHarvestLoading)
	const { buySlotCost, userActivatedSlots, setUserActivatedSlots, houseSlots, withdrawStakedCost, landRemaining } = useGetSetting()
	const { handleBuyHouseSlots } = useHandleBuyHouseSlots(chainId, address, setUserActivatedSlots, setBuyHouseSlotLoading)
	const { stake } = useStake(chainId, address, setDepositLoading)
	const { nftCredits, totalCredits } = useGetNftCredits(address)
	const { withdrawAssetTokenHandler } = useWithdrawAsset(chainId, address, setDepositLoading, setWithdrawLoading)
	const { data: tradingLimit } = useSecondaryTradingLimitOf(chainId, address) as { data: BigNumberish, refetch: Function }
  const [isLoading, setIsLoading] = useState(true);
  const [totalHarvestCost, setTotalHarvestCost] = useState(0);
  const [selectedResource, setSelectedResource] = useState([false, false, false, false, false])
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [showHarvestConfirm, setShowHarvestConfirm] = useState(false)
  const [showWithdrawAlert, setShowWithdrawAlert] = useState(false)

  const getHousesList = async () => {
    setIsLoading(true);
    await getHouses();
    await getResources();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500)
  }

  useEffect(() => {
    (async () => {
      if (!isConnected) return;
      if (isLoginLoading) return;
      if (!isAuthenticated) return;

      await updateDepositedBalance();
			setDepositedBalance(stakedBalance)

      await getHousesList()

      const interval = setInterval(async () => {
        await getHouses();
      }, 60000);

      return () => clearInterval(interval);
    })()
  }, [isAuthenticated, isLoginLoading, isConnected]);

  useEffect(() => {
    if (!isAuthenticated || !isConnected) setIsLoading(false)
    else setIsLoading(true)
  }, [isAuthenticated, isConnected])

  useEffect(() => {
    checkIsAuthenticated(address)
  }, [address])


  const confirmModalStyles: ReactModal.Styles = {
    content: {
      position: "fixed" as "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "300px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0,
      background: 'transparent'
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#00000080',
      zIndex: 99999
    }
  };
	const calcDepositMax = async () => {
    await refetchDepositAmount()
    setDepositAmount(maxAssetTokenBalance);
  };

  const handleHarvest = async () => {
    if (harvestLoading) return
    if (!localStorage.getItem("jwtToken-v2")) {
      setHarvestLoading(false);
      return notifyError("Please login!");
    }

    if (totalCredits >= 1000) {
      harvest(landRemaining, totalHarvestCost, selectedResource, setSelectedResource)
    } else {
      if (nftCredits < 0) return setShowHarvestConfirm(true)
      else harvest(landRemaining, totalHarvestCost, selectedResource, setSelectedResource)
    }
  };

  const buyHouseSlot = async () => {
    setBuyHouseSlotLoading(true)
    if (!localStorage.getItem("jwtToken-v2")) {
      setBuyHouseSlotLoading(false)
      return notifyError("Please login!");
    }

    const requiredLandToken = buySlotCost

    if (Number(requiredLandToken) > Number(formatEther(landTokenBalance))) {
      setBuyHouseSlotLoading(false)
      return notifyError("Not enough LAND tokens");
    } else {
      await handleBuyHouseSlots();
    }
  }


  const handleDeposit = async () => {
    if (depositLoading) return
    setDepositLoading(true)

    if (!localStorage.getItem("jwtToken-v2")) {
      setDepositLoading(false)
      return notifyError("Please login!");
    }

    if (houseItems.filter((house: any) => house.isActivated).length < 1) {
      setDepositLoading(false)
      return notifyError("Please Activate First");
    }

    if (depositAmount === "" || depositAmount === "0") {
      setDepositLoading(false)
      return notifyError("No deposit amount");
    }

    if (Number(depositAmount) % 1 != 0) {
      setDepositLoading(false)
      return notifyError("Please input Integer value");
    }

    if (Number(depositAmount) < 1) {
      setDepositLoading(false)
      return notifyError("Please input Integer value");
    }

    if (Number(depositAmount) > Number(maxAssetTokenBalance)) {
      setDepositLoading(false)
      return notifyError("Deposit amount should not be bigger than max amount");
    }

    if ((Number(stakedBalance) + Number(depositAmount)) >= Number(tradingLimit)) {
      setDepositLoading(false)
      return notifyError("Please increase your secondary trading limit. Please check details: https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/secondary-trading-limits");
    }

    if (userReward[4] > 0.1) {
      setDepositLoading(false);
      return notifyError("Harvest rewards before deposit");
    }

    stake(depositAmount);
  };

  const handleWithdraw = async () => {
    if (withdrawLoading) return
    setWithdrawLoading(true)
    if (!localStorage.getItem("jwtToken-v2")) {
      setWithdrawLoading(false)
      return notifyError("Please login!");
    }

    if (houseItems.filter((house: any) => house.isActivated).length < 1) {
      setWithdrawLoading(false)
      return notifyError("Please Activate First");
    }

    if (depositAmount === "" || depositAmount === "0") {
      setWithdrawLoading(false)
      return notifyError("No deposit amount");
    }

    if (Number(depositAmount) % 1 != 0) {
      setWithdrawLoading(false)
      return notifyError("Please input Integer value");
    }

    if (Number(depositAmount) < 1) {
      setWithdrawLoading(false)
      return notifyError("Please input Integer value");
    }

    if (Number(depositAmount) > Number(depositedBalance)) {
      setWithdrawLoading(false)
      return notifyError("Withdraw amount should not be less than deposited balance");
    }

    const pastUserReward = userReward
    if (Number(depositAmount) == Number(depositedBalance)) {
      if (Number(pastUserReward[4]) > 0.1) {
        setWithdrawLoading(false)
        return notifyError('Please harvest your token reward before withdraw.')
      } else {
        withdrawAssetTokenHandler(withdrawStakedCost, depositAmount)
      }
    } else {
      if (Number(pastUserReward[4]) > 0.1) {
        setWithdrawLoading(false)
        setShowWithdrawAlert(true)
      } else {
        withdrawAssetTokenHandler(withdrawStakedCost, depositAmount)
      }
    }
  };

  const settings = {
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 578,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const activatedHouses = houseItems.filter((house: any) => house.isActivated);
  const activatedHousesLength = activatedHouses.length;

	const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "300px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0,
      background: 'transparent'
    },
    overlay: {
      background: '#00000080',
      zIndex: 99999
    }
  }

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
   
      width: "90vw",
    
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0,
      maxWidth: "800px",
    },
    overlay: {
      background: "#00000080",
    },
  };

  return (
    <div className={`font-inter ${theme == 'dark' ? "dark" : ""}`}>
      <div className="bg-primary min-h-[calc(100vh-144px)]">
        {isLoginLoading || isLoading ? (
          <div className="flex w-full min-h-[60vh] h-full items-center justify-center">
            <ReactLoading type="bars" color="#61cd81" />
          </div>
        ) : (
          <>
            <div className="relative max-w-[1200px] px-0 m-auto overflow-hidden pt-0 pb-[100px] xl:px-[2px] px-[10px]">
              {(!isLoginLoading && (!isConnected || !isAuthenticated)) ? (
                <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
                  <ConnectWallet />
                </div>
              ) : (
                <>
                  {
                    (NFT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? (
                      <>
                        <Topbar isNftList={true} />
                        <div className="text-text-primary flex w-full flex-wrap items-center justify-between px-2">
                          <span className={`text-[24px] ${BOLD_INTER_TIGHT.className}`}>Your Properties</span>
                          <div className="border-b-[1px] border-[#00000050] dark:border-[#cbcbcb] block w-full mb-4 my-3"></div>
                          <div className="flex flex-col w-full pb-3">
                            <div className="flex flex-col gap-[30px] md:gap-0 md:flex-row items-center justify-between mb-5">
                              <div className="w-full my-[20px] md:w-[75%]">
                                {(houseItems?.length > 0) ? (
                                  <Slider {...settings}>
                                    {activatedHousesLength > 0 &&
                                      activatedHouses.map((houseItem, idx) => (
                                        <div
                                          className="flex justify-center md:pr-[40px]"
                                          key={`activated-house-item-${idx}`}
                                        >
                                          <NftItem house={houseItem} />
                                        </div>
                                      ))}

                                    {Array.from({ length: userActivatedSlots - activatedHousesLength }).map((_, index) => (
                                      <div
                                        className="flex justify-center md:pr-[40px]"
                                        key={`user-activated-slots-${index}`}
                                        onClick={() => setShowItemsModal(true)}
                                      >
                                        <div className="h-[378px] p-[16px] items-center justify-center text-cener border-[2px] border-dotted border-[#61cd81] w-[251px] cursor-pointer m-auto animate-[fadeIn] overflow-hidden duration-[1200] rounded-[16px] flex flex-col">
                                          <h2>Slot Available</h2>
                                          <p>Click here to add new NFT</p>
                                        </div>
                                      </div>
                                    ))}

                                    {Number(houseSlots) - Number(userActivatedSlots) > 0 && (
                                      <div className="flex justify-center md:pr-[40px]">
                                        <div className="h-[378px] p-[16px] items-center justify-center text-cener border-[2px] border-dotted border-[#61cd81] w-[251px] cursor-pointer m-auto animate-[fadeIn] overflow-hidden duration-300 rounded-[16px] shadow-md flex flex-col gap-[20px]">
                                          <div>
                                            <p>{`Add New Slot (${buySlotCost} LAND)`}</p>
                                          </div>
                                          <Button
                                            className={`w-auto h-[40px] px-4 py-2 bg-[#61cd81] rounded-[24px] text-[16px] text-button-text-secondary ${BOLD_INTER_TIGHT.className} ${buyHouseSlotLoading
                                              ? "flex justify-center items-center"
                                              : ""
                                              }`}
                                            onClick={() => buyHouseSlot()}
                                            disabled={buyHouseSlotLoading || houseSlots === userActivatedSlots}
                                          >
                                            {buyHouseSlotLoading ? (
                                              <div className='flex justify-center items-center'>
                                                <ReactLoading
                                                  type="spin"
                                                  className="me-2 mb-[4px]"
                                                  width="24px"
                                                  height="24px"
                                                />
                                                <span className="font-semibold">Loading</span>
                                              </div>
                                            ) : (
                                              "Buy House Slot"
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </Slider>
                                ) : (<div className={`text-center text-gray-500 ${BOLD_INTER_TIGHT.className}`}>No NFTs Found</div>)}
                              </div>

                              <div className="w-full ml-0 md:w-[280px] md:ml-[5px] text-[#000000b3] dark:text-white">
                                <div className="border-b-[1px] md:border-0 border-dashed border-[#000000] dark:border-[#cbcbcb]"></div>
                                <div className="flex mt-2 py-2 justify-between">
                                  <span className={`font-semibold text-[16px]`}>
                                    RWA Tokens Deposited:
                                  </span>
                                  <span className={`font-normal text-[16px]`}>
                                    {stakedBalance.toString()}{" "}
                                    {"LSRWA"}
                                  </span>
                                </div>
                                <div className="my-1 pt-1 flex flex-col mb-4">
                                  <div className="flex flex-col">
                                    <div className="deposite-input-box w-full mt-2 justify-content-center">
                                      <InputCost
                                        height={34}
                                        width={500}
                                        value={depositAmount}
                                        changeRepairAmount={setDepositAmount}
                                        calcMaxAmount={calcDepositMax}
                                      />
                                    </div>
                                    <div className="mt-2 pt-3 flex justify-between gap-[20px]">
                                      <Button
                                        onClick={handleDeposit}
                                        className={`w-full h-[40px] py-2 rounded-[24px] bg-[#61cd81] text-[16px] text-button-text-secondary ${BOLD_INTER_TIGHT.className}
                                					${((houseItems.filter((house: any) => house.isActivated).length < 1) || depositLoading) &&
                                          	" bg-[#8f8f8f] border-[2px] border-[#8f8f8f] "
                                          }
                                					${depositLoading
                                            ? " flex justify-center items-center"
                                            : ""
                                          }`}
                                        disabled={
                                          (houseItems.filter((house: any) => house.isActivated).length < 1) || depositLoading
                                        }
                                      >
                                        {depositLoading ? (
                                          <div className='flex justify-center items-center'>
                                            <ReactLoading
                                              type="spin"
                                              className="me-2 mb-[4px]"
                                              width="24px"
                                              height="24px"
                                            />
                                            <span className="font-semibold">
                                              Loading
                                            </span>
                                          </div>
                                        ) : (
                                          "Deposit"
                                        )}
                                      </Button>
                                      <Button
                                        onClick={handleWithdraw}
                                        className={`w-full h-[40px] py-2 rounded-[24px] bg-[#61cd81] text-[16px] text-button-text-secondary ${BOLD_INTER_TIGHT.className}
                                					${((houseItems.filter((house: any) => house.isActivated).length < 1) || withdrawLoading) &&
                                          " bg-[#8f8f8f] border-[2px] border-[#8f8f8f] "
                                          }
                                					${withdrawLoading
                                            ? "flex justify-center items-center"
                                            : ""
                                          }`}
                                        disabled={
                                          withdrawLoading || (houseItems.filter((house: any) => house.isActivated).length < 1)
                                        }
                                      >
                                        {withdrawLoading ? (
                                          <div className='flex justify-center items-center'>
                                            <ReactLoading
                                              type="spin"
                                              className="me-2 mb-[4px]"
                                              width="24px"
                                              height="24px"
                                            />
                                            <span className="font-semibold">
                                              Loading
                                            </span>
                                          </div>
                                        ) : (
                                          "Withdraw"
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <div className="border-b-[1px] md:border-0 border-dashed border-[#000000] mb-2"></div>
                                <div className="flex flex-row justify-between ">
                                  <div className="flex flex-col mr-3 justify-between py-1">
                                    <span className={`flex text-[16px] ${theme == 'dark' ? "text-gray-300" : "text-black-700"} items-center`}>
                                      Total Multiplier:
                                    </span>
                                    <span className={`flex text-[16px] ${theme == 'dark' ? "text-gray-300" : "text-black-700"} items-center`}>
                                      Annual Yield:
                                    </span>
                                    <span className={`flex text-[16px] ${theme == 'dark' ? "text-gray-300" : "text-black-700"} items-center`}>
                                      <span className="mr-1">LAND Remaining:</span>
                                    </span>
                                  </div>

                                  <div className="flex flex-col items-end justify-between gap-[10px] py-1">
                                    <span className="flex text-[16px] text-black-700 items-center">
                                      <span className={`${theme == 'dark' ? "text-white" : "text-black"} text-[16px]`}>
                                        x
                                        {numeral(
                                          houseItems.filter((house: any) => house.isActivated).length > 0 ?
                                            houseItems.filter((house: any) => house.isActivated).map((house: any) => house.multiplier).reduce((a, b) => a + b) : 0
                                        ).format("0.[0]").toString()}{" "}
                                        / 50 RWA
                                      </span>

                                    </span>
                                    <span className={`${theme == 'dark' ? "text-white" : "text-black"} text-[16px]`}>
                                      {`${numeral((
                                        Number(depositedBalance) * (
                                          houseItems.filter((house: any) => house.isActivated).length > 0 ?
                                            houseItems.filter((house: any) => house.isActivated).map((house: any) => house.multiplier).reduce((a, b) => a + b) : 0
                                        ) / 50
                                      ).toString()).format(
                                        "0.[0]"
                                      )} LAND`}
                                    </span>
                                    <span className={`${theme == 'dark' ? "text-white" : "text-black"} text-[16px]`}>
                                      {`${landRemaining} / ${numeral(
                                        Number(
                                          houseItems.filter((house: any) => house.isActivated).length > 0 ?
                                            houseItems.filter((house: any) => house.isActivated).map((house: any) => house.tokenHarvestLimit).reduce((a, b) => a + b) : 0
                                        ) +
                                        Number(
                                          houseItems.filter((house: any) => house.isActivated).length > 0 ?
                                            houseItems.filter((house: any) => house.isActivated).map((house: any) => house.extendedBalance).reduce((a, b) => a + b) : 0
                                        )
                                      ).format("0.[0]")}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className={`text-[24px] ${BOLD_INTER_TIGHT.className}`}>Harvestable resources</span>
                          <div className="border-b-[1px] border-b-[#00000050] dark:border-[#cbcbcb] block w-full mb-4 my-3"></div>
                          <div className="flex flex-col w-full">
                            <RewardHarvest
                              setTotalHarvestCost={setTotalHarvestCost}
                              selectedResource={selectedResource}
                              setSelectedResource={setSelectedResource}
                            />
                            <div className="flex pt-5 pb-5 lg:pb-4 justify-start md:justify-end">
                              <div
                                className={`flex h-[40px] w-full md:w-[282px] border-[1.5px] border-[#61cd81] rounded-[50px] active items-center relative`}
                              >
                                <span className={`flex text-[14px] ${theme == 'dark' ? "text-[#dee2e6]" : "text-[#000000b3]"} items-center justify-center pl-4`}>
                                  Cost:{" "}
                                  <span className={`flex items-center gap-[3px] ml-1 text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                                    {totalHarvestCost} {<ChargeIcon iconColor={theme == 'dark' ? "#cacaca" : "#4C4C4C"} />}
                                  </span>
                                </span>
                                <Button
                                  onClick={handleHarvest}
                                  className={`h-[40px] w-[159px] text-[16px] bg-[#61cd81] border-[1px] border-[#61cd81] rounded-[24px] text-[#fff] flex items-center justify-center ease duration-400 right-[-1px] absolute ${BOLD_INTER_TIGHT.className}
                          					${harvestLoading
                                      ? "flex justify-center items-center"
                                      : ""
                                    }`}
                                  disabled={harvestLoading}
                                >
                                  {harvestLoading ? (
                                    <div className='flex justify-center items-center'>
                                      <ReactLoading
                                        type="spin"
                                        className="me-2 mb-[4px]"
                                        width="24px"
                                        height="24px"
                                      />
                                      <span className="font-semibold">Loading</span>
                                    </div>
                                  ) : (
                                    "Harvest"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          <span className={`text-[24px] ${BOLD_INTER_TIGHT.className}`}>Production Facilities</span>
                          <div className="border-b-[1px] border-[#00000050] dark:border-[#cbcbcb] block w-full mb-4 my-3"></div>
                          <div className="flex flex-col w-full">
                            <ProductionFacilities />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col justify-center items-center text-center m-5 text-red-400 text-xl font-medium animate-[sparkling] h-[calc(100vh-25rem)]">
                        {`Please switch your chain to ${NFT_MAJOR_WORK_CHAIN.map(chain => chain.name).join(', ')}`}
                      </div>
                    )
                  }
                </>
              )}
            </div>
            <ReactModal
              style={modalStyles}
              isOpen={showItemsModal}
							onRequestClose={() => { setShowItemsModal(!showItemsModal), document.body.classList.remove('modal-open'); }}
            >
              <div className='px-3 py-7 bg-primary overflow-auto'>
                <NftItems
                  houseItems={houseItems.filter((house: any) => !house.isActivated)}
                />
              </div>
            </ReactModal>

            <ReactModal
							style={confirmModalStyles}
              isOpen={showHarvestConfirm}
							onRequestClose={() => { setShowHarvestConfirm(!showHarvestConfirm), document.body.classList.remove('modal-open'); }}
              className={`flex items-center ${theme == 'dark' ? "dark" : ""}`}
            >
              <div className="p-[20px] max-w-[300px] bg-third">
                <div className="text-[15px] text-center text-text-primary">
                  Rewards will not be harvested due to negative NFT Credit balance. Continue withdrawal?
                </div>
                <div className="flex mt-[20px]">
                  <div
                    className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] border-[1px] bg-[#00a8f3] cursor-pointer text-button-text-secondary"
                    onClick={() => {
                      setShowHarvestConfirm(false)
                      harvest(landRemaining, totalHarvestCost, selectedResource, setSelectedResource)
                    }}
                  >
                    Yes
                  </div>
                  <div
                    className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] cursor-pointer bg-primary text-text-secondary"
                    onClick={() => setShowHarvestConfirm(false)}
                  >
                    No
                  </div>
                </div>
              </div>
            </ReactModal>

            <ReactModal
							style={confirmModalStyles}
              isOpen={showWithdrawAlert}
							onRequestClose={() => { setShowWithdrawAlert(!showWithdrawAlert), document.body.classList.remove('modal-open'); }}
              className={`flex items-center ${theme == 'dark' ? "dark" : ""}`}
            >
              <div className="p-[20px] max-w-[300px] bg-third">
                <div className="text-[15px] text-center text-text-primary">
                  Withdrawing will reset all rewards. Continue? 
                </div>
                <div className="flex mt-[20px]">
                  <div
                    className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] border-[1px] bg-[#00a8f3] cursor-pointer text-button-text-secondary"
                    onClick={() => {
                      setShowWithdrawAlert(false)
                      setWithdrawLoading(true)
                      withdrawAssetTokenHandler(withdrawStakedCost, depositAmount)
                    }}
                  >
                    Yes
                  </div>
                  <div
                    className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] cursor-pointer bg-primary text-text-secondary"
                    onClick={() => {
                      setWithdrawLoading(false)
                      setShowWithdrawAlert(false)
                    }}
                  >
                    No
                  </div>
                </div>
              </div>
            </ReactModal>

            {isConnected && (
              <YouOwn />
            )}
          </>
        )}
      </div>
    </div>
  );
};
