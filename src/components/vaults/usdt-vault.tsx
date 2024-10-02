import { useEffect, useState } from "react";
import { useAccount, useBalance, useContractRead, useNetwork, useConnect } from "wagmi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ethers } from "ethers";
import numeral from "numeral";
import axios from "axios"
import { Collapse } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import gameSetting from "../../contexts/game/setting.json";
import { useVaultsContext } from "../../contexts/VaultsContext";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useLandshareFunctions } from "../../contexts/LandshareFunctionsProvider";
import useDepositLSRWALP from "../../hooks/useDepositLSRWALP";
import useWithdrawAll from "../../hooks/useWithdrawAll";
import useWithDrawLSRWA from "../../hooks/useWithDrawLSRWA";
import useApproveLSRWALP from "../../hooks/useApproveLSRWALP";
import useClaimBountyLS from "../../hooks/useClaimBountyLS";
import abbreviateNumber from "../main/numberAbbreviator";
import Union from "../../assets/img/new/bluelogo.svg";
import UnionDark from "../../assets/img/new/bluelogo.svg";
import rotateBlue from "../../assets/img/new/rotate-blue.svg";
import down from "../../assets/img/icons/Down.svg";
import calc from "../../assets/img/new/calculator.svg";
import viewContract from "../../assets/img/new/view-contract.png";
import up from "../../assets/img/new/arrow-up.svg";
import pcsBunny from "../../assets/img/icons/pancakeswap-cake-logo.svg"
import "./styles.css"
import smallicon from "../../assets/img/new/tether.svg"
import bscIcon from "../../assets/img/new/bsc.svg";
import polygonIcon from "../../assets/img/new/polygon.svg";
import arbitrumIcon from "../../assets/img/new/arbitrum.svg";
import MasterChefABI from "../../contexts/abis/MasterChef.json"
import APIConsumerABI from "../../contexts/abis/APIConsumer.json"
import LSRWALPABI from "../../contexts/abis/LSRWALP.json"
import book from "../../assets/img/new/book.svg";
import ConnectWallet from "../../components/ConnectWallet";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function UsdtvaultComponent(props) {
  const { theme == 'dark', price } = useGlobalContext();
  const { address } = useAccount()
  const { chain } = useNetwork();
  const { connect, connectors } = useConnect();

  const {
    startTransaction,
    endTransaction,
    transactionResult
  } = useLandshareFunctions();
  const {
    isVaultsLoading,
    LSRWALPAllowance
  } = useVaultsContext();
  const {

    isConnected,
    landTokenV2Contract,
    account,
    notifySuccess,
    notifyError,
    signer,
    provider,

  } = useGlobalContext();



  const { depositLSRWALP } = useDepositLSRWALP({
    startTransaction,
    transactionResult,
  });
  const { withdrawLSRWA } = useWithDrawLSRWA({
    startTransaction,
    transactionResult,
  })
  const { approveLSRWALP } = useApproveLSRWALP({
    startTransaction,
    endTransaction,
    transactionResult,
    updateStatus
  })

  const balance = useBalance({
    address: address,
    token: process.env.REACT_APP_RWA_LP_TOKEN,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,
  })

  const vaultLPTokenBalance = useBalance({
    address: address,
    token: process.env.REACT_APP_RWA_LP_TOKEN,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,
  })

  const { data: userBalance } = useContractRead({
    address: process.env.REACT_APP_MASTERCHEF,
    abi: MasterChefABI,
    chainId: Number(process.env.REACT_APP_NET_ID),
    functionName: "userInfo",
    args: [4, address],
    watch: true,
  });


  const { data: contractLPUSDTBalance } = useBalance({
    address: process.env.REACT_APP_RWA_LP_TOKEN,
    token: process.env.REACT_APP_USDT_TOKEN,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,
  })

  const { data: contractLPLSRWABalance } = useBalance({
    address: process.env.REACT_APP_RWA_LP_TOKEN,
    token: process.env.REACT_APP_RWA_ADDR,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,
  })

  const { data: rwaTokenPrice } = useContractRead({
    address: process.env.REACT_APP_APICONSUMER_ADDR,
    abi: APIConsumerABI,
    functionName: "getRWAPrice",
    chainId: Number(process.env.REACT_APP_NET_ID),

  })

  const { data: LSRWALPTotalSupply } = useContractRead({
    address: process.env.REACT_APP_RWA_LP_TOKEN,
    abi: LSRWALPABI,
    functionName: "totalSupply",
    chainId: Number(process.env.REACT_APP_NET_ID),

  })

  const { data: amountLSRWALPInVault } = useBalance({
    address: process.env.REACT_APP_MASTERCHEF,
    token: process.env.REACT_APP_RWA_LP_TOKEN,
    chainId: Number(process.env.REACT_APP_NET_ID),
    watch: true,
  })

  const { data: rewardsLSRWALP } = useContractRead({
    address: process.env.REACT_APP_MASTERCHEF,
    abi: MasterChefABI,
    functionName: "pendingLand",
    chainId: Number(process.env.REACT_APP_NET_ID),
    args: [4, address],
    watch: true
  })


  const [value, setValue] = useState('deposit');
  const [inputValue, setInputValue] = useState("");
  const [details, setDetails] = useState(false)
  const [depositing, setDepositing] = useState(true)
  const [isWithdrawable, SetWithdrawable] = useState(true);
  const [isDepositable, SetDepositable] = useState(true);
  const [isApprovedLandStake, setIsApprovedLandStake] = useState(true);
  const [TVL, setTVL] = useState(" —")
  const [APY, setAPY] = useState(" —")
  const [LSRWALPValue, setLSRWALPValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDepositing(newValue === "deposit" ? true : false)
  };

  function calculateTVL() {
    if (contractLPUSDTBalance && contractLPLSRWABalance && rwaTokenPrice) {
      const totalValueInLP = contractLPUSDTBalance.value.add(contractLPLSRWABalance.value.mul(rwaTokenPrice))

      const percentageLPInVault = amountLSRWALPInVault.value.mul(totalValueInLP).div(LSRWALPTotalSupply)
      setTVL(ethers.utils.formatEther(percentageLPInVault))
      setLSRWALPValue(totalValueInLP.div(LSRWALPTotalSupply))
      console.log("1: " + LSRWALPValue)
    }

  }

  function calculateAPRLSRWA() {
    if (price, TVL !== " —") {
      const apr = 54750 * Number(price) / Number(TVL) * 100
      setAPY(apr)
    }
  }

  useEffect(() => {
    calculateTVL()
    calculateAPRLSRWA()
  }, [contractLPLSRWABalance])

  function handlePercents(percent) {
    if (depositing) {
      setInputValue(ethers.utils.formatEther(balance.data.value.mul(percent).div(100).toString()))
    } else {

      setInputValue(ethers.utils.formatEther(userBalance[0].mul(percent).div(100).toString()))
    }
  }

  const depositHandler = async () => {
    let amountLS = inputValue;
    if (!amountLS || Number(amountLS) <= 0) {
      setInputValue("")
      notifyError("Please enter an amount");
      return;
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    if (!isApprovedLandStake) {

    }
    amountLS = ethers.utils.parseEther(amountLS); //convert to wei
    depositLSRWALP(amountLS);
  };

  const withdrawHandler = () => {
    let amountLS = inputValue;
    if (!amountLS || Number(amountLS) <= 0) {
      notifyError("Please enter an amount");
      setInputValue("")
      return;
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    amountLS = ethers.utils.parseEther(amountLS).toString(); //convert to wei
    withdrawLSRWA(amountLS)
  };

  async function updateStatus() {
    if (!isConnected) return

    if (LSRWALPAllowance) {
      const approvedLANDETH = ethers.utils.formatEther(LSRWALPAllowance);

      setIsApprovedLandStake(inputValue > 0 && Number(approvedLANDETH) >= Number(inputValue))
    }

    if (userBalance) {
      SetWithdrawable(
        Number(inputValue) <=
        Number(ethers.utils.formatEther(userBalance ? userBalance[0].toString() : 0))
      );
    }
    if (balance) {
      SetDepositable(
        Number(ethers.utils.formatEther(balance?.data.value.toString())) >=
        Number(inputValue)
      );
    }
  }



  useEffect(async () => {
    updateStatus()
  }, [inputValue, LSRWALPAllowance]);

  const openCalcModal = async () => {
    const tokenPriceData = LSRWALPValue
    let tokenPriceUSD = numeral(
      Number(tokenPriceData)
    ).format("0.[000]");
    props.setTokenUsdPrice(tokenPriceUSD)
    props.setShowModal(true)
    props.setShowModalApy(abbreviateNumber(APY?.toString() ?? 0))
    props.setIsLPVault(false)
    props.setIsRUSD(true);
  }

  const handleNetworkSwitch = async (chainId) => {
    try {
      const connector = connectors.find((c) => c.chains.some((chain) => chain.id === chainId));

      if (connector) {
        if (!isConnected) {
          await connect({ connector });
        } else {
          console.log('Connector already connected, switching network...');
          await connector.switchChain(chainId);
        }
      } else {
        console.error(`Unsupported chain ID: ${chainId}`);
      }
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  return (
    <div className="w-full mlg:max-w-[880px]">
      <div className="w-full">
        <div className="p-[12px] flex flex-col md:p-[24px] w-full rounded-[24px] bg-third">
          {isVaultsLoading ? (
            <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
              <div className="flex justify-center items-center m-auto flex-col w-full">
                <div className="flex flex-col justify-center p-0 gap-[16px] w-full">
                  <div className="flex items-center py-[6px] justify-start h-[100px] gap-[16px]">
                    <div className="w-[100px] h-[100px] shrink-0 rounded-[1000px] md:relative">
                      <Skeleton circle={true} width={100} height={100} />
                    </div>
                    <div className="flex flex-col justify-center items-start p-0 gap-[8px] w-full">
                      <div className={`w-full overflow-hidden text-ellipsis leading-[28px] ${BOLD_INTER_TIGHT.className}`}>
                        <Skeleton height={28} />
                      </div>
                      <div className="w-full">
                        <Skeleton height={26} />
                      </div>
                    </div>

                  </div>
                  <div className="grid grid-cols-2 gap-[12px] md:flex md:items-center md:justify-between p-0">
                    <div className="md:w-1/4 w-full">
                      <Skeleton height={46} />
                    </div>
                    <div className="md:w-1/4 w-full">
                      <Skeleton height={46} />
                    </div>
                    <div className="md:w-1/4 w-full">
                      <Skeleton height={46} />
                    </div>
                    <div className="md:w-1/4 w-full">
                      <Skeleton height={46} />
                    </div>
                  </div>
                </div>
              </div>
            </SkeletonTheme>
          ) : (
            <>
              <div className="flex flex-col justify-center p-0 gap-[16px]">
                <div className="flex flex-row gap-[8px] hidden">
                  <div className="w-[48px] h-[48px] rounded-[1000px] shrink-0">
                    <img src={theme == 'dark' ? UnionDark : Union} alt="token pair" />
                  </div>
                  <div className={`text-[16px] leading-[28px] overflow-hidden text-ellipsis shrink-1 text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                    {props.title}
                  </div>
                  <div className="flex items-center p-0 shrink-0 mr-2">
                    <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] ${BOLD_INTER_TIGHT.className}`}>
                      <img src={book} alt="book" className="book" />
                      <span>Manual</span>
                    </div>
                  </div>
                  <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] ml-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} style={{ marginLeft: "auto" }} onClick={() => setDetails(!details)}>
                    <img src={details ? up : down}></img>
                  </button>

                </div>
                <div className="flex items-center py-[6px] justify-start h-[100px] gap-[16px]" onClick={() => setDetails(!details)}>
                  <div className="w-[100px] h-[100px] shrink-0 rounded-[1000px] md:relative">
                    <img src={theme == 'dark' ? UnionDark : Union} className="border-primary border-[6px]" alt="token pair" />
                    <img src={smallicon} className="border-primary border-[6px]" />
                  </div>
                  <div className="flex flex-col justify-center items-start p-0 gap-[8px]">
                    <div className={`w-full overflow-hidden text-ellipsis leading-[28px] text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                      {props.title}
                      <button className={`hidden md:flex flex-row items-center justify-center gap-[4px] text-[14px] ml-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                        <img src={details ? up : down}></img>
                      </button>
                    </div>
                    <div className="p-0 flex items-center">
                      <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#3b98ee1f] text-[#3B98EE] max-w-[87px] ${BOLD_INTER_TIGHT.className}`}>
                        <img src={book} alt="book" className="book" />
                        <span>Manual</span>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                        <img
                          src={bscIcon}
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="grid grid-cols-2 gap-[12px] md:flex md:items-center md:justify-between p-0">
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">TVL</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{"$" + abbreviateNumber(TVL)}</span>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">APR</span>
                    <div className="calculator-container">
                      <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{abbreviateNumber(APY?.toString() ?? 0) + "%"}</span>
                      <button onClick={() => openCalcModal()}>
                        <img src={calc} alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Deposit</span>
                    <div className="d-flex align-items-center">
                      <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{userBalance ? Number(userBalance[0]) > 0 ? Number(ethers.utils.formatEther(userBalance[0])).toExponential(2) : 0.0 : "0.0"} </span>
                    </div>

                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Rewards</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{rewardsLSRWALP ? abbreviateNumber(ethers.utils.formatEther(rewardsLSRWALP?.toString())) : "0.0"}</span>
                  </div>
                </div>
              </div>

              <div className="block md:hidden">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  TabIndicatorProps={{
                    sx: {
                      bgcolor: "#61CD81",
                      height: "1px"
                    }
                  }}
                  className="deposit-withdraw"
                  aria-label="secondary tabs example"
                  style={{ width: "100%", marginTop: 20 }}
                >
                  <Tab style={{ flex: 1, color: theme == 'dark' ? "#cacaca" : "#0A1339", width: "100%", maxWidth: "1000px" }} value="deposit" label="Deposit" />
                  <Tab style={{ flex: 1, color: theme == 'dark' ? "#cacaca" : "#0A1339", width: "100%", maxWidth: "1000px" }} value="withdraw" label="Withdraw" />
                </Tabs>
                <div className="flex flex-col justify-center items-end pt-[12px] pb-[24px] gap-[12px]">
                  <span className="text-[12px] leading-[20px] tracking-[0.24px] text-[#9d9fa8] dark:text-[#cacaca]">Set Amount</span>
                  <div className="flex flex-col md:flex-row gap-[12px] items-start p-0">
                    <input className="placeholder:text-[#cbcbcb] text-button-text-primary" placeholder="0.00 LSRWA-USDT" type="text"
                      value={inputValue}
                      onChange={(e) =>
                        setInputValue(
                          e.target.value
                            .replace(/[^.\d]/g, "")
                            .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2")
                            .replace(/[^\d.]/g, "")
                            .replace(/(\..*)\./g, "$1")
                            .replace(/^(\d+\.\d{18})\d+$/g, "$1")
                        )
                      } />
                    <div className="flex w-full jsutify-between items-center gap-[8px] mt-[12px]">
                      <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(10)}>10%</button>
                      <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(25)}>25%</button>
                      <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(50)}>50%</button>
                      <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(75)}>75%</button>
                      <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(100)} > 100%</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center p-0 gap-[24px] w-full">
                  <div className="flex gap-[12px] w-full flex-col md:flex-row">
                    {(account == 'Not Connected') ? (
                      <div className="d-flex flex-column align-items-center">
                        <ConnectWallet style={{ width: "300px" }} />
                      </div>
                    ) : (
                      <>
                        <button
                          className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                          onClick={() => {
                            if (chain?.id == 56) {
                              if (inputValue && Number(inputValue) > Number(0)) {
                                depositing ? isApprovedLandStake ? depositHandler() : approveLSRWALP() : withdrawHandler()
                              } else {
                                notifyError('Please enter an amount')
                              }
                            } else {
                              handleNetworkSwitch(56)
                            }
                          }}
                          disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                        >
                          {
                            chain?.id != 56 ? 'Switch to BSC' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                          }
                        </button>

                        {chain?.id == 56 && (
                          <button
                            className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                            onClick={() => withdrawLSRWA(0)}
                            disabled={chain?.id != 56}
                          >
                            Harvest
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] ml-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                    {details ? 'Hide' : 'Show'} Details
                    <img src={details ? up : down} />
                  </button>
                </div>
              </div>

              <div className="w-full">
                <Collapse in={details}>
                  <div className="collapse-desktop">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      textColor="secondary"
                      TabIndicatorProps={{
                        sx: {
                          bgcolor: "#61CD81",
                          height: "1px"
                        }
                      }}
                      className="deposit-withdraw"
                      aria-label="secondary tabs example"
                      style={{ width: "100%", marginTop: 20 }}
                    >
                      <Tab style={{ flex: 1, color: theme == 'dark' ? "#cacaca" : "#0A1339", width: "100%", maxWidth: "1000px" }} value="deposit" label="Deposit" />
                      <Tab style={{ flex: 1, color: theme == 'dark' ? "#cacaca" : "#0A1339", width: "100%", maxWidth: "1000px" }} value="withdraw" label="Withdraw" />
                    </Tabs>
                    <div className="flex flex-col justify-center items-end pt-[12px] pb-[24px] gap-[12px]">
                      <span className="text-[12px] leading-[20px] tracking-[0.24px] text-[#9d9fa8] dark:text-[#cacaca]">Set Amount</span>
                      <div className="flex flex-col md:flex-row gap-[12px] items-start p-0">
                        <input className="placeholder:text-[#cbcbcb] text-button-text-primary" placeholder="0.00 LSRWA-USDT" type="text"
                          value={inputValue}
                          onChange={(e) =>
                            setInputValue(
                              e.target.value
                                .replace(/[^.\d]/g, "")
                                .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2")
                                .replace(/[^\d.]/g, "")
                                .replace(/(\..*)\./g, "$1")
                                .replace(/^(\d+\.\d{18})\d+$/g, "$1")
                            )
                          }

                        />
                        <div className="flex w-full jsutify-between items-center gap-[8px] mt-[12px]">
                          <div className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(10)}>10%</div>
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(25)}>25%</button>
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(50)}>50%</button>
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(75)}>75%</button>
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(100)}>100%</button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-0 gap-[24px] w-full">
                      <div className="flex gap-[12px] w-full flex-col md:flex-row justify-center">
                        {(account == 'Not Connected') ? (
                          <ConnectWallet style={{ width: "300px" }} />
                        ) : (
                          <>
                            <button
                              className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                              onClick={() => {
                                if (chain?.id == 56) {
                                  if (inputValue && Number(inputValue) > Number(0)) {
                                    depositing ? isApprovedLandStake ? depositHandler() : approveLSRWALP() : withdrawHandler()
                                  } else {
                                    notifyError('Please enter an amount')
                                  }
                                } else {
                                  handleNetworkSwitch(56)
                                }
                              }}
                              disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                            >
                              {
                                chain?.id != 56 ? 'Switch to BSC' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                              }
                            </button>

                            {chain?.id == 56 && (
                              <button
                                className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                                onClick={() => withdrawLSRWA(0)}
                                disabled={chain?.id != 56}
                              >
                                Harvest
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start p-0 gap-[8px] w-full rounded-[12px] bg-primary dark:bg-secondary mt-[24px]" style={{ marginTop: "24px" }}>
                    <div className="flex w-full flex-col items-center justify-center p-[16px]">
                      <div className="w-8 h-8 rounded-full bg-third">
                        <a href="https://docs.landshare.io/quickstart-guides/how-to-stake-lsrwa-usdt-lp-tokens" target="_blank" rel="noopener noreferrer"><img className="w-[32px] h-[32px] p-[6px]" src={viewContract} alt="" /></a>
                      </div>
                      <div className="flex flex-col mt-[8px] items-center text-text-primary">
                        <span><a href="https://docs.landshare.io/quickstart-guides/how-to-stake-lsrwa-usdt-lp-tokens" target="_blank" rel="noopener noreferrer">Vault Guide</a></span>
                        <a
                          className="inline"
                          href="https://docs.landshare.io/quickstart-guides/how-to-stake-lsrwa-usdt-lp-tokens" target="_blank" rel="noopener noreferrer"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center p-[16px]">
                      <div className="w-8 h-8 rounded-full bg-third">
                        <a href="https://app.landshare.io/rwa" target="_blank" rel="noopener noreferrer"><img className="w-[32px] h-[32px] p-[6px]" src={theme == 'dark' ? UnionDark : Union} alt="" /></a>
                      </div>
                      <div className="flex flex-col mt-[8px] items-center text-text-primary">
                        <span><a href="https://app.landshare.io/rwa" target="_blank" rel="noopener noreferrer">Get LSRWA Token</a></span>
                        <a
                          className="inline"
                          href="https://app.landshare.io/rwa" target="_blank" rel="noopener noreferrer"
                        >
                          RWA Portal
                        </a>
                      </div>
                    </div>
                  </div>
                </Collapse>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
