import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import numeral from "numeral";
import Image from "next/image";
import { useChainId, useAccount } from "wagmi";
import { BigNumberish } from "ethers";
import ReactModal from "react-modal";
import RewardHarvest from "../reward-harvest";
import ReparingStatus from "../reparing-status";
import Repair from "./repair";
import EditableNft from "./editable-nft";
import TotalYieldMultiModal from "../../common/modals/total-yield-multi";
import InputCost from "../../common/input-cost";
import ToggleSwitch from "../../common/toggle-switch";
import OnSaleModal from "../../common/modals/on-sale-modal";
import { NftDurabilityIcon, ChargeIcon } from "../../common/icons/nft";
import MintModal from "../../common/modals/mint-modal";
import useBalanceOfAsset from "../../../hooks/contract/RWAContract/useBalanceOf";
import useGetResource from "../../../hooks/nft-game/axios/useGetResource";
import useStakedBalance from "../../../hooks/contract/AssetStakeContract/useStakedBalance";
import useHarvest from "../../../hooks/nft-game/axios/useHarvest";
import useGetSetting from "../../../hooks/nft-game/axios/useGetSetting";
import useStake from "../../../hooks/nft-game/axios/useStake";
import useGetNftCredits from "../../../hooks/nft-game/apollo/useGetNftCredits";
import useWithdrawAsset from "../../../hooks/nft-game/axios/useWithdrawAsset";
import useSecondaryTradingLimitOf from "../../../hooks/contract/RWAContract/useSecondaryTradingLimitOf";
import useGetUserData from "../../../hooks/nft-game/axios/useGetUserData";
import useHandleHouse from "../../../hooks/nft-game/axios/useHandleHouse";
import useCheckHasGarden from "../../../hooks/nft-game/axios/useCheckHasGarden";
import useCheckHasLandscaping from "../../../hooks/nft-game/axios/useCheckHasLandscaping";
import Button from "../../common/button";
import { useGlobalContext } from "../../../context/GlobalContext";
import HouseNft from "../../../../public/img/house/house.bmp";
import HouseBNft from "../../../../public/img/house/houseB.bmp";
import HouseRareNft from "../../../../public/img/house/house_rare.bmp";
import HouseBRareNft from "../../../../public/img/house/houseB_rare.bmp";
import HouseLandNft from "../../../../public/img/house/house_land.png";
import HouseBLandNft from "../../../../public/img/house/houseB_land.bmp";
import HouseLandRareNft from "../../../../public/img/house/house_land_rare.bmp";
import HouseBLandRareNft from "../../../../public/img/house/houseB_land_rare.bmp";
import HouseGardenNft from "../../../../public/img/house/house_garden.bmp";
import HouseBGardenNft from "../../../../public/img/house/houseB_garden.bmp";
import HouseGardenRareNft from "../../../../public/img/house/house_garden_rare.bmp";
import HouseBGardenRareNft from "../../../../public/img/house/houseB_garden_rare.bmp";
import HouseCNft from "../../../../public/img/house/houseC.bmp"
import HouseCRareNft from "../../../../public/img/house/houseC_rare.bmp"
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface NftDetailsProps {
  house: any,
  setHouse: Function,
  getHouse: Function
}

