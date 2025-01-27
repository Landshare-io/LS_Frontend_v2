import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { BigNumberish, formatEther, parseEther } from "ethers";
import Image from "next/image";
import { bsc } from "viem/chains";
import { useChainId, useAccount, useSwitchChain } from "wagmi";
import Collapse from "../common/collapse";
import ConnectWallet from "../connect-wallet";
import { useGlobalContext } from "../../context/GlobalContext";
import { abbreviateNumber } from "../../utils/helpers/convert-numbers";
import useBalanceOfLpTokenV2 from "../../hooks/contract/LpTokenV2Contract/useBalanceOf";
import useTotalSupplyOfLpTokenV2 from "../../hooks/contract/LpTokenV2Contract/useTotalSupply";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useBalanceOfWBNB from "../../hooks/contract/WBNBTokenContract/useBalanceOf";
import useGetPrice from "../../hooks/get-apy/useGetPrice";
import useAllowance from "../../hooks/contract/LpTokenV2Contract/useAllowance";
import useLpVault from "../../hooks/contract/vault/useLpVault";
import usePoolInfo from "../../hooks/contract/MasterchefContract/usePoolInfo";
import useUserInfo from "../../hooks/contract/MasterchefContract/useUserInfo";
import usePendingLand from "../../hooks/contract/MasterchefContract/usePendingLand";
import useGetLandPrice from "../../hooks/axios/useGetLandPriceFromCoingecko";
import { 
  BOLD_INTER_TIGHT,
  LP_TOKEN_V2_CONTRACT_ADDRESS,
  MASTERCHEF_CONTRACT_ADDRESS,
  MAJOR_WORK_CHAINS
} from "../../config/constants/environments";
import Union from "../../../public/green-logo.svg";
import UnionDark from "../../../public/green-logo.svg";
import book from "../../../public/icons/book.svg";
import down from "../../../public/icons/down.svg";
import calc from "../../../public/icons/calculator.svg";
import viewContract from "../../../public/icons/view-contract.png";
import up from "../../../public/icons/arrow-up.svg";
import bscIcon from "../../../public/icons/bsc.svg";
import pcsBunny from "../../../public/icons/pancakeswap-cake-logo.svg"
import smallicon from "../../../public/icons/bnb.png";
import 'react-loading-skeleton/dist/skeleton.css';
import Tooltip from "../common/tooltip";

const LP_VAULT_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/vaults']['lp']

interface LpVaultProps {
  title: string;
  setShowModal: Function;
  setIsLPVault: Function;
  setShowModalApy: Function;
  setTokenUsdPrice: Function;
}

