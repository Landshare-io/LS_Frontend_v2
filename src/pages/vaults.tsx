import { useState, useEffect } from "react";
import Head from 'next/head';
import Collapse from "../components/common/collapse";
import { useChainId } from "wagmi"
import numeral from "numeral"
import { BigNumberish } from "ethers";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import LandshareVaultsProvider from "../../contexts/VaultsContext";
import { Modal } from "../common/modal/index";
import Breadcrumb from "../re-usable/Breadcrumb";
import ManualVaultComponent from "./ManualVaultComponent.jsx"
import AutoVaultComponent from "./AutoVaultComponent.jsx"
import LPVaultComponent from "./LPVaultComponent.jsx"
import Footer from "../Footer";
import coinStack from "../../assets/img/new/coin-stack-sm.svg"
import tabIcon3 from "../../assets/img/new/tab-icon3.svg"
import tabIcon4 from "../../assets/img/new/tether.svg"
import tabBook from "../../assets/img/new/tab-book.svg"
import rotateBlue from "../../assets/img/new/rotate-blue.svg";
import CloseIcon from "../../assets/img/icons/close.svg";
import CloseIconDark from "../../assets/img/icons/close-dark.svg";
import leftRight from "../../assets/img/new/left-right.svg";
import IconArrowUpDown from "../../assets/img/new/arrow-up-down.svg";
import down from "../../assets/img/icons/Down.svg";
import up from "../../assets/img/new/arrow-up.svg";
import "./styles.css"
import UsdtvaultComponent from "./UsdtVaultComponent.jsx";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useGlobalContext } from "../../contexts/GlobalContext";

import useGetReserves from "../hooks/contract/BNBApePairContract/useGetReserves";
import useGetReservesPair from "../hooks/contract/PancakePairContract/useGetReserves";

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