export default function NftDetails({
  house,
  setHouse,
  getHouse,
}: NftDetailsProps) {
  const { theme } = useGlobalContext();
  const { notifyError } = useGlobalContext();
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "600px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0
    },
    overlay: {
      background: '#00000080'
    }
  };
  const confirmModalStyles = {
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
      border: 0
    },
    overlay: {
      background: '#00000080'
    }
  };
  const chainId = useChainId()
  const { address } = useAccount()
  const [harvestLoading, setHarvestLoading] = useState(false)
  const [depositLoading, setDepositLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [isLoading, setIsLoading] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [onSaleLoading, setOnSaleLoading] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [showOnSaleAlert, setShowOnSaleAlert] = useState(false)
  const { userData } = useGetUserData()
  const isOwn = house.userId === userData?.id
	const { data: maxAssetTokenBalance, refetch: calcDepositMax } = useBalanceOfAsset(chainId, address) as { data: number, refetch: Function }
	const { data: depositedBalance, refetch: updateDepositedBalance } = useStakedBalance(chainId, address) as { data: number, refetch: Function }
	const { userReward } = useGetResource()
	const { harvest } = useHarvest(setHarvestLoading)
	const { minAssetAmount, withdrawStakedCost } = useGetSetting()
  const landRemaining = house.tokenHarvestLimit + house.extendedBalance - house.tokenReward - house.totalHarvestedToken
	const { stake } = useStake(chainId, address, setDepositLoading)
	const { nftCredits, totalCredits } = useGetNftCredits(address)
	const { withdrawAssetTokenHandler } = useWithdrawAsset(chainId, address, setDepositLoading, setWithdrawLoading)
	const { data: tradingLimit } = useSecondaryTradingLimitOf(chainId, address) as { data: BigNumberish, refetch: Function }
  const { activate, deactivate, renameNft, setOnSale, onSaleHandler, extendHarvestLimit } = useHandleHouse(house, setHouse, setIsLoading, isOwn, onSaleLoading, setOnSaleLoading, setSaleOpen, setShowOnSaleAlert, address)
  const { hasLandscaping } = useCheckHasLandscaping(house.id)
  const { hasGarden } = useCheckHasGarden(house.id)
  const [houseImgUrl, setHouseImgUrl] = useState(HouseNft)
  const [depositAmount, setDepositAmount] = useState("");
  const [isTotalYieldModalOpen, setIsTotalYieldModalOpen] = useState(false)
  const [showHarvestConfirm, setShowHarvestConfirm] = useState(false)
  const [selectedResource, setSelectedResource] = useState([false, false, false, false, false])
  const [nftName, setNftName] = useState(house.name);
  const [nftSeries, setNftSeries] = useState(house.series);
  const [durabilityModal, setDurabilityModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showWithdrawAlert, setShowWithdrawAlert] = useState(false)
  const [totalHarvestCost, setTotalHarvestCost] = useState(0);


  useEffect(() => {
    updateDepositedBalance();
  }, [])

  useEffect(() => {
    setNftName(house.name);
    setNftSeries(house.series);
  }, [house]);

  const handleDeposit = async () => {
    if (depositLoading) return
    setDepositLoading(true);

    if (!localStorage.getItem("jwtToken-v2")) {
      setDepositLoading(false);
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setDepositLoading(false);
      return notifyError("Please Activate First");
    }

    if (!isOwn) {
      setDepositLoading(false);
      return notifyError("You are not an owner of this house");
    }

    if (depositAmount === "" || depositAmount === "0") {
      setDepositLoading(false);
      return notifyError("No deposit amount");
    }

    if (Number(depositAmount) % 1 != 0) {
      setDepositLoading(false);
      return notifyError("Please input Integer value");
    }

    if (Number(depositAmount) < 1) {
      setDepositLoading(false);
      return notifyError("Please input Integer value");
    }

    if (Number(depositAmount) > maxAssetTokenBalance) {
      setDepositLoading(false);
      return notifyError("Deposit amount should not be bigger than max amount");
    }

    if ((Number(depositedBalance) + Number(depositAmount)) >= Number(tradingLimit)) {
      setDepositLoading(false)
      return notifyError("Please increase your secondary trading limit. Please check details: https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/secondary-trading-limits");
    }

    if (Number(userReward[0]) + Number(userReward[1]) + Number(userReward[2]) + Number(userReward[3]) + Number(userReward[4]) > 0) {
      return notifyError("Harvest rewards before deposit");
    }

    stake(depositAmount);
  };

  const handleWithdraw = async () => {
    if (withdrawLoading || isLoading[1]) return
    setWithdrawLoading(true)

    if (!localStorage.getItem("jwtToken-v2")) {
      setWithdrawLoading(false)
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setWithdrawLoading(false)
      return notifyError("Please Activate First");
    }

    if (!isOwn) {
      setWithdrawLoading(false)
      return notifyError("You are not an owner of this house");
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

    if (Number(depositAmount) > house.depositedBalance) {
      setWithdrawLoading(false)
      return notifyError("Withdraw amount should not be less than deposited balance");
    }

    if (Number(depositAmount) == Number(depositedBalance)) {
      if (Number(userReward[4]) > 0.1) {
        setWithdrawLoading(false)
        setIsLoading([false, false, false, false, false])
        return notifyError('Please harvest your token reward before withdraw.')
      } else {
        withdrawAssetTokenHandler(withdrawStakedCost, depositAmount)
      }
    } else {
      if (Number(userReward[4]) > 0.1) {
        setWithdrawLoading(false)
        setShowWithdrawAlert(true)
      } else {
        withdrawAssetTokenHandler(withdrawStakedCost, depositAmount)
      }
    }
  };

  const getHouseImageUrl = () => {
    if (house) {
      if (house.isRare) {
        if (house.isActivated && (hasLandscaping)) {
          if (hasGarden) {
            return (house.type == 1 || house.type == 2)
              ? HouseGardenRareNft
              : (house.type == 3 || house.type == 4) ? HouseBGardenRareNft : HouseCRareNft;
          } else {
            return (house.type == 1 || house.type == 2)
              ? HouseLandRareNft
              : (house.type == 3 || house.type == 4) ? HouseBLandRareNft : HouseCRareNft;
          }
        } else {
          return (house.type == 1 || house.type == 2) ? HouseRareNft : (house.type == 3 || house.type == 4) ? HouseBRareNft : HouseCRareNft;
        }
      } else {
        if (house.isActivated && (hasLandscaping)) {
          if (hasGarden) {
            return (house.type == 1 || house.type == 2) ? HouseGardenNft : (house.type == 3 || house.type == 4) ? HouseBGardenNft : HouseCNft;
          } else {
            return (house.type == 1 || house.type == 2) ? HouseLandNft : (house.type == 3 || house.type == 4) ? HouseBLandNft : HouseCNft;
          }
        } else {
          return (house.type == 1 || house.type == 2) ? HouseNft : (house.type == 3 || house.type == 4) ? HouseBNft : HouseCNft;
        }
      }
    }
    return (house.type == 1 || house.type == 2) ? HouseNft : (house.type == 3 || house.type == 4) ? HouseBNft : HouseCNft;
  };

  useEffect(() => {
    (async () => {
      setHouseImgUrl(getHouseImageUrl())
    })()
  }, [house])

  const handleHarvest = async () => {
    if (harvestLoading) return
    setHarvestLoading(true)
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

  return (
    <>
      <div className="justify-center mt-[18px] mb-0 pb-0 md:mb-5 md:pb-4 px-2">
        <div className="px-0">
          <div>
            <div className="flex flex-wrap justify-between min-h-[45px] pb-2">
              <div className="flex items-center">
                <EditableNft
                  className="text-[36px]"
                  defaultValue={nftName}
                  onChangeValue={renameNft}
                >
                  <h2 className="text-[24px] font-semibold m-0 md:text-[36px] text-text-primary">
                    {`${nftName} ${house.isRare
                      ? `Rare #${Number(house.typeId) + 1}`
                      : `#${Number(house.typeId) + 1}`
                      }`}
                  </h2>
                </EditableNft>
              </div>
              <div className="flex items-center">
                <span className="text-[16px] text-text-primary">On-Sale:</span>
                <ToggleSwitch 
                  isSale={house.onSale} 
                  onClick={() => {}} 
                  disabled={onSaleLoading}
                />
              </div>
            </div>
            <div className="border-b-[1px] border-[#00000050]"></div>
            <div className="">
              <div className="pt-[14px] pb-[21px] d-flex">
                <h6 className="font-semibold text-[18px] mb-0 text-text-secondary">
                  {`${nftSeries} ${house.isRare
                    ? `Rare #${Number(house.typeId) + 1}`
                    : `#${Number(house.typeId) + 1}`
                    }`}
                </h6>
              </div>
              <div className="flex flex-col xl:flex-row justify-between">
                <div className="flex flex-col items-center mb-3 relative">
                  <Image
                    className="rounded-[10px] w-full h-auto md:w-[391px] md:h-[391px]"
                    src={houseImgUrl}
                    alt="house image"
                  />
                  {isOwn && (
                    <Button
                      className={`absolute translate-x-[-50%] bg-[#61cd81] bottom-0 left-[50%] mb-[0.9rem] w-auto h-[44px] rounded-[20px] flex text-button-text-secondary items-center justify-center px-[40px] text-[16px] ${isLoading[3]
                        ? "flex justify-center items-center"
                        : ""
                        }`}
                      textClassName="text-[16px]"
                      onClick={() => house.isActivated ? deactivate(isLoading) : activate(isLoading)}
                      disabled={isLoading[3] || house.onSale}
                    >
                      {isLoading[3] ? (
                        <>
                          <ReactLoading
                            type="spin"
                            className="mr-2 mb-[4px]"
                            width="24px"
                            height="24px"
                          />
                          <span className="font-semibold">Loading</span>
                        </>
                      ) : (
                        house.isActivated ? "Deactivate" : "Activate"
                      )}
                    </Button>
                  )}
                </div>
                <div className="flex flex-grow ml-0 lg:ml-[1.5rem]">
                  <div className="flex flex-col w-full">
                    <div className="border-b-[1px] border-dashed border-[#00000080]"></div>
                    <div className="flex flex-col md:flex-row py-3 justify-between">
                      <div className="text-[16px] mb-0 font-normal flex flex-nowrap items-center justify-start text-text-secondary">
                        Durability
                        <div
                          onClick={() => setDurabilityModal(true)}
                          className="cursor-pointer"
                        >
                          <NftDurabilityIcon />
                        </div>
                      </div>
                      <div className="flex justify-end md:justify-between items-center">
                        <div className="w-[163px]">
                          <ReparingStatus
                            max={house.maxDurability}
                            now={house.lastDurability}
                          />
                        </div>
                        <span className="text-[12px] font-normal text-text-secondary pl-2 font-semibold">
                          MAX {house.maxDurability} %
                        </span>
                      </div>
                    </div>
                    <Repair
                      house={house}
                      setHouse={setHouse}
                    />
                    <div className="border-b-[1px] border-dashed border-[#00000080]"></div>
                    <div className="flex justify-between mt-2 py-2">
                      <span className="font-semibold text-[16px] text-text-secondary">
                        Asset Tokens Deposited:
                      </span>
                      <span className="text-text-primary font-normal text-[16px]">
                        {depositedBalance.toString()}{" "}
                        {"LSRWA"}
                      </span>
                    </div>
                    {/*============ ASSET TOKENS DEPOSITED ROW ============*/}
                    <div className="my-1 pt-1 flex flex-col mb-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex justify-center mt-2 text-text-secondary">
                          <InputCost
                            height={34}
                            value={depositAmount}
                            changeRepairAmount={setDepositAmount}
                            calcMaxAmount={async () => {
                              await calcDepositMax()
                              setDepositAmount(maxAssetTokenBalance.toString())
                            }}
                          />
                        </div>
                        <div className="flex mt-2 md:mt-0 justify-center">
                          <Button
                            onClick={handleDeposit}
                            className={`w-auto mr-3 px-4 py-2 rounded-[24px] bg-[#61cd81] text-[24px] text-button-text-secondary ${BOLD_INTER_TIGHT.className}
                            ${(!house.isActivated || !isOwn || house.onSale) &&
                              " bg-[#8f8f8f] border-[2px] border-[#8f8f8f] hover:text-[#fff] "
                              }
                            ${depositLoading
                                ? " flex justify-center items-center"
                                : ""
                              }`}
                            disabled={
                              depositLoading || !house.isActivated || !isOwn || house.onSale
                            }
                          >
                            {depositLoading ? (
                              <>
                                <ReactLoading
                                  type="spin"
                                  className="mr-2 mb-[4px]"
                                  width="24px"
                                  height="24px"
                                />
                                <span className="font-semibold">
                                  Loading
                                </span>
                              </>
                            ) : (
                              "DEPOSIT"
                            )}
                          </Button>
                          <Button
                            onClick={handleWithdraw}
                            className={`w-auto px-4 py-2 rounded-[24px] text-[24px] bg-[#61cd81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}
                            ${(!house.isActivated || !isOwn || house.onSale) &&
                              " bg-[#8f8f8f] border-[2px] border-[#8f8f8f] hover:text-[#fff] "
                              }
                            ${isLoading[1]
                                ? "flex justify-center items-center"
                                : ""
                              }`}
                            disabled={
                              isLoading[1] || !house.isActivated || !isOwn || house.onSale
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
                                <span className="upgrade-status">
                                  Loading
                                </span>
                              </>
                            ) : (
                              "WITHDRAW"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="border-b-[1px] border-dashed border-[#00000080]"></div>
                    <div className="flex flex-col justify-between h-full my-3">
                      <div className="flex justify-between py-1">
                        <span className="flex text-[16px] text-black-700 items-center">
                          <span className="me-1 text-text-secondary">
                            Total Yields multiplier:
                          </span>
                          <span
                            className="cursor-pointer text-[#fff] w-[15px] h-[15px] leading-[16px] text-center rounded-full bg-[#717171] text-[10px] duration-300 ml-1"
                            onClick={() => setIsTotalYieldModalOpen(!isTotalYieldModalOpen)}
                          >
                            ?
                          </span>
                        </span>
                        <span className="text-[16px] text-text-primary">
                          x
                          {numeral(house.multiplier).format("0.[00]").toString()}{" "}
                          LAND
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="flex text-[16px] items-center text-text-secondary">
                          Annual Yield:
                        </span>
                        <span className="text-[16px] text-text-primary">
                          {numeral((Number(depositedBalance) * Number(house.multiplier) / 50).toString()).format(
                            "0.[00]"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="flex text-[16px] text-text-secondary items-center">
                          <span className="mr-1">LAND Remaining:</span>
                          {house.isActivated && !house.onSale && (
                            <span
                              className="cursor-pointer text-[#fff] w-[15px] h-[15px] leading-[16px] text-center rounded-full bg-[#717171] text-[10px] duration-300 ml-1"
                              onClick={() => setShowMintModal(true)}
                            >
                              +
                            </span>
                          )}
                        </span>
                        <span className="text-text-primary text-[16px]">
                          {`${numeral(
                            Number(
                              house.tokenHarvestLimit
                            ) +
                            Number(
                              house.extendedBalance
                            ) -
                            Number(
                              house.tokenReward
                            ) -
                            Number(
                              house.totalHarvestedToken
                            )
                          ).format("0.[0]")} / ${numeral(
                            Number(
                              house.tokenHarvestLimit
                            ) +
                            Number(
                              house.extendedBalance
                            )
                          ).format("0.[0]")} LAND`}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="flex text-[16px] text-text-secondary items-center">
                          LAND Generated:
                        </span>
                        <span className="text-[16px] text-text-primary">
                          {`${numeral(
                            Number(
                              house.totalHarvestedToken
                            )
                          ).format("0.[0]")} LAND`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b-[1px] border-dashed border-[#00000080]"></div>
              <div className="flex flex-col w-full mt-5">
                <RewardHarvest
                  selectedResource={selectedResource}
                  setSelectedResource={setSelectedResource}
                  setTotalHarvestCost={setTotalHarvestCost}
                />
                {/*================ HARVEST AND COST BUTTON ================*/}
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
                        <>
                          <ReactLoading
                            type="spin"
                            className="me-2 mb-[4px]"
                            width="24px"
                            height="24px"
                          />
                          <span className="font-semibold">Loading</span>
                        </>
                      ) : (
                        "Harvest"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MintModal
        title="Extend a harvest limit"
        show={showMintModal}
        setShow={setShowMintModal}
        minAmount={minAssetAmount}
        onSubmit={(land: number) => extendHarvestLimit(land)}
      />
      <TotalYieldMultiModal
        house={house}
        modalShow={isTotalYieldModalOpen}
        setModalShow={setIsTotalYieldModalOpen}
      />
      <ReactModal
        style={customModalStyles}
        isOpen={durabilityModal}
        onRequestClose={() => { setDurabilityModal(!durabilityModal), document.body.classList.remove('modal-open'); }}
      >
        <div className="flex min-h-full justify-center items-center">
          <span className="my-2 mx-3 pt-1 text-[14px] font-normal">
            Durability determines the current repair status of your
            property. Your yield multiplier for a given period of time is
            multiplied by your durability amount. For example, if your
            durability is 90%, your yields will be multiplied by 0.9.
            Durability decreases by
            <b>{` ${house.hasConcreteFoundation ? "8%" : "10%"} `}</b>per
            day.
          </span>
        </div>
      </ReactModal>
      <OnSaleModal
        modalShow={saleOpen}
        setModalShow={setSaleOpen}
        multiplier={house.multiplier}
        rewardedToken={house.tokenReward}
        onSubmit={setOnSale}
        onSaleLoading={onSaleLoading}
      />
      <ReactModal
        style={confirmModalStyles}
        isOpen={showHarvestConfirm}
        onRequestClose={() => { setShowHarvestConfirm(!showHarvestConfirm), document.body.classList.remove('modal-open'); }}
      >
        <div className="max-w-[300px] p-[20px] bg-third">
          <div className="text-[15px] text-center text-text-primary">
            Rewards will not be harvested due to negative NFT Credit balance. Continue withdrawal?
          </div>
          <div className="flex mt-[20px]">
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] bg-[#00a8f3] cursor-pointer text-button-text-secondary"
              onClick={() => harvest(landRemaining, totalHarvestCost, selectedResource, setSelectedResource)}
            >
              Yes
            </div>
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] bg-transparent cursor-pointer bg-primary text-text-secondary"
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
      >
        <div className="max-w-[300px] p-[20px] bg-third">
          <div className="text-[15px] text-center text-text-primary">
            Withdraw will reset all reward
          </div>
          <div className="flex mt-[20px]">
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] bg-[#00a8f3] cursor-pointer text-button-text-secondary"
              onClick={() => {
                setShowWithdrawAlert(false)
                setIsLoading([false, true, false, false, false]);
                withdrawAssetTokenHandler(withdrawStakedCost, depositAmount)
              }}
            >
              Yes
            </div>
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] bg-transparent cursor-pointer bg-primary text-text-secondary"
              onClick={() => {
                setShowWithdrawAlert(false)
                setIsLoading([false, false, false, false, false]);
              }}
            >
              No
            </div>
          </div>
        </div>
      </ReactModal>
      <ReactModal
        style={confirmModalStyles}
        isOpen={showOnSaleAlert}
        onRequestClose={() => { setShowOnSaleAlert(!showOnSaleAlert), document.body.classList.remove('modal-open'); }}
      >
        <div className="max-w-[300px] p-[20px] bg-third">
          <div className="text-[15px] text-center text-text-primary">
            Unharvested tokens will be sold with this house
          </div>
          <div className="flex mt-[20px]">
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] bg-[#00a8f3] cursor-pointer text-button-text-secondary"
              onClick={() => {
                setShowOnSaleAlert(false)
                setSaleOpen(true);
              }}
            >
              Yes
            </div>
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] bg-transparent cursor-pointer bg-primary text-text-secondary"
              onClick={() => {
                setShowOnSaleAlert(false)
              }}
            >
              No
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
};
