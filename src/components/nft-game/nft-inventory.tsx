import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import numeral from "numeral";
import { useDisconnect, useAccount, useChainId } from "wagmi";
import Topbar from "../common/topbar";
import YouOwn from "../common/you-own";
import { ChargeIcon } from "../common/icons/nft";


import { Harvestable } from "./harvestable/Harvestable";
import { NftItems } from "./Nft/nftList/NftItems";

import ConnectWallet from "../connect-wallet";

import { ProductionFacilities } from "./productionFacilities/ProductionFacilities";

import { useLandshareNftContext } from "../contexts/LandshareNftContext";
import "../components/inventory/nftList/Maintenance.css";
import NftItem from "./Nft/nftList/NftItem";
import { InputCost } from "./Nft/inputCost/InputCost";
import { Modal } from "../components/common/modal";
import { Modal as ReactModal } from "react-bootstrap";
import plusSlot from "../assets/img/icons/plus-slot.svg"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BigNumberish, ethers, formatEther } from "ethers";


import { MAJOR_WORK_CHAIN } from "../../config/constants/environments";
import useGetHouses from "../../hooks/nft-game/axios/useGetHouses";
import useBalanceOfAsset from "../../hooks/contract/RWAContract/useBalanceOf";
import useBalanceOfLand from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useLogin from "../../hooks/nft-game/axios/useLogin";
import useGetGameItems from "../../hooks/nft-game/axios/useGetGameItems";
import useGetResource from "../../hooks/nft-game/axios/useGetResource";
import { validateResource } from "../../utils/helpers/validator";
import useStakedBalance from "../../hooks/contract/AssetStakeContract/useStakedBalance";
import useHarvest from "../../hooks/nft-game/axios/useHarvest";
import useHandleBuyHouseSlots from "../../hooks/nft-game/axios/useHandleBuyHouseSlots";
import useGetSetting from "../../hooks/nft-game/axios/useGetSetting";
import useStake from "../../hooks/nft-game/axios/useStake";
import useGetNftCredits from "../../hooks/nft-game/apollo/useGetNftCredits";
import useWithdrawAsset from "../../hooks/nft-game/axios/useWithdrawAsset";
import useSecondaryTradingLimitOf from "../../hooks/contract/RWAContract/useSecondaryTradingLimitOf";
import { useGlobalContext } from "../../context/GlobalContext";


