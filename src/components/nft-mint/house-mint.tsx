import React, { useState, useEffect } from "react";
import numeral from "numeral";
import ReactLoading from "react-loading";
import { BsInfoCircle } from "react-icons/bs";
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import backendAxios from "../../../../helper/axios";
import { useGlobalContext } from "../../../../contexts/GlobalContext";
import HouseNft from "../../../../assets/img/house/house_big.bmp";
import HouseBNft from "../../../../assets/img/house/houseB.bmp";
import HouseRareNft from "../../../../assets/img/house/house_rare_big.bmp";
import HouseBRareNft from "../../../../assets/img/house/houseB_rare.bmp";
import HouseCNft from "../../../../assets/img/house/houseC.bmp"
import HouseCRareNft from "../../../../assets/img/house/houseC_rare.bmp"
import "./houseMintItem.css";
import { useAccount, useBalance } from "wagmi";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import Button from "../common/button";

interface HouseMintItemProps {
  product: any
}

export default function houseMintItem({
  product
}: HouseMintItemProps) {
  const {
    signer,
    account,
    provider,
    notifySuccess,
    isDarkMode,
    notifyError,
    landTokenV2Contract,
    userResource,
    setUserResource,
    nftCredits,
    updateNftCredits
  } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [harvestAmount, setHarvestAmount] = useState(Number())
  const [nftCreditCost, setNftCreditCost] = useState(Number())
  const { address } = useAccount();

  useEffect(() => {
    setHarvestAmount(nftCreditCost / 4);
  }, [nftCreditCost])
  const getHouseImageUrl = () => {
    return (product.type == 1) ?
      (harvestAmount >= 500 ? HouseRareNft : HouseNft) :
      ((product.type == 2) ? (
        harvestAmount >= 500 ? HouseBRareNft : HouseBNft
      ) : (
        harvestAmount >= 500 ? HouseCRareNft : HouseCNft
      ))

  };

  const balance = useBalance({
    address: address,
    token: process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
    chainId: Number(process.env.REACT_APP_NET_ID),
  })

  const mintNewHouse = async () => {
    try {
      setIsLoading(true)
      const { data: transactionData } = await backendAxios.post('/house/get-transaction-for-house-mint', {
        assetAmount: nftCreditCost
      })

      const feeLandAmount = harvestAmount / 100 * 8;


      if (Number(balance.data.formatted) >= Number(feeLandAmount)) {
        const sendedTransaction = await signer.sendTransaction(transactionData.transaction)
        sendedTransaction.wait().then(async (receipt) => {
          if (receipt.status) {
            const { data } = await backendAxios.post('/house/add-new-house', {
              assetAmount: harvestAmount * 4,
              txHash: receipt.transactionHash,
              blockNumber: receipt.blockNumber,
              nonce: transactionData.nonce,
              houseType: (
                product.type == 1 ? (harvestAmount >= 500 ? 2 : 1) :
                  product.type == 2 ? (harvestAmount >= 500 ? 4 : 3) : (harvestAmount >= 500 ? 6 : 5))
            })

            if (data) {
              const landTokenV2Balance = await landTokenV2Contract.balanceOf(account);
              await updateNftCredits();

              setUserResource((prevState) => ({
                ...prevState,
                landTokenV2: landTokenV2Balance,
              }))

              setIsLoading(false)
              return notifySuccess(`Mint a new house successfully`)
            }
          } else {
            setIsLoading(false)
            return notifyError(`Mint a new house Error`);
          }
        })
      } else {
        setIsLoading(false)
        return notifyError(`Insufficient LAND Token amount`);
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      return notifyError(`Mint a new house Error`);
    }
  }

  return (
    <div className="flex flex-col animate-[fadeIn] duration-1200 rounded-[15px] overflow-hidden w-[257px]">
      <div className="h-[249px] relative">
        <div className={`bg-[#c4c4c433] text-[#fff] rounded-[16px] absolute top-0 w-full text-center p-2 ${BOLD_INTER_TIGHT.className}`}>
          {product.name} {Number(harvestAmount) >= 500 && `- Rare`}
        </div>
        <img
          src={getHouseImageUrl()}
          alt="mint-image"
          className="w-[251px] h-[251px]"
        />
        <div className="flex items-end absolute w-full justify-between px-[10px] bottom-[10px]">
          <div className="current-multiplier">
            <span className="text-[#fff] text-[14px] font-semibold align-text-bottom leading-[18px]">
              x
              {numeral(Number(harvestAmount) >= 500 ? 6 : 5).format("0.[0]").toString()}{" "}
            </span>
            <span className="text-[#fff] text-[10px] pl-[2px] align-text-bottom">LAND &nbsp;Yield/Year</span>
          </div>
          <div className="mb-1">
          </div>
        </div>
      </div>
      <div className="bg-[#6f8e9d66] p-[12px] flex flex-col p-3">
        <div className="flex justify-between items-center">
          <div className="text-[#0b6c96] text-[18px] font-semibold flex items-center">
            <span className="pr-1 text-text-secondary">NFT Credit Cost</span>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id={`tooltip-top`}>The number of NFT Credits to spend on the minting. NFT Credits can be earned by purchasing RWA Tokens.</Tooltip>
              }
            >
              <BsInfoCircle id="tooltip-icon" className="w-4 h-4 cursor-pointer z-50 text-text-secondary" />
            </OverlayTrigger>
          </div>
          <input
            className={`max-w-[70px] border-[1px] border-[#8d8d8d] rounded-[5px] text-right text-[0.8rem] px-[5px] text-[#000] mr-1 ${isDarkMode ? "bg-gray-600" : ""}`}
            type="number"
            step="1"
            min={200}
            value={nftCreditCost}
            onChange={(e: any) => setNftCreditCost(e.target.value)}
            onKeyDown={(e) => { if (e.key === '.') { e.preventDefault(); } }}
          />
          {/* <div className="house-item-value fs-xxs fw-600">
            {Number(harvestAmount) * 2}
          </div> */}
        </div>
        <div className="flex items-end justify-between pr-2 pt-1">
          <div className="text-[#0b6c96] text-[18px] font-semibold flex items-center">
            <span className="pr-1 text-text-secondary">Harvestable LAND</span>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id={`tooltip-top`}>The number of LAND Tokens that will be harvestable from the NFT.</Tooltip>
              }
            >
              <BsInfoCircle id="tooltip-icon" className="w-4 h-4 cursor-pointer z-50 text-text-secondary" />
            </OverlayTrigger>
          </div>
          <div className={`${isDarkMode ? "#ffffff88" : "#00000088"} text-[18px] font-semibold`}>
            {Number(harvestAmount)}
          </div>
          {/* <input
            className="asset-amount me-1"
            type="number"
            step="1"
            min={200}
            value={harvestAmount}
            onChange={(e) => setHarvestAmount(e.target.value)}
          /> */}
        </div>
        <div className="flex justify-between items-end pr-2 pt-1 ">
          <div className="text-[#0b6c96] text-[18px] font-semibold text-text-secondary">Mint Price</div>
          <div className={`${isDarkMode ? "#ffffff88" : "#00000088"} text-[18px] font-semibold`}>
            {`${Number(harvestAmount) / 12.5} LAND`}
          </div>
        </div>
        <Button
          onClick={() => mintNewHouse()}
          disabled={isLoading || (Number(nftCreditCost) < 400) || (Number(nftCreditCost) > Number(nftCredits))}
          className={`w-full text-[16px] flex items-center justify-center mt-2 ${BOLD_INTER_TIGHT.className}`}
        >
          {isLoading ? (
            <ReactLoading
              type="spin"
              className="mr-2 mb-[4px]"
              width="24px"
              height="24px"
            />
          ) : (Number(nftCreditCost) <= 0) ? 'Enter Credit Amount' : (Number(nftCreditCost) < 400) ? 'Minimum 400 NFT Credits' : (Number(nftCreditCost) > Number(nftCredits)) ? "Insufficient NFT Credits" : "Mint"}
        </Button>
      </div>
    </div>
  );
};
