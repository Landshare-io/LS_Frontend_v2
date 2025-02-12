import { useEffect, useState } from "react";
import Image from "next/image";
import {
  useAccount,
  useChainId,
  useSwitchChain
} from "wagmi";
import { bsc } from "viem/chains";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import {
  BigNumberish,
  formatEther,
  parseEther
} from "ethers";
import numeral from "numeral";
import Tooltip from "../common/tooltip";
import Collapse from "../common/collapse";
import ConnectWallet from "../connect-wallet";
import { useTheme } from "next-themes";
import { abbreviateNumber } from "../../utils/helpers/convert-numbers";
import useUsdtVault from "../../hooks/contract/vault/useUsdtVault";
import useBalanceOfRwaLp from "../../hooks/contract/RwaLpTokenContract/useBalanceOf";
import useBalanceOfUsdt from "../../hooks/contract/UsdtContract/useBalanceOf";
import useBalanceOfRwa from "../../hooks/contract/RWAContract/useBalanceOf";
import useUserInfo from "../../hooks/contract/MasterchefContract/useUserInfo";
import useGetRwaPrice from "../../hooks/contract/APIConsumerContract/useGetRwaPrice";
import useTotalSupplyOfRwaLp from "../../hooks/contract/RwaLpTokenContract/useTotalSupply";
import usePendingLand from "../../hooks/contract/MasterchefContract/usePendingLand";
import useAllowanceOfRwaLp from "../../hooks/contract/RwaLpTokenContract/useAllowance";
import useGetPrice from "../../hooks/get-apy/useGetPrice";
import Union from "../../../public/blue-logo.svg";
import UnionDark from "../../../public/blue-logo.svg";
import down from "../../../public/icons/down.svg";
import calc from "../../../public/icons/calculator.svg";
import viewContract from "../../../public/icons/view-contract.png";
import up from "../../../public/icons/arrow-up.svg";
import smallicon from "../../../public/icons/tether.svg"
import bscIcon from "../../../public/icons/bsc.svg";
import book from "../../../public/icons/book.svg";
import {
  MAJOR_WORK_CHAINS,
  BOLD_INTER_TIGHT,
  RWA_LP_CONTRACT_ADDRESS,
  MASTERCHEF_CONTRACT_ADDRESS
} from "../../config/constants/environments";
import 'react-loading-skeleton/dist/skeleton.css';

const USDT_VAULT_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/vaults']['usdt']

interface UsdtVaultProps {
  title: string
  setTokenUsdPrice: Function
  setShowModal: Function
  setShowModalApy: Function
  setIsLPVault: Function
  setIsShowUsdPrice: Function
}

