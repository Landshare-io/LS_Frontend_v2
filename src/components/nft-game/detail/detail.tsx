import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import numeral from "numeral";
import { useRouter } from "next/router";
import { useDisconnect, useChainId, useAccount } from "wagmi";
import { ethers } from "ethers";
import { BigNumberish } from "ethers";

import axios from "../../helper/axios";
import HouseNft from "../../assets/img/house/house.bmp";
import HouseBNft from "../../assets/img/house/houseB.bmp";
import HouseRareNft from "../../assets/img/house/house_rare.bmp";
import HouseBRareNft from "../../assets/img/house/houseB_rare.bmp";
import HouseLandNft from "../../assets/img/house/house_land.png";
import HouseBLandNft from "../../assets/img/house/houseB_land.bmp";
import HouseLandRareNft from "../../assets/img/house/house_land_rare.bmp";
import HouseBLandRareNft from "../../assets/img/house/houseB_land_rare.bmp";
import HouseGardenNft from "../../assets/img/house/house_garden.bmp";
import HouseBGardenNft from "../../assets/img/house/houseB_garden.bmp";
import HouseGardenRareNft from "../../assets/img/house/house_garden_rare.bmp";
import HouseBGardenRareNft from "../../assets/img/house/houseB_garden_rare.bmp";
import HouseCNft from "../../assets/img/house/houseC.bmp"
import HouseCRareNft from "../../assets/img/house/houseC_rare.bmp"

import { Harvestable } from "../harvestable/Harvestable";

import ReparingStatus from "../reparing-status";
import Repair from "./repair";
import EditableNft from "./editable-nft";

import { TotalYieldMultiModal } from "./totalYieldMultiModal/TotalYieldMultiModal";
import { useLandshareNftContext } from "../../contexts/LandshareNftContext";

import InputCost from "../../common/input-cost";
import { CustomModal } from "../../components/common/modal/Modal";
import OnSaleModal from "./modals/OnSale";


import { NftDurabilityIcon, ChargeIcon } from "../../common/icons/nft";
import MintModal from "../../components/mintModal";

import { Modal as ReactModal } from "react-bootstrap";
import "./nftDetails.css";

