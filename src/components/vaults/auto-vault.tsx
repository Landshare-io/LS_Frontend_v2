import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { BigNumberish, formatEther, parseEther } from "ethers";
import { useChainId, useAccount } from "wagmi";
import ReactLoading from "react-loading";
import { bsc } from "viem/chains";
import Collapse from "../common/collapse";
import { useGlobalContext } from "../../context/GlobalContext";
import { abbreviateNumber } from "../../utils/helpers/convert-numbers";
import ConnectWallet from "../connect-wallet";
import Timer from "../common/timer";
import { 
  MAJOR_WORK_CHAIN,
  BOLD_INTER_TIGHT, 
  AUTO_VAULT_V3_CONTRACT_ADDRESS 
} from "../../config/constants/environments";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import useBalanceOfLpTokenV2 from "../../hooks/contract/LpTokenV2Contract/useBalanceOf";
import useAutoLandV3 from "../../hooks/contract/AutoVaultV2Contract/useAutoLandV3";
import useCcipVaultBalance from "../../hooks/contract/CrossChainVault/useCcipVaultBalance";
import useCalculateHarvestCakeRewards from "../../hooks/contract/CrossChainVault/useCalculateHarvestCakeRewards";
import useCalculateHarvestCakeRewardsOfAutoVault from "../../hooks/contract/AutoVaultV2Contract/useCalculateHarvestCakeRewards";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useAutoVault from "../../hooks/contract/vault/useAutoVault";
import useMinTransferAmount from "../../hooks/contract/CcipChainSenderContract/useMinTransferAmount";
import useAllowanceOfLandToken from "../../hooks/contract/LandTokenContract/useAllowance";
import useGetApr from "../../hooks/get-apy/useGetApr";
import useGetApy from "../../hooks/get-apy/useGetApy";
import { 
  getTransactions,
  selectIsLoading,
  selectCoolDownTime,
  selectCcipTransactionCounts, 
  selectCcipPendingTransactions, 
  selectLastPendingCcipTransaction 
} from '../../lib/slices/contract-slices/APIConsumerCcipTransactions';
import Union from "../../../public/green-logo.svg";
import UnionDark from "../../../public/green-logo.svg";
import rotateBlue from "../../../public/icons/rotate-blue.svg";
import clockIcon from "../../../public/icons/clock-timer.svg";
import down from "../../../public/icons/down.svg";
import calc from "../../../public/icons/calculator.svg";
import viewContract from "../../../public/icons/view-contract.png";
import up from "../../../public/icons/arrow-up.svg";
import bscIcon from "../../../public/icons/bsc.svg";
import polygonIcon from "../../../public/icons/polygon.svg";
import arbitrumIcon from "../../../public/icons/arbitrum.svg";
import pcsBunny from "../../../public/icons/pancakeswap-cake-logo.svg"
import quickSwap from "../../../public/icons/quickswap-logo.svg"
import smallicon from "../../../public/icons/rotate-black.svg"

interface AutoVaultProps {
  title: string
  setShowModal: Function
  setShowModalApy: Function
  setIsLPVault: Function
  setIsRUSD: Function
  setTokenUsdPrice: Function
}