export default function InventoryPage() {
	const chainId = useChainId()
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
	const { isLoading: isLoginLoading } = useLogin(address)
	const { boostItemsList } = useGetGameItems()
	const { resource, userReward } = useGetResource()
	const { harvest } = useHarvest(setHarvestLoading)
	const { buySlotCost, userActivatedSlots, setUserActivatedSlots, houseSlots, withdrawStakedCost } = useGetSetting()
	const { handleBuyHouseSlots } = useHandleBuyHouseSlots(chainId, address, setUserActivatedSlots, setBuyHouseSlotLoading)
	const { stake } = useStake(chainId, address, setDepositLoading)
	const { nftCredits, totalCredits } = useGetNftCredits()
	const { withdrawAssetTokenHandler } = useWithdrawAsset(chainId, address, setDepositLoading, setWithdrawLoading)
	const { data: tradingLimit } = useSecondaryTradingLimitOf(chainId, address) as { data: BigNumberish, refetch: Function }
	
  const {
		theme,
    isAuthenticated,
    notifyError,	
  } = useGlobalContext();
  const {
    contract: { newStakeContract }
  } = useLandshareNftContext()
  const [isLoading, setIsLoading] = useState(false);
  const { disconnect } = useDisconnect();
  const [totalHarvestCost, setTotalHarvestCost] = useState(0);
  const [selectedResource, setSelectedResource] = useState([false, false, false, false, false])
  const [showItemsModal, setShowItemsModal] = useState(false)
  
  const [showHarvestConfirm, setShowHarvestConfirm] = useState(false)
  const [showWithdrawAlert, setShowWithdrawAlert] = useState(false)
  const [landRemaining, setLandRemaining] = useState(0);

  useEffect(() => {
    setLandRemaining(Number(numeral(
      Number(
        houseItems.filter((house: any) => house.isActivated).length > 0 ?
          houseItems.filter((house: any) => house.isActivated).map((house: any) => house.tokenHarvestLimit).reduce((a, b) => a + b) : 0
      ) +
      Number(
        houseItems.filter((house: any) => house.isActivated).length > 0 ?
          houseItems.filter((house: any) => house.isActivated).map((house: any) => house.extendedBalance).reduce((a, b) => a + b) : 0
      ) -
      Number(
        houseItems.filter((house: any) => house.isActivated).length > 0 ?
          houseItems.filter((house: any) => house.isActivated).map((house: any) => house.tokenReward).reduce((a, b) => a + b) : 0
      ) -
      Number(
        houseItems.filter((house: any) => house.isActivated).length > 0 ?
          houseItems.filter((house: any) => house.isActivated).map((house: any) => house.totalHarvestedToken).reduce((a, b) => a + b) : 0
      )
    ).format("0.[0]")))
  }, [houseItems])

  const getHousesList = async () => {
    setIsLoading(true);
    await getHouses();
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
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
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

  const slider = useRef();
  const activatedHouses = houseItems.filter((house: any) => house.isActivated);
  const activatedHousesLength = activatedHouses.length;

  return (
    <div className={`${theme == 'dark' ? "dark" : ""}`}>
      <div className="bg-primary">
        {isLoginLoading || isLoading ? (
          <div className="flex w-full min-h-[60vh] h-full items-center justify-center">
            <ReactLoading type="bars" color="#61cd81" />
          </div>
        ) : (
          <>
            <div className="relative max-w-[1200px] px-0 m-auto overflow-hidden pt-0 pb-[100px]">
              {(!isConnected || !isAuthenticated) ? (
                <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
                  <ConnectWallet />
                </div>
              ) : (
                <>
                  {
                    chainId == MAJOR_WORK_CHAIN.id ? (
                      <>
                        <Topbar isNftList={true} />
                        <div className="text-text-primary d-flex w-100 flex-wrap align-items-center justify-content-between px-2">
                          <span className="fw-bold fs-md">Your Properties</span>
                          <div className="divider d-block w-100 mb-4 my-3"></div>
                          <div className="d-flex flex-column w-100 pb-3">
                            <div className="properties-section-content mb-5">
                              <div className="slider-container">
                                {(houseItems?.length > 0) ? (
                                  <Slider {...settings}>
                                    {activatedHousesLength > 0 &&
                                      activatedHouses.map((houseItem, idx) => (
                                        <div
                                          className="d-flex justify-content-center m-margin"
                                          key={`activated-house-item-${idx}`}
                                        >
                                          <NftItem house={houseItem} />
                                        </div>
                                      ))}

                                    {Array.from({ length: userActivatedSlots - activatedHousesLength }).map((_, index) => (
                                      <div
                                        className="d-flex justify-content-center m-margin"
                                        key={`user-activated-slots-${index}`}
                                        onClick={() => setShowItemsModal(true)}
                                      >
                                        <div className="need-more-slots nft-house-item d-flex flex-column">
                                          <h2>Slot Available</h2>
                                          <p className="need-more-card-desc">Click here to add new NFT</p>
                                        </div>
                                      </div>
                                    ))}

                                    {Number(houseSlots) - Number(userActivatedSlots) > 0 && (
                                      <div className="d-flex justify-content-center m-margin">
                                        <div className="need-more-slots nft-house-item cards-hover-animation d-flex flex-column gap-[20px]">
                                          <div>
                                            <p className="need-more-card-desc">{`Add New Slot (${buySlotCost} LAND)`}</p>
                                          </div>
                                          <button
                                            className={`btn nav-btn w-auto px-4 py-2 br-md fs-xs fw-700 text-button-text-secondary ${buyHouseSlotLoading
                                              ? "d-flex justify-content-center align-items-center"
                                              : ""
                                              }`}
                                            onClick={() => buyHouseSlot()}
                                            disabled={buyHouseSlotLoading || houseSlots === userActivatedSlots}
                                          >
                                            {buyHouseSlotLoading ? (
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
                                              "Buy House Slot"
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Slider>
                                ) : (<div className="text-center font-bold text-gray-500">No NFTs Found</div>)}
                              </div>

                              <div className="show-properties-info">
                                <div className="dashed-divider d-md-none"></div>
                                <div className="d-flex mt-2 py-2  justify-content-between">
                                  <span className={`font-semibold fs-16 ${theme == 'dark' ? "text-white-700" : "text-black-700"}`}>
                                    RWA Tokens Deposited:
                                  </span>
                                  <span className={`fw-normal fs-xs ${theme == 'dark' ? "text-white" : "text-black"}`}>
                                    {depositedBalance}{" "}
                                    {"LSRWA"}
                                  </span>
                                </div>
                                <div className="my-1 pt-1 d-flex flex-column mb-4">
                                  <div className="d-flex flex-column">
                                    <div className="deposite-input-box w-full mt-2 justify-content-center">
                                      <InputCost
                                        height={34}
                                        width={500}
                                        value={depositAmount}
                                        changeRepairAmount={setDepositAmount}
                                        calcMaxAmount={calcDepositMax}
                                      />
                                    </div>
                                    <div className="mt-2 pt-3 flex justify-between">
                                      <button
                                        onClick={handleDeposit}
                                        className={`btn nav-btn py-2 br-md fs-xs fw-700 text-button-text-secondary
                                					${((houseItems.filter((house: any) => house.isActivated).length < 1) || depositLoading) &&
                                          	" btn-repair-disable "
                                          }
                                					${depositLoading
                                            ? " d-flex justify-content-center align-items-center"
                                            : ""
                                          }`}
                                        disabled={
                                          (houseItems.filter((house: any) => house.isActivated).length < 1) || depositLoading
                                        }
                                      >
                                        {depositLoading ? (
                                          <>
                                            <ReactLoading
                                              type="spin"
                                              className="me-2 button-spinner"
                                              width="24px"
                                              height="24px"
                                            />
                                            <span className="upgrade-status">
                                              Loading
                                            </span>
                                          </>
                                        ) : (
                                          "Deposit"
                                        )}
                                      </button>
                                      <button
                                        onClick={handleWithdraw}
                                        className={`btn nav-btn py-2 br-md fs-xs fw-700 text-button-text-secondary
                                					${((houseItems.filter((house: any) => house.isActivated).length < 1) || withdrawLoading) &&
                                          " btn-repair-disable "
                                          }
                                					${withdrawLoading
                                            ? "d-flex justify-content-center align-items-center"
                                            : ""
                                          }`}
                                        disabled={
                                          withdrawLoading || (houseItems.filter((house: any) => house.isActivated).length < 1)
                                        }
                                      >
                                        {withdrawLoading ? (
                                          <>
                                            <ReactLoading
                                              type="spin"
                                              className="me-2 button-spinner"
                                              width="24px"
                                              height="24px"
                                            />
                                            <span className="upgrade-status">
                                              Loading
                                            </span>
                                          </>
                                        ) : (
                                          "Withdraw"
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="dashed-divider mb-2 d-md-none"></div>
                                <div className="d-flex flex-row justify-content-between ">
                                  <div className="d-flex flex-column me-3 justify-content-between  py-1">
                                    <span className={`d-flex fs-xs ${theme == 'dark' ? "text-gray-300" : "text-black-700"} align-items-center`}>
                                      Total Multiplier:
                                    </span>
                                    <span className={`d-flex fs-xs ${theme == 'dark' ? "text-gray-300" : "text-black-700"} align-items-center`}>
                                      Annual Yield:
                                    </span>
                                    <span className={`d-flex fs-xs ${theme == 'dark' ? "text-gray-300" : "text-black-700"} align-items-center`}>
                                      <span className="me-1">LAND Remaining:</span>
                                    </span>

                                    {/* <span className="text-black fs-xs">
                              x
                              {numeral(
                                houseItems.filter(house => house.isActivated).length > 0 ?
                                  houseItems.filter(house => house.isActivated).map(house => house.multiplier).reduce((a, b) => a + b) : 0
                              ).format("0.[00]").toString()}{" "}
                              LAND
                            </span> */}
                                  </div>


                                  <div className="d-flex flex-column align-items-end justify-content-between  gap-[10px] py-1">
                                    <span className="d-flex fs-xs text-black-700 align-items-center">
                                      <span className={`${theme == 'dark' ? "text-white" : "text-black"} fs-xs`}>
                                        x
                                        {numeral(
                                          houseItems.filter((house: any) => house.isActivated).length > 0 ?
                                            houseItems.filter((house: any) => house.isActivated).map((house: any) => house.multiplier).reduce((a, b) => a + b) : 0
                                        ).format("0.[0]").toString()}{" "}
                                        / 50 RWA
                                      </span>

                                    </span>
                                    <span className={`${theme == 'dark' ? "text-white" : "text-black"} fs-xs`}>
                                      {`${numeral((
                                        Number(depositedBalance) * (
                                          houseItems.filter((house: any) => house.isActivated).length > 0 ?
                                            houseItems.filter((house: any) => house.isActivated).map((house: any) => house.multiplier).reduce((a, b) => a + b) : 0
                                        ) / 50
                                      ).toString()).format(
                                        "0.[0]"
                                      )} LAND`}
                                    </span>
                                    <span className={`${theme == 'dark' ? "text-white" : "text-black"} fs-xs`}>
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
                          <span className="fw-bold fs-md">Harvestable resources</span>
                          <div className="divider d-block w-100 mb-4 my-3"></div>
                          <div className="d-flex flex-column w-100">
                            <Harvestable
                              setTotalHarvestCost={setTotalHarvestCost}
                              selectedResource={selectedResource}
                              setSelectedResource={setSelectedResource}
                            />
                            <div className="d-flex pt-5 pb-5 pb-lg-4 justify-content-start justify-content-lg-end harvest-cost">
                              <div
                                className={`d-flex switch-btn active align-items-center position-relative`}
                              >
                                <span className={`d-flex fs-14 ${theme == 'dark' ? "text-gray-300" : "text-black-700"} align-items-center justify-content-center ps-4`}>
                                  Cost:{" "}
                                  <span className="fw-bold ms-1 text-text-primary">
                                    {totalHarvestCost} {<ChargeIcon iconColor={theme == 'dark' ? "#cacaca" : "#4C4C4C"} />}
                                  </span>
                                </span>
                                <button
                                  onClick={handleHarvest}
                                  className={`btn btn-switch-sale fs-16 fw-700 d-flex align-items-center justify-content-center position-absolute dark:text-button-text-secondary
                          ${harvestLoading
                                      ? "d-flex justify-content-center align-items-center"
                                      : ""
                                    }`}
                                  disabled={harvestLoading}
                                >
                                  {harvestLoading ? (
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
                                    "Harvest"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                          <span className="fw-bold fs-md">Production Facilities</span>
                          <div className="divider d-block w-100 mb-4 my-3"></div>
                          <div className="d-flex flex-column w-100">
                            <ProductionFacilities />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col justify-center items-center text-center m-5 text-red-400 text-xl font-medium animate-[sparkling-anim_3s_linear_infinite] h-[calc(100vh-25rem)]">
                        Chain not Supported / Switch to BSC
                      </div>
                    )
                  }
                </>
              )}
            </div>
            <Modal
              modalOptions={{
                centered: true,
                size: 'lg'
              }}
              modalShow={showItemsModal}
              setModalShow={setShowItemsModal}
            >
              <Modal.Body className='px-3 my-5'>
                <NftItems
                  houseItems={houseItems.filter((house: any) => !house.isActivated)}
                />
              </Modal.Body>
            </Modal>

            <ReactModal
              show={showHarvestConfirm}
              onHide={() => setShowHarvestConfirm(false)}
              className={`modal_content ${theme == 'dark' ? "dark" : ""}`}
            >
              <div className="modal_body bg-third">
                <div className="modal_header text-text-primary">
                  Rewards will not be harvested due to negative NFT Credit balance. Continue withdrawal?
                </div>
                <div className="modal_buttons">
                  <div
                    className="modal_buttons_yes cursor-pointer text-button-text-secondary"
                    onClick={() => harvest(landRemaining, totalHarvestCost, selectedResource, setSelectedResource)}
                  >
                    Yes
                  </div>
                  <div
                    className="modal_buttons_no cursor-pointer bg-primary text-text-secondary"
                    onClick={() => setShowHarvestConfirm(false)}
                  >
                    No
                  </div>
                </div>
              </div>
            </ReactModal>

            <ReactModal
              show={showWithdrawAlert}
              onHide={() => setShowWithdrawAlert(false)}
              className={`modal_content ${theme == 'dark' ? "dark" : ""}`}
            >
              <div className="modal_body bg-third">
                <div className="modal_header text-text-primary">
                  Withdraw will reset all reward
                </div>
                <div className="modal_buttons">
                  <div
                    className="modal_buttons_yes cursor-pointer text-button-text-secondary"
                    onClick={() => {
                      setShowWithdrawAlert(false)
                      setWithdrawLoading(true)
                      withdrawAssetTokenHandler(withdrawStakedCost, depositAmount)
                    }}
                  >
                    Yes
                  </div>
                  <div
                    className="modal_buttons_no cursor-pointer bg-primary text-text-secondary"
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
