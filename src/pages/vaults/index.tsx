import { useState, useEffect, useRef } from "react";
import Head from 'next/head';
import type { NextPage } from 'next';
import { useChainId, useAccount } from "wagmi"
import { bsc } from "viem/chains";
import numeral from "numeral"
import Image from "next/image";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Slider from 'react-slick';
import ReactModal from "react-modal";
import Collapse from "../../components/common/collapse";
import Breadcrumb from "../../components/common/breadcrumb";
import ManualVault from "../../components/vaults/manual-vault";
import AutoVault from "../../components/vaults/auto-vault";
import LPVault from "../../components/vaults/lp-vault";
import Usdtvault from "../../components/vaults/usdt-vault";
import { useTheme } from "next-themes";
import useGetPrice from "../../hooks/get-apy/useGetPrice";
import { BOLD_INTER_TIGHT, RWA_LP_CONTRACT_ADDRESS, RWA_LP_PANCAKESWAP_CONTRACT_ADDRESS } from "../../config/constants/environments";
import coinStack from "../../../public/icons/coin-stacked.svg"
import tabIcon3 from "../../../public/icons/tab-icon3.svg"
import tabIcon4 from "../../../public/icons/tether.svg"
import tabBook from "../../../public/icons/tab-book.svg"
import rotateBlue from "../../../public/icons/rotate-blue.svg";
import CloseIcon from "../../../public/icons/close.svg";
import CloseIconDark from "../../../public/icons/close-dark.svg";
import leftRight from "../../../public/icons/left-right.svg";
import IconArrowUpDown from "../../../public/icons/arrow-up-down.svg";
import { AUTO_VAULT_MAIN_CHAINS, MAJOR_WORK_CHAINS } from "../../config/constants/environments";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const breadcrumbItems = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'Vaults',
    url: '/vaults'
  }
]

const VAULT_MAJOR_CHAINS = MAJOR_WORK_CHAINS['/vaults']['auto']