export default function AutoVault({
  title,
  setShowModal,
  setShowModalApy,
  setIsLPVault,
  setIsRUSD,
  setTokenUsdPrice
}: AutoVaultProps) {
  const chainId = useChainId();
  const { isConnected, address } = useAccount();
  const { theme, notifyError } = useGlobalContext();
  const dispatch = useAppDispatch();

  const { data: lpTokenV2Balance } = useBalanceOfLpTokenV2({ chainId, address }) as { data: BigNumberish }
  const vaultBalance = useAutoLandV3(chainId, address) as {
    total: BigNumberish;
    totalSharesV3: BigNumberish;
    autoLandV3: BigNumberish;
    autoReward: BigNumberish;
  }
  const minTransferAmount = useMinTransferAmount(chainId) as BigNumberish
  const autoLandAllowance = useAllowanceOfLandToken(chainId, address, AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id]) as BigNumberish

  const ccipTransactions = useAppSelector(selectCcipTransactionCounts)
  const ccipPendingTransactions = useAppSelector(selectCcipPendingTransactions)
  const lastTransactionId = useAppSelector(selectLastPendingCcipTransaction)
  const lastTransactionEstimateTime = useAppSelector(selectCoolDownTime)
  const ccipLoading = useAppSelector(selectIsLoading)
  const apr = useGetApr(chainId)
  const apy = useGetApy(chainId)
  const ccipVaultBalance = useCcipVaultBalance(chainId, address) as {
    total: BigNumberish;
    totalSharesV3: BigNumberish;
    autoLandV3: BigNumberish;
    autoReward: BigNumberish;
  }
  const { refetch: updateLandTokenV2Balance } = useBalanceOfLandToken({ chainId, address })
  const { data: ccipBountyReward } = useCalculateHarvestCakeRewards(chainId) as { data: BigNumberish }
  const { data: bountyReward } = useCalculateHarvestCakeRewardsOfAutoVault(chainId) as { data: BigNumberish }
  const {
    depositVault,
    withdrawVault,
    clainBounty,
    approveVault
  } = useAutoVault(chainId, address)

  const isVaultsLoading = false // need to update

  const [inputValue, setInputValue] = useState("");
  const [details, setDetails] = useState(false)
  const [depositing, setDepositing] = useState(true)
  const [isWithdrawable, SetWithdrawable] = useState(true);
  const [isDepositable, SetDepositable] = useState(true);
  const [isApprovedLandStake, setIsApprovedLandStake] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);

  useEffect(() => {
    (async () => {
      dispatch(getTransactions(address))
    })()

    const intervalCcipUpdate = setInterval(() => {
      dispatch(getTransactions(address))
    }, 60000);

    return () => clearInterval(intervalCcipUpdate);
  }, [chainId, address])


  function handlePercents(percent: number) {
    if (depositing) {
      const bal = BigInt(lpTokenV2Balance) * BigInt(percent) / BigInt(100)
      setInputValue(formatEther(bal))
    } else {
      const bal = chainId == MAJOR_WORK_CHAIN.id ? BigInt(vaultBalance.autoLandV3) * BigInt(percent) / BigInt(100) : BigInt(ccipVaultBalance.autoLandV3) * BigInt(percent) / BigInt(100)
      setInputValue(formatEther(bal))
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

      amountLS = parseEther(amountLS).toString(); //convert to wei
      if (chainId != MAJOR_WORK_CHAIN.id) {
        if (BigInt(minTransferAmount) > BigInt(amountLS)) {
          notifyError(`Minimum transfer amount is ${formatEther(minTransferAmount.toString())} LAND`);
          return;
        }
      }

      // SETTING INPUT VALUE EMPTY
      setInputValue("");
      
      setIsDepositing(true)
      await depositVault(amountLS)
      setIsDepositing(false)
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
    amountLS = parseEther(amountLS).toString(); //convert to wei
    if (chainId != MAJOR_WORK_CHAIN.id) {
      if (BigInt(minTransferAmount) > BigInt(amountLS)) {
        setInputValue("");
        notifyError(`Minimum transfer amount is ${formatEther(minTransferAmount.toString())} LAND`);
        return;
      }
    }

    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    withdrawVault(amountLS)
  };

  async function updateStatus() {
    try {
      if (!isConnected || typeof address == 'undefined') return
      if (chainId != MAJOR_WORK_CHAIN.id ? ccipVaultBalance.autoLandV3 ?? 0 : vaultBalance.autoLandV3) {
        SetWithdrawable(
          Number(inputValue) <=
          Number(formatEther(chainId != MAJOR_WORK_CHAIN.id ? ccipVaultBalance.autoLandV3 ?? 0 : vaultBalance.autoLandV3))
        );
      }
      if (lpTokenV2Balance) {
        SetDepositable(
          Number(formatEther(lpTokenV2Balance)) >=
          Number(inputValue)
        );
      }

      const approvedLANDETH = formatEther(autoLandAllowance);
      setIsApprovedLandStake(Number(inputValue) > 0 && Number(approvedLANDETH) >= Number(inputValue));
    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
    updateStatus()
  }, [inputValue]);

  const openCalcModal = async () => {
    setShowModal(true)
    setShowModalApy(apr.toString().substr(0, 4))
    setIsLPVault(false)
    setIsRUSD(false)
  }

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
                    <Image src={theme == 'dark' ? UnionDark : Union} className="border-primary border-[6px]" alt="token pair" />
                    <Image src={smallicon} className="border-primary border-[6px]" alt="" />
                  </div>
                  <div className={`text-[16px] leading-[28px] overflow-hidden text-ellipsis shrink-1 text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                    {title}
                  </div>
                  <div className="flex items-center p-0 shrink-0">
                    <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] mr-2 ${BOLD_INTER_TIGHT.className}`}>
                      <Image src={rotateBlue} alt="book" className="rotate" />
                      <span>Auto</span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                      <Image src={bscIcon} className="w-8 h-8" alt="" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                      <Image src={polygonIcon} className="w-8 h-8" alt="" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                      <Image src={arbitrumIcon} className="w-8 h-8" alt="" />
                    </div>
                  </div>
                  {((chainId != MAJOR_WORK_CHAIN.id) && (ccipTransactions > 0)) && (isConnected) && (
                    <a className="ml-auto mr-0 font-bold text-primary-700" href="/vaults/ccip-transactions">
                      View all CCIP Transactions
                    </a>
                  )}
                  <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] ml-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                    <Image src={details ? up : down}  alt="" />
                  </button>
                </div>
                <div className="flex items-center py-[6px] justify-start h-[100px] gap-[16px]" onClick={() => setDetails(!details)}>
                  <div className="w-[100px] h-[100px] shrink-0 rounded-[1000px] md:relative">
                    <Image src={theme == 'dark' ? UnionDark : Union} className="border-primary border-[6px]" alt="token pair" />
                    <Image src={smallicon} className="border-primary border-[6px]" alt="" />
                  </div>
                  <div className="flex flex-col justify-center items-start p-0 gap-[8px]">
                    <div className={`w-full overflow-hidden text-ellipsis leading-[28px] text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                      {title}
                      <button className={`hidden md:flex flex-row items-center justify-center gap-[4px] text-[14px] ml-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                        <Image src={details ? up : down} alt="" />
                      </button>
                    </div>
                    <div className="p-0 flex items-center">
                      <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#3b98ee1f] text-[#3B98EE] max-w-[87px] mr-2 ${BOLD_INTER_TIGHT.className}`}>
                        <Image src={rotateBlue} alt="book" className="rotate" />
                        <span>Auto</span>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                        <Image src={bscIcon} className="w-8 h-8" alt="" />
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                        <Image src={polygonIcon} className="w-8 h-8" alt="" />
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                        <Image src={arbitrumIcon} className="w-8 h-8" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ccip-transaction md:absolute md:top-[20px] md:right-[10px]">
                  {(chainId != MAJOR_WORK_CHAIN.id) && (isConnected) && (
                    ccipLoading ?

                      <div className="flex items-center justify-center mb-2 flex-row">
                        <ReactLoading type="cylon" color="#61CD81" height="24px" width="24px"></ReactLoading>

                      </div>
                      :
                      ccipPendingTransactions > 0 ? (
                        <div className="flex items-center justify-center mb-2">
                          <div className="hidden sm:flex flex-col bg-gray-200 rounded-full items-center justify-center mr-3 w-10 h-10 text-[0.5rem] font-bold">
                            <Image src={clockIcon} alt="Clock" className="h-3 w-3 mb-[0.1rem]" />
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
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{abbreviateNumber(Number(formatEther(vaultBalance?.total?.toString() ?? 0)))}</span>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">APY</span>
                    <div className="calculator-container">
                      <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{abbreviateNumber(Number(apy?.toString() ?? 0)) + "%"}</span>
                      <button onClick={() => openCalcModal()}>
                        <Image src={calc} alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Deposit</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{chainId == MAJOR_WORK_CHAIN.id ? abbreviateNumber(Number(formatEther(vaultBalance.autoLandV3.toString()))) : abbreviateNumber(Number(formatEther((ccipVaultBalance?.autoLandV3 ?? 0).toString())))}</span>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px]">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Rewards</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                      {chainId != MAJOR_WORK_CHAIN.id ? ccipVaultBalance?.autoReward ?? 0 : vaultBalance?.autoReward ?? 0}</span>
                  </div>
                </div>
              </div>

              <div className="block md:hidden">
                <div className="bg-[#61CD81] h-[1px] w-full mt-[20px]">
                  <div 
                    className="w-full font-medium text-[14px] leading-[22px] tracking-[0.02em] normal-case border border-[#E6E7EB] text-[#0A1339] dark:text-[#cacaca]"
                    onClick={() => setDepositing(true)}
                  >
                    Deposit
                  </div>
                  <div 
                    className="w-full font-medium text-[14px] leading-[22px] tracking-[0.02em] normal-case border border-[#E6E7EB] text-[#0A1339] dark:text-[#cacaca]"
                    onClick={() => setDepositing(false)}
                  >
                    Withdraw
                  </div>
                </div>
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

                    {(typeof address !== 'undefined') ? (
                      <>
                        <button
                          className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                          onClick={() => {
                            if (inputValue && Number(inputValue) > Number(0)) {
                              if (chainId == MAJOR_WORK_CHAIN.id) {
                                depositing ? isApprovedLandStake ? depositHandler() : approveVault() : withdrawHandler()
                              } else {
                                depositing ? depositHandler() : withdrawHandler()
                              }
                            } else {
                              notifyError('Please enter an amount')
                            }
                          }}
                          disabled={(typeof address == 'undefined') || depositing && !isDepositable || !depositing && !isWithdrawable}
                        >
                          {
                            inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : (
                              (chainId === MAJOR_WORK_CHAIN.id || chainId === 97) ? "Withdraw" : "Withdraw"
                            )) : "Enter Amount"
                          }
                        </button>
                        <button
                          className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`} onClick={() => withdrawVault(0)}
                          disabled={typeof address == 'undefined'}
                        >
                          Harvest
                        </button>
                      </>

                    ) : (
                      <div className="d-flex flex-column align-items-center">
                        <ConnectWallet containerClassName="w-[300px]" />
                      </div>

                    )}
                  </div>
                  <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] ml-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                    {details ? 'Hide' : 'Show'} Details
                    <Image src={details ? up : down} alt="" />
                  </button>
                </div>
              </div>
              <div className="w-full">
                <Collapse isOpen={details}>
                  <div className="collapse-desktop">
                    <div className="bg-[#61CD81] h-[1px] w-full mt-[20px]">
                      <div 
                        className="w-full font-medium text-[14px] leading-[22px] tracking-[0.02em] normal-case border border-[#E6E7EB] text-[#0A1339] dark:text-[#cacaca]"
                        onClick={() => setDepositing(true)}
                      >
                        Deposit
                      </div>
                      <div 
                        className="w-full font-medium text-[14px] leading-[22px] tracking-[0.02em] normal-case border border-[#E6E7EB] text-[#0A1339] dark:text-[#cacaca]"
                        onClick={() => setDepositing(false)}
                      >
                        Withdraw
                      </div>
                    </div>
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
                        {(typeof address == 'undefined') ?
                          (
                            <ConnectWallet containerClassName="w-[300px]" />
                          ) : (
                            <>
                              <button
                                className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className} ${isDepositing ? 'flex justify-center items-center' : ''}`}
                                onClick={() => {
                                  if (inputValue && Number(inputValue) > Number(0)) {
                                    if (chainId == MAJOR_WORK_CHAIN.id) {
                                      depositing ? isApprovedLandStake ? depositHandler() : approveVault() : withdrawHandler()
                                    } else {
                                      depositing ? depositHandler() : withdrawHandler()
                                    }
                                  } else {
                                    notifyError('Please enter an amount')
                                  }
                                }}
                                style={{ width: "100%", maxWidth: "1000px" }}
                                disabled={(typeof address == 'undefined') || depositing && !isDepositable || !depositing && !isWithdrawable || isDepositing}
                              >
                                {
                                  // (typeof address == 'undefined') ?
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
                                    (chainId === MAJOR_WORK_CHAIN.id || chainId === 97) ? "Withdraw" : "Withdraw"
                                  )) : "Enter Amount"}

                              </button>
                              <button
                                className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                                onClick={() => clainBounty()}
                                disabled={typeof address == 'undefined'}
                              >
                                {`Claim Bounty (${chainId == MAJOR_WORK_CHAIN.id ? (formatEther(bountyReward).substr(0, 6)) : (formatEther(ccipBountyReward).substr(0, 6))} LAND)`}
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
                        <a href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens"><Image className="sub-container-image" src={viewContract} alt="" /></a>
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
                      {chainId == 137 ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-third">
                            <a href="https://quickswap.exchange/#/swap?currency0=ETH&currency1=0xC03E6ad83dE7C58c9166fF08D66B960d78e64105&swapIndex=0"><Image className="w-[32px] h-[32px]" src={quickSwap} alt="" /></a>
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
                            <a href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"><Image className="w-[32px] h-[32px] p-[6px]" src={pcsBunny} alt="" /></a>
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
