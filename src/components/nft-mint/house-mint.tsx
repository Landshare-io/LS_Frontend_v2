import React, { useState, useEffect } from "react";
import numeral from "numeral";
import ReactLoading from "react-loading";
import { BsInfoCircle } from "react-icons/bs";
import { useAccount, useChainId } from "wagmi";
import Tooltip from "../common/tooltip";
import { useGlobalContext } from "../../context/GlobalContext";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import useMintHouseNft from "../../hooks/nft-game/house-nfts/useMintHouseNft";
import useGetNftCredits from "../../hooks/nft-game/apollo/useGetNftCredits";
import Button from "../common/button";
import HouseNft from "../../../public/img/house/house_big.bmp";
import HouseBNft from "./../../public/img/house/houseB.bmp";
import HouseRareNft from "./../../public/img/house/house_rare_big.bmp";
import HouseBRareNft from "./../../public/img/house/houseB_rare.bmp";
import HouseCNft from "./../../public/img/house/houseC.bmp"
import HouseCRareNft from "./../../public/img/house/houseC_rare.bmp"

interface HouseMintItemProps {
  product: any
}

export default function HouseMintItem({
  product
}: HouseMintItemProps) {
  const { theme } = useGlobalContext();
  const { nftCredits } = useGetNftCredits()
  const [isLoading, setIsLoading] = useState(false);
  const [harvestAmount, setHarvestAmount] = useState(Number())
  const [nftCreditCost, setNftCreditCost] = useState(Number())
  const { address } = useAccount();
  const chainId = useChainId();
  const { mint: mintNewHouse } = useMintHouseNft(chainId, address, setIsLoading)

  useEffect(() => {
    setHarvestAmount(nftCreditCost / 4);
  }, [nftCreditCost])

  const getHouseImageUrl = (): any => {
    return (product.type == 1) ?
      (harvestAmount >= 500 ? HouseRareNft : HouseNft) :
      ((product.type == 2) ? (
        harvestAmount >= 500 ? HouseBRareNft : HouseBNft
      ) : (
        harvestAmount >= 500 ? HouseCRareNft : HouseCNft
      ))
  };

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
          <div>
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
            <Tooltip 
              title="The number of NFT Credits to spend on the minting. NFT Credits can be earned by purchasing RWA Tokens."
              tooltipClassName="min-w-[400px]"
            >
              <BsInfoCircle id="tooltip-icon" className="w-4 h-4 cursor-pointer z-50 text-text-secondary"></BsInfoCircle>
            </Tooltip>
          </div>
          <input
            className={`max-w-[70px] border-[1px] border-[#8d8d8d] rounded-[5px] text-right text-[0.8rem] px-[5px] text-[#000] mr-1 ${theme == 'dark' ? "bg-gray-600" : ""}`}
            type="number"
            step="1"
            min={200}
            value={nftCreditCost}
            onChange={(e: any) => setNftCreditCost(e.target.value)}
            onKeyDown={(e) => { if (e.key === '.') { e.preventDefault(); } }}
          />
        </div>
        <div className="flex items-end justify-between pr-2 pt-1">
          <div className="text-[#0b6c96] text-[18px] font-semibold flex items-center">
            <span className="pr-1 text-text-secondary">Harvestable LAND</span>
            <Tooltip 
              title="The number of LAND Tokens that will be harvestable from the NFT."
              tooltipClassName="min-w-[400px]"
            >
              <BsInfoCircle id="tooltip-icon" className="w-4 h-4 cursor-pointer z-50 text-text-secondary"></BsInfoCircle>
            </Tooltip>
          </div>
          <div className={`${theme == 'dark' ? "#ffffff88" : "#00000088"} text-[18px] font-semibold`}>
            {Number(harvestAmount)}
          </div>
        </div>
        <div className="flex justify-between items-end pr-2 pt-1 ">
          <div className="text-[#0b6c96] text-[18px] font-semibold text-text-secondary">Mint Price</div>
          <div className={`${theme == 'dark' ? "#ffffff88" : "#00000088"} text-[18px] font-semibold`}>
            {`${Number(harvestAmount) / 12.5} LAND`}
          </div>
        </div>
        <Button
          onClick={() => mintNewHouse(nftCreditCost, harvestAmount)}
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
