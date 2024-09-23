import axios from "axios";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useAccount, useContract, useSigner, useProvider, useBalance, useContractRead, useNetwork } from "wagmi";
import { Help } from "@mui/icons-material";
import { Hidden, Tooltip, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import Link from '@mui/material/Link';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { TOKENS } from "./data";
import { useLandshareFunctions } from "../../../contexts/LandshareFunctionsProvider";
import { useGlobalContext } from "../../../contexts/GlobalContext";
import APIConsumerABI from "../../../contexts/abis/APIConsumer.json";
import AssetToken from "../../../contexts/abis/firstNFT/LS81712NFToken.json";
import SaleABI from "../../../contexts/abis/Sale.json";
import BuySaleABI from "../../../contexts/abis/BuySale.json";
import USDCABI from "../../../contexts/abis/USDC.json";
import AutoRedeemABI from "../../../contexts/abis/AutoRedeemOptIn.json";
import { Modal } from "../../common/modal"
import Button from "../../re-usable/Button";
import ToggleButton from "../../re-usable/ToggleButton";
import IconSwipelux from "../../../assets/img/icons/swipelux.svg";
import IconPancakeswap from "../../../assets/img/icons/pancakeswap.png";
import IconGateio from "../../../assets/img/icons/gateio.png";
import IconMEXC from "../../../assets/img/icons/mexclogo.png";
import ConnectWallet from "../../ConnectWallet";
import FinancialSummary from "./FinancialSummary";
import PriceGraph from "./PriceGraph";
import IconUSDC from "../../../assets/img/new/usdc.png";
import IconArrowDown from "../../../assets/img/new/arrow-down.svg";
import IconArrowUpDown from "../../../assets/img/new/arrow-up-down.svg";
import IconArrowRightUp from "../../../assets/img/new/arrow-right-up.svg";
import IconDashboard from "../../../assets/img/new/dashboard.svg";
import IconInfo from "../../../assets/img/new/info.svg";
import IconInfoGray from "../../../assets/img/new/info-gray.svg";
import IconClose from "../../../assets/img/new/close.svg";
import ZeroIDWidget from './ZeroIDWidget';
import ReactModal from "react-modal";
import { PROVIDERS } from "../../../configs/ccip";
import "../styles.css";
import "./swaptoken.css";

export default function SwapToken() {
  const { data: signer } = useSigner();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  const [RWAPrice, setRWAPrice] = useState();
  const [landFee, setLandFee] = useState();
  const [landFeeAmount, setLandFeeAmount] = useState();
  const [saleLimit, setSaleLimit] = useState();
  const [limitDate, setLimitDate] = useState(new Date());
  const [reachedLimit, setReachedLimit] = useState();
  const [RWATokenAmount, setRWATokenAmount] = useState();
  const [USDCAmount, setUSDCAmount] = useState();
  const [isGraphShow, setIsGraphShow] = useState(false);
  const [isFinancialSummaryShow, setIsFinancialSummaryShow] = useState(false);
  const [buyUSDCAmount, setBuyUSDCAmount] = useState();
  const [buyLANDAmount, setBuyLANDAmount] = useState();
  const [isKYC, setIsKYC] = useState(false);
  const [isSTAPShow, setIsSTAPshow] = useState(false);
  const [signAgreement, setSignAgreement] = useState(false);
  const [RWAAllowance, setRWAAllowance] = useState()
  const [LandAllowance, setLandAllowance] = useState()
  const [usdcAllowance, setUSDCAllowance] = useState()
  const [isShowTokenSelector, setIsShowTokenSelector] = useState(false);
  const [buyOrSell, setBuyOrSell] = useState("Buy");
  const [allTokens, setAllTokens] = useState([]);
  const [isAutoRedeem, setAutoRedeem] = useState(false);
  const [isSTPALoding, setIsSTPALoading] = useState(true);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [iskycmodal, setKycopen] = useState(false);
  const [isZeroIDModal, setZeroIDModalOpen] = useState(false);

  const apiKey = '10000000-0000-0000-0000-7f9a2af16a1c';
  const verifierUrl = 'https://landshare-zeroid-verdict.onrender.com/verdict';
  const env = 'zeroid';

  const balance = useBalance({
    address: address,
    token: process.env.REACT_APP_RWA_ADDR,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,
  })

  const USDCBalance = useBalance({
    address: address,
    token: process.env.REACT_APP_USDC_ADDR,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,

  })

  const poolBalance = useBalance({
    address: process.env.REACT_APP_RWA_POOL,
    token: process.env.REACT_APP_USDC_ADDR,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,

  })

  const landBalance = useBalance({
    address: address,
    token: process.env.REACT_APP_LAND_ADDR,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,
  })

  const SaleContract = useContract({
    address: process.env.REACT_APP_SALE_ADDR,
    abi: SaleABI,
    signerOrProvider: chain?.id == 56 ? signer || PROVIDERS[56] : PROVIDERS[56],
  });

  const LandTokenContract = useContract({
    address: process.env.REACT_APP_LAND_ADDR,
    abi: USDCABI,
    signerOrProvider: chain?.id == 56 ? signer || PROVIDERS[56] : PROVIDERS[56],
  });

  const APIConsumerContract = useContract({
    address: process.env.REACT_APP_APICONSUMER_ADDR,
    abi: APIConsumerABI,
    signerOrProvider: chain?.id == 56 ? signer || PROVIDERS[56] : PROVIDERS[56],
  });

  const APIConsumerContractNotConnected = useContract({
    address: process.env.REACT_APP_APICONSUMER_ADDR,
    abi: APIConsumerABI,
    signerOrProvider: chain?.id == 56 ? signer || PROVIDERS[56] : PROVIDERS[56],

  });

  const BuySaleContract = useContract({
    address: process.env.REACT_APP_BUY_SALE_ADDR,
    abi: BuySaleABI,
    signerOrProvider: chain?.id == 56 ? signer || PROVIDERS[56] : PROVIDERS[56],
  });

  const RWATokenContract = useContract({
    address: process.env.REACT_APP_RWA_ADDR,
    abi: AssetToken.abi,
    signerOrProvider: chain?.id == 56 ? signer || PROVIDERS[56] : PROVIDERS[56],
  });

  const USDCTokenContract = useContract({
    address: process.env.REACT_APP_USDC_ADDR,
    abi: USDCABI,
    signerOrProvider: chain?.id == 56 ? signer || PROVIDERS[56] : PROVIDERS[56],
  });

  const AutoRedeemContract = useContract({
    address: process.env.REACT_APP_AUTOREDEEMOPTIN_ADDR,
    abi: AutoRedeemABI,
    signerOrProvider: chain?.id == 56 ? signer || PROVIDERS[56] : PROVIDERS[56],
  })

  const { data: SaleLimit } = useContractRead({
    address: process.env.REACT_APP_SALE_ADDR,
    abi: SaleABI,
    functionName: 'getSaleLimit',

    args: [address],
    watch: true
  })

  const { data: SaleInfo } = useContractRead({
    address: process.env.REACT_APP_SALE_ADDR,
    abi: SaleABI,
    functionName: 'saleInfo',

    args: [address]
  })

  const { data: secondaryLimit } = useContractRead({
    address: process.env.REACT_APP_RWA_ADDR,
    abi: AssetToken.abi,
    functionName: 'getAllowedToTransfer',

    args: [address],
    watch: true
  })

  const { data: isWhitelisted } = useContractRead({
    address: process.env.REACT_APP_RWA_ADDR,
    abi: AssetToken.abi,
    functionName: 'isWhitelistedAddress',
    args: [address],
    watch: true,
  })


  const {
    startTransaction,
    transactionResult,
  } = useLandshareFunctions();

  async function getRWAPrice() {
    try {
      const price = await APIConsumerContractNotConnected.getRWAPrice();
      setRWAPrice(Number(ethers.utils.formatEther(price)));
    } catch (e) { }
  }

  async function getLandFee() {
    try {
      if (SaleContract != undefined) {
        const _landFee = await SaleContract.landFee();
        setLandFee(_landFee.toNumber());
      }
    } catch (e) { }
  }

  async function getLandFeeAmount() {
    try {
      if (RWATokenAmount > 0 && SaleContract) {
        const _landFeeAmount = USDCAmount != null ? await SaleContract.getLANDFee(USDCAmount?.toString()) : 0
        setLandFeeAmount(_landFeeAmount);
      } else {
        setLandFeeAmount(0);
      }
    } catch (e) { }
  }

  async function getSaleLimit() {
    try {
      if (SaleLimit != undefined && SaleLimit.length == 3 && SaleInfo.length > 0) {
        setSaleLimit(ethers.utils.formatEther(SaleLimit[0]).toString());
        setLimitDate(new Date(SaleLimit[1] != undefined ? Number(SaleLimit[1]) * 1000 : Date.now() * 1000));
        setReachedLimit(SaleLimit[2] != undefined ? SaleLimit[2] : Date.now());
      }
    } catch (e) { }
  }
  useEffect(async () => {
    try {
      if (isConnected && RWATokenContract && RWATokenContract.signer) {
        const kyc = await RWATokenContract.isWhitelistedAddress(address.toString())
        if (kyc) {
          setIsKYC(true)
        } else {
          setIsKYC(false)
        }
      }
    } catch (e) { }
  }, [isConnected, RWATokenContract]);

  useEffect(() => {
    if (APIConsumerContractNotConnected) {
      getRWAPrice();
    }
  }, [APIConsumerContractNotConnected])

  useEffect(() => {
    if (APIConsumerContract && APIConsumerContract.provider) {
      getLandFee();
    }
  }, [APIConsumerContract]);

  useEffect(() => {
    if (APIConsumerContract && APIConsumerContract.provider) {
      getLandFeeAmount()

    }
  }, [USDCAmount]);

  useEffect(() => {
    if (APIConsumerContract && address && APIConsumerContract.provider) {
      getSaleLimit();
    }
  }, [APIConsumerContract, SaleLimit, APIConsumerContract.provider, address]);

  useEffect(() => {
    if (isSTAPShow) {
      get_information('https://docs.google.com/document/d/e/2PACX-1vSCbbmciud2wUhSDtRpwbXdimj_GF6ZaLvvtu_XmGSYxdfHc-bMP4psbMoZFUIgdWgJLpx53RubSxSb/pub?embedded=true', function (text) {
        var docElement = document.createElement('div');
        docElement.innerHTML = text;
        docElement.classList.add('bg-tw-primary');
        docElement.classList.add('dark:bg-tw-secondary');
        docElement.classList.add('text-tw-text-primary');
        var container = document.getElementById('doc');
        container.appendChild(docElement);
        setIsSTPALoading(false);
      });
    }
  }, [isSTAPShow]);

  useEffect(() => {
    try {
      if (RWATokenContract.provider && address) getAllowance('rwa', SaleContract.address);
    } catch (e) { }
  }, [RWATokenContract, address]);

  useEffect(() => {
    try {
      if (LandTokenContract.provider && address) getAllowance('land', SaleContract.address);
    } catch (e) { }
  }, [LandTokenContract, address]);

  useEffect(async () => {
    try {
      if (APIConsumerContract != undefined && BuySaleContract != undefined && RWATokenAmount != undefined && APIConsumerContract) {
        const theRWAPrice = await APIConsumerContract.getRWAPrice()
        setUSDCAmount(RWATokenAmount > 0 ? theRWAPrice.mul(RWATokenAmount) : null);

        // Buy
        if (RWATokenAmount.length > 0) {
          const basePrice = await BuySaleContract.offeringSecurityToUSDPrice()
          const tmp = await BuySaleContract.buyTokenView(RWATokenAmount, process.env.REACT_APP_USDC_ADDR)
          setBuyUSDCAmount(tmp.amountOfStableCoin)
          setBuyLANDAmount(tmp.amountOfLAND)
        }
      }
    } catch (e) { }
  }, [RWATokenAmount, RWAPrice]);

  async function getAllowance(token, spender) {
    try {
      if (token === 'rwa') {
        setRWAAllowance(await RWATokenContract.allowance(address, spender))
      }
      if (token === 'land') {
        setLandAllowance(await LandTokenContract.allowance(address, spender))
      }
      if (token === 'usdc') {
        setUSDCAllowance(await USDCTokenContract.allowance(address, spender))
      }
    } catch (e) { }
  }

  async function getAllTokens() {
    try {
      const res = await fetch(
        new Request("https://api.livecoinwatch.com/coins/list"),
        {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": "95ce49d3-3e89-475d-b61e-6638a002b1fe",
          }),
          body: JSON.stringify({
            currency: "USD",
            sort: "rank",
            order: "ascending",
            offset: 0,
            limit: 50,
            meta: true,
          }),
        }
      );
      setAllTokens(await res.json());
    } catch (e) { }
  }

  useEffect(() => {
    getAllTokens();
    getRWAPrice();
  }, []);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "400px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px"
    },
  };

  const zeroIDStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "500px",
      width: "100%",
      height: "fit-content",
      borderRadius: "20px"
    },
  }

  function get_information(link, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(xhr.responseText);
      }
    };
    xhr.send(null);
  }


  async function handlemodalkyc() {
    setKycopen(true);
    document.body.style.overflow = 'hidden';
  }
  function handleclosemodal() {
    setKycopen(false);
    document.body.style.overflow = 'auto';
  }
  async function sellTokens() {
    try {

      const amount = RWATokenAmount;

      try {
        if (!RWAAllowance.gte(amount)) {
          startTransaction("RWA Token Approval Pending...")
          const tx1 = await RWATokenContract.approve(SaleContract.address, RWATokenContract.balanceOf(address));
          await tx1.wait().then(async () => {
            const newRWAAllowance = await RWATokenContract.allowance(address, SaleContract.address)
            await getAllowance('rwa', SaleContract.address)
            if (!newRWAAllowance.gte(amount)) {
              window.alert("Please approve sufficient allowance.")
              throw new Error('Insufficient Allowance');
            }
          })
        }

        const landAllowTmp = await LandTokenContract.allowance(address, SaleContract.address)
        if (!landAllowTmp.gte(landFeeAmount)) {
          startTransaction("LAND Token Approval Pending...")
          const tx2 = await LandTokenContract.approve(SaleContract.address, LandTokenContract.balanceOf(address));
          await tx2.wait().then(async () => {
            const newLandAllowance = await LandTokenContract.allowance(address, SaleContract.address)
            await getAllowance('land', SaleContract.address)
            if (!newLandAllowance.gte(landFeeAmount)) {
              window.alert("Please approve sufficient allowance.")
              throw new Error('Insufficient Allowance');
            }
          })
        }
        startTransaction("Sell RWA Pending...")
        const tx3 = await SaleContract.sellRWA(amount)
        await tx3.wait().then(async () => {
          await getAllowance('rwa', SaleContract.address)
          await getAllowance('land', SaleContract.address)

          transactionResult("Transaction Complete.")

        })
        getSaleLimit()

      } catch (e) {
        transactionResult("Transaction Failed.")

        console.log(e)
      }
    } catch (e) { }
  }

  async function buyTokens() {
    try {
      const amount = RWATokenAmount;
      if (!signAgreement)
        return;
      startTransaction()
      try {
        const usdcAllowTmp = await USDCTokenContract.allowance(address, BuySaleContract.address)

        if (!usdcAllowTmp.gte(buyUSDCAmount)) {
          const tx1 = await USDCTokenContract.approve(BuySaleContract.address, USDCTokenContract.balanceOf(address));
          await tx1.wait().then(async () => {
            const newLandAllowance = await USDCTokenContract.allowance(address, BuySaleContract.address)
            await getAllowance('usdc', BuySaleContract.address)
            if (!newLandAllowance.gte(USDCAmount)) {
              window.alert("Please approve sufficient allowance.")
              throw new Error('Insufficient Allowance');
            }
          })
        }

        const landAllowTmp = await LandTokenContract.allowance(address, BuySaleContract.address)
        if (!landAllowTmp.gte(buyLANDAmount)) {
          const tx2 = await LandTokenContract.approve(BuySaleContract.address, LandTokenContract.balanceOf(address));
          await tx2.wait().then(async () => {
            const newLandAllowance = await LandTokenContract.allowance(address, BuySaleContract.address)
            await getAllowance('land', BuySaleContract.address)
            if (!newLandAllowance.gte(buyLANDAmount)) {
              window.alert("Please approve sufficient allowance.")
              throw new Error('Insufficient Allowance');
            }
          })
        }

        const tx3 = await BuySaleContract.buyToken(amount, process.env.REACT_APP_USDC_ADDR)
        await tx3.wait().then(async () => {
          await getAllowance('usdc', BuySaleContract.address)
          await getAllowance('land', BuySaleContract.address)

          transactionResult("Transaction Complete.")
        })
        getSaleLimit()
      } catch (e) {
        transactionResult("Transaction Failed.")
        console.log(e)
      }
    } catch (e) { }
  }

  const { isDarkMode } = useGlobalContext();

  const handleLinkClick = (event) => {
    console.log("isWhitelisted", isWhitelisted);
    event.preventDefault(); // Prevent the default link behavior
    setKycopen(false)
    setZeroIDModalOpen(true)
    document.body.style.overflow = 'hidden';
  };

  return (
    <div>
      <div className="bg-tw-third swap-card-container max-h-none ">
        <div className="swap-card-title-section">
          <div>
            <div className="swap-card-title text-tw-text-primary">
              Swap RWA
            </div>
            <div className="swap-card-subtitle text-tw-text-secondary">
              Trade tokens in an instant
            </div>
          </div>
          <div className="swap-price-card-icons">
            <img
              src={IconDashboard}
              alt="dashboard"
              className="swap-price-card-icon"
              onClick={() => setIsGraphShow(true)}
            />
            {/* <img
              src={IconListing}
              alt="listing"
              className="swap-price-card-icon"
              onClick={() => setIsFinancialSummaryShow(true)}
            /> */}
          </div>
        </div>
        <div className="swap-card-button-group">
          <ToggleButton
            active={buyOrSell == "Buy"}
            type={"pricegraph"}
            onClick={() => {
              setBuyOrSell("Buy");
              setRWATokenAmount(null)
              setBuyLANDAmount(null)
              setBuyUSDCAmount(null)
            }}
          >
            Buy
          </ToggleButton>
          <ToggleButton
            active={buyOrSell == "Sell"}
            type={"pricegraph"}
            onClick={() => {
              setBuyOrSell("Sell");
              setRWATokenAmount(null)
              setUSDCAmount(null)

            }}
          >
            Sell
          </ToggleButton>
        </div>

        <ReactModal
          isOpen={iskycmodal}
          onRequestClose={() => { setKycopen(false), document.body.classList.remove('modal-open'); }}
          style={customStyles}
          contentLabel="current-apr Modal"
        >
          <CancelIcon onClick={handleclosemodal} sx={{
            float: "right",
            color: "#000",
            cursor: "pointer",
            position: "absolute",
            right: "20px",
            top: "15px",
            ':hover': {
              color: 'gray',
            }
          }} />
          <div className="w-full">
            <Typography variant="h5" component="h5" align="center" sx={{ fontWeight: 700 }}>
              KYC Verification
            </Typography>
            <Typography variant="p" component="p" align="center" sx={{
              fontSize: "16px",
              fontStyle: "Bold",
              paddingTop: "10px",
              lineHeight: "28px",
              fontWeight: 500,
              letterSpacing: "2%"
            }}>
              Complete the KYC process to access RWA Tokens
            </Typography>
          </div>
          <div className="w-full mt-3">
            <a href="https://dashboard.landshare.io">
              <button className="flex flex-col justify-center items-center w-full pb-[10px] bg-0ed145 br-20 pt-[10px] border-b relative hover:bg-green-600 transition-colors">
                <Typography component="p" sx={{
                  color: "#fff",
                  fontSize: "16px",
                  fontStyle: "Bold",
                  lineHeight: "28px",
                  letterSpacing: "2%",
                  fontWeight: 700
                }}>Manual Verification</Typography>
              </button>
            </a>
            <div onClick={handleLinkClick}>
              {/* <a href={`https://${env}.swipelux.com?apiKey=${apiKey}&verifierUrl=${verifierUrl}`}> */}
              {/* <button disabled={true} className="flex flex-col justify-center items-center w-full mt-4 pb-[10px] bg-0ed145 br-20 pt-[6px] border-b relative hover:bg-green-600 transition-colors"> */}
              <button className="flex flex-col justify-center items-center w-full pb-[10px] bg-0ed145 br-20 pt-[10px] border-b relative hover:bg-green-600 transition-colors mt-4"
              disabled
              >
                <Typography component="p" className="text-[20px] font-[600]" sx={{
                  color: "#fff",
                  fontSize: "16px",
                  fontStyle: "Bold",
                  lineHeight: "28px",
                  letterSpacing: "2%",
                  fontWeight: 700
                }}>ZeroID Verification</Typography>
              </button>
            </div>
          </div>
        </ReactModal>

        <ReactModal
          isOpen={isZeroIDModal}
          onRequestClose={() => { setZeroIDModalOpen(true), document.body.classList.remove('modal-open'); }}
          style={zeroIDStyles}
          contentLabel="ZeroID Modal"
          className="zeroid-modal"
        >
          <CancelIcon onClick={() => { setZeroIDModalOpen(false); document.body.style.overflow = 'auto' }} sx={{
            float: "right",
            color: "#000",
            cursor: "pointer",
            position: "absolute",
            right: "20px",
            top: "15px",
            ':hover': {
              color: 'gray',
            }
          }} />
          <ZeroIDWidget apiKey={apiKey} verifierUrl={verifierUrl} env={env} />
        </ReactModal>
        <ReactModal
          isOpen={isBuyModalOpen}
          onRequestClose={() => { setIsBuyModalOpen(false), document.body.classList.remove('modal-open'); }}
          style={customStyles}
          contentLabel="current-apr Modal"
        >
          <div className="w-full" id="button-list">
            <button onClick={() => openSwipelux()} className="h-[115px] flex flex-col justify-center items-center w-full pb-[20px] border-b relative hover:bg-gray-300 transition-colors">
              <img src={IconSwipelux} alt="" className="w-[40px]" />
              <div className="text-[24px] font-bold">Swipelux</div>
              <div className="text-[16px] text-[#b6b0b0]">Credit or Debit Card</div>
            </button>
            <a href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
              <img src={IconPancakeswap} alt="" className="w-[40px]" />
              <div className="text-[24px] font-bold">PancakeSwap</div>
              <div className="text-[16px] text-[#b6b0b0]">Decentralized Exchange</div>
            </a>
            <a href="https://www.gate.io/trade/LANDSHARE_USDT" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full  pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
              <img src={IconGateio} alt="" className="w-[40px]" />
              <div className="text-[24px] font-bold">Gate.io</div>
              <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
            </a>
            <a href="https://www.mexc.com/exchange/LANDSHARE_USDT" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full hover:bg-gray-300 transition-colors">
              <img src={IconMEXC} alt="" className="w-[40px] h-[40px]" />
              <div className="text-[24px] font-bold">MEXC</div>
              <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
            </a>
          </div>
        </ReactModal>
        {buyOrSell === "Sell" &&
          <>
            <div className="swap-card-price-section">
              <div className="swap-card-balance-section">
                <label className="text-tw-text-secondary">RWA Token</label>
                <div className="swap-card-token-section">
                  <label className="text-tw-text-secondary">Balance:</label>
                  <span className="text-tw-text-primary">
                    {(RWAPrice == undefined || isConnected === false) ? "0" : `${parseFloat(balance?.data?.formatted)} ($${(RWAPrice * parseFloat(balance?.data?.formatted)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
                  </span>
                </div>
              </div>
              <input
                className="bg-tw-primary dark:bg-tw-secondary text-tw-text-primary"
                placeholder="0 RWA"
                type="number"
                disabled={!isConnected}
                onChange={(e) => {
                  const regex = /^[0-9\b]/;
                  if (e.target.value === "" || regex.test(e.target.value))
                    setRWATokenAmount(e.target.value)
                }}
              />
            </div>
            <div className="swap-card-price-section">
              <div className="swap-card-token-section">
                <div
                  className="swap-card-token-selector"
                // onClick={() => setIsShowTokenSelector(true)}
                >
                  <img src={IconUSDC} alt="usdc" />
                  <span className="text-tw-text-primary">USDC</span>
                  <img src={IconArrowDown} alt="arrow down" />
                </div>
                <div>
                  <img src={IconArrowUpDown} alt="arrow up down" />
                </div>
                <div className="swap-card-token-section">
                  <label className="text-tw-text-secondary">Price:</label>
                  <span className="text-tw-text-primary">
                    ${RWAPrice == undefined ? "Loading..." : RWAPrice.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                  </span>
                </div>
              </div>
              <input
                className="bg-tw-primary dark:bg-tw-secondary text-tw-text-primary"
                placeholder="00.00 USDC"
                readOnly
                value={USDCAmount == undefined ? "" : ethers.utils.formatEther(USDCAmount.toString())}
                onChange={(e) => setUSDCAmount(e.target.value)}
              />

            </div>
            {isConnected &&
              <>
                <div className="text-tw-text-primary swap-card-price-total">
                  <span>LAND Fee ({landFee}%)</span>
                  <span>{landFeeAmount ? ethers.utils.formatEther(landFeeAmount).toString().substr(0, 12) : 0} Land </span>
                </div>
                <div className="text-tw-text-primary swap-card-monthly-limit swap-card-price-total">
                  <div>
                    <span className="bold">Monthly Sale Limit</span>
                    <Tooltip title={reachedLimit ? "Your remaining monthly USDC sale limit. To make a larger sale, please contact admin@landshare.io." : `Your remaining monthly USDC sale limit. Your limit resets on [${limitDate.getFullYear() + "/" + (limitDate.getMonth() + 1) + "/" + limitDate.getDate()}]. To make a larger sale, please contact admin@landshare.io`}>
                      <Help sx={{ fontSize: 16 }} />
                    </Tooltip>
                  </div>
                  <span>{saleLimit ? `$${Number(saleLimit).toFixed(2)}` : "Loading"}</span>
                </div>
                <div className="text-tw-text-primary swap-card-monthly-limit swap-card-secondary-limit swap-card-price-total">
                  <div>
                    <span className="bold">Transfer Limit</span>
                    <Tooltip title={
                      <>
                        Remaining number of RWA Tokens that can be transferred from your wallet based on your Secondary Trading Limit.
                        Number must exceed the RWA Tokens to be sold. Limit can be raised on the dashboard.
                        To learn more, <Link href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/secondary-trading-limits" target="_blank" rel="noopener" sx={{ color: 'inherit', fontWeight: 'bold' }}>click here</Link>.
                      </>
                    }>
                      <Help sx={{ fontSize: 16 }} />
                    </Tooltip>
                  </div>
                  <span>{secondaryLimit ? secondaryLimit.toString() : "Loading"}</span>
                </div>
              </>
            }
          </>
        }
        {buyOrSell === "Buy" &&
          <>
            <div className="swap-card-price-section">
              <div className="swap-card-balance-section">
                <label className="text-tw-text-secondary">RWA Token </label>
                {isConnected &&
                  <div className="swap-card-token-section">
                    <label className="text-tw-text-secondary">Balance:</label>
                    <span className="text-tw-text-primary">
                      {(RWAPrice == undefined || isConnected === false) ? "0" : `${parseFloat(balance?.data?.formatted)} ($${(RWAPrice * parseFloat(balance?.data?.formatted)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
                    </span>
                  </div>
                }
              </div>
              <input
                className="bg-tw-primary dark:bg-tw-secondary text-tw-text-primary"
                placeholder="0 RWA"
                value={RWATokenAmount}
                disabled={!isConnected}
                type="number"
                onChange={(e) => {
                  const regex = /^[0-9\b]/;
                  if (e.target.value === "" || regex.test(e.target.value))
                    setRWATokenAmount(e.target.value)
                }}
              />
            </div>

            <div className="swap-card-price-section-buy">
              <div className="swap-card-price-section">
                <div className="swap-card-token-section">
                  <div className="swap-card-token-selector">
                    <img src={IconUSDC} alt="usdc" />
                    <span className="text-tw-text-primary">USDC</span>
                  </div>
                </div>
                <input
                  className="bg-tw-primary dark:bg-tw-secondary text-tw-text-primary"
                  placeholder="00.00 USDC"
                  readOnly
                  value={(buyUSDCAmount == undefined || RWATokenAmount === "") ? "" : ethers.utils.formatEther(buyUSDCAmount.toString())}
                />
                {isConnected &&
                  <div className="swap-card-token-section swap-card-balance-section1">
                    <label className="text-tw-text-secondary">Balance:</label>
                    <span className="text-tw-text-primary">
                      {(USDCBalance === undefined) ? "Loading..." : parseFloat(USDCBalance?.data?.formatted).toFixed(3)}
                    </span>
                  </div>
                }
              </div>
              <div className="swap-card-price-section">
                <div className="swap-card-token-section">
                  <div className="swap-card-token-selector">
                    <span className="text-tw-text-primary">LAND</span>
                  </div>
                </div>
                <input
                  className="bg-tw-primary dark:bg-tw-secondary text-tw-text-primary"
                  placeholder="00.00 LAND"
                  readOnly
                  value={(buyLANDAmount == undefined || RWATokenAmount === "") ? "" : ethers.utils.formatEther(buyLANDAmount.toString())}
                />
                {isConnected &&
                  <div className="swap-card-token-section swap-card-balance-section1">
                    <label className="text-tw-text-secondary">Balance:</label>
                    <span className="text-tw-text-primary">
                      {(landBalance === undefined) ? "0" : Number(landBalance?.data?.formatted).toFixed(3)}
                    </span>
                  </div>
                }
              </div>
            </div>

            {isConnected &&
              <div className="swap-card-balance-section1">

              </div>
            }
            {isConnected && buyOrSell === "Sell" &&
              <>
                <div className="swap-card-price-total">
                  <span className="bold">LAND Fee ({landFee}%)</span>
                  <span>{landFeeAmount ? ethers.utils.formatEther(landFeeAmount).toString().substr(0, 12) : 0} LAND </span>
                </div>
                <div className="swap-card-price-total">
                  <div>
                    <span className="bold">Monthly Limit</span>
                    <Tooltip title={reachedLimit ? "Your remaining monthly USDC sale limit. To make a larger sale, please contact admin@landshare.io." : `Your remaining monthly USDC sale limit. Your limit sets on [${limitDate.getFullYear() + "/" + (limitDate.getMonth() + 1) + "/" + limitDate.getDate()}]. To make a larger sale, please contact admin@landshare.io.`}>
                      <Help fontSize="small" />
                    </Tooltip>
                  </div>
                  <span>${Number(saleLimit).toFixed(2)}</span>
                </div>
              </>
            }
          </>
        }
        <div className="swap-card-connect-container ">
          {isConnected ? (
            chain?.id == 56 ? (
              <>
                {isWhitelisted &&
                  <>
                    {buyOrSell === "Sell" &&
                      <Button
                        color="#fff"
                        style={{ width: "100%", marginBottom: "16px" }}
                        disabled={
                          isWhitelisted == false || RWATokenAmount === undefined || RWATokenAmount < 1 || RWATokenAmount === ''
                          || RWATokenAmount > parseFloat(balance?.data?.formatted) || ethers.utils.formatEther(landFeeAmount ? landFeeAmount : 0) > parseFloat(landBalance?.data?.formatted)
                          || Number(saleLimit) < Number(USDCAmount == undefined ? 0 : ethers.utils.formatEther(USDCAmount.toString())) ||
                          Number(USDCAmount == undefined ? 0 : ethers.utils.formatEther(USDCAmount.toString())) > poolBalance?.data?.formatted
                        }
                        onClick={sellTokens}
                      >
                        {RWATokenAmount && USDCAmount && landFeeAmount
                          ? (RWATokenAmount > parseFloat(balance?.data?.formatted) ? "Insufficient RWA Balance" :
                            ethers.utils.formatEther(landFeeAmount) > parseFloat(landBalance?.data?.formatted) ? "Insufficient LAND Balance" :
                              Number(saleLimit) < Number(USDCAmount == undefined ? 0 : ethers.utils.formatEther(USDCAmount.toString())) ? "Insufficient Limit" :
                                Number(USDCAmount == undefined ? 0 : ethers.utils.formatEther(USDCAmount.toString())) > poolBalance?.data?.formatted ? "Insufficient Liquidity" :
                                  "Sell"
                          )
                          : "Enter Amount"}
                      </Button>
                    }
                    {buyOrSell === "Buy" &&
                      <Button
                        color="#fff"
                        style={{ width: "100%", marginBottom: "16px" }}
                        disabled={
                          isWhitelisted == false || RWATokenAmount === undefined || RWATokenAmount < 1 || RWATokenAmount === '' || ethers.utils.formatEther(buyLANDAmount ? buyLANDAmount.toString() : 0) > parseFloat(landBalance?.data?.formatted) || ethers.utils.formatEther(buyUSDCAmount ? buyUSDCAmount.toString() : 0) > parseFloat(USDCBalance?.data?.formatted)
                        }
                        onClick={() => { setIsSTAPshow(true); }}
                      >
                        {RWATokenAmount && buyLANDAmount && USDCAmount
                          ? (
                            ethers.utils.formatEther(buyLANDAmount.toString()) > parseFloat(landBalance?.data?.formatted) ? "Insufficient LAND Balance" :
                              ethers.utils.formatEther(buyUSDCAmount.toString()) > parseFloat(USDCBalance?.data?.formatted) ? "Insufficient USDC Balance" :
                                buyOrSell)

                          : "Enter Amount"}
                      </Button>
                    }
                  </>
                }
                {isWhitelisted ? (
                  <a
                    href="https://app.dsswap.io/swap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <Button outlined style={{ width: "100%" }}>
                      Trade on DS Swap
                    </Button>
                  </a>
                ) : (
                  <div className="swap-card-kyc-section bg-tw-primary">
                    <div className="swap-card-kyc-status">
                      <img src={IconInfo} alt="icon info" />
                      <span>KYC not verified</span>
                    </div>
                    <span className="text-tw-text-secondary">
                      Complete the KYC process on the dashboard to access RWA Tokens
                    </span>
                    <Button
                      color="#fff"
                      style={{ width: "100%", marginTop: '14px' }}
                      onClick={handlemodalkyc}
                    >
                      Verify Now
                    </Button>
                  </div>
                )}
                <div className="swap-card-connect-section">
                  <div />
                  <a>
                    <button onClick={() => { setIsBuyModalOpen(true) }}>
                      <span>Get LAND Token</span>
                      <img src={IconArrowRightUp} alt="arrow right up" />
                    </button>
                  </a>
                </div>
              </>
            ) : (
              <div className="swap-card-kyc-section bg-tw-primary">
                <div className="swap-card-kyc-status">
                  <img src={IconInfo} alt="icon info" />
                  <span>Not supported Chain</span>
                </div>
                <span className="text-tw-text-secondary">
                  Please swtich your network to the BSC.
                </span>
              </div>
            )
          ) : (
            <div className="swap-card-connect-section">
              <div>
                <ConnectWallet style={{ width: "100%" }} containerStyle={{ marginRight: 0 }} />
              </div>
              <a>
                <button onClick={() => { setIsBuyModalOpen(true) }}>
                  <span>Get LAND Token</span>
                  <img src={IconArrowRightUp} alt="arrow right up  " />
                </button>
              </a>
            </div>
          )}
        </div>

      </div>

      <Modal
        modalShow={isShowTokenSelector}
        setModalShow={setIsShowTokenSelector}
        modalOptions={{
          centered: true
        }}
        className="token-selector-modal-content"
      >
        <Modal.Header>
          <div className="token-selector-header">
            <div className="token-selector-header-title">
              Select Token
            </div>
            <img
              src={IconClose}
              alt="icon close"
              className="token-selector-header-closer"
              onClick={() => setIsShowTokenSelector(false)}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="token-selector-body">
            <input
              className="token-selector-body-search"
              placeholder="Search name or paste"
              onChange={(e) => setRWATokenAmount(e.target.value)}
            />
            <div className="token-selector-common-tokens-title">
              <span>Common bases</span>
              <img
                src={IconInfoGray}
                alt="icon info"
              />
            </div>
            <div className="token-selector-common-tokens">
              {TOKENS.map((token) => {
                return (
                  <div className="token-selector-common-token" key={token.symbol}>
                    <img
                      src={token.icon}
                      alt={token.symbol}
                    />
                    <span>{token.symbol}</span>
                  </div>
                );
              })}
            </div>
            <div className="token-selector-tokens-list">
              {allTokens.map((token) => {
                return (
                  <div className="token-selector-token-info" key={token.name}>
                    <img
                      src={token.png32}
                      alt={token.code}
                    />
                    <div className="token-selector-token-info-name-info">
                      <span className="token-selector-token-info-name">{token.code}</span>
                      <span className="token-selector-token-info-fullname">{token.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        modalShow={isGraphShow}
        setModalShow={setIsGraphShow}
        modalOptions={{
          centered: true
        }}
      >
        <Modal.Header>
          <div className={`${isDarkMode && "dark bg-tw-secondary"} header-closer`}>
            <img
              src={IconClose}
              alt="icon close"
              className="token-selector-header-closer"
              onClick={() => setIsGraphShow(false)}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className={`${isDarkMode && "dark bg-tw-secondary"} swap-modal-content`}>
            <PriceGraph
              contentStyle={{ padding: '24px', width: '100%' }}
              titleIconStyle={{ height: '24px' }}
              titleStyle={{ fontSize: '16px', lineHeight: '24px' }}
              type="rwa"
              isRWAPage={true}
            />
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        modalShow={isFinancialSummaryShow}
        setModalShow={setIsFinancialSummaryShow}
        modalOptions={{
          centered: true
        }}
      >
        <Modal.Header>
          <div className="header-closer">
            <img
              src={IconClose}
              alt="icon close"
              className="token-selector-header-closer"
              onClick={() => setIsFinancialSummaryShow(false)}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="swap-modal-content">
            <FinancialSummary />
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        modalShow={isSTAPShow}
        setModalShow={setIsSTAPshow}
        modalOptions={{
          centered: true
        }}
      >
        <Modal.Header>
          <div className="flex w-full justify-between items-center pl-4 z-10 bg-tw-secondary">
            <div className="text-[16px] md:text-[24px]">Security Token Purchase Agreement</div>
            <div className="header-closer pb-3">
              <img
                src={IconClose}

                alt="icon close"
                className="token-selector-header-closer"
                onClick={() => setIsSTAPshow(false)}
              />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="swap-modal-content p-3 flex flex-col space-y-4">
            <div className="w-full google-doc-content bg-tw-secondary">
              {!isSTPALoding ? (<></>)
                : (
                  <SkeletonTheme baseColor={`${isDarkMode ? "#31333b" : "#dbdde0"}`} highlightColor={`${isDarkMode ? "#52545e" : "#f6f7f9"}`}>
                    <div className="w-full h-[300px] absolute left-0 top-0 flex flex-col gap-2 pt-[70px] px-7">
                      <Skeleton className="rounded-lg w-2/3" height={18} />
                      <Skeleton className="rounded-lg w-full" height={18} />
                      <Skeleton className="rounded-lg w-1/3" height={18} />
                      <Skeleton className="rounded-lg w-full" height={18} />
                      <Skeleton className="rounded-lg w-1/2" height={18} />
                      <Skeleton className="rounded-lg w-4/5" height={18} />
                      <Skeleton className="rounded-lg w-full" height={18} />
                      <Skeleton className="rounded-lg w-full" height={18} />
                      <Skeleton className="rounded-lg w-1/4" height={18} />
                    </div>
                  </SkeletonTheme>)}
              <div className="z-10 relative h-[300px] w-full bg-tw-secondary text-tw-text-secondary" id='doc'></div>
              {/* <iframe className="-mt-[120px] z-10 relative" id="doc" src={docContent} width="105%" height="420px" onLoad={() => setIsSTPALoading(false)} /> */}
            </div>
            <div className="">
              <span className="disclaimer-color-text  text-tw-text-secondary">By finalizing the purchase of RWA Tokens, you hereby affirm your acceptance of the terms outlined in the STPA. To obtain a duly signed copy of the STPA, kindly complete the purchase process through the <a href="https://dashboard.landshare.io" target="_blank">Landshare Dashboard</a>.</span>
              <Form.Check
                type="checkbox"
                id="checkbox-token"
                label={
                  <span className="fs-16 fw-600 text-black-700 cursor-pointer">
                    Acknowledge and sign
                  </span>

                }
                className="custom-checkbox pt-2"
                checked={signAgreement}
                disabled={false}
                onChange={(e) => setSignAgreement((prevState) => !prevState)}
              />


            </div>

            <div>
              <button
                className="btn nav-btn d-flex justify-content-center align-items-center"
                onClick={async () => {
                  setIsSTAPshow(false);
                  buyOrSell == "Buy" ? buyTokens() : sellTokens();
                }}
                disabled={false}
              >
                Submit
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </div >
  );
}
