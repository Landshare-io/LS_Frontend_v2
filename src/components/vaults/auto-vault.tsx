import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ethers } from "ethers";
import numeral from "numeral";
import axios from "axios"
import { useNetwork } from "wagmi";
import { Collapse } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ReactLoading from "react-loading";
import { useVaultsContext } from "../../contexts/VaultsContext";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useLandshareFunctions } from "../../contexts/LandshareFunctionsProvider";
import { useLandshareV2Context } from "../../contexts/LandshareV2Context";
import useDepositLS from "../../hooks/useDepositLS";
import useWithdrawAll from "../../hooks/useWithdrawAll";
import useWithDrawLS from "../../hooks/useWithDrawLS";
import useApproveLS from "../../hooks/useApproveLS";
import useClaimBountyLS from "../../hooks/useClaimBountyLS";
import abbreviateNumber from "../main/numberAbbreviator";
import Union from "../../assets/img/new/greenlogo.svg";
import UnionDark from "../../assets/img/new/greenlogo.svg";
import rotateBlue from "../../assets/img/new/rotate-blue.svg";
import clockIcon from "../../assets/img/new/clock-timer.svg";
import down from "../../assets/img/icons/Down.svg";
import calc from "../../assets/img/new/calculator.svg";
import viewContract from "../../assets/img/new/view-contract.png";
import up from "../../assets/img/new/arrow-up.svg";
import bscIcon from "../../assets/img/new/bsc.svg";
import polygonIcon from "../../assets/img/new/polygon.svg";
import arbitrumIcon from "../../assets/img/new/arbitrum.svg";
import pcsBunny from "../../assets/img/icons/pancakeswap-cake-logo.svg"
import quickSwap from "../../assets/img/icons/quickswap-logo.svg"
import smallicon from "../../assets/img/new/rotate-black.svg"
import { CCIP_CHAIN_SENDER_ADDRESS } from "../../configs/ccip";
import ccipAxios from "../../helper/ccip-axios";
import ConnectWallet from "../../components/ConnectWallet";
import Timer from "../timer/Timer";
import "./styles.css"
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function StakingVault(props) {
  const { chain } = useNetwork()
  const { theme == 'dark' } = useGlobalContext();
  const {
    startTransaction,
    endTransaction,
    transactionResult
  } = useLandshareFunctions();
  const {
    isVaultsLoading,
    apr,
    apy,
    vaultBalance,
    ccipVaultBalance,
    bountyReward,
    ccipBountyReward,
    ccipStakeAuto
  } = useVaultsContext();
  const { contract: { ccipChainEthSenderContract } } = useLandshareV2Context()
  const {
    balance,
    isConnected,
    landTokenV2Contract,
    account,
    notifySuccess,
    notifyError,
    updateLandTokenV2Balance
  } = useGlobalContext();
  const { depositLS, depositCcip } = useDepositLS({
    startTransaction,
    transactionResult,
  });
  const { withdrawLS, withdrawCcip } = useWithDrawLS({
    startTransaction,
    transactionResult,
  })
  const { approveLS } = useApproveLS({
    startTransaction,
    endTransaction,
    transactionResult,
    updateStatus
  })
  const { withdrawAll, withdrawCcipAll } = useWithdrawAll({
    startTransaction,
    endTransaction,
    transactionResult
  })

  const { claimBountyLS } = useClaimBountyLS({
    startTransaction,
    transactionResult
  })
  const [value, setValue] = useState('deposit');
  const [inputValue, setInputValue] = useState("");
  const [details, setDetails] = useState(false)
  const [depositing, setDepositing] = useState(true)
  const [isWithdrawable, SetWithdrawable] = useState(true);
  const [isDepositable, SetDepositable] = useState(true);
  const [isApprovedLandStake, setIsApprovedLandStake] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);
  const [ccipTransactions, setCcipTransactions] = useState(0);
  const [ccipPendingTransactions, setCcipPendingTransactions] = useState(0);
  const [lastTransactionId, setLastTransactionId] = useState('');
  const [lastTransactionEstimateTime, setLastTransactionEstimateTime] = useState(0)
  const [ccipLoading, setCCIPLoading] = useState(true)


  async function updateCCIP() {
    if (chain?.id != 56 && isConnected) {
      const { data } = await ccipAxios.get(`/ccip-transaction/count/${account}`)
      setCcipTransactions(data.data)
      const { data: pendingData } = await ccipAxios.get(`/ccip-transaction/pending/${account}`)
      const { data: lastTxId } = await ccipAxios.get(`/ccip-transaction/get-last-pending-tx/${account}`)
      setCcipPendingTransactions(pendingData)
      console.log('==========================lastTxId,', lastTxId)
      const coolTimeTime = new Date(lastTxId.createDateTime).getTime() + lastTxId.estimateTime - new Date().getTime()
      setLastTransactionEstimateTime(coolTimeTime)
      setLastTransactionId(lastTxId.messageId)
    }
  }

  useEffect(() => {
    if(!isConnected) {
      setCCIPLoading(false)
      return
    }

    (async () => {
      if (chain?.id != 56 && isConnected) {
        setCCIPLoading(true)
        const { data } = await ccipAxios.get(`/ccip-transaction/count/${account}`)
        setCcipTransactions(data.data)
        const { data: pendingData } = await ccipAxios.get(`/ccip-transaction/pending/${account}`)
        const { data: lastTxId } = await ccipAxios.get(`/ccip-transaction/get-last-pending-tx/${account}`)
        setCcipPendingTransactions(pendingData)
        console.log('==========================lastTxId,', lastTxId)
        const coolTimeTime = new Date(lastTxId.createDateTime).getTime() + lastTxId.estimateTime - new Date().getTime()
        setLastTransactionEstimateTime(coolTimeTime)
        setLastTransactionId(lastTxId.messageId)
        setCCIPLoading(false)
      }
    })()

    const intervalCcipUpdate = setInterval(() => {
      updateCCIP()
    }, 60000);

    return () => clearInterval(intervalCcipUpdate);
  }, [chain, account])

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDepositing(newValue === "deposit" ? true : false)
  };

  function handlePercents(percent) {
    if (depositing) {
      const bal = balance.landTokenV2.mul(percent).div(100)
      setInputValue(ethers.utils.formatEther(bal))
    } else {
      const bal = chain?.id == 56 ? vaultBalance.autoLandV3.mul(percent).div(100) : ccipStakeAuto.mul(percent).div(100)
      setInputValue(ethers.utils.formatEther(bal))
    }
  }

  const depositHandler = async () => {
    try {
      let amountLS = inputValue;
      await updateLandTokenV2Balance();
      if (!amountLS || Number(amountLS) <= 0) {
        setInputValue("")
        notifyError("Please enter an amount");
        return;
      }

      if (chain?.id != 56) {
        const minTransferAmount = await ccipChainEthSenderContract.minTransferAmount()
        amountLS = ethers.utils.parseEther(amountLS); //convert to wei
        if (
          ethers.BigNumber.from(minTransferAmount).gt(
            ethers.BigNumber.from(amountLS)
          )
        ) {
          notifyError(`Minimum transfer amount is ${ethers.utils.formatEther(minTransferAmount.toString())} LAND`);
          return;
        }
      } else {
        amountLS = ethers.utils.parseEther(amountLS); //convert to wei
      }

      // SETTING INPUT VALUE EMPTY
      setInputValue("");
      if (!isApprovedLandStake) {

      }
      setIsDepositing(true)
      if (chain?.id != 56) {
        const allowance = await landTokenV2Contract.allowance(
          account,
          process.env.REACT_APP_IS_CCIP_TESTING == 'true' ? CCIP_CHAIN_SENDER_ADDRESS[chain?.id ?? 11155111] : CCIP_CHAIN_SENDER_ADDRESS[chain?.id]
        )

        if (
          ethers.BigNumber.from(allowance).gte(
            ethers.BigNumber.from(amountLS)
          )
        ) {
          await depositCcip(account, amountLS, chain);
        } else {
          const transaction = await landTokenV2Contract.approve(
            process.env.REACT_APP_IS_CCIP_TESTING == 'true' ? CCIP_CHAIN_SENDER_ADDRESS[chain?.id ?? 11155111] : CCIP_CHAIN_SENDER_ADDRESS[chain?.id],
            amountLS
          )

          const receipt = await transaction.wait()
          if (receipt.status) {
            await depositCcip(account, amountLS, chain);
          }
        }
        const { data } = await ccipAxios.get(`/ccip-transaction/count/${account}`)
        const { data: pendingData } = await ccipAxios.get(`/ccip-transaction/pending/${account}`)

        updateCCIP()
        setIsDepositing(false)
      } else {
        depositLS(amountLS)
        setIsDepositing(false)
      }
    } catch (err) {
      console.log('error', err)
      setIsDepositing(false)
    }
  };

  const withdrawHandler = async () => {
    let amountLS = inputValue;
    if (!amountLS || Number(amountLS) <= 0) {
      notifyError("Please enter an amount");
      setInputValue("")
      return;
    }
    if (chain?.id != 56) {
      const minTransferAmount = await ccipChainEthSenderContract.minTransferAmount()
      amountLS = ethers.utils.parseEther(amountLS); //convert to wei
      if (
        ethers.BigNumber.from(minTransferAmount).gt(
          ethers.BigNumber.from(amountLS)
        )
      ) {
        setInputValue("");
        notifyError(`Minimum transfer amount is ${ethers.utils.formatEther(minTransferAmount.toString())} LAND`);
        return;
      }
    } else {
      amountLS = ethers.utils.parseEther(amountLS); //convert to wei
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    if (inputValue === ethers.utils.formatEther(chain?.id != 56 ? ccipStakeAuto ?? 0 : vaultBalance.autoLandV3)) {
      if (chain?.id != 56) {
        await withdrawCcipAll(account, chain)
        const { data } = await ccipAxios.get(`/ccip-transaction/count/${account}`)
        const { data: pendingData } = await ccipAxios.get(`/ccip-transaction/pending/${account}`)

        updateCCIP()

      } else {
        await withdrawAll()
        updateCCIP()
      }
    } else {
      if (chain?.id != 56) {
        await withdrawCcip(account, amountLS, chain)
        const { data } = await ccipAxios.get(`/ccip-transaction/count/${account}`)
        const { data: pendingData } = await ccipAxios.get(`/ccip-transaction/pending/${account}`)

        updateCCIP()

      } else {
        withdrawLS(amountLS);
      }
    }
  };

  async function updateStatus() {
    try {
      if (!isConnected || !account) return
      if (chain?.id != 56 ? ccipStakeAuto ?? 0 : vaultBalance.autoLandV3) {
        SetWithdrawable(
          Number(inputValue) <=
          Number(ethers.utils.formatEther(chain?.id != 56 ? ccipStakeAuto ?? 0 : vaultBalance.autoLandV3))
        );
      }
      if (balance.landTokenV2) {
        SetDepositable(
          Number(ethers.utils.formatEther(balance.landTokenV2)) >=
          Number(inputValue)
        );
      }

      const approvedLAND = await landTokenV2Contract.allowance(
        account,
        process.env.REACT_APP_AUTOLANDV3
      );
      const approvedLANDETH = ethers.utils.formatEther(approvedLAND);
      setIsApprovedLandStake(inputValue > 0 && Number(approvedLANDETH) >= Number(inputValue));
    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
    updateStatus()
  }, [inputValue]);

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
                      <Skeleton circle={true} width={90} height={90} />
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
              <div className="flex flex-col justify-center p-0 gap-[16px] relative">
                <div className="flex flex-row gap-[8px] hidden">
                  <div className="w-[48px] h-[48px] rounded-[1000px] shrink-0">
                    <img src={theme == 'dark' ? UnionDark : Union} className="border-primary border-[6px]" alt="token pair" />
                    <img src={smallicon} className="border-primary border-[6px]" />
                  </div>
                  <div className={`text-[16px] leading-[28px] overflow-hidden text-ellipsis shrink-1 text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                    {props.title}
                  </div>
                  <div className="flex items-center p-0 shrink-0">
                    <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] mr-2 ${BOLD_INTER_TIGHT.className}`}>
                      <img src={rotateBlue} alt="book" className="rotate" />
                      <span>Auto</span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                      <img
                        src={bscIcon}
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                      <img
                        src={polygonIcon}
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                      <img
                        src={arbitrumIcon}
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                  {((chain?.id != 56) && (ccipTransactions > 0)) && (isConnected) && (
                    <a className="ml-auto mr-0 font-bold text-primary-700" href="/vaults/ccip-transactions">
                      View all CCIP Transactions
                    </a>
                  )}
                  <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] ml-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
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
                      <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#3b98ee1f] text-[#3B98EE] max-w-[87px] mr-2 ${BOLD_INTER_TIGHT.className}`}>
                        <img src={rotateBlue} alt="book" className="rotate" />
                        <span>Auto</span>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                        <img
                          src={bscIcon}
                          className="w-8 h-8"
                        />
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                        <img
                          src={polygonIcon}
                          className="w-8 h-8"
                        />
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                        <img
                          src={arbitrumIcon}
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ccip-transaction md:absolute md:top-[20px] md:right-[10px]">
                  {(chain?.id != 56) && (isConnected) && (
                    ccipLoading ?

                      <div className="flex items-center justify-center mb-2 flex-row">
                        <ReactLoading type="cylon" color="#61CD81" height="24px" width="24px"></ReactLoading>

                      </div>
                      :
                      ccipPendingTransactions > 0 ? (
                        <div className="flex items-center justify-center mb-2">
                          <div className="hidden sm:flex flex-col bg-gray-200 rounded-full items-center justify-center mr-3 w-10 h-10 text-[0.5rem] font-bold">
                            <img src={clockIcon} alt="Clock" className="h-3 w-3 mb-[0.1rem]" />
                            <Timer countTime={lastTransactionEstimateTime} />
                          </div>
                          <div className="flex flex-col">
                            <div className="hidden sm:block">
                              <div className="font-bold text-text-primary text-sm">
                                Crosschain Transaction Pending
                              </div>

                              <a className="font-bold text-[#3B98EE] text-sm" href={`https://ccip.chain.link/msg/${lastTransactionId}`}>
                                View on CCIP Explorer &rarr;
                              </a>
                            </div>
                            <div className="sm:hidden">
                              <a className="font-bold text-[#3B98EE] text-sm" href={`https://ccip.chain.link/msg/${lastTransactionId}`}>
                                Crosschain Transaction Pending &rarr;
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>   {isConnected && (
                          <div className="flex justify-center mb-2">
                            <a className="font-bold text-[#61CD81]" href="/vaults/ccip-transactions">
                              View All CCIP Transactions &rarr;
                            </a>
                          </div>
                        )}
                        </>
                     

                      )
                  )}
                </div>

                <div className="grid grid-cols-2 gap-[12px] md:flex md:items-center md:justify-between p-0">
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">TVL</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{abbreviateNumber(ethers.utils.formatEther(vaultBalance?.total?.toString() ?? 0))}</span>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">APY</span>
                    <div className="calculator-container">
                      <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{abbreviateNumber(apy?.toString() ?? 0) + "%"}</span>
                      <button onClick={() => openCalcModal()}>
                        <img src={calc} alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Deposit</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{chain?.id == 56 ? abbreviateNumber(ethers.utils.formatEther(vaultBalance.autoLandV3.toString())) : abbreviateNumber(ethers.utils.formatEther((ccipVaultBalance?.autoLandV3 ?? 0).toString()))}</span>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Rewards</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                      {chain?.id != 56 ? ccipVaultBalance?.autoReward ?? 0 : vaultBalance?.autoReward ?? 0}</span>
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
                    <input className="placeholder:text-[#cbcbcb] text-button-text-primary" placeholder="0.00 LAND" type="text"
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

                    {(account != 'Not Connected') ? (
                      <>
                        <button
                          className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                          onClick={() => {
                            if (inputValue && Number(inputValue) > Number(0)) {
                              if (chain?.id == 56) {
                                depositing ? isApprovedLandStake ? depositHandler() : approveLS() : withdrawHandler()
                              } else {
                                depositing ? depositHandler() : withdrawHandler()
                              }
                            } else {
                              notifyError('Please enter an amount')
                            }
                          }}
                          disabled={(account == 'Not Connected') || depositing && !isDepositable || !depositing && !isWithdrawable}
                        >
                          {
                            inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : (
                              (chain?.id === 56 || chain?.id === 97) ? "Withdraw" : "Withdraw"
                            )) : "Enter Amount"
                          }
                        </button>
                        <button
                          className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`} onClick={() => withdrawLS2(0)}
                          disabled={account == 'Not Connected'}
                        >
                          Harvest
                        </button>
                      </>

                    ) : (
                      <div className="d-flex flex-column align-items-center">
                        <ConnectWallet style={{ width: "300px" }} />
                      </div>

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
                        <input className="placeholder:text-[#cbcbcb] text-button-text-primary" placeholder="0.00 LAND" type="text"
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
                        {(account == 'Not Connected') ?
                          (
                            <ConnectWallet style={{ width: "300px" }} />
                          ) : (
                            <>
                              <button
                                className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className} ${isDepositing ? 'flex justify-center items-center' : ''}`}
                                onClick={() => {
                                  if (inputValue && Number(inputValue) > Number(0)) {
                                    if (chain?.id == 56) {
                                      depositing ? isApprovedLandStake ? depositHandler() : approveLS() : withdrawHandler()
                                    } else {
                                      depositing ? depositHandler() : withdrawHandler()
                                    }
                                  } else {
                                    notifyError('Please enter an amount')
                                  }
                                }}
                                style={{ width: "100%", maxWidth: "1000px" }}
                                disabled={(account == 'Not Connected') || depositing && !isDepositable || !depositing && !isWithdrawable || isDepositing}
                              >
                                {
                                  // (account == 'Not Connected') ?
                                  //   "Connect Wallet" :
                                  isDepositing ? (
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
                                  ) : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : (
                                    (chain?.id === 56 || chain?.id === 97) ? "Withdraw" : "Withdraw"
                                  )) : "Enter Amount"}

                              </button>
                              <button
                                className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                                onClick={() => claimBountyLS()}
                                disabled={account == 'Not Connected'}
                              >
                                {`Claim Bounty (${chain.id == 56 ? (ethers.utils.formatEther(bountyReward).substr(0, 6)) : (ethers.utils.formatEther(ccipBountyReward).substr(0, 6))} LAND)`}
                              </button>
                            </>
                          )
                        }

                      </div>
                    </div>
                  </div>
                  <div className="flex items-start p-0 gap-[8px] w-full rounded-[12px] bg-primary dark:bg-secondary mt-[24px]" style={{ marginTop: "24px" }}>
                    <div className="flex w-full flex-col items-center justify-center p-[16px]">
                      <div className="w-8 h-8 rounded-full bg-third">
                        <a href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens"><img className="sub-container-image" src={viewContract} alt="" /></a>
                      </div>
                      <div className="flex flex-col mt-[8px] items-center text-text-primary">
                        <span><a href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens">Vault Guide</a></span>
                        <a
                          className="inline"
                          href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center p-[16px]">
                      {chain?.id == 137 ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-third">
                            <a href="https://quickswap.exchange/#/swap?currency0=ETH&currency1=0xC03E6ad83dE7C58c9166fF08D66B960d78e64105&swapIndex=0"><img className="w-[32px] h-[32px]" src={quickSwap} alt="" /></a>
                          </div>
                          <div className="flex flex-col mt-[8px] items-center text-text-primary">
                            <span><a href="https://quickswap.exchange/#/swap?currency0=ETH&currency1=0xC03E6ad83dE7C58c9166fF08D66B960d78e64105&swapIndex=0">Buy on Quickswap</a></span>
                            <a
                              className="inline"
                              href="https://quickswap.exchange/#/swap?currency0=ETH&currency1=0xC03E6ad83dE7C58c9166fF08D66B960d78e64105&swapIndex=0"
                            >
                              Quickswap
                            </a>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-third">
                            <a href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"><img className="w-[32px] h-[32px] p-[6px]" src={pcsBunny} alt="" /></a>
                          </div>
                          <div className="flex flex-col mt-[8px] items-center text-text-primary">
                            <span><a href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C">Get LAND Token</a></span>
                            <a
                              className="inline"
                              href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"
                            >
                              Pancakeswap
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Collapse>
              </div>
            </>
          )}
        </div>
      </div>
    </div >
  )
}