const StakingPage: NextPage = () => {
  const { theme } = useTheme();
  const { isConnected } = useAccount()
  const chainId = useChainId() as 56 | 137 | 42161 | 97 | 11155111 | 80002
  const { price } = useGetPrice(chainId);

  const [selectedVault, useSelectedVault] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalApy, setShowModalApy] = useState(0);
  const [timeframe, setTimeframe] = useState("1y");
  const [roiShowDetails, setRoiShowDetails] = useState(false);
  const [tokenUsdPrice, setTokenUsdPrice] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(0)
  const [usdAmount, setUsdAmount] = useState(0)
  const [roiInputCalculValue, setRoiInputCalculValue] = useState("")
  const [isShowUsdPrice, setIsShowUsdPrice] = useState(false)
  const [rewardPercent, setRewardPercent] = useState(0)
  const [isLPVault, setIsLPVault] = useState(false)
  const mobileVaultSliderRef = useRef<Slider | null>(null)

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "400px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0,
      backgroundColor: theme == "dark" ? "#31333b" : "#f6f7f9",
    },
    overlay: {
      background: '#00000080'
    }
  };


  function handleClick(tab: number) {
    useSelectedVault(tab)
  }
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false
  };

  const vaults = [
    {
      index: 0,
      icon: tabBook,
      label: 'LAND Token Staking',
    },
    {
      index: 1,
      icon: rotateBlue,
      label: 'Auto LAND Staking',
    },
    {
      index: 2,
      icon: tabIcon3,
      label: 'LAND-BNB LP ',
    },
    {
      index: 3,
      icon: tabIcon4,
      label: 'LSRWA-USDT LP (Pancakeswap)',
    },
    {
      index: 4,
      icon: tabIcon4,
      label: 'LSRWA-USDT LP (DS Swap)',
    },
 
  ];

  useEffect(() => {
    if (!(AUTO_VAULT_MAIN_CHAINS.map(chain => chain.id) as number[]).includes(chainId)) {
      useSelectedVault(1)
    } else {
      useSelectedVault(0)
    }
  }, [chainId])

  useEffect(() => {
    showModal ? disableBodyScroll(document.documentElement) : enableBodyScroll(document.documentElement)
  }, [showModal]);

  useEffect(() => {
    setRewardPercent(Number(numeral(showModalApy).format('0.[00000]')))
  }, [showModalApy]);

  useEffect(() => {
    if (isShowUsdPrice) {
      setUsdAmount(Number(roiInputCalculValue))
      setTokenAmount(Number(roiInputCalculValue) / tokenUsdPrice)
    } else {
      setTokenAmount(Number(roiInputCalculValue))
      setUsdAmount(Number(roiInputCalculValue) * tokenUsdPrice)
    }
    setRewardPercent(Number(numeral(showModalApy).format('0.[00000]')))
  }, [roiInputCalculValue, isShowUsdPrice]);

  return (
    <div>
      <Head>
        <title>Landshare - Vaults</title>
        <meta
          content="app.landshare.io"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <div className="bg-primary pt-[41px] pb-[25px] px-[20px] lg:px-[0px]">
        <div className="max-w-[1200px] m-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
    
      <div className="bg-primary py-[20px] px-[20px] md:px-[40px] lg:px-[120px] pt-0 pb-20 lg:pb-40">
        <div className="flex flex-col md:justify-between items-center max-w-[1200px] m-auto gap-[12px]">
          <div className="flex items-center m-auto py-[6px] pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-secondary">
            <div className="flex items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-primary">
              <Image src={coinStack} alt="" />
            </div>
            <span className="text-[14px] leading-[22px] tracking-[0.02em] font-semibold text-text-primary">LAND Staking</span>
          </div>
          <h1 className={`text-[54px] leading-[68px] m-auto p-0 text-text-primary ${BOLD_INTER_TIGHT.className}`}>Vaults</h1>
          <p className="text-center text-[16px] leading-[28px] tracking-[0.02em] text-[#7c7c80]">
            Earn Rewards for Staking in our DeFi Vaults
          </p>
        </div>
        <div className="flex flex-col items-start md:justify-between md:items-center max-w-[1200px] m-auto w-full gap-[24px] mt-[32px] xl:gap-[32px]">
          <div className="relative flex mlg:hidden justify-between p-0 h-[132px] w-full gap-[20px] mb-[20px]">
            <button
              type="button"
              aria-label="Previous vault"
              onClick={() => mobileVaultSliderRef.current?.slickPrev()}
              className="absolute left-[6px] top-1/2 -translate-y-1/2 z-10 w-[20px] h-[20px] rounded-full bg-secondary text-text-primary flex items-center justify-center"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 1.5L3 5L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next vault"
              onClick={() => mobileVaultSliderRef.current?.slickNext()}
              className="absolute right-[6px] top-1/2 -translate-y-1/2 z-10 w-[20px] h-[20px] rounded-full bg-secondary text-text-primary flex items-center justify-center"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 1.5L7 5L3.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Slider ref={mobileVaultSliderRef} {...sliderSettings} centerPadding="10px" className="w-full">
              {vaults.map((vault) => (
                <div key={vault.index} className="px-[5px] bg-transparent">
                  <button
                    className={selectedVault === vault.index ? 
                      `bg-[#0A1339] text-[#fff] text-[10px] leading-[16px] tracking-[0.02em] flex flex-col justify-center items-center py-[12px] px-[8px] gap-[4px] h-[112px] w-full rounded-[12px] ${BOLD_INTER_TIGHT.className}` : 
                      `bg-secondary flex flex-col justify-center items-center leading-[16px] py-[12px] px-[8px] gap-[4px] h-[112px] rounded-[12px] text-[10px] text-[#9d9fa8] w-full tracking-[0.02em] ${BOLD_INTER_TIGHT.className}`}
                    onClick={() => handleClick(vault.index)}
                  >
                    <div className="w-7 h-7 p-[1px] bg-primary rounded-full">
                      <Image src={vault.icon} className="w-full h-full" alt="" />
                    </div>
                    <span>{vault.label}</span>
                  </button>
                </div>
              ))}
            </Slider>
          </div>
          <div className="flex mlg:hidden w-full">
            {(selectedVault === 0 ?
              <ManualVault
                title="LAND Token Staking"
                setShowModal={setShowModal}
                setIsLPVault={setIsLPVault}
                setIsShowUsdPrice={setIsShowUsdPrice}
                setTokenUsdPrice={setTokenUsdPrice}
                setShowModalApy={setShowModalApy}
              /> :
              selectedVault === 1 ?
                <AutoVault
                  title={"Auto LAND Staking"}
                  setShowModal={setShowModal}
                  setShowModalApy={setShowModalApy}
                  setTokenUsdPrice={setTokenUsdPrice}
                  setIsLPVault={setIsLPVault}
                  setIsShowUsdPrice={setIsShowUsdPrice}
                /> : selectedVault === 2 ?
                  <LPVault
                    title={"LAND-BNB LP"}
                    setShowModal={setShowModal}
                    setShowModalApy={setShowModalApy}
                    setTokenUsdPrice={setTokenUsdPrice}
                    setIsLPVault={setIsLPVault}
                    setIsShowUsdPrice={setIsShowUsdPrice}
                  /> : selectedVault === 3 ?
                  <Usdtvault
                    title={"LSRWA-USDT LP (Pancakeswap)"}
                    setShowModal={setShowModal}
                    setShowModalApy={setShowModalApy}
                    setTokenUsdPrice={setTokenUsdPrice}
                    setIsLPVault={setIsLPVault}
                    setIsShowUsdPrice={setIsShowUsdPrice}
                    poolId={5}
                    isInactive={false}
                    lpContractAddress={RWA_LP_PANCAKESWAP_CONTRACT_ADDRESS[bsc.id]}
                    isSteerVault={true}
                  /> :
                  <Usdtvault
                    title={"LSRWA-USDT LP (DS Swap)"}
                    setShowModal={setShowModal}
                    setShowModalApy={setShowModalApy}
                    setTokenUsdPrice={setTokenUsdPrice}
                    setIsLPVault={setIsLPVault}
                    setIsShowUsdPrice={setIsShowUsdPrice}
                    poolId={4}
                    isInactive={true}
                    lpContractAddress={RWA_LP_CONTRACT_ADDRESS[bsc.id]}
                  />
            )}
          </div>
          <div className="hidden mlg:flex mlg:flex-col gap-[32px] w-full">
            {(<>
                {(!(VAULT_MAJOR_CHAINS.map(chain => chain.id) as number[]).includes(chainId)) ? (
                  <>
                    <ManualVault
                      title="LAND Token Staking"
                      setShowModal={setShowModal}
                      setIsLPVault={setIsLPVault}
                      setIsShowUsdPrice={setIsShowUsdPrice}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                    />
                    <AutoVault
                      title={"Auto LAND Staking"}
                      setShowModal={setShowModal}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                      setIsLPVault={setIsLPVault}
                      setIsShowUsdPrice={setIsShowUsdPrice}
                    />
                  </>
                ) : (
                  <>
                    <AutoVault
                      title={"Auto LAND Staking"}
                      setShowModal={setShowModal}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                      setIsLPVault={setIsLPVault}
                      setIsShowUsdPrice={setIsShowUsdPrice}
                    />
                    <ManualVault
                      title="LAND Token Staking"
                      setShowModal={setShowModal}
                      setIsLPVault={setIsLPVault}
                      setIsShowUsdPrice={setIsShowUsdPrice}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                    />
                  </>
                )}

                <LPVault
                  title={"LAND-BNB LP Staking"}
                  setShowModal={setShowModal}
                  setShowModalApy={setShowModalApy}
                  setTokenUsdPrice={setTokenUsdPrice}
                  setIsLPVault={setIsLPVault}
                  setIsShowUsdPrice={setIsShowUsdPrice}
                />
                <Usdtvault
                  title={"LSRWA-USDT LP (Pancakeswap)"}
                  setShowModal={setShowModal}
                  setShowModalApy={setShowModalApy}
                  setTokenUsdPrice={setTokenUsdPrice}
                  setIsLPVault={setIsLPVault}
                  setIsShowUsdPrice={setIsShowUsdPrice}
                  poolId={5}
                  isInactive={false}
                  lpContractAddress={RWA_LP_PANCAKESWAP_CONTRACT_ADDRESS[bsc.id]}
                  isSteerVault={true}
                />
                <Usdtvault
                  title={"LSRWA-USDT LP (DS Swap)"}
                  setShowModal={setShowModal}
                  setShowModalApy={setShowModalApy}
                  setTokenUsdPrice={setTokenUsdPrice}
                  setIsLPVault={setIsLPVault}
                  setIsShowUsdPrice={setIsShowUsdPrice}
                  poolId={4}
                  isInactive={true}
                  lpContractAddress={RWA_LP_CONTRACT_ADDRESS[bsc.id]}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={showModal}
        onRequestClose={() => { setShowModal(false), document.body.classList.remove('modal-open'); }}
        style={customModalStyles}
      >
        <div className={`flex items-center justify-between w-inherit pt-[24px] px-[24px] pb-[16px] rounded-t-[16px] text-[18px] leading-[28px] tracking-[0.36px] bg-primary text-text-primary ${BOLD_INTER_TIGHT.className}`}>
          <span>ROI Calculator</span>
          <Image src={theme == 'dark' ? CloseIconDark : CloseIcon} alt="" className="close cursor-pointer" onClick={() => setShowModal(false)} />
        </div>
        <div className="flex flex-col py-[16px] px-[24px] gap-[32px] w-full bg-secondary">
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col items-start p-0 gap-[4px] w-full text-[12px] leading-[20px] tracking-[0.02em] text-text-third">
              <span className="text-[12px] leading-[20px] tracking-[0.02em]">Set Amount</span>
              <div className="flex items-center justify-between py-[13px] px-[16px] gap-[8px] w-full rounded-[12px] outline-0 bg-primary">
                <div className="flex">
                  <Image
                    onClick={() => {
                      setIsShowUsdPrice(!isShowUsdPrice); { !isShowUsdPrice ? setRoiInputCalculValue(Number(usdAmount).toString()) : setRoiInputCalculValue(Number(tokenAmount).toString()) };
                    }}
                    src={leftRight}
                    alt="leftRight"
                    className="cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder={isShowUsdPrice ? '0.00 USD' : isLPVault ? '0.00 LAND-BNB LP' : isShowUsdPrice ? "0.00 LSRWA-USDT" : '0.00 LAND'}
                    className="w-full outline-0 ml-[8px] text-[14px] bg-primary placeholder:text-[#9d9fa8]"
                    value={roiInputCalculValue}
                    onChange={(e) => setRoiInputCalculValue(e.target.value)}
                  />
                </div>
                <div className="light-text nowrap">
                  {isShowUsdPrice ?
                    numeral(Number(Number(roiInputCalculValue) / (tokenUsdPrice ?? 1))).format('0,0.[00000000]') :
                    numeral(Number(roiInputCalculValue) * tokenUsdPrice).format('0.00')
                  } {isShowUsdPrice ? isLPVault ? 'LAND-BNB LP' : isShowUsdPrice ? 'LSRWA-USDT LP' : 'LAND' : 'USD'}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start p-0 gap-[4px] w-full text-[12px] leading-[20px] tracking-[0.02em] text-text-third">
              <span>Staked for</span>
              <div className="flex p-0 w-full rounded-[100px] bg-primary">
                <button
                  className={timeframe === "1d" ? 
                    "flex justify-center items-center py-[5px] w-full h-[32px] bg-[#0A1339] dark:bg-[#61CD81] rounded-[52px] font-semibold text-[14px] leading-[22px] tracking-[0.02em] text-[#fff] dark:text-[#2e2e2e]"
                   : "flex justify-center items-center py-[5px] w-full font-medium text-[14px] leading-[22px] tracking-[0.02em]"}
                  onClick={() => {
                    setTimeframe("1d")
                    setRewardPercent(Number(numeral(showModalApy / 365).format('0.[00000]')))
                  }}
                >
                  1D
                </button>
                <button
                  className={timeframe === "7d" ? 
                    "flex justify-center items-center py-[5px] w-full h-[32px] bg-[#0A1339] dark:bg-[#61CD81] rounded-[52px] font-semibold text-[14px] leading-[22px] tracking-[0.02em] text-[#fff] dark:text-[#2e2e2e]" 
                   : "flex justify-center items-center py-[5px] w-full font-medium text-[14px] leading-[22px] tracking-[0.02em]"}
                  onClick={() => {
                    setTimeframe("7d")
                    setRewardPercent(Number(numeral(showModalApy / 365 * 7).format('0.[00000]')))
                  }}
                >
                  7D
                </button>
                <button
                  className={timeframe === "30d" ? 
                    "flex justify-center items-center py-[5px] w-full h-[32px] bg-[#0A1339] dark:bg-[#61CD81] rounded-[52px] font-semibold text-[14px] leading-[22px] tracking-[0.02em] text-[#fff] dark:text-[#2e2e2e]"
                   : "flex justify-center items-center py-[5px] w-full font-medium text-[14px] leading-[22px] tracking-[0.02em]"}
                  onClick={() => {
                    setTimeframe("30d")
                    setRewardPercent(Number(numeral(showModalApy / 12).format('0.[00000]')))
                  }}
                >
                  30D
                </button>
                <button
                  className={timeframe === "3m" ? 
                    "flex justify-center items-center py-[5px] w-full h-[32px] bg-[#0A1339] dark:bg-[#61CD81] rounded-[52px] font-semibold text-[14px] leading-[22px] tracking-[0.02em] text-[#fff] dark:text-[#2e2e2e]"
                   : "flex justify-center items-center py-[5px] w-full font-medium text-[14px] leading-[22px] tracking-[0.02em]"}
                  onClick={() => {
                    setTimeframe("3m")
                    setRewardPercent(Number(numeral(showModalApy / 4).format('0.[00000]')))
                  }}
                >
                  3M
                </button>
                <button
                  className={timeframe === "6m" ? 
                    "flex justify-center items-center py-[5px] w-full h-[32px] bg-[#0A1339] dark:bg-[#61CD81] rounded-[52px] font-semibold text-[14px] leading-[22px] tracking-[0.02em] text-[#fff] dark:text-[#2e2e2e]"
                     : "flex justify-center items-center py-[5px] w-full font-medium text-[14px] leading-[22px] tracking-[0.02em]"}
                  onClick={() => {
                    setTimeframe("6m")
                    setRewardPercent(Number(numeral(showModalApy / 2).format('0.[00000]')))
                  }}
                >
                  6M
                </button>
                <button
                  className={timeframe === "1y" ? 
                    "flex justify-center items-center py-[5px] w-full h-[32px] bg-[#0A1339] dark:bg-[#61CD81] rounded-[52px] font-semibold text-[14px] leading-[22px] tracking-[0.02em] text-[#fff] dark:text-[#2e2e2e]"
                     : "flex justify-center items-center py-[5px] w-full font-medium text-[14px] leading-[22px] tracking-[0.02em]"}
                  onClick={() => {
                    setTimeframe("1y")
                    setRewardPercent(Number(numeral(showModalApy).format('0.[00000]')))
                  }}
                >
                  1Y
                </button>
              </div>
            </div>
            <Image src={IconArrowUpDown} style={{ width: 'auto', height: '18px' }} alt="" />
            <div className="flex flex-col items-start p-0 gap-[4px] w-full text-[12px] leading-[20px] tracking-[0.02em] text-text-third">
              <span>ROI at current rate</span>
              <div className="flex items-center justify-between py-[13px] px-[16px] gap-[8px] w-full rounded-[12px] outline-0 bg-primary">
                <div className="text-[14px] font-medium min-w-fit leading-[22px] tracking-[0.28px] text-[#9d9fa8]">
                  {
                    numeral(rewardPercent / 100 * Number(numeral(usdAmount / price).format('0.[00000]'))).format('0.[00000]')
                  }
                  {" "} LAND
                </div>
                <div className="light-text">{numeral(rewardPercent / 100 * usdAmount).format('0.[000]')} USD  ({rewardPercent}%) </div>
              </div>
            </div>
          </div>
          <Collapse isOpen={roiShowDetails}>
            <div className="flex flex-col gap-[12px]">
              <div className="flex justify-between">
                <span className="text-[14px] leading-[22px] text-[#9d9fa8] dark:text-[#cacaca]">APR</span>
                <span className={`${BOLD_INTER_TIGHT.className} leading-[22px] text-[14px]`}>{numeral(showModalApy).format('0.[00000]')} %</span>
              </div>
              <ul className="text-[#545458] dark:text-[#bbbbc4]">
                <li>Calculated Based On Current Rates.</li>
                <li>All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.</li>
              </ul>
            </div>
          </Collapse>
        </div>
      </ReactModal>
    </div>
  )
}

export default StakingPage
