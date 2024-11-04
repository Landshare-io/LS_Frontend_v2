import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import numeral from "numeral";
import {useReadContract, useDisconnect, useAccount, useConfig, useChainId, useSendTransaction } from "wagmi";
import { useGlobalContext } from "../../context/GlobalContext";
import { ethers } from "ethers";
import useStakedBalance  from "../../hooks/contract/AssetStakeContract/useStakedBalance"
import ConnectWallet from "../../components/connect-wallet";
import Topbar from "../../components/common/topbar";
import Slider from "react-slick";
import InputCost from "../../components/common/input-cost";
import NftItem from "../../components/nft-game/nft/nft-item";
import axios from "../../hooks/nft-game/axios/nft-game-axios";

export default function InventoryPage() {
  const { isConnected, chainId, address } = useAccount();

  const { 
    signer,
    theme, 
    isLoginLoading, 
    isAuthenticated, 
    getUserHouses, 
    houseItems, 
    userActivatedSlots, 
    setUserActivatedSlots, 
    houseSlots,
    buySlotCost,
    notifyError,
    notifySuccess,
    notifyInfo,
    userResource,
    setUserResource
} = useGlobalContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [depositedBalance, setDepositedBalance] = useState<string>("");
  const [buyHouseSlotLoading, setBuyHouseSlotLoading] = useState<boolean>(false)
  const { sendTransaction, data: sendTransactionTx } = useSendTransaction()
  const [depositeAmount, setDepositeAmount] = useState<string>("");

  const getHousesList = async () => {
    setIsLoading(true);
    await getUserHouses();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const buyHouseSlot = async () => {
    setBuyHouseSlotLoading(true)
    if (!localStorage.getItem("jwtToken-v2")) {
      setBuyHouseSlotLoading(false)
      return notifyError("Please login!");
    }

    const requiredLandToken = buySlotCost

    if (Number(requiredLandToken) > userResource.landTokenBalance) {
      setBuyHouseSlotLoading(false)
      return notifyError("Not enough LAND tokens");
    } else {
      await handleBuyHouseSlots();
    }
  }

  const updateDepositedBalance = async () => {
    if (chainId !== undefined && address !== undefined) {
        const balance = useStakedBalance(chainId, address);
        setDepositedBalance((ethers as any).utils.formatUnits(balance, 0));
      }
  }

  const handleBuyHouseSlots = async () => {
    try {
    //   const { data: transactionData } = await axios.post('/has-item/get-buy-house-slot-transaction')

    //   const sendedTransaction = sendTransaction(transactionData.transaction)

    //   sendedTransaction.wait().then(async (receipt) => {
    //     if (receipt.status) {
    //       const { data } = await axios.post('/has-item/buy-house-slot', {
    //         txHash: receipt.transactionHash,
    //         blockNumber: receipt.blockNumber,
    //         nonce: transactionData.nonce
    //     })

    //       const landTokenV2Balance = await landTokenV2Contract.balanceOf(account);

    //       setUserResource((prevState) => ({
    //         ...prevState,
    //         landTokenV2: landTokenV2Balance
    //       }))

    //       setUserActivatedSlots(data.activatedSlots)

    //       setBuyHouseSlotLoading(false)
    //       notifySuccess(`New house slot purchased successfully!`)

    //     } else {
    //       setBuyHouseSlotLoading(false)
    //       notifyError("Buy House Slot Error");
    //     }
    //   })
      
    } catch (error) {
      console.log("Buy House Slot Error: ", (error as any).response.data.message);
      setBuyHouseSlotLoading(false)
      notifyError((error as any).response.data.message);
    }
  }


  useEffect(() => {
    (async () => {
      if (!isConnected) return;
      if (isLoginLoading) return;
      if (!isAuthenticated) return;

      updateDepositedBalance();

      await getHousesList()

      const interval = setInterval(async () => {
        await getUserHouses();
      }, 60000);

      return () => clearInterval(interval);
    })()
  }, [isAuthenticated, isLoginLoading, isConnected]);

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
  const activatedHouses = houseItems.filter(house => house.isActivated);
  const activatedHousesLength = activatedHouses.length;

  return (
    <>
      <section className="bg-primary text-text-primary">
        {isLoginLoading || isLoading ? (
            <div className="flex w-full min-h-[70vh] h-full items-center justify-center bg-primary">
            <ReactLoading type="bars" color="#61cd81" />
            </div>
        ) : 
        <>
            <div className="relative max-w-[1200px] px-0 mx-auto overflow-hidden pt-0 pb-[100px]">
            {(!isConnected || !isAuthenticated) ? (
                <div className="flex w-full min-h-[70vh] h-full items-center justify-center bg-primary">
                    <ConnectWallet />
                </div>
                ) : (
                <>
                    {chainId == 56 ? (<>
                        <Topbar isNftList={true} />
                        <div className="d-flex w-100 overflow-auto scrollbar-style flex-wrap align-items-center justify-conetent-between">
                            <span className="fw-bold fs-md">Harvestable resources</span>
                            <div className="divider d-block w-100 mb-4 my-3"></div>
                            <div className="d-flex flex-column w-100">
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

                                    {Array.from({ length: userActivatedSlots as number  - activatedHousesLength }).map((_, index) => (
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
                                            className={`btn nav-btn w-auto px-4 py-2 br-md fs-xs fw-700 text-tw-button-text-secondary ${buyHouseSlotLoading
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

                              {/* <div className="show-properties-info">
                                <div className="dashed-divider d-md-none"></div>
                                <div className="d-flex mt-2 py-2  justify-content-between">
                                  <span className={`font-semibold fs-16 ${theme ? "text-white-700" : "text-black-700"}`}>
                                    RWA Tokens Deposited:
                                  </span>
                                  <span className={`fw-normal fs-xs ${theme ? "text-white" : "text-black"}`}>
                                    {depositedBalance}{" "}
                                    {"LSRWA"}
                                  </span>
                                </div>
                                <div className="my-1 pt-1 d-flex flex-column mb-4">
                                  <div className="d-flex flex-column">
                                    <div className="flex justify-center w-full mt-2 justify-content-center">
                                      <InputCost
                                        height={34}
                                        width={500}
                                        value={depositeAmount}
                                        changeRepairAmount={setDepositeAmount}
                                        calcMaxAmount={calcDepositMax}
                                      />
                                    </div>
                                    <div className="mt-2 pt-3 flex justify-between">
                                      <button
                                        onClick={handleDeposit}
                                        className={`btn nav-btn py-2 br-md fs-xs fw-700 text-tw-button-text-secondary
                                        ${((houseItems.filter(house => house.isActivated).length < 1) || depositLoading) &&
                                          " btn-repair-disable "
                                          }
                                        ${depositLoading
                                            ? " d-flex justify-content-center align-items-center"
                                            : ""
                                          }`}
                                        disabled={
                                          (houseItems.filter(house => house.isActivated).length < 1) || depositLoading
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
                                        className={`btn nav-btn py-2 br-md fs-xs fw-700 text-tw-button-text-secondary
                                        ${((houseItems.filter(house => house.isActivated).length < 1) || withdrawLoading) &&
                                          " btn-repair-disable "
                                          }
                                        ${withdrawLoading
                                            ? "d-flex justify-content-center align-items-center"
                                            : ""
                                          }`}
                                        disabled={
                                          withdrawLoading || (houseItems.filter(house => house.isActivated).length < 1)
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

                                <div className="dashed-divider mb-2 d-md-none"/>
                                
                                <div className="d-flex flex-row justify-content-between ">
                                  <div className="d-flex flex-column me-3 justify-content-between  py-1">
                                    <span className={`d-flex fs-xs ${theme ? "text-gray-300" : "text-black-700"} align-items-center`}>
                                      Total Multiplier:
                                    </span>
                                    <span className={`d-flex fs-xs ${theme ? "text-gray-300" : "text-black-700"} align-items-center`}>
                                      Annual Yield:
                                    </span>
                                    <span className={`d-flex fs-xs ${theme ? "text-gray-300" : "text-black-700"} align-items-center`}>
                                      <span className="me-1">LAND Remaining:</span>
                                    </span>
                                  </div>

                                  <div className="d-flex flex-column align-items-end justify-content-between  gap-[10px] py-1">
                                    <span className="d-flex fs-xs text-black-700 align-items-center">
                                      <span className={`${theme ? "text-white" : "text-black"} fs-xs`}>
                                        x
                                        {numeral(
                                          houseItems.filter(house => house.isActivated).length > 0 ?
                                            houseItems.filter(house => house.isActivated).map(house => house.multiplier).reduce((a, b) => a + b) : 0
                                        ).format("0.[0]").toString()}{" "}
                                        / 50 RWA
                                      </span>

                                    </span>
                                    <span className={`${theme ? "text-white" : "text-black"} fs-xs`}>
                                      {`${numeral((
                                        depositedBalance * (
                                          houseItems.filter(house => house.isActivated).length > 0 ?
                                            houseItems.filter(house => house.isActivated).map(house => house.multiplier).reduce((a, b) => a + b) : 0
                                        ) / 50
                                      ).toString()).format(
                                        "0.[0]"
                                      )} LAND`}
                                    </span>
                                    <span className={`${theme ? "text-white" : "text-black"} fs-xs`}>
                                      {`${landRemaining} / ${numeral(
                                        Number(
                                          houseItems.filter(house => house.isActivated).length > 0 ?
                                            houseItems.filter(house => house.isActivated).map(house => house.tokenHarvestLimit).reduce((a, b) => a + b) : 0
                                        ) +
                                        Number(
                                          houseItems.filter(house => house.isActivated).length > 0 ?
                                            houseItems.filter(house => house.isActivated).map(house => house.extendedBalance).reduce((a, b) => a + b) : 0
                                        )
                                      ).format("0.[0]")}`}
                                    </span>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                            </div>
                        </div>
                    </>) : (<></>)}
                    
                </>
            )}
            </div>
        </>}
      </section>
    </>
  );
}
