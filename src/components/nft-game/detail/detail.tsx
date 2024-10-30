import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import numeral from "numeral";
import { useRouter } from "next/router";
import { useDisconnect, useSigner } from "wagmi";
import { ethers } from "ethers";

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
import { ReparingStatus } from "./reparingStatus/ReparingStatus";
import { Reparing } from "./reparing/Reparing";
import { EditableNft } from "./editableNft/editableNft";
import { TotalYieldMultiModal } from "./totalYieldMultiModal/TotalYieldMultiModal";
import { useLandshareNftContext } from "../../contexts/LandshareNftContext";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { InputCost } from "./inputCost/InputCost";
import { CustomModal } from "../../components/common/modal/Modal";
import OnSaleModal from "./modals/OnSale";
import gameSetting from "../../contexts/game/setting.json";
import { NftDurabilityIcon, ChargeIcon } from "./NftIcon";
import MintModal from "../../components/mintModal";
import { validateResource } from "../../helper/validator";
import { Modal as ReactModal } from "react-bootstrap";
import "./nftDetails.css";

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
    account,
    provider,
    userData,
    houseItems,
    minAssetAmount,
    withdrawStakedCost,
    assetNewContract,
    landTokenV2Contract,
    notifySuccess,
    notifyError,
    userResource,
    setUserResource,
    getUserData,
    boostItemsList,
    checkHasLandscaping,
    checkHasGarden,
    getUserHouses,
    nftCredits,
    updateNftCredits,
    totalCredits
  } = useGlobalContext();
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
  const { data: signer } = useSigner();
  const isOwn = house.userId === userData?.id
  const houseIds = houseItems.map(houseItem => houseItem.id).sort((a, b) => a - b)
  const { disconnect } = useDisconnect();
  const [depositeAmount, setDepositeAmount] = useState("");
  const [depositedBalance, setDepositedBalance] = useState("");

  const [isTotalYieldModalOpen, setIsTotalYieldModalOpen] = useState(false);
  const [onSaleLoading, setOnSaleLoading] = useState(false);

  const [showHarvestConfirm, setShowHarvestConfirm] = useState(false)
  const [selectedResource, setSelectedResource] = useState([false, false, false, false, false])

  const [harvestLoading, setHarvestLoading] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);

  const [hasLandscaping, setHasLandscaping] = useState(false)
  const [hasGarden, setHasGarden] = useState(false)
  const [isLoading, setIsLoading] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [nftName, setNftName] = useState(house.name);
  const [nftSeries, setNftSeries] = useState(house.series);
  const [durabilityModal, setDurabilityModal] = useState(false);

  const [showMintModal, setShowMintModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [showWithdrawAlert, setShowWithdrawAlert] = useState(false)
  const [showOnSaleAlert, setShowOnSaleAlert] = useState(false)

  const router = useRouter()
  const { houseId } = router.query as { houseId: string };

  const [totalHarvestCost, setTotalHarvestCost] = useState(0);

  async function updateDepositedBalance() {
    const balance = await newStakeContract.stakedBalance(account);
    setDepositedBalance(ethers.utils.formatUnits(balance, 0));
  }

  useEffect(() => {
    updateDepositedBalance();
  }, [])

  useEffect(() => {
    setNftName(house.name);
    setNftSeries(house.series);
  }, [house]);

  const renameNft = async (target, value) => {
    if (value.length > 0) {
      if (value.length < 32) {
        if (target === "nftName") {
          try {
            const { data: houseData } = await axios.patch(`/house/${houseId}`, {
              name: value
            })
            setHouse((prevState) => ({
              ...prevState,
              ...houseData
            }))
            notifySuccess("Rename NFT successfully!");
          } catch (error) {
            if (error.response?.data.status == 401) {
              localStorage.removeItem("jwtToken-v2");
              disconnect();
              return notifyError(`Unautherized error`);
            } else
              return notifyError(error.response.data.message);
          }
        } else {
          return notifyError("Invalid field type.");
        }
      } else {
        return notifyError("This field maximum length is 31.");
      }
    } else {
      return notifyError("This field value is not empty.");
    }
  };

  const stake = async () => {
    try {
      const txApprove = await assetNewContract.approve(newStakeAddress, depositeAmount);
      const receipt = await txApprove.wait();
      if (receipt.status) {
        const txDeposit = await newStakeContract.deposit(depositeAmount);
        const receipt = await txDeposit.wait();
        if (receipt.status) {
          const { data } = await axios.post('/house/deposit-asset-token', {
            houseId: house.id
          })
          if (data.status) {
            await getUserHouses()
            notifySuccess(`${depositeAmount} Asset Tokens deposited!`);
            getHouse(house.id);
            setDepositeAmount("");
            const balance = await newStakeContract.stakedBalance(account);
            setDepositedBalance(ethers.utils.formatUnits(balance, 0));
            setIsLoading([false, false, false, false, false]);
          } else {
            setIsLoading([false, false, false, false, false]);
            notifyError("Deposit failed");
          }
        } else {
          setIsLoading([false, false, false, false, false]);
          notifyError("Deposit failed");
        }
      } else {
        setIsLoading([false, false, false, false, false]);
        notifyError("Deposit failed");
      }
    } catch (error) {
      console.log("deposite error", error);
      setIsLoading([false, false, false, false, false]);
      notifyError(error.response.data.message);
    }
  };

  const handleDeposit = async () => {
    if (isLoading[0]) return
    setIsLoading([true, false, false, false, false]);
    const maxAssetTokenBalance = await assetNewContract.balanceOf(account);
    const tradingLimit = await assetNewContract.secondaryTradingLimitOf(account);
    const stakedBalance = await newStakeContract.stakedBalance(account);

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Please Activate First");
    }

    if (!isOwn) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("You are not an owner of this house");
    }

    if (depositeAmount === "" || depositeAmount === "0") {
      setIsLoading([false, false, false, false, false]);
      return notifyError("No deposit amount");
    }

    if (depositeAmount % 1 != "0") {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Please input Integer value");
    }

    if (depositeAmount < 1) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Please input Integer value");
    }

    if (Number(depositeAmount) > maxAssetTokenBalance) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Deposit amount should not be bigger than max amount");
    }

    if ((Number(stakedBalance) + Number(depositeAmount)) >= Number(tradingLimit)) {
      setDepositLoading(false)
      return notifyError("Please increase your secondary trading limit. Please check details: https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/secondary-trading-limits");
    }

    const { data } = await axios.get(`/user-reward/${userData.id}`);
    if (Number(data.brick) + Number(data.concrete) + Number(data.lumber) + Number(data.steel) + Number(data.token) > 0) {
      return notifyError("Harvest rewards before deposit");
    }

    stake();
  };

  const handleWithdraw = async () => {
    if (withdrawLoading || isLoading[1]) return
    setWithdrawLoading(true)
    setIsLoading([false, true, false, false, false]);
    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Please Activate First");
    }

    if (!isOwn) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("You are not an owner of this house");
    }

    if (depositeAmount === "" || depositeAmount === "0") {
      setIsLoading([false, false, false, false, false]);
      return notifyError("No deposit amount");
    }

    if (depositeAmount % 1 != "0") {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Please input Integer value");
    }

    if (depositeAmount < 1) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Please input Integer value");
    }

    if (Number(depositeAmount) > house.depositedBalance) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Withdraw amount should not be less than deposited balance");
    }

    const pastUserReward = userResource.userReward
    if (Number(depositeAmount) == Number(depositedBalance)) {
      const withdrawAssetTokenCost = withdrawStakedCost.split(',')
      if (Number(pastUserReward[4]) > 0.1) {
        setWithdrawLoading(false)
        setIsLoading([false, false, false, false, false])
        return notifyError('Please harvest your token reward before withdraw.')
      } else {
        withdrawAssetTokenHandler()
      }
    } else {
      if (Number(pastUserReward[4]) > 0.1) {
        setWithdrawLoading(false)
        setIsLoading([false, false, false, false, false]);
        setShowWithdrawAlert(true)
      } else {
        withdrawAssetTokenHandler()
      }
    }
  };

  const withdrawAssetTokenHandler = async () => {
    const withdrawCost = withdrawStakedCost.split(',')
    if (await validateResource(userResource, withdrawCost)) {
      try {
        const txWithdraw = await newStakeContract.withdraw(depositeAmount);
        await txWithdraw.wait().then(async () => {
          await axios.post('/house/withdraw-asset-token', {
            houseId: -1
          })
          getUserData()
          notifySuccess(`${depositeAmount} LSRWA withdrawn successfully!`);
          setWithdrawLoading(false)
          const balance = await newStakeContract.stakedBalance(account);
          setDepositedBalance(ethers.utils.formatUnits(balance, 0));
          setIsLoading([false, false, false, false, false]);
        });
      } catch (error) {
        console.log("Withdraw error", error);
        setWithdrawLoading(false)
        setIsLoading([false, false, false, false, false]);
        notifyError(error.response.data.message);
      }
    } else {
      setWithdrawLoading(false)
      setIsLoading([false, false, false, false, false]);
      notifyError("Insufficient resources.");
    }
  }

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

  const deactivate = async () => {
    if (isLoading[3]) return
    setIsLoading([false, false, false, true, false]);

    if (!house.isActivated) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Already Deactivated");
    }

    if (house.userId != userData.id) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("You are not house owner");
    }

    try {
      const { data: houseData } = await axios.patch(`/house/${houseId}`, {
        isActivated: false,
        lastRepairTime: new Date()
      })

      setHouse((prevState) => ({
        ...prevState,
        ...houseData
      }))
      await getUserData();
      setIsLoading([false, false, false, false, false]);
      notifySuccess("Deactivated successfully!");
    } catch (error) {
      setIsLoading([false, false, false, false, false]);
      if (error.response?.data.status == 401) {
        localStorage.removeItem("jwtToken-v2");
        disconnect();
        return notifyError(`Unautherized error`);
      } else
        return notifyError(error.response.data.message);
    }
  };

  const activate = async () => {
    if (isLoading[3]) return
    setIsLoading([false, false, false, true, false]);

    if (house.isActivated) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("Already activated");
    }

    if (house.userId != userData.id) {
      setIsLoading([false, false, false, false, false]);
      return notifyError("You are not house owner");
    }

    try {
      const { data: houseData } = await axios.patch(`/house/${houseId}`, {
        isActivated: true,
        lastRepairTime: new Date()
      })

      setHouse((prevState) => ({
        ...prevState,
        ...houseData
      }))
      await getUserData();
      setIsLoading([false, false, false, false, false]);
      notifySuccess("Activated successfully!");
    } catch (error) {
      setIsLoading([false, false, false, false, false]);
      if (error.response?.data.status == 401) {
        localStorage.removeItem("jwtToken-v2");
        disconnect();
        return notifyError(`Unautherized error`);
      } else
        return notifyError(error.response.data.message);
    }
  };

  const calcDepositMax = async () => {
    const userAssetTokenBalance = await assetNewContract.balanceOf(account);
    setDepositeAmount(userAssetTokenBalance.toString());
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

  const onSaleHandler = async () => {
    if (house.isActivated) {
      if (isOwn) {
        if (!onSaleLoading) {
          if (house.onSale) {
            try {
              const { data } = await axios.post('/house/set-sale', {
                hosueId: house.id,
                setSale: false
              })
              const transaction = await newHouseContract.setApprovalForAll(process.env.REACT_APP_ADMIN_WALLET_ADDRESS, false);
              await transaction.wait()

              setHouse((prevState) => ({
                ...prevState,
                onSale: data.onSale,
              }));

              return notifySuccess(`Successfully removed NFT from marketplace`);
            } catch (error) {
              console.log("Setting off-sale error", error);
              setSaleOpen(false);
              notifyError(error.response.data.message);
            }
          } else {
            if (userResource.userReward[4] > 0.1) {
              setShowOnSaleAlert(true)
            } else {
              setSaleOpen(true);
            }
          }
        }
      } else {
        notifyError("You do not own this NFT.");
      }
    } else {
      notifyError("Please activate this house");
    }
  };

  const setOnSale = async (price) => {
    if (house.isActivated) {
      if (isOwn) {
        setOnSaleLoading(true);
        try {
          const isApprovedForAll = await newHouseContract.isApprovedForAll(
            account,
            process.env.REACT_APP_ADMIN_WALLET_ADDRESS
          );
          if (isApprovedForAll) {
            await setHouseToOnSale(price);
          } else {
            const transaction = await newHouseContract.setApprovalForAll(process.env.REACT_APP_ADMIN_WALLET_ADDRESS, true);
            const receipt = await transaction.wait()
            if (receipt.status) {
              await setHouseToOnSale(price);
            } else {
              setOnSaleLoading(false);
              notifyError("Approve error");
            }
          }
        } catch (error) {
          setOnSaleLoading(false);
          notifyError(error.response.data.message);
        }
      } else {
        notifyError("You do not own this NFT.");
      }
    } else {
      notifyError("Please activate this house");
    }
  };

  const extendHarvestLimit = async (landAmount) => {
    try {
      const maxAssetTokenBalance = await assetNewContract.balanceOf(account);
      const ableAmount = nftCredits
      const userLandAmount = await landTokenV2Contract.balanceOf(account);
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
            const landTokenV2Balance = await landTokenV2Contract.balanceOf(account);

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

  const setHouseToOnSale = async (price) => {
    try {
      const approveTransaction = await newHouseContract.approve(process.env.REACT_APP_ADMIN_WALLET_ADDRESS, house.houseId);
      const approveReceipt = await approveTransaction.wait()
      console.log("here")
      if (approveReceipt.status) {
        const { data } = await axios.post('/house/set-sale', {
          hosueId: house.id,
          setSale: true,
          price: price
        })

        setHouse((prevState) => ({
          ...prevState,
          onSale: data.onSale,
          salePrice: data.salePrice
        }));

        notifySuccess(`NFT successfully listed for sale`);
        setSaleOpen(false);
        setOnSaleLoading(false);
      } else {
        setSaleOpen(false);
        setOnSaleLoading(false);
        notifyError("Approve error");
      }
    } catch (error) {
      console.log("Setting on-sale error", error);
      setSaleOpen(false);
      setOnSaleLoading(false);
      notifyError(error.response.data.message);
    }
  };

  const handleHarvest = async () => {
    if (harvestLoading) return
    setHarvestLoading(true)
    if (!localStorage.getItem("jwtToken-v2")) {
      setHarvestLoading(false);
      return notifyError("Please login!");
    }

    if (totalCredits >= 1000) {
      harvest()
    } else {
      if (nftCredits < 0) return setShowHarvestConfirm(true)
      else harvest()
    }
  };

  const harvest = async () => {
    if (totalHarvestCost === 0) {
      setHarvestLoading(false);
      return notifyError("Select resources to harvest");
    }

    if (await validateResource(userResource, [totalHarvestCost, 0, 0, 0, 0])) {
      try {
        const pastUserReward = userResource.userReward
        const { data } = await axios.post(`/user-reward/harvest`, {
          harvestItem: [...selectedResource]
        })

        const harvestMessages = []
        selectedResource.map((sR, type) => {
          if (sR) {
            harvestMessages.push(`${numeral(pastUserReward[type]).format('0.[00]')} ${boostItemsList[type].name.split(' ')[0]}`)
          }
        })

        setUserResource((prevState) => ({
          ...prevState,
          resource: [data.resourceData.power, data.resourceData.lumber, data.resourceData.brick, data.resourceData.concrete, data.resourceData.steel],
          userReward: [data.userReward.lumber, data.userReward.brick, data.userReward.concrete, data.userReward.steel, data.userReward.token]
        }))
        setSelectedResource([false, false, false, false, false])
        setHarvestLoading(false)
        return notifySuccess(harvestMessages.join(', ') + ' harvested successfully.')
      } catch (error: any) {
        console.log(error)
        setHarvestLoading(false)
        setIsLoading([false, false, false, false, false]);
        if (error.response?.data.status == 401) {
          localStorage.removeItem("jwtToken-v2");
          disconnect();
          return notifyError(`Unautherized error`);
        } else
          return notifyError(error.response.data.message);
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Not enough resource");
    }
  }

  useEffect(() => {
    (async () => {
      if (!house.isActivated) return

      const tempHasLandscaping = await checkHasLandscaping(house.id)
      const tempHasGarden = await checkHasGarden(house.id)

      setHasLandscaping(tempHasLandscaping)
      setHasGarden(tempHasGarden)
    })()
  }, [house])


  return (
    <>
      <div className=" justify-content-center nft-house mb-5 pb-4 px-2">
        <div className="px-xl-0">
          <div>
            <div className="d-flex flex-wrap justify-content-between nft-title-section pb-2">
              <div className="d-flex align-items-center">
                <EditableNft
                  className="fs-xxl"
                  defaultValue={nftName}
                  onChangeValue={renameNft}
                  target="nftName"
                  activated={house.isActivated && isOwn}
                >
                  <h2 className="fs-xxl font-semibold property-title text-tw-text-primary">
                    {`${nftName} ${house.isRare
                      ? `Rare #${Number(house.typeId) + 1}`
                      : `#${Number(house.typeId) + 1}`
                      }`}
                  </h2>
                </EditableNft>
              </div>
              <div className="d-flex align-items-center for-sale">
                <span className="fs-xs text-tw-text-primary">On-Sale:</span>
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
                <h6 className="fw-600 fs-sm mb-0 text-tw-text-secondary">
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
                      className={`btn nav-btn btn_active w-auto d-flex text-tw-button-text-secondary align-items-center justify-content-center px-5 fs-xs fw-700 ${isLoading[3]
                        ? "d-flex justify-content-center align-items-center"
                        : ""
                        }`}
                      onClick={() => house.isActivated ? deactivate() : activate()}
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
                      <div className="fs-xs mb-sm-0 font-normal d-flex flex-nowrap align-items-center justify-content-start text-tw-text-secondary">
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
                        <span className="fs-12 font-normal text-tw-text-secondary ps-2 fs-xxs fw-600">
                          MAX {house.maxDurability} %
                        </span>
                      </div>
                    </div>
                    <Reparing
                      house={house}
                      setHouse={setHouse}
                    />
                    <div className="dashed-divider"></div>
                    <div className="d-flex justify-content-between mt-2 py-2">
                      <span className="font-semibold fs-16 text-tw-text-secondary">
                        Asset Tokens Deposited:
                      </span>
                      <span className="text-tw-text-primary fw-normal fs-xs">
                        {depositedBalance}{" "}
                        {"LSRWA"}
                      </span>
                    </div>
                    {/*============ ASSET TOKENS DEPOSITED ROW ============*/}
                    <div className="my-1 pt-1 d-flex flex-column mb-4">
                      <div className="d-flex flex-column flex-sm-row justify-content-between">
                        <div className="deposite-input-box mt-2 text-tw-text-secondary">
                          <InputCost
                            height={34}
                            value={depositeAmount}
                            changeRepairAmount={setDepositeAmount}
                            calcMaxAmount={calcDepositMax}
                          />
                        </div>
                        <div className="d-flex mt-2 mt-sm-0 button-group">
                          <button
                            onClick={handleDeposit}
                            className={`btn nav-btn  w-auto me-3 px-4 py-2 br-md fs-xs fw-700  text-tw-button-text-secondary
                            ${(!house.isActivated || !isOwn || house.onSale) &&
                              " btn-repair-disable "
                              }
                            ${isLoading[0]
                                ? " d-flex justify-content-center align-items-center"
                                : ""
                              }`}
                            disabled={
                              isLoading[0] || !house.isActivated || !isOwn || house.onSale
                            }
                          >
                            {isLoading[0] ? (
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
                            className={`btn nav-btn  w-auto px-4 py-2 br-md fs-xs fw-700  text-tw-button-text-secondary
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
                                  isLoading[0] || !house.isActivated || !isOwn || house.onSale
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
                          <span className="me-1 text-tw-text-secondary">
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
                        <span className="fs-xs text-tw-text-primary">
                          x
                          {numeral(house.multiplier).format("0.[00]").toString()}{" "}
                          LAND
                        </span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="d-flex fs-xs align-items-center text-tw-text-secondary">
                          Annual Yield:
                        </span>
                        <span className="fx-xs text-tw-text-primary">
                          {numeral((depositedBalance * house.multiplier / 50).toString()).format(
                            "0.[00]"
                          )}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="d-flex fs-xs text-tw-text-secondary align-items-center">
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
                        <span className="text-tw-text-primary fx-xs">
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
                        <span className="d-flex fs-xs text-tw-text-secondary align-items-center">
                          LAND Generated:
                        </span>
                        <span className="fx-xs text-tw-text-primary">
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
                    <span className="d-flex fs-14 text-tw-text-secondary align-items-center justify-content-center ps-4">
                      Cost:{" "}
                      <span className="fw-bold ms-1">
                        {totalHarvestCost}{" "}
                        {<ChargeIcon iconColor={theme == 'dark' ? "#cbcbcb" : "#4C4C4C"} />}
                      </span>
                    </span>
                    <button
                      onClick={handleHarvest}
                      className={`btn btn-switch-sale fs-16 fw-700 d-flex align-items-center justify-content-center position-absolute dark:text-tw-button-text-secondary
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
        <div className="modal_body bg-tw-third">
          <div className="modal_header text-tw-text-primary">
            Rewards will not be harvested due to negative NFT Credit balance. Continue withdrawal?
          </div>
          <div className="modal_buttons">
            <div
              className="modal_buttons_yes cursor-pointer text-tw-button-text-secondary"
              onClick={() => harvest()}
            >
              Yes
            </div>
            <div
              className="modal_buttons_no cursor-pointer bg-tw-primary text-tw-text-secondary"
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
        <div className="modal_body bg-tw-third">
          <div className="modal_header text-tw-text-primary">
            Withdraw will reset all reward
          </div>
          <div className="modal_buttons">
            <div
              className="modal_buttons_yes cursor-pointer text-tw-button-text-secondary"
              onClick={() => {
                setShowWithdrawAlert(false)
                setIsLoading([false, true, false, false, false]);
                withdrawAssetTokenHandler()
              }}
            >
              Yes
            </div>
            <div
              className="modal_buttons_no cursor-pointer bg-tw-primary text-tw-text-secondary"
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
        <div className="modal_body bg-tw-third">
          <div className="modal_header text-tw-text-primary">
            Unharvested tokens will be sold with this house
          </div>
          <div className="modal_buttons">
            <div
              className="modal_buttons_yes cursor-pointer text-tw-button-text-secondary"
              onClick={() => {
                setShowOnSaleAlert(false)
                setSaleOpen(true);
              }}
            >
              Yes
            </div>
            <div
              className="modal_buttons_no cursor-pointer bg-tw-primary text-tw-text-secondary"
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