export default function LpVault({
  title,
  setShowModal,
  setIsLPVault,
  setShowModalApy,
  setTokenUsdPrice
}: LpVaultProps) {
  const chainId = useChainId();
  const { isConnected, address } = useAccount();
  const { switchChain } = useSwitchChain()
  const { theme, notifyError } = useGlobalContext();

  const { data: lpTokenV2Balance } = useBalanceOfLpTokenV2({ chainId, address }) as { data: BigNumberish }
  const { data: totalLPInVault } = useBalanceOfLpTokenV2({ chainId, address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish }
  const { data: totalLANDinLPContract } = useBalanceOfLandToken({ chainId, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish }
  const { data: totalLPSupply } = useTotalSupplyOfLpTokenV2(chainId) as { data: BigNumberish }
  const { data: totalBNBinLPContract } = useBalanceOfWBNB({ chainId, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish }
  const { data: userInfo } = useUserInfo({ chainId, userInfoId: 1, address }) as { data: [BigNumberish, BigNumberish], isLoading: boolean }
  const { data: pendingLand } = usePendingLand({ chainId, pendingLandId: 1, address }) as { data: BigNumberish, isLoading: boolean }
  const { data: approvedLAND } = useAllowance(chainId, address, MASTERCHEF_CONTRACT_ADDRESS[bsc.id]) as { data: BigNumberish }
  const { data: allocPoints } = usePoolInfo(chainId, 1) as { data: any[] };
  const { bnbPrice, coinPrice: coin, price } = useGetPrice(chainId)
  const { price: tokenPriceData } = useGetLandPrice()

  
  const {
    depositVault,
    withdrawVault,
    approveVault
  } = useLpVault(chainId, address, updateStatus, updateLPFarm)

  const [details, setDetails] = useState(false)
  const [depositing, setDepositing] = useState(true)
  const [inputValue, setInputValue] = useState("");
  const [isWithdrawable, setIsWithdrawable] = useState(true);
  const [isDepositable, setIsDepositable] = useState(true);
  const [isApprovedLP, setIsApproved] = useState(false);
  const [apr, setAPR] = useState(0);
  const [tvl, setTvl] = useState(0);
  const [rewardLP, setReward] = useState<BigNumberish>(0);
  const [depositBalanceLP, setDepositBalanceLP] = useState<BigNumberish>(0);
  const [usdValueLP, setUsdValueLP] = useState(0)
  const isVaultsLoading = false

  useEffect(() => {
    updateLPFarm();
  }, [])

  useEffect(() => {
    updateLPFarm();
  }, [totalBNBinLPContract, bnbPrice, totalLANDinLPContract, totalLPSupply, totalLPInVault, allocPoints, price]);

  async function updateStatus() {
    setIsWithdrawable(
      inputValue !== "0" &&
      inputValue !== "0.0" &&
      Number(inputValue) <= Number(formatEther(depositBalanceLP))
    );
    setIsDepositable(
      inputValue !== "0" &&
      inputValue !== "0.0" &&
      Number(formatEther(lpTokenV2Balance)) >=
      Number(inputValue)
    );
    if (isConnected && address) {
      const approvedLANDETH = formatEther(approvedLAND);
      setIsApproved((Number(inputValue) > 0) && (Number(approvedLANDETH) >= Number(inputValue)))
    }
  }

  useEffect(() => {
    updateStatus()
  }, [inputValue, approvedLAND]);

  function handlePercents(percent: number) {
    if (depositing) {
      if (lpTokenV2Balance == 0) {
        notifyError("You don't have enough balance to perform this action.")
      } else {
        const bal = BigInt(lpTokenV2Balance) * BigInt(percent) / BigInt(100)
        setInputValue(formatEther(bal))
      }
    } else {
      if (depositBalanceLP == 0) {
        notifyError("You don't have enough balance to perform this action.")
      } else {
        const bal = BigInt(depositBalanceLP) * BigInt(percent) / BigInt(100)
        setInputValue(formatEther(bal))
      }
    }
  }

  const depositHandler = () => {
    let amountLS = inputValue;
    if (!amountLS || Number(amountLS) == 0 || Number(amountLS) == 0.0) {
      notifyError("Please enter an amount");
      return;
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    amountLS = parseEther(amountLS).toString(); //convert to wei

    depositVault(amountLS);
  };

  const withdrawHandler = () => {
    let amountLS = inputValue;
    if (!amountLS || Number(amountLS) == 0 || Number(amountLS) == 0.0) {
      notifyError("Please enter an amount");
      return;
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    amountLS = parseEther(amountLS).toString(); //convert to wei

    withdrawVault(depositBalanceLP, amountLS);
  };

  async function updateLPFarm() {
    const totalBNBValueinLPContract = Number(formatEther(totalBNBinLPContract)) * Number(bnbPrice);
    let totalLANDValueinLPContract = 0;
    try {
      totalLANDValueinLPContract = Number(formatEther(totalLANDinLPContract?.toString() || '0')) * Number(price);
    } catch (error: any) {
      console.warn('Error calculating LAND value, defaulting to 0:', error.message);
      totalLANDValueinLPContract = 0;
    }
    const totalUSDValue = Number(totalLANDValueinLPContract) + Number(totalBNBValueinLPContract);
    const usdValueLPToken = Number(totalUSDValue) / (Number(formatEther(totalLPSupply)) == 0 ? 1 : Number(formatEther(totalLPSupply)))
    setUsdValueLP(usdValueLPToken)

    const percentageOfLPInVault = Number(totalLPInVault) / Number(totalLPSupply == 0 ? 1 : totalLPSupply);
    const USDValueinVault = Number(percentageOfLPInVault) * totalUSDValue;
    setTvl(USDValueinVault);
    const totalMoneyAnnual = 365 * Number(allocPoints[1]) * Number(price);
    const farmAPR = (totalMoneyAnnual / USDValueinVault) * 100;

    setAPR(farmAPR);



    if (isConnected) {
      const depositBalance = userInfo[0]
      setDepositBalanceLP(depositBalance);
      const rewardsLP = pendingLand
      setReward(rewardsLP);
    } else {
      setDepositBalanceLP(0);
      setReward(0)
    }
  }

  return (
    <div className="w-full max-w-[880px] m-auto">
      <div className="w-full">
        <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
          <div className={`p-[12px] flex flex-col md:p-[24px] w-full rounded-[24px] bg-third`}>
            {isVaultsLoading ? (
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
            ) : (
              <>
                <div className="flex flex-col justify-center p-0 gap-[16px]">
                  <div className="flex flex-row gap-[8px] hidden">
                    <div className="w-[48px] h-[48px] rounded-[1000px] shrink-0">
                      <Image src={theme == 'dark' ? UnionDark : Union} alt="token pair" className="size-[90px]"/>
                      <Image src={smallicon} alt="small-icon" />
                    </div>
                    <div className={`text-[16px] leading-[28px] overflow-hidden text-ellipsis shrink-1 text-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                      {title}
                    </div>
                    <div className="flex items-center p-0 shrink-0">
                      <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] mr-2 ${BOLD_INTER_TIGHT.className}`}>
                        <Image src={book} alt="book" className="book" />
                        <span>Manual</span>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-primary transition-colors duration-200 mr-2">
                        <Image src={bscIcon} className="w-8 h-8" alt="bsc-icon" />
                      </div>
                    </div>
                    <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] m-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                      <Image src={details ? up : down} alt="direction" />
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
                        <button className={`hidden md:flex flex-row items-center justify-center gap-[4px] text-[14px] m-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}
                        // disabled={chainId != 56 || chainId != 97}
                        >
                          <Image src={details ? up : down} alt="direction" />
                        </button>
                      </div>
                      <div className="flex items-center p-0">
                        <div className={`flex items-center justify-center py-[3px] px-[12px] gap-[4px] rounded-[1000px] text-[12px] leading-[20px] bg-[#ff54541f] text-[#FF5454] max-w-[87px] mr-2 ${BOLD_INTER_TIGHT.className}`}>
                          <Image src={book} alt="book" className="book" />
                          <span>Manual</span>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-primary transition-colors duration-200 mr-2">
                          <Image src={bscIcon} className="w-8 h-8" alt="bsc-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-[12px] md:flex md:items-center md:justify-between p-0">
                    <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                      <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">TVL</span>
                      <span className={`text-[13px] md:text-[14px] leading-[22px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>{!isNaN(tvl) ? "$" + abbreviateNumber(Number(tvl.toString().substr(0, 8))) :
                        <Skeleton className="rounded-lg h-full w-full min-w-[50px] min-h-[25px]" />}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                      <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">APR</span>
                      <div className="flex items-center gap-[4px] text-bold text-[14px] leading-[22px] text-[#0A0A0A]">
                        <span className={`text-[13px] md:text-[14px] leading-[22px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>{!isNaN(apr) ? abbreviateNumber(Number(Number(apr).toFixed(0))) + "%" :
                          <Skeleton className="rounded-lg h-full w-full min-w-[50px] min-h-[25px]" />}
                        </span>
                        <button onClick={() => {
                          setShowModal(true)
                          setShowModalApy(abbreviateNumber(Number(apr.toString().substr(0, 4))))
                          setTokenUsdPrice(tokenPriceData)
                          setIsLPVault(true)
                        }}>
                          <Image src={calc} alt="" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                      <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Deposit</span>
                      <span className={`text-[13px] md:text-[14px] leading-[22px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                        {formatEther(depositBalanceLP.toString()).substr(0, 7)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-[12px] px-[16px] w-full rounded-[12px] bg-vault-input">
                      <span className="text-[12px] text-[#9d9fa8] md:text-[14px] leading-[22px]">Rewards</span>
                      <Tooltip content={`Full number: ${formatEther(rewardLP || 0)}`}>
                        <span className={`text-[13px] md:text-[14px] leading-[22px] tracking-[0.02em] cursor-pointer text-text-primary ${BOLD_INTER_TIGHT.className}`}>{formatEther(rewardLP.toString()).substr(0, 5)}</span>
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
                      {typeof address == 'undefined' ? (
                        <div className="flex flex-col items-center">
                          <ConnectWallet connectButtonClassName="w-[300px]" />
                        </div>
                      ) : (
                        <>
                          <button
                            className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                            onClick={() => {
                              if ((LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)) {
                                if (inputValue && Number(inputValue) > Number(0)) {
                                  depositing ? isApprovedLP ? depositHandler() : approveVault(parseEther(inputValue)) : withdrawHandler()
                                } else {
                                  notifyError('Please enter an amount')
                                }
                              } else {
                                notifyError(`Please switch your chain to ${LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.name).join(', ')}`)
                                // switchChain({ chainId: MAJOR_WORK_CHAIN.id })
                              }
                            }}
                            disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                          >
                            {
                              !(LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? 'Switch your network' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLP ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                            }
                          </button>
                          {(LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) && (
                            <button
                              className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                              onClick={() => withdrawVault(depositBalanceLP, 0)}
                              disabled={!(LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)}
                            >
                              Harvest
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <button className={`flex flex-row items-center justify-center gap-[4px] text-[14px] m-auto text-[14px] leading-[22px] tracking-[0.02em] text-[#61CD81] shrink-0 ${BOLD_INTER_TIGHT.className}`} onClick={() => setDetails(!details)}>
                      {details ? 'Hide' : 'Show'} Details
                      <Image src={details ? up : down} alt="direction" />
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
                          {typeof address == 'undefined' ? (
                            <ConnectWallet connectButtonClassName="w-[300px]" />
                          ) : (
                            <>
                              <button
                                className={`flex justify-center items-center w-full py-[13px] px-[24px] text-button-text-secondary bg-[#61CD81] rounded-[100px] text-[14px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}
                                onClick={() => {
                                  if ((LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)) {
                                    if (inputValue && Number(inputValue) > Number(0)) {
                                      depositing ? isApprovedLP ? depositHandler() : approveVault(parseEther(inputValue)) : withdrawHandler()
                                    } else {
                                      notifyError('Please enter an amount')
                                    }
                                  } else {
                                    notifyError(`Please switch your chain to ${LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.name).join(', ')}`)
                                    // switchChain({ chainId: MAJOR_WORK_CHAIN.id })
                                  }
                                }}
                                disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                              >
                                {
                                  !(LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? 'Switch your network' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLP ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                                }
                              </button>
                              {(LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) && (
                                <button
                                  className={`flex justify-center items-center w-full py-[13px] px-[24px] border border-[#61CD81] rounded-[100px] text-[14px] leading-[22px] tracking-[0.02em] text-text-primary disabled:bg-[#fff] disabled:border-[#c2c5c3] ${BOLD_INTER_TIGHT.className}`}
                                  onClick={() => withdrawVault(depositBalanceLP, 0)}
                                  disabled={!(LP_VAULT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)}
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
                          <a href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens">
                            <Image className="w-[32px] h-[32px] p-[6px]" src={viewContract} alt="" />
                          </a>
                        </div>
                        <div className="flex flex-col mt-[8px] items-center text-text-primary">
                          <span>
                            <a 
                              className={`${BOLD_INTER_TIGHT.className} text-[14px] leading-[22px] tracking-[0.28px]`} 
                              href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens"
                            >
                              Vault Guide
                            </a>
                          </span>
                          <a
                            className={`${BOLD_INTER_TIGHT.className} text-[12px] leading-[20px] tracking-[0.24px] text-[#61CD81]`}
                            href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-center justify-center p-[16px]">
                        <div className="w-8 h-8 rounded-full bg-third">
                          <a href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C">
                          <Image className="w-[32px] h-[32px] p-[6px]" src={pcsBunny} alt="" /></a>
                        </div>
                        <div className="flex flex-col mt-[8px] items-center text-text-primary">
                          <span>
                            <a 
                              href="https://pancakeswap.finance/v2/add/0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C/BNB"
                              className={`${BOLD_INTER_TIGHT.className} text-[14px] leading-[22px] tracking-[0.28px]`} 
                            >
                              Get LAND-BNB LP
                            </a>
                          </span>
                          <a
                            className={`${BOLD_INTER_TIGHT.className} text-[12px] leading-[20px] tracking-[0.24px] text-[#61CD81]`}
                            href="https://pancakeswap.finance/v2/add/0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C/BNB"
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
        </SkeletonTheme>
      </div>
    </div>
  )
}
