import { useState, useEffect } from "react";
import { formatEther, parseEther, BigNumberish } from "ethers";
import { useChainId, useAccount, useSwitchChain } from "wagmi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { bsc } from "viem/chains";
import Image from "next/image";
import Collapse from "../common/collapse";
import ConnectWallet from "../connect-wallet";
import { useGlobalContext } from "../../context/GlobalContext";
import { abbreviateNumber } from "../../utils/helpers/convert-numbers";
import useVaultBalanceManual from "../../hooks/contract/vault/useVaultBalanceManual";
import useTotalStaked from "../../hooks/contract/MasterchefContract/useTotalStaked";
import useUserInfo from "../../hooks/contract/MasterchefContract/useUserInfo";
import usePendingLand from "../../hooks/contract/MasterchefContract/usePendingLand";
import useGetApr from "../../hooks/get-apy/useGetApr";
import useBalanceOf from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useAllowanceOfLandTokenContract from "../../hooks/contract/LandTokenContract/useAllowance";
import { BOLD_INTER_TIGHT, MASTERCHEF_CONTRACT_ADDRESS, MAJOR_WORK_CHAIN } from "../../config/constants/environments";
import Union from "../../../public/green-logo.svg";
import UnionDark from "../../../public/green-logo.svg";
import book from "../../../public/icons/book.svg";
import down from "../../../public/icons/down.svg";
import up from "../../../public/icons/arrow-up.svg";
import calc from "../../../public/icons/calculator.svg";
import viewContract from "../../../public/icons/view-contract.png";
import pcsBunny from "../../../public/icons/pancakeswap-cake-logo.svg"
import bscIcon from "../../../public/icons/bsc.svg"
import 'react-loading-skeleton/dist/skeleton.css';

interface ManualVaultProps {
  title: string
  setShowModal: Function
  setIsLPVault: Function
  setIsRUSD: Function
  setTokenUsdPrice: Function
}