export default function StakingPage() {
  const { theme } = useGlobalContext();
  const reservesBNB = useGetReserves() as BigNumberish[];
  const resercesToken = useGetReservesPair() as BigNumberish[];
  const bnb = reservesBNB ? BigInt(reservesBNB[1]) / BigInt(reservesBNB[0]) : 0;
  const coin = resercesToken ? BigInt(resercesToken[1]) / BigInt(resercesToken[0]) : 0;
  const price = Number(bnb) * Number(coin)



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
  const [isRUSD, setIsRUSD] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleSlider = (index) => {
    setCurrentIndex(index);
  };

  const chainId = useChainId()

  function handleClick(tab) {
    useSelectedVault(tab)
    console.log("price: " + price)
  }
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
      label: 'LSRWA-USDT LP ',
    },
 
  ];

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 885);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (chainId !== 56) {
      useSelectedVault(1)
    } else {
      useSelectedVault(0)
    }
  }, [chainId])

  useEffect(() => {
    showModal ? disableBodyScroll(document) : enableBodyScroll(document)
  }, [showModal]);

  useEffect(() => {
    setRewardPercent(numeral(showModalApy).format('0.[00000]'))
  }, [showModalApy]);

  useEffect(() => {
    if (isShowUsdPrice) {
      setUsdAmount(roiInputCalculValue)
      setTokenAmount(roiInputCalculValue / tokenUsdPrice)
    } else {
      setTokenAmount(roiInputCalculValue)
      setUsdAmount(roiInputCalculValue * tokenUsdPrice)
    }
    setRewardPercent(numeral(showModalApy).format('0.[00000]'))
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
      <div className="bg-primary breadcrumb-container">
        <div className="section-set-max-container">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      {chain?.unsupported && (<div className="flex flex-col justify-center items-center text-center m-5 text-red-400 text-xl font-medium animate-[sparkling-anim_3s_linear_infinite]">
        Chain not Supported
      </div>)}
      <div className="bg-primary section-container less-padding pt-0">
        <div className="section-content section-set-max-container vault-header-content">
          <div className="liquidity-token bg-secondary">
            <div className="coin-icon-container bg-primary">
              <img src={coinStack} alt="" />
            </div>
            <span className="feature-btn-text text-text-primary">LAND Staking</span>
          </div>
          <h1 className="vault-header-title text-text-primary">Vaults</h1>
          <p className="vault-header-title-description">
            Earn Rewards for Staking in our DeFi Vaults
          </p>
        </div>
        <div className="section-content section-set-max-container vaults-cards-section">
          {isSmallScreen ? (
            <div className="tabs-container">
              {/*<button className={selectedVault === 0 ? 'active-tab' : 'bg-secondary inactive-tab'} onClick={() => handleClick(0)}>
                <div className="w-7 h-7 p-[1px] bg-primary rounded-full">
                  <img src={tabBook} className="w-full h-full" alt="" />
                </div>
                <span>LAND Token Staking</span>

              </button>
              <button className={selectedVault === 1 ? 'active-tab' : 'bg-secondary inactive-tab'} onClick={() => handleClick(1)}>
                <div className="w-7 h-7 p-[1px] bg-primary rounded-full">
                  <img src={rotateBlue} className="w-full h-full" alt="" />
                </div>
                <span>Auto LAND Staking</span>

              </button>
              <button className={selectedVault === 2 ? 'active-tab' : 'bg-secondary inactive-tab'} onClick={() => handleClick(2)}>
                <div className="w-7 h-7 p-1 bg-primary rounded-full">
                  <img src={tabIcon3} alt="" />
                </div>
                <span>LAND-BNB LP Staking</span>
              </button>
              <button className={selectedVault === 3 ? 'active-tab' : 'bg-secondary inactive-tab'} onClick={() => handleClick(3)}>
                <div className="w-7 h-7 p-1 bg-primary rounded-full">
                  <img src={tabIcon4} alt="" />
                </div>
                <span>LSRWA-USDT LP Staking</span>
              </button>*/}
              <Slider {...sliderSettings} centerPadding="10px" className="w-full">
                {vaults.map((vault) => (
                  <div key={vault.index}>
                    <button
                      className={selectedVault === vault.index ? 'active-tab' : 'bg-secondary inactive-tab'}
                      onClick={() => handleClick(vault.index)}
                    >
                      <div className="w-7 h-7 p-[1px] bg-primary rounded-full">
                        <img src={vault.icon} className="w-full h-full" alt="" />
                      </div>
                      <span>{vault.label}</span>
                    </button>
                  </div>
                ))}
              </Slider>
            </div>

          ) : null}
          <LandshareVaultsProvider>
            {isSmallScreen ?

              (selectedVault === 0 ?
                <ManualVaultComponent
                  title={"LAND Token Staking"}
                  setShowModal={setShowModal}
                  setShowModalApy={setShowModalApy}
                  setTokenUsdPrice={setTokenUsdPrice}
                  setIsLPVault={setIsLPVault}
                  setIsRUSD={setIsRUSD}
                /> :
                selectedVault === 1 ?
                  <AutoVaultComponent
                    title={"Auto LAND Staking"}
                    setShowModal={setShowModal}
                    setShowModalApy={setShowModalApy}
                    setTokenUsdPrice={setTokenUsdPrice}
                    setIsLPVault={setIsLPVault}
                    setIsRUSD={setIsRUSD}
                  /> : selectedVault === 2 ?
                    <LPVaultComponent
                      title={"LAND-BNB LP"}
                      setShowModal={setShowModal}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                      setIsLPVault={setIsLPVault}
                      setIsRUSD={setIsRUSD}
                    /> :
                    <UsdtvaultComponent
                      title={"LSRWA-USDT LP"}
                      setShowModal={setShowModal}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                      setIsLPVault={setIsLPVault}
                      setIsRUSD={setIsRUSD}
                    />
              ) :
              (<>
                {chainId == 56 || chainId == 97 ? (
                  <>
                    <ManualVaultComponent
                      title={"LAND Token Staking"}
                      setShowModal={setShowModal}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                      setIsLPVault={setIsLPVault}
                    />
                    <AutoVaultComponent
                      title={"Auto LAND Staking"}
                      setShowModal={setShowModal}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                      setIsLPVault={setIsLPVault}
                    />
                  </>
                ) : (
                  <>
                    <AutoVaultComponent
                      title={"Auto LAND Staking"}
                      setShowModal={setShowModal}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                      setIsLPVault={setIsLPVault}
                    />
                    <ManualVaultComponent
                      title={"LAND Token Staking"}
                      setShowModal={setShowModal}
                      setShowModalApy={setShowModalApy}
                      setTokenUsdPrice={setTokenUsdPrice}
                      setIsLPVault={setIsLPVault}
                    />
                  </>
                )}

                <LPVaultComponent
                  title={"LAND-BNB LP Staking"}
                  setShowModal={setShowModal}
                  setShowModalApy={setShowModalApy}
                  setTokenUsdPrice={setTokenUsdPrice}
                  setIsLPVault={setIsLPVault}
                />
                <UsdtvaultComponent
                  title={"LSRWA-USDT LP"}
                  setShowModal={setShowModal}
                  setShowModalApy={setShowModalApy}
                  setTokenUsdPrice={setTokenUsdPrice}
                  setIsLPVault={setIsLPVault}
                  setIsRUSD={setIsRUSD}
                />
              </>
              )}
          </LandshareVaultsProvider >
        </div>
      </div>
      <Footer />
      <Modal
        modalShow={showModal}
        setModalShow={setShowModal}
        modalOptions={{
          centered: true
        }}
        className={`roi-calculator-card ${theme ? "dark" : ""}`}
      >
        <Modal.Header>
          <div className="roi-calculator-card-header bg-primary text-text-primary">
            <span>ROI Calculator</span>
            <img src={theme == 'dark' ? CloseIconDark : CloseIcon} alt="" className="close" onClick={() => setShowModal(false)} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="roi-calculator-card-content bg-secondary">
            <div className="roi-calculator-amount-container">
              <div className="roi-input-container text-text-third">
                <span>Set Amount</span>
                <div className="roi-input-bar bg-primary">
                  <div className="roi-input-bar-label">
                    <img
                      onClick={() => {
                        setIsShowUsdPrice(!isShowUsdPrice); { !isShowUsdPrice ? setRoiInputCalculValue(usdAmount) : setRoiInputCalculValue(tokenAmount) };
                      }}
                      src={leftRight}
                      alt="leftRight"
                      style={{ cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      placeholder={isShowUsdPrice ? '0.00 USD' : isLPVault ? '0.00 LAND-BNB LP' : isRUSD ? "0.00 LSRWA-USDT" : '0.00 LAND'}
                      className="roi-input-field bg-primary"
                      value={roiInputCalculValue}
                      onChange={(e) => setRoiInputCalculValue(e.target.value)}
                    />
                  </div>
                  <div className="light-text nowrap">
                    {isShowUsdPrice ?
                      isRUSD ? Number(roiInputCalculValue / (tokenUsdPrice ?? 1)).toExponential(2) : numeral(Number(roiInputCalculValue / (tokenUsdPrice ?? 1))).format('0.00') :
                      numeral(roiInputCalculValue * tokenUsdPrice).format('0.00')
                    } {isShowUsdPrice ? isLPVault ? 'LAND-BNB LP' : isRUSD ? 'LSRWA-USDT LP' : 'LAND' : 'USD'}
                  </div>
                </div>
              </div>
              <div className="roi-input-container text-text-third">
                <span>Staked for</span>
                <div className="time-selection-bar bg-primary">
                  <button
                    className={timeframe === "1d" ? "active-section" : "inactive-section"}
                    onClick={() => {
                      setTimeframe("1d")
                      setRewardPercent(numeral(showModalApy / 365).format('0.[00000]'))
                    }}
                  >
                    1D
                  </button>
                  <button
                    className={timeframe === "7d" ? "active-section" : "inactive-section"}
                    onClick={() => {
                      setTimeframe("7d")
                      setRewardPercent(numeral(showModalApy / 365 * 7).format('0.[00000]'))
                    }}
                  >
                    7D
                  </button>
                  <button
                    className={timeframe === "30d" ? "active-section" : "inactive-section"}
                    onClick={() => {
                      setTimeframe("30d")
                      setRewardPercent(numeral(showModalApy / 12).format('0.[00000]'))
                    }}
                  >
                    30D
                  </button>
                  <button
                    className={timeframe === "3m" ? "active-section" : "inactive-section"}
                    onClick={() => {
                      setTimeframe("3m")
                      setRewardPercent(numeral(showModalApy / 4).format('0.[00000]'))
                    }}
                  >
                    3M
                  </button>
                  <button
                    className={timeframe === "6m" ? "active-section" : "inactive-section"}
                    onClick={() => {
                      setTimeframe("6m")
                      setRewardPercent(numeral(showModalApy / 2).format('0.[00000]'))
                    }}
                  >
                    6M
                  </button>
                  <button
                    className={timeframe === "1y" ? "active-section" : "inactive-section"}
                    onClick={() => {
                      setTimeframe("1y")
                      setRewardPercent(numeral(showModalApy).format('0.[00000]'))
                    }}
                  >
                    1Y
                  </button>
                </div>
              </div>
              <img src={IconArrowUpDown} style={{ width: 'auto', height: '18px' }} alt="" />
              <div className="roi-input-container text-text-third">
                <span>ROI at current rate</span>
                <div className="roi-input-bar bg-primary">
                  <div className="roi-input-field-show-rate">

                    {

                      rewardPercent / 100 * numeral(usdAmount / price).format('0.[00000]')

                    }
                    {" "} LAND
                  </div>
                  <div className="light-text">{numeral(rewardPercent / 100 * usdAmount).format('0.[000]')} USD  ({rewardPercent}%) </div>
                </div>
              </div>
            </div>
            <Collapse in={roiShowDetails}>
              <div className="roi-apr-result">
                <div className="roi-apr-section">
                  <span className="light-font">APR</span>
                  <span className="bold-font text-text-primary">{numeral(showModalApy).format('0.[00000]')} %</span>
                </div>
                <ul className="text-[#545458] dark:text-[#bbbbc4]">
                  <li>Calculated Based On Current Rates.</li>
                  <li>All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.</li>
                </ul>
              </div>
            </Collapse>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
