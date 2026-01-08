import { useState, useEffect } from "react";
import { BigNumberish, formatUnits, formatEther } from "ethers";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";
import { bsc } from "viem/chains";
import { MdOutlineHelp, MdCancel } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { useAccount, useBalance, useChainId } from "wagmi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { TOKENS } from "../../config/constants/page-data";
import { TOKEN_TYPE } from "../../utils/type";
import { useTheme } from "next-themes";
import Button from "../common/button";
import ToggleButton from "../common/toggle-button";
import ConnectWallet from "../connect-wallet";
import FinancialSummary from "../financial-summary";
import PriceGraph from "../price-line-chart";
import SwipeluxModal from "../common/modals/swipelux";
import ZeroIDWidget from "../zero-id-widget";
import KYCWidget from "../sumsub-widget";
import useGetSaleLimit from "../../hooks/contract/LandshareSaleContract/useGetSaleLimit";
import useGetDecimals from "../../hooks/contract/UsdtContract/useGetDecimals";
import useGetAllowedToTransfer from "../../hooks/contract/RWAContract/useGetAllowedToTransfer";
import useIsWhitelisted from "../../hooks/contract/WhitelistContract/useIsWhitelisted";
import useLandFee from "../../hooks/contract/LandshareSaleContract/useLandFee";
import {
  RWA_CONTRACT_ADDRESS,
  USDC_ADDRESS,
  RWA_POOL_CONTRACT_ADDRESS,
  LAND_TOKEN_CONTRACT_ADDRESS,
  BOLD_INTER_TIGHT,
  MAJOR_WORK_CHAINS,
  PUSD_SUPPORT_CHINAS,
} from "../../config/constants/environments";
import { useGlobalContext } from "../../context/GlobalContext";
import useGetRwaPrice from "../../hooks/contract/APIConsumerContract/useGetRwaPrice";
import useGetAllTokens from "../../hooks/axios/useGetAllTokens";
import useGetLandFee from "../../hooks/contract/LandshareSaleContract/useGetLandFee";
import useBuyTokenView from "../../hooks/contract/LandshareBuySaleContract/useBuyTokenView";
import useSellTokens from "../../hooks/swap-token/useSellTokens";
import useBuyTokens from "../../hooks/swap-token/useBuyTokens";
import IconSwipelux from "../../../public/icons/swipelux.svg";
import IconPancakeswap from "../../../public/icons/pancakeswap.png";
import IconGateio from "../../../public/icons/gateio.png";
import IconMEXC from "../../../public/icons/mexclogo.png";
import IconUSDC from "../../../public/icons/usdc.png";
import IconArrowDown from "../../../public/icons/arrow-down.svg";
import IconArrowDownDark from "../../../public/icons/arrow-down-dark.svg";
import IconArrowUpDown from "../../../public/icons/arrow-up-down.svg";
import IconArrowRightUp from "../../../public/icons/arrow-right-up.svg";
import IconDashboard from "../../../public/icons/dashboard.svg";
import IconInfo from "../../../public/icons/info.svg";
import IconInfoGray from "../../../public/icons/info-gray.svg";
import IconClose from "../../../public/icons/close.svg";
import IconCloseDark from "../../../public/icons/close-dark.svg";
import pUsd from "../../../public/icons/pusd.svg";
import "react-loading-skeleton/dist/skeleton.css";
import Tooltip from "../common/tooltip";

const RWA_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/rwa']

