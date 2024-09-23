import { useMemo, useState, useEffect, use } from "react";
import Modal from "react-modal";
import Image from "next/image";
import Link from "next/link";
import { BsInfoCircle, BsLink45Deg } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { bsc } from "viem/chains";
import { useAccount } from "wagmi";
import { BigNumberish, formatEther } from "ethers";
import { useBalance } from "wagmi";
import { useGlobalContext } from "../../context/GlobalContext";

import { Collapse } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { db } from "../../../lib/firebase";
import AutoRedeemABI from "../../../contexts/abis/AutoRedeemOptIn.json"
import APIConsumerABI from "../../../contexts/abis/APIConsumer.json";
import AssetToken from "../../../contexts/abis/firstNFT/LS81712NFToken.json";
import Carousel from "../../re-usable/Carousel";
import CarouselItem from "../../re-usable/Carousel/CarouselItem";
import CarouselControlMobile from "../../re-usable/Carousel/CarouselControlMobile";
import PropertyItem from "./PropertyItem";
import PropertyCard from "../common/property-card";
import myRwa from "../../../assets/img/icons/Coin_Stacked.svg";
import ModalOpenIcon from "../../../assets/img/icons/finance-logs-open.png"
import "./financial-summary.css"
import "./property-item.css"
import useGetTotalValue from "../../hooks/contract/APIConsumerContract/useGetTotalValue";
import useBankBalance from "../../hooks/contract/APIConsumerContract/useBankBalance";
import useGetRwaPrice from "../../hooks/contract/APIConsumerContract/useGetRwaPrice";
import useReserveRwa from "../../hooks/contract/APIConsumerContract/useReserveRwa";
import useTotalSupply from "../../hooks/contract/RWAContract/useTotalSupply";
import { 
  getData as getFinancialLogsData,
  selectFinancialLogs,
} from '../../lib/slices/firebase-slices/financial-logs';
import {
  getData,
  selectLoadingStatus,
  selectGrossRentPerMonth,
  selectTaxes,
  selectInsurance,
  selectManagement,
  selectAppreciation,
  selectNetRentalPerMonth
} from '../../lib/slices/firebase-slices/properties-rental';
import useIsOptedIn from "../../hooks/contract/AutoRedeemContract/useIsOptedIn";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { BOLD_INTER_TIGHT, RWACONTRACT_ADDRESS } from "../../config/constants/environments";
import { getDateStringFromTimestamp } from "../../utils/helpers/convert-date";
import useOptOut from "../../hooks/contract/AutoRedeemContract/useOptOut";
import useOptIn from "../../hooks/contract/AutoRedeemContract/useOptIn";
import useBalanceOf from "../../hooks/contract/RWAContract/useBalanceOf";