import { BOLD_INTER_TIGHT, MAJOR_WORK_CHAIN } from "../../../config/constants/environments";
import useGetHouses from "../../../hooks/nft-game/axios/useGetHouses";
import useBalanceOfAsset from "../../../hooks/contract/RWAContract/useBalanceOf";
import useBalanceOfLand from "../../../hooks/contract/LandTokenContract/useBalanceOf";
import useLogin from "../../../hooks/nft-game/axios/useLogin";
import useGetResource from "../../../hooks/nft-game/axios/useGetResource";
import useStakedBalance from "../../../hooks/contract/AssetStakeContract/useStakedBalance";
import useHarvest from "../../../hooks/nft-game/axios/useHarvest";
import useHandleBuyHouseSlots from "../../../hooks/nft-game/axios/useHandleBuyHouseSlots";
import useGetSetting from "../../../hooks/nft-game/axios/useGetSetting";
import useStake from "../../../hooks/nft-game/axios/useStake";
import useGetNftCredits from "../../../hooks/nft-game/apollo/useGetNftCredits";
import useWithdrawAsset from "../../../hooks/nft-game/axios/useWithdrawAsset";
import useSecondaryTradingLimitOf from "../../../hooks/contract/RWAContract/useSecondaryTradingLimitOf";
import useGetUserData from "../../../hooks/nft-game/axios/useGetUserData";
import useHandleHouse from "../../../hooks/nft-game/axios/useHandleHouse";
import useCheckHasGarden from "../../../hooks/nft-game/axios/useCheckHasGarden";
import useCheckHasLandscaping from "../../../hooks/nft-game/axios/useCheckHasLandscaping";
import { useGlobalContext } from "../../../context/GlobalContext";

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
  const {
    notifySuccess,
    notifyError
  } = useGlobalContext();
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
  const { houses: houseItems, getHouses } = useGetHouses()
	const { data: maxAssetTokenBalance, refetch: calcDepositMax } = useBalanceOfAsset(chainId, address) as { data: number, refetch: Function }
	const { data: landTokenBalance, refetch: refetchLandAmount } = useBalanceOfLand({ chainId, address }) as { data: BigNumberish, refetch: Function }
	const { data: stakedBalance, refetch: updateDepositedBalance } = useStakedBalance(chainId, address) as { data: number, refetch: Function }
	const { isLoading: isLoginLoading } = useLogin()
	const { userReward } = useGetResource()
	const { harvest } = useHarvest(setHarvestLoading)
	const { buySlotCost, userActivatedSlots, setUserActivatedSlots, houseSlots, withdrawStakedCost } = useGetSetting()
  const landRemaining = house.tokenHarvestLimit + house.extendedBalance - house.tokenReward - house.totalHarvestedToken
  
	const { stake } = useStake(chainId, address, setDepositLoading)
	const { nftCredits, totalCredits } = useGetNftCredits()
	const { withdrawAssetTokenHandler } = useWithdrawAsset(chainId, address, setDepositLoading, setWithdrawLoading)
	const { data: tradingLimit } = useSecondaryTradingLimitOf(chainId, address) as { data: BigNumberish, refetch: Function }
  const { activate, deactivate, renameNft, setOnSale, onSaleHandler } = useHandleHouse(house, setHouse, setIsLoading, isOwn, onSaleLoading, setOnSaleLoading, setSaleOpen, setShowOnSaleAlert, address)
  const { hasLandscaping } = useCheckHasLandscaping(house.id)
  const { hasGarden } = useCheckHasGarden(house.id)

  const {
    contract: {
      newHouseContract,
      newStakeContract
    },
    address: {
      newStakeAddress
    }
  } = useLandshareNftContext();
  const [houseImgUrl, setHouseImgUrl] = useState(HouseNft)


  const { disconnect } = useDisconnect();
  const [depositAmount, setDepositAmount] = useState("");
  const [depositedBalance, setDepositedBalance] = useState("");

  const [isTotalYieldModalOpen, setIsTotalYieldModalOpen] = useState(false);

  const [showHarvestConfirm, setShowHarvestConfirm] = useState(false)
  const [selectedResource, setSelectedResource] = useState([false, false, false, false, false])
  const [nftName, setNftName] = useState(house.name);
  const [nftSeries, setNftSeries] = useState(house.series);
  const [durabilityModal, setDurabilityModal] = useState(false);

  const [showMintModal, setShowMintModal] = useState(false);
  
  const [showWithdrawAlert, setShowWithdrawAlert] = useState(false)

  const router = useRouter()
  const { houseId } = router.query as { houseId: string };

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

    if ((Number(stakedBalance) + Number(depositAmount)) >= Number(tradingLimit)) {
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

  const handleV1Withdraw = async () => {
    // if (!house.isActivated) {
    //   setIsLoading([false, false, false, false, false]);
    //   return notifyError("Please Activate First");
    // }

    // if (depositeV1Amount % 1 != "0") {
    //   setIsLoading([false, false, false, false, false]);
    //   return notifyError("Please input Integer value");
    // }

    // if (house.depositedV1Balance === "0") {
    //   setIsLoading([false, false, false, false, false]);
    //   return notifyError("No withdraw amount");
    // }

    // if (!depositeV1Amount) {
    //   setIsLoading([false, false, false, false, false]);
    //   return notifyError("Please input Withdraw amount");
    // }

    // if (depositeV1Amount < 1) {
    //   setIsLoading([false, false, false, false, false]);
    //   return notifyError("Please input Integer value");
    // }

    // setIsLoading([false, true, false, false, false]);
    // try {
    //   const transaction = await NFTV1StakeContract.unstake(depositeV1Amount, house.houseV1tokenId);
    //   const receipt = await transaction.wait();
    //   if (receipt.status) {
    //     notifySuccess(`${depositeV1Amount} LAND withdrawn successfully!`);
    //     setHouse((prevState) => ({
    //       ...prevState,
    //       depositedV1Balance: (
    //         Number(prevState.depositedV1Balance) - Number(depositeV1Amount)
    //       ).toString(),
    //     }));
    //     getHouse();
    //     setIsLoading([false, false, false, false, false]);
    //   } else {
    //     setIsLoading([false, false, false, false, false]);
    //     notifyError("Withdraw failed");
    //   }
    // } catch (error) {
    //   console.log("Withdraw error", error);
    //   setIsLoading([false, false, false, false, false]);
    //   notifyError("Withdraw failed");
    // }
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

  const extendHarvestLimit = async (landAmount) => {
    try {

      const userLandAmount = await landTokenV2Contract.balanceOf(address);
      if (landAmount > userLandAmount) {
        return notifyError('Insufficient LAND amount')
      }
      if (nftCredits < landAmount * 4) {
        return notifyError(`Insufficient NFT Credits`);
      }

      const { data: transactionData } = await axios.post('/house/get-transaction-for-house-mint', {
        assetAmount: landAmount * 4
      })

      const sendedTransaction = await signer.sendTransaction(transactionData.transaction)
      sendedTransaction.wait().then(async (receipt) => {
        if (receipt.status) {
          const { data } = await axios.post('/house/extend-house-limit', {
            houseId: houseId,
            assetAmount: landAmount * 4,
            txHash: receipt.transactionHash,
            nonce: transactionData.nonce,
            blockNumber: receipt.blockNumber
          })

          if (data) {
            const landTokenV2Balance = await landTokenV2Contract.balanceOf(address);

            await updateNftCredits()
            setUserResource((prevState) => ({
              ...prevState,
              landTokenV2: landTokenV2Balance,
            }))
            getHouse(houseId)
            notifySuccess(`Extended house harvest limit`)
          }
        } else {
          notifyError(`Extending house harvest limit Error`);
        }
      })
    } catch (error) {
      console.log(error)
      notifyError(error.response.data.message);
    }
  }

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
      <div className="justify-center nft-house mb-5 pb-4 px-2">
        <div className="px-xl-0">
          <div>
            <div className="d-flex flex-wrap justify-content-between nft-title-section pb-2">
              <div className="d-flex align-items-center">
                <EditableNft
                  className="fs-xxl"
                  defaultValue={nftName}
                  onChangeValue={renameNft}
                >
                  <h2 className="fs-xxl font-semibold property-title text-text-primary">
                    {`${nftName} ${house.isRare
                      ? `Rare #${Number(house.typeId) + 1}`
                      : `#${Number(house.typeId) + 1}`
                      }`}
                  </h2>
                </EditableNft>
              </div>
              <div className="d-flex align-items-center for-sale">
                <span className="fs-xs text-text-primary">On-Sale:</span>
                <div className="on-off-toggle ms-sm-3 ms-1">
                  <input
                    className="on-off-toggle__input"
                    type="checkbox"
                    onChange={() => onSaleHandler()}
                    id="bopis"
                    checked={house.onSale}
                    disabled={onSaleLoading}
                  />
                  <label
                    htmlFor="bopis"
                    className="on-off-toggle__slider round"
                  ></label>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="nft-detail-content-section">
              <div className="house-desc d-flex">
                <h6 className="fw-600 fs-sm mb-0 text-text-secondary">
                  {`${nftSeries} ${house.isRare
                    ? `Rare #${Number(house.typeId) + 1}`
                    : `#${Number(house.typeId) + 1}`
                    }`}
                </h6>
              </div>
              <div className="d-flex flex-column flex-xl-row nft-house-action-status">
                <div className="d-flex flex-column align-items-center mb-3 position-relative">
                  <img
                    className="br-sm mb-xl-0 nft-house-image"
                    src={houseImgUrl}
                    alt="house image"
                    style={{ width: '100%' }}
                  />
                  {isOwn && (
                    <button
                      className={`btn nav-btn btn_active w-auto d-flex text-button-text-secondary align-items-center justify-content-center px-5 fs-xs fw-700 ${isLoading[3]
                        ? "d-flex justify-content-center align-items-center"
                        : ""
                        }`}
                      onClick={() => house.isActivated ? deactivate(isLoading) : activate(isLoading)}
                      disabled={isLoading[3] || house.onSale}
                    >
                      {isLoading[3] ? (
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
                        house.isActivated ? "Deactivate" : "Activate"
                      )}
                    </button>
                  )}
                </div>
                <div className="d-flex flex-grow nft-house-action-status-actions">
                  <div className="d-flex flex-column w-100">
                    <div className="dashed-divider"></div>
                    <div className="d-flex flex-column flex-sm-row py-3 justify-content-sm-between">
                      <div className="fs-xs mb-sm-0 font-normal d-flex flex-nowrap align-items-center justify-content-start text-text-secondary">
                        Durability
                        <div
                          onClick={() => setDurabilityModal(true)}
                          className="cursor-pointer"
                        >
                          <NftDurabilityIcon />
                        </div>
                      </div>
                      <div className="d-flex  justify-content-between align-items-center justify-content-sm-end">
                        <div className="now-reparing-status">
                          <ReparingStatus
                            max={house.maxDurability}
                            now={house.lastDurability}
                          />
                        </div>
                        <span className="fs-12 font-normal text-text-secondary ps-2 fs-xxs fw-600">
                          MAX {house.maxDurability} %
                        </span>
                      </div>
                    </div>
                    <Repair
                      house={house}
                      setHouse={setHouse}
                    />
                    <div className="dashed-divider"></div>
                    <div className="d-flex justify-content-between mt-2 py-2">
                      <span className="font-semibold fs-16 text-text-secondary">
                        Asset Tokens Deposited:
                      </span>
                      <span className="text-text-primary fw-normal fs-xs">
                        {depositedBalance}{" "}
                        {"LSRWA"}
                      </span>
                    </div>
                    {/*============ ASSET TOKENS DEPOSITED ROW ============*/}
                    <div className="my-1 pt-1 d-flex flex-column mb-4">
                      <div className="d-flex flex-column flex-sm-row justify-content-between">
                        <div className="deposite-input-box mt-2 text-text-secondary">
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
                        <div className="d-flex mt-2 mt-sm-0 button-group">
                          <button
                            onClick={handleDeposit}
                            className={`btn nav-btn  w-auto me-3 px-4 py-2 br-md fs-xs fw-700  text-button-text-secondary
                            ${(!house.isActivated || !isOwn || house.onSale) &&
                              " btn-repair-disable "
                              }
                            ${depositLoading
                                ? " d-flex justify-content-center align-items-center"
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
                                  className="me-2 button-spinner"
                                  width="24px"
                                  height="24px"
                                />
                                <span className="upgrade-status">
                                  Loading
                                </span>
                              </>
                            ) : (
                              "DEPOSIT"
                            )}
                          </button>
                          <button
                            onClick={handleWithdraw}
                            className={`btn nav-btn  w-auto px-4 py-2 br-md fs-xs fw-700  text-button-text-secondary
                            ${(!house.isActivated || !isOwn || house.onSale) &&
                              " btn-repair-disable "
                              }
                            ${isLoading[1]
                                ? "d-flex justify-content-center align-items-center"
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
                          </button>
                        </div>
                      </div>
                    </div>
                    {/*============ V1 ASSET TOKENS DEPOSITED ROW ============*/}
                    {house.depositedV1Balance > 0 && (
                      <>
                        <div className="dashed-divider"></div>
                        <div className="d-flex justify-content-between mt-2 py-2">
                          <span className="font-semibold fs-16 text-black-700">
                            Asset Tokens Deposited in V1 Game:
                          </span>
                          <span className="text-black fw-normal fs-xs">
                            {house.depositedV1Balance} LSNF
                          </span>
                        </div>
                        <div className="my-1 pt-1 d-flex flex-column mb-4">
                          <div className="d-flex flex-column flex-sm-row justify-content-between">
                            <div className="deposite-input-box mt-2">
                              {/* <InputCost
                                height={34}
                                value={depositeV1Amount}
                                changeRepairAmount={setDepositeV1Amount}
                                calcMaxAmount={calcDepositMaxV1}
                              /> */}
                            </div>
                            <div className="d-flex mt-2 mt-sm-0 button-group">
                              <button
                                onClick={handleV1Withdraw}
                                className={`btn nav-btn  w-auto px-4 py-2 br-md fs-xs fw-700 
                              ${(!house.isActivated || !isOwn) &&
                                  " btn-repair-disable "
                                  }
                              ${isLoading[1]
                                    ? "d-flex justify-content-center align-items-center"
                                    : ""
                                  }`}
                                disabled={
                                  depositLoading || !house.isActivated || !isOwn || house.onSale
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
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="dashed-divider"></div>
                    <div className="d-flex flex-column justify-content-between h-100 my-3">
                      <div className="d-flex justify-content-between py-1">
                        <span className="d-flex fs-xs text-black-700 align-items-center">
                          <span className="me-1 text-text-secondary">
                            Total Yields multiplier:
                          </span>
                          <span
                            className="cursor-pointer btn-show-info ms-1"
                            onClick={() =>
                              setIsTotalYieldModalOpen(
                                !isTotalYieldModalOpen
                              )
                            }
                          >
                            ?
                          </span>
                        </span>
                        <span className="fs-xs text-text-primary">
                          x
                          {numeral(house.multiplier).format("0.[00]").toString()}{" "}
                          LAND
                        </span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="d-flex fs-xs align-items-center text-text-secondary">
                          Annual Yield:
                        </span>
                        <span className="fx-xs text-text-primary">
                          {numeral((depositedBalance * house.multiplier / 50).toString()).format(
                            "0.[00]"
                          )}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="d-flex fs-xs text-text-secondary align-items-center">
                          <span className="me-1">LAND Remaining:</span>
                          {house.isActivated && !house.onSale && (
                            <span
                              className="cursor-pointer btn-show-info ms-1"
                              onClick={() => setShowMintModal(true)}
                            >
                              +
                            </span>
                          )}
                        </span>
                        <span className="text-text-primary fx-xs">
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
                      <div className="d-flex justify-content-between py-1">
                        <span className="d-flex fs-xs text-text-secondary align-items-center">
                          LAND Generated:
                        </span>
                        <span className="fx-xs text-text-primary">
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
              <div className="dashed-divider"></div>
              <div className="d-flex flex-column w-100 mt-5">
                <Harvestable
                  selectedResource={selectedResource}
                  setSelectedResource={setSelectedResource}
                  setTotalHarvestCost={setTotalHarvestCost}
                />
                {/*================ HARVEST AND COST BUTTON ================*/}
                <div className="d-flex pt-5 pb-4 justify-content-end harvest-cost">
                  <div
                    className={`d-flex switch-btn active align-items-center position-relative ${isOwn ? "" : "grey"
                      }`}
                  >
                    <span className="d-flex fs-14 text-text-secondary align-items-center justify-content-center ps-4">
                      Cost:{" "}
                      <span className="fw-bold ms-1">
                        {totalHarvestCost}{" "}
                        {<ChargeIcon iconColor={theme == 'dark' ? "#cbcbcb" : "#4C4C4C"} />}
                      </span>
                    </span>
                    <button
                      onClick={handleHarvest}
                      className={`btn btn-switch-sale fs-16 fw-700 d-flex align-items-center justify-content-center position-absolute dark:text-button-text-secondary
                        ${harvestLoading
                          ? "d-flex justify-content-center align-items-center"
                          : ""
                        } ${isOwn ? "" : "grey"}`}
                      disabled={harvestLoading || !isOwn}
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
            </div>
          </div>
        </div>
      </div>
      <MintModal
        title="Extend a harvest limit"
        show={showMintModal}
        setShow={setShowMintModal}
        minAmount={minAssetAmount}
        onSubmit={(land) => extendHarvestLimit(land)}
      />
      <TotalYieldMultiModal
        house={house}
        modalShow={isTotalYieldModalOpen}
        setModalShow={setIsTotalYieldModalOpen}
      />
      <CustomModal
        modalOptions={{
          centered: true,
          size: "lg",
        }}
        modalShow={durabilityModal}
        setModalShow={setDurabilityModal}
      >
        <CustomModal.Body className="d-flex min-h-100 justify-content-center align-items-center">
          <span className="my-2 mx-3 fs-14 fw-400">
            Durability determines the current repair status of your
            property. Your yield multiplier for a given period of time is
            multiplied by your durability amount. For example, if your
            durability is 90%, your yields will be multiplied by 0.9.
            Durability decreases by
            <b>{` ${house.hasConcreteFoundation ? "8%" : "10%"} `}</b>per
            day.
          </span>
        </CustomModal.Body>
      </CustomModal>
      <OnSaleModal
        modalShow={saleOpen}
        setModalShow={setSaleOpen}
        multiplier={house.multiplier}
        rewardedToken={house.tokenReward}
        onSubmit={setOnSale}
        onSaleLoading={onSaleLoading}
      />
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
              onClick={() => harvest()}
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
                setIsLoading([false, true, false, false, false]);
                withdrawAssetTokenHandler(withdrawStakedCost, depositAmount)
              }}
            >
              Yes
            </div>
            <div
              className="modal_buttons_no cursor-pointer bg-primary text-text-secondary"
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
        show={showOnSaleAlert}
        onHide={() => setShowOnSaleAlert(false)}
        className={`modal_content ${theme == 'dark' ? "dark" : ""}`}
      >
        <div className="modal_body bg-third">
          <div className="modal_header text-text-primary">
            Unharvested tokens will be sold with this house
          </div>
          <div className="modal_buttons">
            <div
              className="modal_buttons_yes cursor-pointer text-button-text-secondary"
              onClick={() => {
                setShowOnSaleAlert(false)
                setSaleOpen(true);
              }}
            >
              Yes
            </div>
            <div
              className="modal_buttons_no cursor-pointer bg-primary text-text-secondary"
              onClick={() => {
                setShowOnSaleAlert(false)
              }}
            >
              No
            </div>
          </div>
        </div>
      </ReactModal>
      {/* {house.isActivated && !house.onSale && (
        <LoadHouseNFTs
          modalShow={openLoadNftModal}
          setModalShow={setOpenLoadNftModal}
          setHouse={setHouse}
        />
      )} */}
    </>
  );
};