export default function SwapToken() {
  const { screenLoadingStatus } = useGlobalContext();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data: isWhitelisted, refetch } = useIsWhitelisted(chainId, address);

  const [RWATokenAmount, setRWATokenAmount] = useState(0);
  const [usdcAmount, setUsdcAmount] = useState(0);
  const [isGraphShow, setIsGraphShow] = useState(false);
  const [isFinancialSummaryShow, setIsFinancialSummaryShow] = useState(false);
  const [buyUSDCAmount, setBuyUSDCAmount] = useState(0);
  const [buyLANDAmount, setBuyLANDAmount] = useState(0);
  const [isSTAPShow, setIsSTAPshow] = useState(false);
  const [signAgreement, setSignAgreement] = useState(false);
  const [isShowTokenSelector, setIsShowTokenSelector] = useState(false);
  const [buyOrSell, setBuyOrSell] = useState("Buy");
  const [isSTPALoding, setIsSTPALoading] = useState(true);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSwipeluxModalOpen, setIsSwipeluxModalOpen] = useState(false);
  const [iskycmodal, setKycopen] = useState(false);
  const [isZeroIDModal, setZeroIDModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      await refetch();
    })()
  }, [isZeroIDModal])

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address,
    token: RWA_CONTRACT_ADDRESS[chainId],
    chainId: chainId,
  }) as { data: any, refetch: Function };

  const { data: USDCBalance, refetch: refetchUSDCBalance } = useBalance({
    address: address,
    token: USDC_ADDRESS[chainId],
    chainId: chainId,
  }) as { data: any, refetch: Function };

  const { data: poolBalance, refetch: refetchPoolBalance } = useBalance({
    address: RWA_POOL_CONTRACT_ADDRESS[chainId],
    token: USDC_ADDRESS[chainId],
    chainId: chainId,
  }) as { data: any, refetch: Function };

  const { data: landBalance, refetch: refetchLandBalance } = useBalance({
    address: address,
    token: LAND_TOKEN_CONTRACT_ADDRESS[chainId],
    chainId: chainId,
  }) as { data: any, refetch: Function };

  const { data: saleLimit, refetch: refetchSaleLimit } = useGetSaleLimit(
    chainId,
    address
  ) as { data: [BigNumberish, number, number]; refetch: Function };

  const { data: usdcDecimals } = useGetDecimals(chainId) as { data: number };

  const limitDate = saleLimit
    ? new Date(
      saleLimit[1] != undefined
        ? Number(saleLimit[1]) * 1000
        : Date.now() * 1000
    )
    : Date.now() * 1000;
  const reachedLimit = saleLimit
    ? saleLimit[2] != undefined
      ? saleLimit[2]
      : Date.now()
    : Date.now();

  const { data: secondaryLimit, isLoading: isSecondaryLimitLoading } = useGetAllowedToTransfer(chainId, address) as { data: BigNumberish, isLoading: boolean };
  const landFee = useLandFee(chainId) as number;
  const rwaPrice = useGetRwaPrice(chainId) as BigNumberish;
  const { allTokens } = useGetAllTokens();
  const landFeeAmount = useGetLandFee(chainId, usdcAmount) as number;

  const { sellTokens } =
    useSellTokens(chainId, address, landFeeAmount, RWATokenAmount);
  const { buyTokens } = useBuyTokens(
    chainId,
    address,
    buyLANDAmount,
    RWATokenAmount
  );
  const buyTokenAmount = useBuyTokenView(
    chainId,
    RWATokenAmount,
    USDC_ADDRESS[chainId]
  ) as any;

  useEffect(() => {
    setUsdcAmount(Number((Number(formatEther(rwaPrice ?? 0)) * RWATokenAmount).toFixed(2)));
    setBuyLANDAmount(buyTokenAmount[1])
    setBuyUSDCAmount(buyTokenAmount[0])
  }, [rwaPrice, RWATokenAmount, buyTokenAmount]);

  useEffect(() => {
    if (screenLoadingStatus === "Transaction Complete.") {
      refetchBalance();
      refetchUSDCBalance();
      refetchPoolBalance();
      refetchLandBalance();
      refetchSaleLimit();
    }
  }, [screenLoadingStatus]);

  useEffect(() => {
    if (isSTAPShow) {
      get_information(
        "https://docs.google.com/document/d/e/2PACX-1vSCbbmciud2wUhSDtRpwbXdimj_GF6ZaLvvtu_XmGSYxdfHc-bMP4psbMoZFUIgdWgJLpx53RubSxSb/pub?embedded=true",
        function (text: string) {
          var docElement = document.createElement("div");
          docElement.innerHTML = text;
          docElement.classList.add("bg-primary");
          docElement.classList.add("text-text-primary");
          docElement.classList.add("w-full");
          var container = document.getElementById("doc");
          if (container) {
            container.innerHTML = ''; // Clear existing content
            container.appendChild(docElement);
            var docContent = docElement.getElementsByClassName("doc-content");
            if (docContent[0] instanceof HTMLElement) {
              docContent[0].style.padding = "10px";
              docContent[0].style.background = theme == "dark" ? "#2E2E2E" : "#f6f7f9";
              var paragraphs = docContent[0].getElementsByTagName("p");
              for (var i = 0; i < paragraphs.length; i++) {
                var spans = paragraphs[i].getElementsByTagName("span");
                for (var j = 0; j < spans.length; j++) {
                  spans[j].style.color = theme == "dark" ? "#f1f1f1" : "#0a0a0a";
                  spans[j].style.background = "transparent";
                }
              }
            }
          }
          setIsSTPALoading(false);
        }
      );
    }
  }, [isSTAPShow]);

  const { theme } = useTheme();

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "auto",
      maxWidth: "400px",
      width: "90%",
      height: "fit-content",
      maxHeight: "90%",
      borderRadius: "20px",
      border: 0,
      backgroundColor: theme == "dark" ? "#31333b" : "#f6f7f9",
    },
    overlay: {
      zIndex: 99999,
      background: "#00000080",
    },
  };

  function get_information(link: string, callback: any) {
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
  }
  function handleclosemodal() {
    setKycopen(false);
  }

  const handleLinkClick = (event: any) => {
    event.preventDefault(); // Prevent the default link behavior
    setKycopen(false);
    setZeroIDModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col w-full lg:w-[371px] max-w-full lg:max-w-[371px] items-start bg-third p-[18px] lg:p-[24px] rounded-[16px] gap-[16px] max-h-none">
        <div className="flex justify-between items-center w-full">
          <div>
            <div
              className={`text-[24px] leading-[30px] text-text-primary ${BOLD_INTER_TIGHT.className}`}
            >
              Swap RWA
            </div>
            <div className="text-[14px] leading-[22px] tracking-[0.02em] text-left pt-[4px] text-text-secondary">
              Trade tokens in an instant
            </div>
          </div>
          <div className="flex gap-[20px] md:hidden">
            <Image
              src={IconDashboard}
              alt="dashboard"
              className="w-[24px] h-[24px] p-[1.5px] grayscale cursor-pointer"
              onClick={() => setIsGraphShow(true)}
            />
          </div>
        </div>
        <div className="flex w-full gap-[10px] justify-between">
          <ToggleButton
            active={buyOrSell == "Buy"}
            type={"pricegraph"}
            onClick={() => {
              setBuyOrSell("Buy");
              setRWATokenAmount(0);
              setBuyLANDAmount(0);
              setBuyUSDCAmount(0);
            }}
            className="w-full h-[40px]"
          >
            Buy
          </ToggleButton>
          <ToggleButton
            active={buyOrSell == "Sell"}
            type={"pricegraph"}
            onClick={() => {
              setBuyOrSell("Sell");
              setRWATokenAmount(0);
              setUsdcAmount(0);
            }}
            className="w-full h-[40px]"
          >
            Sell
          </ToggleButton>
        </div>

        <Modal
          isOpen={iskycmodal}
          onRequestClose={() => {
            setKycopen(false), document.body.classList.remove("modal-open");
          }}
          style={customModalStyles}
          contentLabel="Modal"
        >
          <MdCancel
            onClick={handleclosemodal}
            className="float-right text-[#000] dark:text-[#fff] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
          />
          <div className="w-full">
            <h5
              className={` text-[1.5rem] leading-[1.334] text-center ${BOLD_INTER_TIGHT.className}`}
            >
              KYC Verification
            </h5>
            <p
              className='text-[#000000CC] dark:text-[#fff] text-[16px] pt-[10px] leading-[28px] text-center tracking-[2%] font-inter font-semibold'
            >
              Complete the KYC process to access RWA Tokens
            </p>
          </div>
          <div className="w-full mt-3">
            <a href="https://dashboard.landshare.io">
              <Button
                className="flex flex-col justify-center items-center w-full pb-[10px] bg-primary-green text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors"
                disabled={chainId != bsc.id}
              >
                <p
                  className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}
                >
                  Manual Verification
                </p>
              </Button>
              <p className="text-xs text-text-secondary text-center mt-1">Recommended for advanced users and large investors</p>
            </a>
            <div onClick={handleLinkClick}>
              <Button
                className="flex flex-col disabled:bg-[#c2c5c3] justify-center items-center w-full pb-[10px] bg-primary-green text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors mt-4"
        
              >
                <p
                  className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}
                >
                  Sumsub Verification
                </p>
              </Button>
              <p className="text-xs text-text-secondary text-center mt-1">Quick verification - 5 minutes or less!</p>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isZeroIDModal}
          onRequestClose={() => {
            setZeroIDModalOpen((prev) => !prev),
              document.body.classList.remove("modal-open");
          }}
          style={customModalStyles}
          contentLabel="Sumsub Modal"
          className="relative"
        >
          <MdCancel
            onClick={() => {
              setZeroIDModalOpen(false);
            }}
            className="float-right text-[#000] dark:text-[#fff] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
          />
          <KYCWidget />
        </Modal>
        <Modal
          isOpen={isBuyModalOpen}
          onRequestClose={() => {
            setIsBuyModalOpen(false),
              document.body.classList.remove("modal-open");
          }}
          style={customModalStyles}
          contentLabel="current-apr Modal"
        >
          <div className="w-full overflow-y-auto h-[460px]">
            <Button
              onClick={() => {
                setIsBuyModalOpen(false)
                setIsSwipeluxModalOpen(true)
              }}
              className="h-[115px] flex flex-col justify-center items-center w-full pb-[20px] border-b relative hover:bg-gray-300 transition-colors"
              textClassName="flex flex-col justify-center items-center"
            >
              <Image src={IconSwipelux} alt="" className="w-[40px]" />
              <div className="text-[24px] font-bold">Swipelux</div>
              <div className="text-[16px] text-[#b6b0b0]">
                Credit or Debit Card
              </div>
            </Button>
            <Link
              href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"
              target="_blank"
              className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors"
            >
              <Image src={IconPancakeswap} alt="" className="w-[40px]" />
              <div className="text-[24px] font-bold">PancakeSwap</div>
              <div className="text-[16px] text-[#b6b0b0]">
                Decentralized Exchange
              </div>
            </Link>
            <Link
              href="https://www.gate.io/trade/LANDSHARE_USDT"
              target="_blank"
              className="h-[115px] flex flex-col justify-center items-center w-full  pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors"
            >
              <Image src={IconGateio} alt="" className="w-[40px]" />
              <div className="text-[24px] font-bold">Gate.io</div>
              <div className="text-[16px] text-[#b6b0b0]">
                Centralized Exchange
              </div>
            </Link>
            <Link
              href="https://www.mexc.com/exchange/LANDSHARE_USDT"
              target="_blank"
              className="h-[115px] flex flex-col justify-center items-center w-full hover:bg-gray-300 transition-colors"
            >
              <Image src={IconMEXC} alt="" className="w-[40px] h-[40px]" />
              <div className="text-[24px] font-bold">MEXC</div>
              <div className="text-[16px] text-[#b6b0b0]">
                Centralized Exchange
              </div>
            </Link>
          </div>
        </Modal>
        {buyOrSell === "Sell" && (
          <>
            <div className="flex flex-col w-full gap-[4px] min-h-[76px]">
              <div className="flex justify-between items-center">
                <label className="text-text-secondary text-[12px]">RWA Token</label>
                <div className="flex justify-between items-center gap-[5px]">
                  <label className="text-text-secondary text-[12px] leading-[22px]">
                    Balance:
                  </label>
                  <span
                    className={`text-text-primary text-[12px] leading-[20px] ${BOLD_INTER_TIGHT.className}`}
                  >
                    {rwaPrice == undefined || isConnected === false
                      ? "0"
                      : `${parseFloat(balance?.formatted)} ($${(
                        Number(formatEther(rwaPrice ?? 0)) *
                        parseFloat(balance?.formatted)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })})`}
                  </span>
                </div>
              </div>
              <input
                className="bg-primary dark:bg-secondary text-text-primary py-[13px] px-[20px] w-full rounded-[12px]"
                placeholder="0 RWA"
                type="number"
                disabled={!isConnected}
                onChange={(e: any) => {
                  const regex = /^\d+$/;
                  if (e.target.value === "" || regex.test(e.target.value))
                    setRWATokenAmount(Number(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col w-full gap-[4px] min-h-[76px]">
              <div className="flex justify-between items-center gap-[5px]">
                <div className="flex items-center gap-[5px] cursor-pointer">
                  <Image
                    src={PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866) ? pUsd : IconUSDC}
                    alt="usdc"
                    className="w-[18px] h-[18px] rounded-full"
                  />
                  <span
                    className={`text-text-primary text-[12px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                  >
                    {PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866) ? "pUSD" : "USDC"}
                  </span>
                  <Image
                    src={theme == "dark" ? IconArrowDownDark : IconArrowDown}
                    alt="arrow down"
                    className="w-[18px] h-[18px]"
                  />
                </div>
                <div className="flex justify-between items-center gap-[5px]">
                  <label className="text-text-secondary text-[12px] leading-[22px]">
                    RWA Price:
                  </label>
                  <span
                    className={`text-text-primary text-[12px] leading-[20px] ${BOLD_INTER_TIGHT.className}`}
                  >
                    $
                    {rwaPrice == 0
                      ? "Loading..."
                      : Number(formatEther(rwaPrice ?? 0)).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 4 }
                      )}
                  </span>
                </div>
              </div>
              <input
                className="bg-primary dark:bg-secondary text-text-primary py-[13px] px-[20px] w-full rounded-[12px]"
                placeholder={`00.00 ${PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866) ? 'pUSD' : 'USDC'}`}
                readOnly
                value={usdcAmount == 0 || RWATokenAmount === 0
                  ? ""
                  : usdcAmount}
                onChange={(e: any) => setUsdcAmount(e.target.value)}
              />
            </div>
            {isConnected && (
              <>
                <div className="text-text-primary w-full flex justify-between">
                  <span className={`text-[14px] ml-[5px] leading-[22px] ${BOLD_INTER_TIGHT.className} mr-1`}>
                    {chainId == bsc.id ? 'LAND' : ''} Fee ({landFee.toString()}%)
                  </span>
                  <span
                    className={`text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                  >
                    {landFeeAmount
                      ? formatEther(landFeeAmount).toString().substr(0, 12)
                      : 0}{" "}
                    {chainId == bsc.id ? 'LAND ' : ' '}
                  </span>
                </div>
                <div className="text-text-primary w-full flex justify-between">
                  <div className="flex items-center">
                    <span
                      className={`text-[14px] ml-[5px] leading-[22px] ${BOLD_INTER_TIGHT.className} mr-1`}
                    >
                    Monthly Sale Limit
                    </span>
                    <Tooltip
                      content={
                        reachedLimit
                          ? "Your remaining monthly USDC sale limit. To make a larger sale, please contact admin@landshare.io."
                          : `Your remaining monthly USDC sale limit. Your limit resets on [${new Date(limitDate).getFullYear() +
                          "/" +
                          (new Date(limitDate).getMonth() + 1) +
                          "/" +
                          new Date(limitDate).getDate()
                          }]. To make a larger sale, please contact admin@landshare.io`
                      }
                    >
                      {/* svg icon must be wrapped in a div */}
                      <div>
                        <MdOutlineHelp className="text-[16px]" />
                      </div>
                    </Tooltip>
                  </div>
                  <span
                    className={`text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                  >
                    {saleLimit
                      ? `$${Number(
                        formatUnits(saleLimit[0], usdcDecimals).toString()
                      ).toFixed(2)}`
                      : "Loading"}
                  </span>
                </div>
                <div className="text-text-primary mb-[18px] w-full flex justify-between">
                  <div className="flex items-center">
                    <span
                      className={`text-[14px] ml-[5px] leading-[22px] ${BOLD_INTER_TIGHT.className} mr-1`}
                    >
                      Transfer Limit
                    </span>

                    <Tooltip
                      content={
                        <>
                          Remaining number of RWA Tokens that can be transferred
                          from your wallet based on your Secondary Trading
                          Limit. Number must exceed the RWA Tokens to be sold.
                          Limit can be raised on the dashboard. To learn more,
                          <Link
                            href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/secondary-trading-limits"
                            target="_blank"
                            rel="noopener"
                            className="text-inherit font-bold"
                          >
                            click here.
                          </Link>
                        </>
                      }
                    >
                      {/* svg icon must be wrapped in a div */}
                      <div>
                        <MdOutlineHelp className="text-[16px]" />
                      </div>
                    </Tooltip>
                  </div>
                  <span
                    className={`text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                  >
                    {isSecondaryLimitLoading ? "Loading" : secondaryLimit.toString()}
                  </span>
                </div>
              </>
            )}
          </>
        )}
        {buyOrSell === "Buy" && (
          <>
            <div className="flex flex-col w-full gap-[4px] min-h-[76px]">
              <div className="flex justify-between items-center">
                <label className="text-text-secondary text-[12px]">RWA Token </label>
                {isConnected && (
                  <div className="flex justify-between items-center gap-[5px]">
                    <label className="text-text-secondary text-[12px] leading-[22px]">
                      Balance:
                    </label>
                    <span
                      className={`text-text-primary text-[12px] leading-[20px] ${BOLD_INTER_TIGHT.className}`}
                    >
                      {rwaPrice == undefined
                        ? "0"
                        : `${parseFloat(balance?.formatted)} ($${(
                          Number(formatEther(rwaPrice ?? 0)) *
                          parseFloat(balance?.formatted)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })})`}
                    </span>
                  </div>
                )}
              </div>
              <input
                className="bg-primary dark:bg-secondary text-text-primary py-[13px] px-[20px] w-full rounded-[12px]"
                placeholder="0 RWA"
                value={RWATokenAmount == 0 ? "" : RWATokenAmount}
                disabled={!isConnected}
                type="number"
                onChange={(e: any) => {
                  const regex = /^\d+$/;
                  if (e.target.value === "" || regex.test(e.target.value))
                    setRWATokenAmount(Number(e.target.value));
                }}
              />
            </div>

            <div className="flex min-h-[76px] w-full gap-[16px]">
              <div className="flex flex-col flex-1 w-full gap-[4px] min-h-[76px]">
                <div className="flex justify-between items-center gap-[5px]">
                  <div className="flex items-center gap-[5px] cursor-pointer">
                    <Image
                      src={PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866) ? pUsd : IconUSDC}
                      alt="usdc"
                      className="w-[18px] h-[18px] rounded-full"
                    />
                    <span
                      className={`text-text-primary text-[14px] leading-[22px] !text-[12px] ${BOLD_INTER_TIGHT.className}`}
                    >
                      {PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866) ? "pUSD" : "USDC"}
                    </span>
                  </div>
                </div>
                <input
                  className="bg-primary dark:bg-secondary text-text-primary py-[13px] px-[20px] w-full rounded-[12px]"
                  placeholder={`00.00 ${PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866) ? 'pUSD' : 'USDC'}`}
                  readOnly
                  value={
                    buyUSDCAmount == undefined || RWATokenAmount === 0
                      ? ""
                      : formatUnits(buyUSDCAmount.toString(), chainId == bsc.id ? 18 : 6)
                  }
                />
                {isConnected && (
                  <div className="flex items-center gap-[5px] justify-end w-full">
                    <label className="text-text-secondary text-[12px] leading-[22px]">
                      Balance:
                    </label>
                    <span
                      className={`text-text-primary text-[12px] leading-[20px] ${BOLD_INTER_TIGHT.className}`}
                    >
                      {USDCBalance === undefined
                        ? "Loading..."
                        : parseFloat(USDCBalance?.formatted).toFixed(3)}
                    </span>
                  </div>
                )}
              </div>
              {!PUSD_SUPPORT_CHINAS.map(c => c.id).includes(chainId as 98867 | 98866) && (
                <div className="flex flex-col flex-1 w-full gap-[4px] min-h-[76px]">
                  <div className="flex justify-between items-center gap-[5px]">
                    <div className="flex items-center gap-[5px] cursor-pointer">
                      <span
                        className={`text-text-primary text-[12px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                      >
                        LAND
                      </span>
                    </div>
                  </div>
                  <input
                    className="bg-primary dark:bg-secondary text-text-primary py-[13px] px-[20px] w-full rounded-[12px]"
                    placeholder="00.00 LAND"
                    readOnly
                    value={
                      buyLANDAmount == undefined || RWATokenAmount === 0
                        ? ""
                        : formatEther(buyLANDAmount.toString())
                    }
                  />
                  {isConnected && (
                    <div className="flex items-center gap-[5px] justify-end w-full">
                      <label className="text-text-secondary text-[12px] leading-[22px]">
                        Balance:
                      </label>
                      <span
                        className={`text-text-primary text-[12px] leading-[20px] ${BOLD_INTER_TIGHT.className}`}
                      >
                        {landBalance === undefined
                          ? "0"
                          : Number(landBalance?.formatted).toFixed(3)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        <div className="w-full">
          {isConnected ? (
            (RWA_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? (
              <>
                {isWhitelisted && (
                  <>
                    {buyOrSell === "Sell" && (
                      <Button
                        disabled={
                          isWhitelisted == false ||
                          RWATokenAmount === undefined ||
                          RWATokenAmount < 1 ||
                          RWATokenAmount === 0 ||
                          RWATokenAmount > parseFloat(balance?.formatted) ||
                          (chainId == bsc.id ?
                            (Number(formatEther(landFeeAmount ? landFeeAmount : 0)) > parseFloat(landBalance?.formatted))
                            : (Number(formatEther(landFeeAmount ? landFeeAmount : 0)) > Number(usdcAmount.toString()))) ||
                          Number(saleLimit) <
                          Number(
                            usdcAmount == 0 ? 0 : usdcAmount.toString()
                          ) ||
                          Number(
                            usdcAmount == 0 ? 0 : Number(usdcAmount.toString())
                          ) > Number(poolBalance?.formatted)
                        }
                        onClick={() => sellTokens()}
                        textClassName="text-[#fff]"
                        className="w-full mb-[16px] py-[13px] px-[24px] rounded-[100px] bg-primary-green"
                      >
                        {RWATokenAmount && usdcAmount && landFeeAmount
                          ? RWATokenAmount > parseFloat(balance?.formatted)
                            ? "Insufficient RWA Balance"
                            : (chainId == bsc.id ?
                              Number(formatEther(landFeeAmount ? landFeeAmount : 0)) > parseFloat(landBalance?.formatted)
                              : Number(formatEther(landFeeAmount ? landFeeAmount : 0)) > Number(usdcAmount.toString()))
                              ? "Insufficient LAND Balance"
                              : Number(saleLimit) <
                                Number(
                                  usdcAmount == 0 ? 0 : usdcAmount.toString()
                                )
                                ? "Insufficient Limit"
                                : Number(
                                  usdcAmount == 0
                                    ? 0
                                    : Number(usdcAmount.toString())
                                ) > Number(poolBalance?.formatted)
                                  ? (
                                    <Tooltip
                                      content="Fixed-price liquidity is limited and is replenished periodically. Please try again later."
                                    >
                                      {/* svg icon must be wrapped in a div */}
                                      <div className="flex gap-[8px] items-center">
                                        <span>Insufficient Liquidity</span>
                                        <BsInfoCircle
                                          id="tooltip-icon"
                                          className="w-4 h-4 cursor-pointer"
                                        ></BsInfoCircle>
                                      </div>
                                    </Tooltip>
                                  )
                                  : "Sell"
                          : "Enter Amount"}
                      </Button>
                    )}
                    {buyOrSell === "Buy" && (
                      <Button
                        disabled={
                          isWhitelisted == false ||
                          RWATokenAmount === undefined ||
                          RWATokenAmount === 0 ||
                          Number(
                            formatEther(
                              buyLANDAmount ? buyLANDAmount.toString() : 0
                            )
                          ) > parseFloat(landBalance?.formatted) ||
                          Number(
                            formatUnits(
                              buyUSDCAmount ? buyUSDCAmount.toString() : 0,
                              usdcDecimals
                            )
                          ) > parseFloat(USDCBalance?.formatted)
                        }
                        onClick={() => {
                          setIsSTAPshow(true);
                        }}
                        className="w-full mb-[16px] py-[13px] px-[24px] rounded-[100px] bg-primary-green text-white"
                      >
                        {(chainId == bsc.id ? buyLANDAmount : true) && RWATokenAmount && usdcAmount
                          ? Number(formatEther(buyLANDAmount.toString())) >
                            parseFloat(landBalance?.formatted)
                            ? "Insufficient LAND Balance"
                            : Number(formatUnits(buyUSDCAmount.toString(), usdcDecimals)) >
                              parseFloat(USDCBalance?.formatted)
                              ? "Insufficient USDC Balance"
                              : "Buy"
                          : "Enter Amount"}
                      </Button>
                    )}
                  </>
                )}
                {isWhitelisted  ? (
                  <a
                    href="https://app.dsswap.io/swap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <Button outlined className="w-full py-[13px] px-[24px] rounded-[100px] border-[#61cd81]">
                      Trade on DS Swap
                    </Button>
                  </a>
                ) : (
                  <div className="bg-[#f6f8f9] p-[16px] rounded-[12px] bg-primary">
                    <div className="flex items-center gap-[10px] mb-[4px]">
                      <Image
                        src={IconInfo}
                        alt="icon info"
                        className="w-[20px] h-[20px]"
                      />
                      <span
                        className={`text-[14px] leading-[22px] text-[#d21111] ${BOLD_INTER_TIGHT.className}`}
                      >
                        KYC not verified
                      </span>
                    </div>
                    <span className={`text-[14px] text-text-secondary ${BOLD_INTER_TIGHT.className}`}>
                      Complete the KYC process on the dashboard to access RWA
                      Tokens
                    </span>
                    <Button
                      onClick={handlemodalkyc}
                      textClassName="text-[#fff]"
                      className="w-full mt-[14px] py-[13px] bg-primary-green px-[24px] rounded-[100px]"
                    >
                      Verify Now
                    </Button>
                  </div>
                )}
                <div className="flex flex-col items-center gap-[18px] w-full">
                  <div className="w-full" />
                  <div
                    className="flex !bg-transparent items-center justify-center"
                    onClick={() => {
                      setIsBuyModalOpen(true);
                    }}
                  >
                    <span
                      className={`text-[14px] cursor-pointer leading-[22px] text-[#61cd81] ${BOLD_INTER_TIGHT.className}`}
                    >
                      Get LAND Token
                    </span>
                    <Image src={IconArrowRightUp} alt="arrow right up" />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#f6f8f9] p-[16px] rounded-[12px] bg-primary">
                <div className="flex items-center gap-[10px] mb-[4px]">
                  <Image
                    src={IconInfo}
                    alt="icon info"
                    className="w-[20px] h-[20px]"
                  />
                  <span
                    className={`text-[14px] leading-[22px] text-[#d21111] ${BOLD_INTER_TIGHT.className}`}
                  >
                    Not supported Chain
                  </span>
                </div>
                <span className="text-text-secondary">
                  {`Please switch your chain to ${RWA_MAJOR_WORK_CHAIN.map(chain => chain.name).join(', ')}`}
                </span>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-[18px] w-full">
              <div className="w-full">
                <ConnectWallet connectButtonClassName="w-full mr-0" />
              </div>
              <div
                className="flex !bg-transparent items-center justify-center"
                onClick={() => {
                  setIsBuyModalOpen(true);
                }}
              >
                <span
                  className={`text-[14px] cursor-pointer leading-[22px] text-[#61cd81] ${BOLD_INTER_TIGHT.className}`}
                >
                  Get LAND Token
                </span>
                <Image src={IconArrowRightUp} alt="arrow right up  " />
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isShowTokenSelector}
        onRequestClose={() => {
          setIsShowTokenSelector(false),
            document.body.classList.remove("modal-open");
        }}
        style={customModalStyles}
        className="max-w-[384px]"
      >
        <div className="bg-[#f6f8f9] flex justify-between items-center px-[24px] pt-[24px] pb-[16px] rounded-t-[16px]">
          <div
            className={`text-[18px] leading-[28px] text-[#0a0a0a] ${BOLD_INTER_TIGHT.className}`}
          >
            Select Token
          </div>
          <Image
            src={IconClose}
            alt="icon close"
            className="w-[24px] h-[24px] cursor-pointer"
            onClick={() => setIsShowTokenSelector(false)}
          />
        </div>
        <div className="flex flex-col py-[16px] px-[24px]">
          <input
            className="bg-[#f6f8f9] rounded-[12px] py-[13px] px-[20px] w-full text-[14px] leading-[22px]"
            placeholder="Search name or paste"
            onChange={(e: any) => setRWATokenAmount(e.target.value)}
          />
          <div className="flex gap-[5.5px] items-center mt-[16px] mb-[4px]">
            <span className="text-[12px] leading-[20px]">Common bases</span>
            <Image
              src={IconInfoGray}
              alt="icon info"
              className="w-[13px] h-[13px]"
            />
          </div>
          <div className="flex gap-[12px]">
            {TOKENS.map((token: TOKEN_TYPE) => {
              return (
                <div
                  className="flex justify-center items-center gap-[7px] bg-[#f6f8f9] rounded-[12px] w-[90px] pt-[6px] pr-[12px] pb-[8px] pl-[13px]"
                  key={token.symbol}
                >
                  <Image
                    className="w-[18px] h-[18px]"
                    src={token.icon}
                    alt={token.symbol}
                  />
                  <span
                    className={`text-[14px] leading-[22px] text-[#0a0a0a] ${BOLD_INTER_TIGHT.className}`}
                  >
                    {token.symbol}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-[16px] mt-[16px] max-h-[300px] overflow-y-scroll">
            {allTokens.map((token: any) => {
              return (
                <div className="flex gap-[9px]" key={token.name}>
                  <Image src={token.png32} alt={token.code} />
                  <div className="flex flex-col">
                    <span
                      className={`text-[12px] leading-[20px] text-[#0a133999] ${BOLD_INTER_TIGHT.className}`}
                    >
                      {token.code}
                    </span>
                    <span className="text-[12px] leading-[22px] text-[#0a133999]">
                      {token.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isGraphShow}
        onRequestClose={() => {
          setIsGraphShow(false), document.body.classList.remove("modal-open");
        }}
        style={customModalStyles}
      >
        <div className="bg-secondary flex justify-end px-[16px] pt-[16px]">
          <Image
            src={IconClose}
            alt="icon close"
            className="w-[24px] h-[24px] cursor-pointer"
            onClick={() => setIsGraphShow(false)}
          />
        </div>
        <div className="bg-secondary !pt-0">
          <PriceGraph
            containerClassName="p-[24px] w-full"
            titleClassName="text-[16px] leading-[24px]"
            type="rwa"
            showBuyButton={false}
          />
        </div>
      </Modal>
      <Modal
        isOpen={isFinancialSummaryShow}
        onRequestClose={() => {
          setIsFinancialSummaryShow(false),
            document.body.classList.remove("modal-open");
        }}
        style={customModalStyles}
      >
        <div className="flex justify-end px-[16px] pt-[16px]">
          <Image
            src={IconClose}
            alt="icon close"
            className="w-[24px] h-[24px] cursor-pointer"
            onClick={() => setIsFinancialSummaryShow(false)}
          />
        </div>
        <div className="!pt-0">
          <FinancialSummary />
        </div>
      </Modal>
      <Modal
        isOpen={isSTAPShow}
        onRequestClose={() => {
          setIsSTAPshow(false), document.body.classList.remove("modal-open");
        }}
        style={customModalStyles}
      >
        <div className="flex w-full justify-between items-center pl-4 z-10">
          <div className={`text-[16px] md:text-[20px] mb-3 text-text-primary ${BOLD_INTER_TIGHT.className}`}>
            Security Token Purchase Agreement
          </div>
          <div className="flex justify-end px-[16px] pt-[16px] pb-3">
            <Image
              src={theme == "dark" ? IconCloseDark : IconClose}
              alt="icon close"
              className="w-[24px] h-[24px] cursor-pointer"
              onClick={() => setIsSTAPshow(false)}
            />
          </div>
        </div>
        <div className="pt-0 p-3 flex flex-col space-y-4">
          <div className="w-full google-doc-content overflow-x-hidden overflow-y-scroll">
            {!isSTPALoding ? (
              <></>
            ) : (
              <SkeletonTheme
                baseColor={`${theme == "dark" ? "#31333b" : "#dbdde0"}`}
                highlightColor={`${theme == "dark" ? "#52545e" : "#f6f7f9"}`}
              >
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
              </SkeletonTheme>
            )}
            <div
              className="z-10 relative h-[250px] w-full text-text-secondary"
              id="doc"
            ></div>
          </div>
          <div className="">
            <span className="text-[13px] leading-[24px] mt-[5px] pr-[15px] text-text-secondary">
              By finalizing the purchase of RWA Tokens, you hereby affirm your
              acceptance of the terms outlined in the STPA. To obtain a duly
              signed copy of the STPA, kindly complete the purchase process
              through the{" "}
              <a className="underline font-bold" href="https://dashboard.landshare.io" target="_blank">
                Landshare Dashboard
              </a>
              .
            </span>
            <div className="relative pt-2">
              <input
                type="checkbox"
                id="custom-checkbox"
                className="peer hidden"
                checked={signAgreement}
                onChange={() => setSignAgreement((prevState) => !prevState)}
              />
              <label
                htmlFor="custom-checkbox"
                className="relative pl-[25px] flex items-center before:content-[''] before:inline-block before:absolute before:top-[6px] before:w-[15px] before:h-[15px] before:left-0 before:border before:border-gray-700 before:rounded before:bg-white before:transition before:ease-in-out peer-checked:before:bg-green-500 text-[16px] font-bold text-text-primary cursor-pointer"
              >
                Acknowledge and sign
              </label>
            </div>
          </div>
          <div>
            <Button
              className="w-full flex justify-center items-center py-[13px] px-[24px] rounded-[100px] bg-primary-green "
              onClick={async () => {
                setIsSTAPshow(false);
                buyOrSell == "Buy" ? buyTokens(buyUSDCAmount) : sellTokens();
              }}
              disabled={false}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
      <SwipeluxModal
        isOpen={isSwipeluxModalOpen}
        setIsOpen={setIsSwipeluxModalOpen}
      />
    </div>
  );
}