export default function Usdtvault({
  title,
  setTokenUsdPrice,
  setShowModal,
  setShowModalApy,
  setIsLPVault,
  setIsShowUsdPrice
}: UsdtVaultProps) {
  const { theme, notifyError } = useGlobalContext();
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const {
    depositVault,
    withdrawVault,
    approveVault
  } = useUsdtVault(chainId, address)

  const { data: balance, isLoading: isBalanceOfRwaLpLoading } = useBalanceOfRwaLp(chainId, address) as { data: BigNumberish, isLoading: boolean }
  const { data: contractLPUSDTBalance, isLoading: isBalanceOfUsdtLoading } = useBalanceOfUsdt(chainId, RWA_LP_CONTRACT_ADDRESS[bsc.id]) as { data: BigNumberish, isLoading: boolean }
  const { data: contractLPLSRWABalance, isLoading: isBalanceofRwaLoading } = useBalanceOfRwa(chainId, RWA_LP_CONTRACT_ADDRESS[bsc.id]) as { data: BigNumberish, isLoading: boolean }
  const { data: amountLSRWALPInVault, isLoading: isBalanceOfRwaLpMasterLoading } = useBalanceOfRwaLp(chainId, MASTERCHEF_CONTRACT_ADDRESS[bsc.id]) as { data: BigNumberish, isLoading: boolean }
  const { data: userBalance, isLoading: isUserInfoLoading } = useUserInfo({ chainId, userInfoId: 4, address }) as { data: [BigNumberish, BigNumberish], isLoading: boolean }
  const rwaTokenPrice = useGetRwaPrice(chainId) as BigNumberish
  const LSRWALPTotalSupply = useTotalSupplyOfRwaLp(chainId) as BigNumberish
  const { data: rewardsLSRWALP, isLoading: isPendingLandLoading } = usePendingLand({ chainId, pendingLandId: 4, address }) as { data: BigNumberish, isLoading: boolean }
  const { data: LSRWALPAllowance, isLoading: isAllowanceLoading } = useAllowanceOfRwaLp(chainId, address, MASTERCHEF_CONTRACT_ADDRESS[bsc.id]) as { data: BigNumberish, isLoading: boolean }
  const { price } = useGetPrice(chainId)

  const [inputValue, setInputValue] = useState("");
  const [details, setDetails] = useState(false)
  const [depositing, setDepositing] = useState(true)
  const [isWithdrawable, setIsWithdrawable] = useState(true);
  const [isDepositable, setIsDepositable] = useState(true);
  const [isApprovedLandStake, setIsApprovedLandStake] = useState(true);
  const [TVL, setTVL] = useState(" —")
  const [APY, setAPY] = useState(" —")
  const [LSRWALPValue, setLSRWALPValue] = useState(0)

  function calculateTVL() {
    if (contractLPUSDTBalance && contractLPLSRWABalance && rwaTokenPrice) {
      const totalValueInLP = BigInt(contractLPUSDTBalance) + (BigInt(contractLPLSRWABalance) * BigInt(rwaTokenPrice))

      const percentageLPInVault = BigInt(amountLSRWALPInVault) * BigInt(totalValueInLP) / BigInt(LSRWALPTotalSupply)
      setTVL(formatEther(percentageLPInVault))
      setLSRWALPValue(Number(BigInt(totalValueInLP) / BigInt(LSRWALPTotalSupply)))
    }
  }

  function calculateAPRLSRWA() {
    if (TVL !== " —") {
      const apr = 54750 * Number(price) / Number(TVL) * 100
      setAPY(apr.toString())
    }
  }

  useEffect(() => {
    calculateTVL()
  }, [contractLPLSRWABalance])

  useEffect(() => {
    calculateAPRLSRWA()
  }, [TVL, price])

  function handlePercents(percent: number) {
    if (depositing) {
      if (balance == 0) {
        notifyError("You don't have enough balance to perform this action.")
      } else {
        const bal = BigInt(balance) * BigInt(percent) / BigInt(100)
        setInputValue(formatEther(bal))
      }
    } else {
      if (userBalance[0] == 0) {
        notifyError("You don't have enough balance to perform this action.")
      } else {
        const bal = BigInt(userBalance[0]) * BigInt(percent) / BigInt(100)
        setInputValue(formatEther(bal))
      }
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
    amountLS = parseEther(amountLS).toString();; //convert to wei
    depositVault(amountLS);
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
    amountLS = parseEther(amountLS).toString(); //convert to wei
    withdrawVault(amountLS)
  };

  async function updateStatus() {
    if (!isConnected) return

    if (LSRWALPAllowance) {
      const approvedLANDETH = formatEther(LSRWALPAllowance);

      setIsApprovedLandStake(Number(inputValue) > 0 && Number(approvedLANDETH) >= Number(inputValue))
    } else {
      setIsApprovedLandStake(false)
    }

    if (userBalance) {
      setIsWithdrawable(
        Number(inputValue) <=
        Number(formatEther(userBalance ? userBalance[0].toString() : 0))
      );
    }
    if (balance) {
      setIsDepositable(
        Number(formatEther(balance.toString())) >=
        Number(inputValue)
      );
    }
  }

  useEffect(() => {
    updateStatus()
  }, [inputValue, LSRWALPAllowance]);

  const openCalcModal = async () => {
    const tokenPriceData = LSRWALPValue
    let tokenPriceUSD = numeral(
      Number(tokenPriceData)
    ).format("0.[000]");
    setTokenUsdPrice(tokenPriceUSD)
    setShowModal(true)
    setShowModalApy(abbreviateNumber(Number(APY?.toString() ?? 0)))
    setIsLPVault(false)
    setIsShowUsdPrice(true);
  }

  const isVaultsLoading = isBalanceOfRwaLpLoading || isBalanceOfUsdtLoading || isBalanceOfRwaLpLoading || isBalanceOfRwaLpMasterLoading || isUserInfoLoading || isPendingLandLoading || isAllowanceLoading;

  return (
    <div className="w-full max-w-[880px] m-auto">
      <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
        <div className="w-full">
          <div className="p-[12px] flex flex-col md:p-[24px] w-full rounded-[24px] bg-third">
            {isVaultsLoading ? (
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
            ) : (
              <>
                <div className="flex flex-col justify-center p-0 gap-[16px]">
                  <div className="flex flex-row gap-[8px] hidden">
                    <div className="w-[48px] h-[48px] rounded-[1000px] shrink-0">
                      <Image src={theme == 'dark' ? UnionDark : Union} alt="token pair" className="size-[90px]" />
                    </div>
                    <div className={`text-[16px] leading-[28px] overflow-hidden text-ellipsis shrink-1 text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                      {title}
                    </div>
                    <div className="flex items-center p-0 shrink-0 mr-2">
                      <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] ${BOLD_INTER_TIGHT.className}`}>
                        <Image src={book} alt="book" className="book" />
                        <span>Manual</span>
                      </div>
                    </div>
                    <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] m-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} style={{ marginLeft: "auto" }} onClick={() => setDetails(!details)}>
                      <Image src={details ? up : down} alt="" />
                    </button>
                  </div>
                  <div className="flex items-center py-[6px] justify-start h-[100px] gap-[16px]" onClick={() => setDetails(!details)}>
                    <div className="size-[90px] shrink-0 rounded-[1000px] relative">
                      <Image src={theme == 'dark' ? UnionDark : Union} className="border-primary border-[6px] rounded-[1000px] size-fit absolute left-0 top-0" alt="token pair" />
                      <Image src={smallicon} className="border-primary border-[6px] rounded-[1000px] w-[40px] h-[40px] absolute right-0 bottom-0 bg-white" alt="" />
                    </div>
                    <div className="flex flex-col justify-center items-start p-0 gap-[8px]">
                      <div className={`cursor-pointer w-full overflow-hidden text-ellipsis leading-[28px] text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                        {title}
                        <button className={`hidden md:flex flex-row items-center justify-center gap-[4px] text-[14px] m-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                          <Image src={details ? up : down} alt="" />
                        </button>
                      </div>
                      <div className="p-0 flex items-center">
                        <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] mr-2 ${BOLD_INTER_TIGHT.className}`}>
                          <Image src={book} alt="book" className="book" />
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
                      <span className={`text-[13px] md:text-[14px] leading-[22px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                        {/* {"$" + abbreviateNumber(Number(TVL))}
                        */}
                        {TVL !== undefined && TVL !== null && !isNaN(Number(TVL))
                          ? `$${abbreviateNumber(Number(TVL))}`
                          : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                      <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">APR</span>
                      <div className="flex items-center gap-[4px] text-bold text-[14px] leading-[22px] text-[#0A0A0A]">
                        <span className={`text-[13px] md:text-[14px] leading-[22px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                          {/* {abbreviateNumber(Number(APY?.toString() ?? 0)) + "%"}
                          */}
                          {APY !== undefined && APY !== null && !isNaN(Number(APY))
                            ? `${abbreviateNumber(Number(APY))}%`
                            : "0"}
                        </span>
                        <button onClick={() => openCalcModal()}>
                          <Image src={calc} alt="" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                      <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Deposit</span>
                      <div className="d-flex align-items-center">
                        <span className={`text-[13px] md:text-[14px] leading-[22px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>{userBalance ? Number(userBalance[0]) > 0 ? Number(formatEther(userBalance[0])).toExponential(2) : 0.0 : "0.0"} </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                      <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Rewards</span>
                      <Tooltip content={`Full number: ${formatEther(rewardsLSRWALP || 0)}`}>
                        <span className={`text-[13px] md:text-[14px] leading-[22px] tracking-[0.02em] cursor-pointer text-text-primary ${BOLD_INTER_TIGHT.className}`}>{rewardsLSRWALP ? formatEther(rewardsLSRWALP).substr(0, 5) : "0.0"}</span>
                      </Tooltip>
                    </div>
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
                          <ConnectWallet connectButtonClassName="w-[300px]" />
                        </div>
                      ) : (
                        <>
                          <button
                            className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                            onClick={() => {
                              if ((USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)) {
                                if (inputValue && Number(inputValue) > Number(0)) {
                                  depositing ? isApprovedLandStake ? depositHandler() : approveVault(parseEther(inputValue)) : withdrawHandler()
                                } else {
                                  notifyError('Please enter an amount')
                                }
                              } else {
                                notifyError(`Please switch your chain to ${USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.name).join(', ')}`)
                                // switchChain({ chainId: MAJOR_WORK_CHAIN.id })
                              }
                            }}
                            disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                          >
                            {
                              !(USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? 'Switch your network' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                            }
                          </button>

                          {(USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) && (
                            <button
                              className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                              onClick={() => withdrawVault(0)}
                              disabled={!(USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)}
                            >
                              Harvest
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] m-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                      {details ? 'Hide' : 'Show'} Details
                      <Image src={details ? up : down} alt="" />
                    </button>
                  </div>
                </div>

                <div className="w-full">
                  <Collapse isOpen={details}>
                    <div className="hidden md:block">
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
                        <div className="flex gap-[12px] w-full flex-col md:flex-row justify-center">
                          {(typeof address == 'undefined') ? (
                            <ConnectWallet connectButtonClassName="w-[300px]" />
                          ) : (
                            <>
                              <button
                                className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                                onClick={() => {
                                  if ((USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)) {
                                    if (inputValue && Number(inputValue) > Number(0)) {
                                      depositing ? isApprovedLandStake ? depositHandler() : approveVault(parseEther(inputValue)) : withdrawHandler()
                                    } else {
                                      notifyError('Please enter an amount')
                                    }
                                  } else {
                                    notifyError(`Please switch your chain to ${USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.name).join(', ')}`)
                                    // switchChain({ chainId: MAJOR_WORK_CHAIN.id })
                                  }
                                }}
                                disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                              >
                                {
                                  !(USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? 'Switch your network' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLandStake ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                                }
                              </button>

                              {(USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) && (
                                <button
                                  className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                                  onClick={() => withdrawVault(0)}
                                  disabled={!(USDT_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)}
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
                          <a href="https://docs.landshare.io/quickstart-guides/how-to-stake-lsrwa-usdt-lp-tokens" target="_blank" rel="noopener noreferrer"><Image className="w-[32px] h-[32px] p-[6px]" src={viewContract} alt="" /></a>
                        </div>
                        <div className="flex flex-col mt-[8px] items-center text-text-primary">
                          <span>
                            <a
                              className={`${BOLD_INTER_TIGHT.className} text-[14px] leading-[22px] tracking-[0.28px]`}
                              href="https://docs.landshare.io/quickstart-guides/how-to-stake-lsrwa-usdt-lp-tokens"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Vault Guide
                            </a>
                          </span>
                          <a
                            className={`${BOLD_INTER_TIGHT.className} text-[12px] leading-[20px] tracking-[0.24px] text-[#61CD81]`}
                            href="https://docs.landshare.io/quickstart-guides/how-to-stake-lsrwa-usdt-lp-tokens" target="_blank" rel="noopener noreferrer"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-center justify-center p-[16px]">
                        <div className="w-8 h-8 rounded-full bg-third">
                          <a href="https://app.landshare.io/rwa" target="_blank" rel="noopener noreferrer"><Image className="w-[32px] h-[32px] p-[6px]" src={theme == 'dark' ? UnionDark : Union} alt="" /></a>
                        </div>
                        <div className="flex flex-col mt-[8px] items-center text-text-primary">
                          <span>
                            <a
                              href="https://app.landshare.io/rwa"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${BOLD_INTER_TIGHT.className} text-[14px] leading-[22px] tracking-[0.28px]`}
                            >
                              Get LSRWA Token
                            </a>
                          </span>
                          <a
                            className={`${BOLD_INTER_TIGHT.className} text-[12px] leading-[20px] tracking-[0.24px] text-[#61CD81]`}
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
      </SkeletonTheme>
    </div>
  )
}