export default function FinancialSummary() {
  const { theme } = useGlobalContext();
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();
  const totalPropertyValue = useGetTotalValue() as BigNumberish;
  const bankBalance = useBankBalance() as BigNumberish;
  const rwaPrice = useGetRwaPrice() as BigNumberish;
  const rwaValue = useTotalSupply() as BigNumberish;
  const totalRWATokenBalanceOfReserveWallets = useReserveRwa() as BigNumberish;

  const financeLogs = useAppSelector(selectFinancialLogs);
  const isSummaryLoading = useAppSelector(selectLoadingStatus);

  const grossRentPerMonth = useAppSelector(selectGrossRentPerMonth)
  const taxes = useAppSelector(selectTaxes)
  const insurance = useAppSelector(selectInsurance)
  const management = useAppSelector(selectManagement)
  const appreciation = useAppSelector(selectAppreciation)
  const netRentalPerMonth = useAppSelector(selectNetRentalPerMonth)
  let isAutoRedeem = useIsOptedIn(address) as boolean
  const rwaBalance = useBalanceOf(address) as number
  const { data: optOutData, isPending: isOptOutPending, onOptOut } = useOptOut()
  const { data: optInData, isPending: isOptInPending, onOptIn } = useOptIn()

  useEffect(() => {
    if (optOutData && isOptOutPending) {
      isAutoRedeem = !isAutoRedeem
    }
  
    if (optInData && isOptInPending) {
      isAutoRedeem = !isAutoRedeem
    }
  }, [optOutData, isOptOutPending, optInData, isOptInPending])

  useEffect(() => {
    dispatch(getFinancialLogsData())
    dispatch(getData())
  }, [dispatch])

  const [openMonthlyExpences, setOpenMonthlyExpences] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: balance } = useBalance({
    address: address,
    token: RWACONTRACT_ADDRESS,
    chainId: bsc.id,
  }) as { data: any }

  async function onAutoRedeem() {
    if (isAutoRedeem) {
      onOptOut()
    }
    else {
      if (rwaBalance < 1000) {
        window.alert("Must hold 1,000 RWA Tokens to opt into Auto Redemption")
        return
      }
      onOptIn()
    }
  }
  
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: theme == 'dark' ? "#31333b" : "#f6f7f9",
    },
    overlay: {
      background: '#00000080'
    }
  };

  return (
    <>
      <div className="flex flex-col w-full gap-[24px]">
        <div className="hidden md:flex gap-[24px]">
          <div className="flex flex-col items-start w-full max-w-[371px] px-[24px] pt-[24px] pb-[8px] bg-third">
            <div className="flex justify-start flex-row gap-8 w-full">
              <div className="flex flex-col gap-[10px]">
                <span className="font-medium text-[14px] leading-[22px] text-text-secondary">My RWA Balance</span>
                <div className="flex gap-[8px]">
                  <div className="flex items-center jsutify-center w-[32px] h-[32px] py-[6.23px] px-[7px] bg-[#F6F7F9]">
                    <Image src={myRwa} alt="refresh" className="w-[18px]" />
                  </div>
                  <span className={`text-[24px] leading-[30px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                    {(Number(formatEther(rwaPrice)) === undefined || isConnected === false) ? "0" : `${parseFloat(balance.formatted)}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center w-full">
              <input
                type="checkbox"
                onChange={() => onAutoRedeem()}
                id="bopis"
                checked={isAutoRedeem}
                disabled={!isConnected}
              />
              <span className="font-medium text-[14px] leading-[22px] ml-1 text-text-secondary">
                Auto Redeem
                <Link href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/auto-redeem" target="_blank">
                  <BsLink45Deg className="w-5 h-5"></BsLink45Deg>
                </Link>
              </span>
            </div>
          </div>
          <PropertyCard page="rwa" title="Rental Yield" value={(netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100).toFixed(3) + "%"} />
          {/* <PropertyCard title="Est. Appreciation" value={(appreciation / propertyValue).toFixed(3) + "%"} /> */}
          <PropertyCard page="rwa" title="Ann. Return" value={(netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100 + appreciation / Number(formatEther(totalPropertyValue))).toFixed(3) + "%"} />
        </div>
        <div className="block md:hidden">
          <div className="flex gap-[24px]">
            <Carousel
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              containerClassName="w-full m-0 items-center"
            >
              <CarouselItem>
                <div className="bg-third md:bg-secondary flex flex-col justify-center items-center md:items-start w-full gap-[10px] rounded-[16px] min-w-max">
                  <div className="flex justify-center flex-row gap-8 w-full">
                    <div className="flex flex-col gap-[10px]">
                      <span className="font-medium text-[14px] leading-[22px] dark:text-[#bec8f399] text-[#0a133999]">My RWA Balance</span>
                      <div className="flex gap-[8px]">
                        <div className="w-[32px] h-[32px] py-[6.23px] px-[7px] rounded-[30px] flex justify-center items-center bg-[#F6F7F9]" >
                          <img src={myRwa} alt="refresh" width="18px" />
                        </div>
                        <span className={`text-[24px] leading-[30px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                          {(Number(formatEther(rwaPrice)) === undefined || isConnected === false) ? "0" : `${parseFloat(balance?.data?.formatted)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-full">
                    <input
                      type="checkbox"
                      onChange={() => onAutoRedeem()}
                      id="bopis"
                      checked={isAutoRedeem}
                      disabled={!isConnected}
                    />
                    <span className="font-medium text-[14px] leading-[22px] ml-1 dark:text-[#bec8f399] text-[#0a133999]">
                      Auto Redeem
                      <Link href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/auto-redeem" target="_blank">
                        <BsLink45Deg className="w-5 h-5"></BsLink45Deg>
                      </Link>
                    </span>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <PropertyCard title="Rental Yield" value={(netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100).toFixed(3) + "%"} />
              </CarouselItem>
              <CarouselItem>
                <PropertyCard title="Ann. Return" value={(netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100 + appreciation / Number(formatEther(totalPropertyValue))).toFixed(3) + "%"} />
              </CarouselItem>
            </Carousel>
          </div>
          <CarouselControlMobile
            isIndicator={true}
            isControl={true}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            count={3}
            isSmallControl={true}
            style={{
              margin: '0 0 20px 0',
            }}
            carouselControlClass="section-container-carousel limited-width"
          />
        </div>
        <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
          <div className="flex flex-col w-full py-[24px] px-[15px] rounded-[16px] bg-third text-text-primary">
            <div className={`flex justify-between items-center text-[24px] leading-[30px] mb-[24px] ${BOLD_INTER_TIGHT.className}`}>
              <div className="flex gap-x-1">
                <div>Financial Summary</div>
                <div className="relative flex items-center">
                  <BsInfoCircle id="tooltip-icon" className="w-4 h-4 cursor-pointer z-50"></BsInfoCircle>
                  <div id="tooltip-content" className="hidden md:block absolute -left-[1000px] z-40 bg-white top-5 w-[200px] md:w-[400px] opacity-0 hover:opacity-100 hover:left-5 transition delay-75 text-[15px] rounded-lg shadow-lg px-3 py-2 font-normal">
                    Financial information is provided for your information only. Expenses and property valuations are estimated and subject to change at any time. Maintenance costs, vacancies, and other factors can affect property returns.
                  </div>
                </div>
              </div>
              <Image onClick={() => setIsModalOpen(true)} src={ModalOpenIcon} alt="modal open" className="w-5 h-5 cursor-pointer" />
            </div>
            <div className="flex flex-col">
              <PropertyItem property={
                { title: "Gross Rent per Year", value: Number(grossRentPerMonth * 12).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
              } isLoaded={isSummaryLoading} />
              <PropertyItem property={
                { title: "Gross Rent per Month", value: Number(grossRentPerMonth).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
              } isLoaded={isSummaryLoading} />
              <div className="flex w-full justify-between py-[13px]" onClick={() => setOpenMonthlyExpences(!openMonthlyExpences)}>
                <div className={`text-[14px] leading-[22px] tracking-[0.02em] flex items-center gap-[10px] cursor-pointer ${BOLD_INTER_TIGHT.className}`}>
                  <span>Annual Expenses</span>
                  <KeyboardArrowDown fontSize="small" />
                </div>
                <div className="text-[14px] leading-[22px] tracking-[0.02em]"> {isSummaryLoading == true ? (<Skeleton className="rounded-lg" width={100} height={18} />) : ("-$" + ((taxes) + (insurance) + management).toLocaleString(undefined, { maximumFractionDigits: 2 }))}</div>
              </div>
              <Collapse in={openMonthlyExpences}>
                <div className="w-full rounded-[12px] px-[16px] pb-[24px] bg-secondary text-text-primary">
                  <div className="py-[13px] w-full flex justify-between font-medium text-[12px] leading-[20px] text-center tracking-[0.02em]">
                    <div>Property Taxes</div>
                    <div>${(taxes).toFixed(2)}</div>
                  </div>
                  <div className="py-[13px] w-full flex justify-between font-medium text-[12px] leading-[20px] text-center tracking-[0.02em]">
                    <div>Insurance</div>
                    <div>${(insurance).toFixed(2)}</div>
                  </div>
                  <div className="py-[13px] w-full flex justify-between font-medium text-[12px] leading-[20px] text-center tracking-[0.02em]">
                    <div>Property Management</div>
                    <div>${management}</div>
                  </div>
                </div>
              </Collapse>
              <div className="w-full flex justify-between py-[13px]">
                <div className={`text-[14px] leading-[22px] tracking-[0.02em] ${BOLD_INTER_TIGHT.className}`}>Total Property Value</div>
                <div className="text-[14px] leading-[22px] tracking-[0.02em]"> {isSummaryLoading == true ? (<Skeleton className="rounded-lg" width={100} height={18} />) : ("$" + (Number(formatEther(totalPropertyValue)) - Number(formatEther(bankBalance))).toLocaleString())}</div>
              </div>
              <div className="w-full flex justify-between py-[13px]">
                <div className={`text-[14px] leading-[22px] tracking-[0.02em] ${BOLD_INTER_TIGHT.className}`}>Cash Assets</div>
                <div className="text-[14px] leading-[22px] tracking-[0.02em]"> {isSummaryLoading == true ? (<Skeleton className="rounded-lg" width={100} height={18} />) : "$" + Number(formatEther(bankBalance)).toLocaleString()}</div>
              </div>
              <PropertyItem property={
                { title: "Net Rent Per Month", value: Number(netRentalPerMonth).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
              } isLoaded={isSummaryLoading} />
              <PropertyItem property={
                { title: "Net Rent Per Year", value: Number(netRentalPerMonth * 12).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
              } isLoaded={isSummaryLoading} />
              <PropertyItem property={
                { title: "Token Price", value: Number(formatEther(rwaPrice)).toLocaleString(undefined, { maximumFractionDigits: 4 }) }
              } isLoaded={isSummaryLoading} />
              <div className="w-full flex justify-between py-[13px]">
                <div className={`text-[14px] leading-[22px] tracking-[0.02em] ${BOLD_INTER_TIGHT.className}`}>Total Tokens</div>
                <div className="text-[14px] leading-[22px] tracking-[0.02em]"> {isSummaryLoading == true ? (<Skeleton className="rounded-lg" width={100} height={18} />) : Number(BigInt(rwaValue) - BigInt(totalRWATokenBalanceOfReserveWallets)).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={customModalStyles}>
        <div>
          <div className="font-bold text-[22px] mb-2 text-text-primary">Finance Log</div>
          {financeLogs.map((log: any) => {
            return <div className="border-b pt-2 pb-1" key={log.id}>
              <div className="text-[#777] text-[14px]">{getDateStringFromTimestamp(log.datetime)}</div>
              <div className="flex justify-between text-text-primary">
                <div>{log.action}</div>
                <div className={`${log.value > 0 ? "text-[#30ba00]" : "text-[#ce1313]"}`}>
                  {log.value < 0 ? "-" : "+"}${log.value < 0 ? log.value * -1 : log.value}
                </div>
              </div>
            </div>
          })}
        </div>
      </Modal>
    </>
  );
}