export default function ManualVault({
  title,
  setShowModal,
  setIsLPVault,
  setIsRUSD,
  setTokenUsdPrice
}: ManualVaultProps) {
  const { 
    theme, 
    notifyError,
    setScreenLoadingStatus
  } = useGlobalContext();
  const chainId = useChainId()
  const { isConnected, address } = useAccount();
  const { switchChain } = useSwitchChain()
  
  const { data: totalStaked, isLoading: totalStakedLoading } = useTotalStaked(chainId) as { data: BigNumberish, isLoading: boolean }
  const { data: userInfo, isLoading: userInfoLoading } = useUserInfo({ chainId, userInfoId: 0, address }) as { data: [BigNumberish, BigNumberish], isLoading: boolean }
  const { data: pendingLand, isLoading: pendingLandLoading } = usePendingLand({ chainId, pendingLandId: 0, address }) as { data: BigNumberish, isLoading: boolean }
  const apr = useGetApr(chainId) as number
  const { data: landBalance } = useBalanceOf({ chainId, address }) as { data: BigNumberish }
  const { data: landAllowance } = useAllowanceOfLandTokenContract(chainId, address, MASTERCHEF_CONTRACT_ADDRESS[chainId]) as { data: BigNumberish }

  const { 
    depositVault,
    withdrawVault,
    approveVault
  } = useVaultBalanceManual(chainId, address, updateStatus)

  const [inputValue, setInputValue] = useState("");
  const [details, setDetails] = useState(false)
  const [depositing, setDepositing] = useState(true)
  const [isWithdrawable, setIsWithdrawable] = useState(true);
  const [isDepositable, setIsDepositable] = useState(true);
  const [isApprovedLandStake, setIsApprovedLandStake] = useState(true);
  const isVaultsLoading = false // totalStakedLoading || userInfoLoading || pendingLandLoading

  function handlePercents(percent: number) {
    if (landBalance == 0) {
      notifyError("You don't have enough balance to perform this action.")
    } else {
      if (depositing) {
        const bal = BigInt(landBalance) * BigInt(percent) / BigInt(100)
        setInputValue(formatEther(bal))
      } else {
        const bal = BigInt(userInfo[0]) * BigInt(percent) / BigInt(100)
        setInputValue(formatEther(bal))
      }
    }
  }

  const depositHandler = async () => {
    let amountLS = inputValue;
    if (!amountLS || Number(amountLS) <= 0) {
      window.alert("Please enter an amount");
      setInputValue("")
      return;
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    if (!isApprovedLandStake) {
      return
    }
    amountLS = parseEther(amountLS).toString(); //convert to wei

    depositVault(amountLS);
  };

  async function updateStatus() {  
    try {
      if (!isConnected) return;
      if (userInfo[0]) {
        setIsWithdrawable(
          Number(inputValue) <=
          Number(formatEther(userInfo[0]))
        );
      }
      if (landBalance) {
        setIsDepositable(
          Number(formatEther(landBalance)) >=
          Number(inputValue)
        );
      }

      const approvedLANDETH = formatEther(landAllowance);

      setIsApprovedLandStake(Number(inputValue) > 0 && Number(approvedLANDETH) >= Number(inputValue));
    } catch (err) { }
  }

  const withdrawHandler = () => {
    let amountLS = inputValue;
    if (!amountLS || Number(amountLS) <= 0) {
      window.alert("Please enter an amount");
      setInputValue("")
      return;
    }

    if (Number(userInfo[0]) == 0) {
      notifyError("No Rewards Found")
      return
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    amountLS = parseEther(amountLS).toString(); //convert to wei
    withdrawVault(amountLS);
  };

  useEffect(() => {
    updateStatus()
  }, [inputValue]);

  useEffect(() => {
    const approvedLANDETH = formatEther(landAllowance);
    setIsApprovedLandStake(Number(inputValue) > 0 && Number(approvedLANDETH) >= Number(inputValue));
  }, [landAllowance])

  const openCalcModal = async () => {
    setShowModal(true)
    setIsLPVault(false)
    setIsRUSD(false)
  }

  return (
    <div className="w-full max-w-[880px] m-auto">
      <div className="w-full">
        <div className={`p-[12px] md:p-[24px] flex flex-col w-full rounded-[24px] bg-third`}>
          {isVaultsLoading ? (
            <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
              <div className="flex justify-center items-center m-auto flex-col w-full">
                <div className="flex flex-col justify-start p-0 gap-[16px] w-full">
                  <div className="flex items-center py-[6px] justify-start h-[100px] gap-[16px]">
                    <div className="w-full h-[100px] rounded-[1000px] relative">
                      <Skeleton circle={true} width={90} height={90} />
                    </div>
                    <div className="flex flex-col justify-center items-start p-0 gap-[8px] w-full">
                      <div className={`text-[18px] overflow-hidden text-ellipsis leading-[28px] w-full ${BOLD_INTER_TIGHT.className}`}>
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
              <div className="flex flex-col justify-start p-0 gap-[16px]">
                <div className="flex gap-[8px] hidden">
                  <div className="w-[48px] h-[48px] rounded-[1000px] shrink-0">
                    <Image src={theme == 'dark' ? UnionDark : Union} alt="token pair" />
                  </div>
                  <div className={`leading-[28px] text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                    {title}
                  </div>
                  <div className="flex items-center p-0 shrink-0">
                    <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] ${BOLD_INTER_TIGHT.className}`}>
                      <Image src={book} alt="book" className="book" />
                      <span>Manual</span>
                    </div>
                  </div>
                  <button className={`flex ml-auto items-center justify-center gap-[4px] text-[14px] leading-[22px] tracking-[0.28px] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                    <Image src={details ? up : down} className="w-[20px] h-[20px]" alt="details" />
                  </button>
                </div>
                <div className="flex items-center py-[6px] justify-start h-[100px] gap-[16px]" onClick={() => setDetails(!details)}>
                  <div className="w-[90px] h-[90px] rounded-[1000px] relative border-primary border-[6px] rounded-[1000px]">
                    <Image src={theme == 'dark' ? UnionDark : Union} alt="token pair" />
                  </div>
                  <div className="flex flex-col justify-center items-start p-0 gap-[8px]">
                    <div className={`text-[18px] overflow-hidden text-ellipsis leading-[28px] text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                      {title}
                      <button className={`hidden md:flex items-center justify-center gap-[4px] text-[14px] leading-[22px] tracking-[0.28px] text-[#61CD81] shrink-0 mt-2 hidden md:block ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                        <Image src={details ? up : down} alt="detail" />
                      </button>
                    </div>
                    <div className="flex items-center p-0">
                      <div className={`flex items-center justify-center py-[3px] px-[12px] text-[12px] gap-[4px] rounded-[1000px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] mr-2 ${BOLD_INTER_TIGHT.className}`}>
                        <Image src={book} alt="book" className="book mr-2" />
                        <span>Manual</span>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-primary transition-colors duration-200 mr-2">
                        <Image src={bscIcon} className="w-8 h-8" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-[12px] md:flex md:items-center md:justify-between p-0">
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">TVL</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{
                      abbreviateNumber(Number(formatEther(totalStaked)))}</span>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">APR</span>
                    <div className={`flex items-center p-0 gap-[4px] text-[14px] leading-[22px] tracking-[0.02em] text-[#0A0A0A] ${BOLD_INTER_TIGHT.className}`}>
                      <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{apr.toString().substr(0, 4) + "%"}</span>
                      <button onClick={() => openCalcModal()}>
                        <Image src={calc} alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Deposit</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>{abbreviateNumber(Number(formatEther(userInfo[0])))}</span>
                  </div>
                  <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                    <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Rewards</span>
                    <span className={`text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                      {formatEther(pendingLand || 0).substr(0, 5)}
                    </span>
                  </div>
                </div>
                <div className="block md:hidden">
                  <div className="flex w-full mt-[20px]">
                    <div 
                      className={`w-full font-medium text-[14px] leading-[22px] tracking-[0.02em] text-[14px] leading-[22px] py-[12px] px-[16px] text-center normal-case border-b-[1px] border-[#E6E7EB] text-[#0A1339] dark:text-[#cacaca] cursor-pointer ${depositing ? 'text-[#61CD81] !border-[#61CD81]' : ''}`}
                      onClick={() => setDepositing(true)}
                    >
                      Deposit
                    </div>
                    <div 
                      className={`w-full font-medium text-[14px] leading-[22px] tracking-[0.02em] text-[14px] leading-[22px] py-[12px] px-[16px] text-center normal-case border-b-[1px] border-[#E6E7EB] text-[#0A1339] dark:text-[#cacaca] cursor-pointer ${!depositing ? 'text-[#61CD81] !border-[#61CD81]' : ''}`}
                      onClick={() => setDepositing(false)}
                    >
                      Withdraw
                    </div>
                  </div>
                  <div className="flex flex-col justify-center pt-[12px] pb-[24px]">
                    <span className="text-[12px] leading-[20px] tracking-[0.24px] text-[#9d9fa8] dark:text-[#cacaca]">Set Amount</span>
                    <div className="flex flex-col md:flex-row gap-[12px] items-start p-0">
                      <input className="w-full bg-vault-input rounded-[12px] text-[14px] font-medium outline-0 tracking-[0.02em] leading-[22px] py-[13px] px-[16px] placeholder:text-[#cbcbcb] text-button-text-primary" placeholder="0.00 LAND" type="text"
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
                      <div className="flex w-full justify-between items-center gap-[8px] mt-[12px]">
                        <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(10)}>10%</button>
                        <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(25)}>25%</button>
                        <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(50)}>50%</button>
                        <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(75)}>75%</button>
                        <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(100)}>100%</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-0 gap-[24px] w-full">
                    <div className="flex gap-[12px] w-full flex-col md:flex-row">
                      {(typeof address == 'undefined') ? (
                        <div className="flex flex-col items-center">
                          <ConnectWallet containerClassName="w-[300px]" />
                        </div>
                      ) : (
                        <>
                          <button
                            className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                            onClick={() => {
                              if (inputValue && Number(inputValue) > Number(0)) {
                                depositing ? isApprovedLandStake ? depositHandler() : approveVault(parseEther(inputValue)) : withdrawHandler()
                              } else {
                                notifyError('Please enter an amount')
                              }
                            }}
                            disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                          >
                            {inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"}
                          </button>
                          <button 
                            className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                            onClick={() => withdrawVault(0)}
                          >
                            Harvest
                          </button>
                        </>
                      )}
                    </div>
                    <button className={`flex items-center gap-[4px] text-[14px] leading-[22px] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                      {details ? 'Hide' : 'Show'} Details
                      <Image src={details ? up : down} className="w-[20px] h-[20px]" alt="details" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <Collapse isOpen={details}>
                  <div className="hidden md:block">
                    <div className="flex w-full mt-[20px]">
                      <div 
                        className={`w-full font-medium text-[14px] leading-[22px] tracking-[0.02em] py-[12px] px-[16px] text-center normal-case border-b-[1px] border-[#E6E7EB] text-[#0A1339] dark:text-[#cacaca] cursor-pointer ${depositing ? 'text-[#61CD81] !border-[#61CD81]' : ''}`}
                        onClick={() => setDepositing(true)}
                      >
                        Deposit
                      </div>
                      <div 
                        className={`w-full font-medium text-[14px] leading-[22px] tracking-[0.02em] py-[12px] px-[16px] text-center normal-case border-b-[1px] border-[#E6E7EB] text-[#0A1339] dark:text-[#cacaca] cursor-pointer ${!depositing ? 'text-[#61CD81] !border-[#61CD81]' : ''}`}
                        onClick={() => setDepositing(false)}
                      >
                        Withdraw
                      </div>
                    </div>
                    <div className="flex flex-col justify-center pt-[12px] pb-[24px]">
                      <span className="text-[12px] leading-[20px] tracking-[0.24px] text-[#9d9fa8] dark:text-[#cacaca]">Set Amount</span>
                      <div className="flex flex-col md:flex-row gap-[12px] items-start p-0">
                        <input className="w-full bg-vault-input rounded-[12px] text-[14px] font-medium outline-0 tracking-[0.02em] leading-[22px] py-[13px] px-[16px] placeholder:text-[#cbcbcb] text-button-text-primary" placeholder="0.00 LAND" type="text"
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
                        <div className="flex justify-between items-center gap-[8px] mt-[12px]">
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(10)}>10%</button>
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(25)}>25%</button>
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(50)}>50%</button>
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(75)}>75%</button>
                          <button className="py-[2px] px-[8px] sm:px-[10px] md:py-[3px] md:px-[16px] border border-[#61CD81] rounded-[52px] text-[12px] leading-[20px] text-[#61cd81]" onClick={() => handlePercents(100)}>100%</button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-0 gap-[24px] w-full">
                      <div className="flex flex-col md:flex-row gap-[12px] w-full justify-center">
                        {(typeof address == 'undefined') ? (
                          <div className="flex flex-col items-center">
                            <ConnectWallet containerClassName="w-[300px]" />
                          </div>
                        ) : (
                          <>
                            <button
                              className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                              onClick={() => {
                                if (chainId == MAJOR_WORK_CHAIN.id) {
                                  if (inputValue && Number(inputValue) > Number(0)) {
                                    depositing ? isApprovedLandStake ? depositHandler() : approveVault(parseEther(inputValue)) : withdrawHandler()
                                  } else {
                                    notifyError('Please enter an amount')
                                  }
                                } else {
                                  switchChain({ chainId: MAJOR_WORK_CHAIN.id })
                                }
                              }}
                              disabled={(typeof address == 'undefined') || depositing && !isDepositable || !depositing && !isWithdrawable}
                            >
                              {
                                chainId != MAJOR_WORK_CHAIN.id ? 'Switch to BSC' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                              }
                            </button>
                            {chainId == MAJOR_WORK_CHAIN.id && (
                              <button
                                className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                                onClick={() => withdrawVault(0)}
                                disabled={(typeof address == 'undefined') || chainId != MAJOR_WORK_CHAIN.id}
                              >
                                Harvest
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start p-0 gap-[8px] w-full rounded-[12px] bg-primary dark:bg-secondary mt-[24px]">
                    <div className="flex w-full flex-col items-center justify-center p-[16px]">
                      <div className="w-8 h-8 rounded-full bg-third">
                        <a href="https://docs.landshare.io/quickstart-guides/how-to-stake-landshare-token-land"><Image className="w-[32px] h-[32px] p-[6px]" src={viewContract} alt="" /></a>
                      </div>
                      <div className="flex flex-col mt-[8px] items-center text-text-primary">
                        <span>
                          <a 
                            href="https://docs.landshare.io/quickstart-guides/how-to-stake-landshare-token-land"
                            className={`${BOLD_INTER_TIGHT.className} text-[14px] leading-[22px] tracking-[0.28px]`}
                          >
                            Vault Guide
                          </a>
                        </span>
                        <a
                          className={`${BOLD_INTER_TIGHT.className} text-[12px] leading-[20px] tracking-[0.24px] text-[#61CD81]`}
                          href="https://docs.landshare.io/quickstart-guides/how-to-stake-landshare-token-land"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center p-[16px]">
                      <div className="w-8 h-8 rounded-full bg-third">
                        <a href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"><Image className="w-[32px] h-[32px] p-[6px]" src={pcsBunny} alt="" /></a>
                      </div>
                      <div className="flex flex-col mt-[8px] items-center text-text-primary">
                        <span>
                          <a 
                            href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"
                            className={`${BOLD_INTER_TIGHT.className} text-[14px] leading-[22px] tracking-[0.28px]`}
                          >
                            Get LAND Token
                          </a>
                        </span>
                        <a
                          className={`${BOLD_INTER_TIGHT.className} text-[12px] leading-[20px] tracking-[0.24px] text-[#61CD81]`}
                          href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"
                        >
                          Pancakeswap
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
