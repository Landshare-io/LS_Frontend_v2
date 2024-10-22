import { useState, useEffect, useRef } from "react";
import { useAccount, useBalance } from "wagmi";
import { bsc } from "viem/chains";
import Image from "next/image";
import ReactLoading from "react-loading";
import { parseEther, formatEther, BigNumberish } from "ethers";
import { useGlobalContext } from "../../context/GlobalContext";
import useMigrateWithDrawLandv1 from "../../hooks/contract/migrations/useMigrateWithDrawLandV1";
import useTokenMigrate from "../../hooks/contract/migrations/useTokenMigrate";
import useMigrateApproveLandAndLpV2 from "../../hooks/contract/migrations/useMigrateApproveLandAndLpV2";
import useMigrateDepositLandAndLpV2 from "../../hooks/contract/migrations/useMigrateDepositLandAndMasterchefV2";
import useSplitLP from "../../hooks/contract/migrations/useSplitLp";
import useMigrationBalance from "../../hooks/contract/migrations/useMigrationBalance";
import useRecombine from "../../hooks/contract/migrations/useRecombine";
import useGetPrice from "../../hooks/get-apy/useGetPrice";
import useGetReservesOfLpV1 from "../../hooks/contract/LpTokenV1Contract/useGetReserves";
import useUserInfoOfAutoLandV1 from "../../hooks/contract/AutoLandV1Contract/useUserInfo";
import useTotalSharesOfAutoLandV1 from "../../hooks/contract/AutoLandV1Contract/useTotalShares";
import useBalanceOfAutoLandV1 from "../../hooks/contract/AutoLandV1Contract/useBalanceOf";
import useTotalSharesOfAutoLandV2 from "../../hooks/contract/AutoLandV2Contract/useTotalShares";
import useBalanceOfAutoLandV2 from "../../hooks/contract/AutoLandV2Contract/useBalanceOf";
import useUserInfoOfAutoLandV2 from "../../hooks/contract/AutoLandV2Contract/useUserInfo";
import usePendingRewardOfLandTokenStakeV2 from "../../hooks/contract/LandTokenStakeV2/usePendingReward";
import usePendingRewardOfLandTokenStakeV3 from "../../hooks/contract/LandTokenStakeV3/usePendingReward";
import usePendingRewardOfLandLPFarm from "../../hooks/contract/LandLPFarmContract/usePendingReward";
import usePendingLandOfMasterchef from "../../hooks/contract/MasterchefContract/usePendingLand";
import useBalanceOfWBNB from "../../hooks/contract/WBNBTokenContract/useBalanceOf";
import usePoolInfo from "../../hooks/contract/MasterchefContract/usePoolInfo";
import useUserInfoOfMasterchef from "../../hooks/contract/MasterchefContract/useUserInfo";
import useBalanceOfLpTokenV2 from "../../hooks/contract/LpTokenV2Contract/useBalanceOf";
import useTotalSupplyOfLpTokenV2 from "../../hooks/contract/LpTokenV2Contract/useTotalSupply";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";
import useTotalSupplyOfLpTokenV1 from "../../hooks/contract/LpTokenV1Contract/useTotalSupply";
import useBalanceOfLandTokenV1 from "../../hooks/contract/LandTokenV1Contract/useBalanceOf";
import useBalanceOfLpTokenV1 from "../../hooks/contract/LpTokenV1Contract/useBalanceOf";
import useGetReservesLpTokenV2 from "../../hooks/contract/PancakePairContract/useGetReserves";
import useTotalAllocPoint from "../../hooks/contract/MasterchefContract/useTotalAllocPoint";
import useLandPerBlock from "../../hooks/contract/MasterchefContract/useLandPerBlock";
import useCheckAllowance from "../../hooks/contract/useCheckAllowance";
import useBalanceOfAutoVaultV3 from "../../hooks/contract/AutoVaultV3Contract/useBalanceOf";
import useBalanceOfMasterchef from "../../hooks/contract/MasterchefContract/useBalanceOf";
import { abbreviateNumber } from "../../utils/helpers/convert-numbers";
import { 
  LAND_TOKEN_CONTRACT_ADDRESS,
  LP_TOKEN_V2_CONTRACT_ADDRESS, 
  MASTERCHEF_CONTRACT_ADDRESS, 
  LP_TOKEN_V1_CONTRACT_ADDRESS,
  AUTO_LAND_V3_CONTRACT_ADDRESS,
  BOLD_INTER_TIGHT
} from "../../config/constants/environments";
import DetailsIcon from "../../../public/icons/details.svg";
import DetailsIconDark from "../../../public/icons/details-dark.svg";
import CloseIcon from "../../../public/icons/close.svg";

function useOutsideAlerter(ref: any, setDetails: Function) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setDetails(0);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

interface VaultCardProps {
  vaultName: string;
  initVault: Function;
}

export default function VaultCard({
  vaultName,
  initVault
}: VaultCardProps) {
  const { theme } = useGlobalContext();
  const { address } = useAccount()
  const wrapperRef = useRef(null);
  const [details, setDetails] = useState<number | string>(0);
  useOutsideAlerter(wrapperRef, setDetails);
  const [amount, setAmount] = useState<number | string>(0);
  const [currentStep, setCurrentStep] = useState<number | string>(1);
  const [APR, setAPR] = useState<number | BigNumberish>();
  const [TVL, setTVL] = useState<number | BigNumberish>();
  const [isLoading, setIsLoading] = useState(true);
  const [landBalance, setLandBalance] = useState<any>({ v1: 0, v2: 0, lp: 0, lp2: 0, bnb: 0 });
  const [balance, setBalance] = useState("Loading...");
  const [totalLandPerYear, setTotalLandPerYear] = useState<number | BigNumberish>(0);

  const { data: balanceOfLandV1, refetch: refetchBalanceOfLandV1 } = useBalanceOfLandTokenV1({ address }) as { data: BigNumberish, refetch: Function }
  const { data: balanceOfLandV2, refetch: refetchBalanceOfLandV2 } = useBalanceOfLandToken({ chainId: bsc.id, address }) as { data: BigNumberish, refetch: Function }
  const { data: balanceOfLpToken, refetch: refetchBalanceOfLpToken } = useBalanceOfLpTokenV1({ address }) as { data: BigNumberish, refetch: Function }
  const { data: balanceOfLpTokenV2, refetch: refetchBalanceOfLpTokenV2 } = useBalanceOfLpTokenV2({ chainId: bsc.id, address }) as { data: BigNumberish, refetch: Function }
  const { data: bnbBalance, refetch: refetchBnbBalance } = useBalance({
    chainId: bsc.id,
    address
  })
  const { data: landInLP } = useBalanceOfLandToken({ chainId: bsc.id, address: LP_TOKEN_V1_CONTRACT_ADDRESS }) as { data: BigNumberish, refetch: Function }
  const balanceMigration = useMigrationBalance({ address }) as any
  const { data: landTokenStakeCurrentDepositTotal } = useBalanceOfAutoVaultV3() as { data: BigNumberish }
  const { data: landTokenStakeCurrentDepositTotal2 } = useBalanceOfMasterchef() as { data: BigNumberish }

  const updateUserBalance = async () => {
    await refetchBalanceOfLandV1()
    await refetchBalanceOfLandV2()
    await refetchBalanceOfLpToken()
    await refetchBalanceOfLpTokenV2()
    await refetchBnbBalance()
  }

  const { data: totalBNBinLPContract } = useBalanceOfWBNB({ chainId: bsc.id, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish }
  const { data: totalLANDinLPContract } = useBalanceOfLandToken({ chainId: bsc.id, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish }
  const { data: totalLPInVault } = useBalanceOfLpTokenV2({ chainId: bsc.id, address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish }
  const { data: totalLPV2Supply } = useTotalSupplyOfLpTokenV2(bsc.id) as { data: BigNumberish }
  const { data: allocPoints } = usePoolInfo(bsc.id, 1) as { data: any[] };
  const { data: totalAllocPoint } = useTotalAllocPoint() as { data: BigNumberish }
  const { data: totalLPV1Supply } = useTotalSupplyOfLpTokenV1() as { data: BigNumberish }
  const { data: lpTokenV1Reserves } = useGetReservesOfLpV1() as { data: [BigNumberish, BigNumberish, BigNumberish] }
  const { data: lpTokenV2Reserves } = useGetReservesLpTokenV2(bsc.id) as { data: [BigNumberish, BigNumberish, BigNumberish] }

  // AutoLAND v1 info
  const { data: autoBalanceV1, refetch: refetchAutoBalanceV1 } = useUserInfoOfAutoLandV1({ address }) as { data: [BigNumberish, BigNumberish, BigNumberish, BigNumberish], refetch: Function };
  const oldAutoBalance = autoBalanceV1[0]
  const { data: totalSharesAutoOld, refetch: refetchTotalSharesAutoOld } = useTotalSharesOfAutoLandV1() as { data: BigNumberish, refetch: Function };
  const { data: totalDepositAutoOld, refetch: refetchTotalDepositAutoOld } = useBalanceOfAutoLandV1() as { data: BigNumberish, refetch: Function }
  const lastRewardOld = BigInt(oldAutoBalance) * BigInt(totalDepositAutoOld) / (Number(BigInt(totalSharesAutoOld) - BigInt(autoBalanceV1[2])) == 0 ? BigInt(1) : (BigInt(totalSharesAutoOld) - BigInt(autoBalanceV1[2])))

  const updateV1Data = async () => {
    await refetchAutoBalanceV1()
    await refetchTotalSharesAutoOld()
    await refetchTotalDepositAutoOld()
  }

  // AutoLAND V2 info
  const { data: totalSharesAutoV2 } = useTotalSharesOfAutoLandV2() as { data: BigNumberish };
  const { data: totalDepositAutoV2 } = useBalanceOfAutoLandV2() as { data: BigNumberish }
  const { data: useInfoAutoV2 } = useUserInfoOfAutoLandV2({ address }) as { data: [BigNumberish, BigNumberish, BigNumberish, BigNumberish] };
  const lastRewardV2 = BigInt(useInfoAutoV2[0]) * BigInt(totalDepositAutoV2) / (Number(BigInt(totalSharesAutoV2) - BigInt(useInfoAutoV2[2])) == 0 ? BigInt(1) : (BigInt(totalSharesAutoV2) - BigInt(useInfoAutoV2[2])))
  // LAND Staking V2 info
  const { data: rewardLandV2 } = usePendingRewardOfLandTokenStakeV2({ address }) as { data: BigNumberish };
  // LAND Staking V3 info
  const { data: rewardLandV3 } = usePendingRewardOfLandTokenStakeV3({ address }) as { data: BigNumberish };
  // LP Farm
  const { data: lpFarmReward } = usePendingRewardOfLandLPFarm({ address }) as { data: BigNumberish };
  const { data: lpFarmReward2 } = usePendingLandOfMasterchef({ chainId: bsc.id, pendingLandId: 1, address }) as { data: BigNumberish };
  const [expectedLand, setExpectedLand] = useState<number | BigNumberish>(0);
  const [expectedEth, setExpectedEth] = useState<number | BigNumberish>(0);
  const [expectedLandV2, setExpectedLandV2] = useState<number | BigNumberish>(0);
  const [expectedEthV2, setExpectedEthV2] = useState<number | BigNumberish>(0);
  const [ethAmount, setEthAmount] = useState<number | BigNumberish>(0);
  const { data: landPerBlock } = useLandPerBlock(bsc.id) as { data: BigNumberish }
  const { data: approveAutoLandV3OfLandV2, refetch: refetchApproveAutoLandV3OfLandV2 } = useCheckAllowance(address, LAND_TOKEN_CONTRACT_ADDRESS[bsc.id], AUTO_LAND_V3_CONTRACT_ADDRESS)
  const { data: approveMasterchefOfLandV2, refetch: refetchApproveMasterchefOfLandV2 } = useCheckAllowance(address, LAND_TOKEN_CONTRACT_ADDRESS[bsc.id], MASTERCHEF_CONTRACT_ADDRESS[bsc.id])
  const { data: approveMasterchefOfLpV2, refetch: refetchApproveMasterchefOfLpV2 } = useCheckAllowance(address, LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id], MASTERCHEF_CONTRACT_ADDRESS[bsc.id])
  const { data: userInfoOfMasterchef } = useUserInfoOfMasterchef({ chainId: bsc.id, userInfoId: 0, address }) as { data: [BigNumberish, BigNumberish] };
  const prices = useGetPrice(bsc.id)

  useEffect(() => {
    updateLPFarm();
    landPerYear();
  }, []);

  useEffect(() => {
    getAPY();
  }, [totalLandPerYear, landTokenStakeCurrentDepositTotal2]);

  useEffect(() => {
    setDetails(0);
    setAmount(0);
    setCurrentStep(1);
    setAPR(0);
    setTVL(0);
    setIsLoading(true);
    updateLPFarm();
  }, [vaultName]);

  useEffect(() => {
    updateUserBalance();
    getBalance();
    getRewards();
    if (currentStep === 2) {
      setMaxAmount();
    }
  }, [currentStep]);

  const {
    withdrawLP,
    withdrawStakingAutoV2,
    withdrawStakingAutoV3,
    withdrawStakingV2,
    withdrawStakingV3,
    isSuccessWithdraw,
    setIsSuccessWithdraw,
  } = useMigrateWithDrawLandv1({
    oldAutoBalance,
    address
  });
  const { tokenMigrate, isSuccessMigrate, setIsSuccessMigrate } = useTokenMigrate({ address });
  const {
    approveLandV2,
    approveLpTokenV2,
    isSuccessApprove,
    setIsSuccessApprove,
  } = useMigrateApproveLandAndLpV2({ address });

  const {
    depositAutoLandv2,
    depositLandv2,
    depositLP,
    isSuccessDeposit,
    setIsSuccessDeposit,
  } = useMigrateDepositLandAndLpV2({ address });

  const { splitLP, isSuccessSplit, amountSplitedTokens, setIsSuccessSplit } = useSplitLP({ address });

  const { recombine, isSuccessRecombine, setIsSuccessRecombine } = useRecombine({ address });

  function isLP() {
    return vaultName == "LP Farm";
  }

  function isStakingAutoV2() {
    return vaultName == "V2 Auto Staking Vault";
  }

  function isStakingAutoV3() {
    return vaultName == "V3 Auto Staking Vault";
  }

  function isStakingV2() {
    return vaultName == "V2 Staking Vault";
  }

  function isStakingV3() {
    return vaultName == "V3 Staking Vault";
  }

  async function setMinValues(amount: BigNumberish | string | number) {
    const coinPriceBNB = BigInt(lpTokenV1Reserves[1]) / BigInt(lpTokenV1Reserves[0]);
    amount = BigInt(parseEther(amount.toString()));
    const percentage = BigInt(amount * (BigInt((1e18).toString()))) / (BigInt(totalLPV1Supply));
    console.log(percentage.toString());
    const minLand = BigInt(landInLP) * (percentage) / (BigInt((1e18).toString())) * (BigInt(99)) / (BigInt(100));
    console.log(minLand.toString());
    console.log(coinPriceBNB);
    const minEth = BigInt(BigInt(minLand) * (BigInt(parseEther(coinPriceBNB.toString().substr(0, 20)).toString())) / (BigInt((1e18).toString()))
    );
    setExpectedLand(minLand);
    setExpectedEth(minEth);
  }


  async function setMinValuesV2(amount: number) {
    const coinPriceBNB = BigInt(lpTokenV2Reserves[1]) / BigInt(lpTokenV2Reserves[0]);
    const minLand = BigInt(Math.trunc(amount * 0.95).toString());
    console.log(minLand.toString());
    const ethAmount = BigInt(
      Math.trunc(Number(BigInt(amount) * coinPriceBNB)).toString()
    );
    const minEth = BigInt(
      Math.trunc(Number(ethAmount * BigInt(0.95))).toString()
    );
    console.log(minEth.toString());
    console.log(minLand + " " + minEth);
    setEthAmount(ethAmount);
    setExpectedLandV2(minLand);
    setExpectedEthV2(minEth);
  }

  function getDepositBalance() {
    if (isStakingV2()) {
      if (Number(currentStep) < 3 && balanceMigration.depositV2) {
        return balanceMigration.depositV2;
      } else if (Number(currentStep) > 3 && userInfoOfMasterchef) {
        return userInfoOfMasterchef;
      } else {
        return 0;
      }
    } else if (isStakingV3()) {
      if (Number(currentStep) < 3 && balanceMigration.depositV3) {
        return balanceMigration.depositV3;
      } else if (Number(currentStep) > 3 && userInfoOfMasterchef) {
        return userInfoOfMasterchef;
      } else {
        return 0;
      }
    } else if (isStakingAutoV2()) {
      console.log("Auto V2");
      if (Number(currentStep) > 2 && balanceMigration.depositAutoV3) {
        return balanceMigration.depositAutoV3;
      } else if (
        Number(currentStep) < 2 &&
        oldAutoBalance &&
        totalDepositAutoOld &&
        totalSharesAutoOld
      ) {
        if (
          parseInt(totalDepositAutoOld.toString()) == 0 ||
          parseInt(oldAutoBalance.toString()) == 0 ||
          parseInt(totalSharesAutoOld.toString()) == 0
        ) {
          return 0;
        } else {
          return BigInt(oldAutoBalance) * (BigInt(totalDepositAutoOld)) / (BigInt(totalSharesAutoOld));
        }
      } else {
        console.log("none found");
        return 0;
      }
    } else if (isStakingAutoV3()) {
      console.log("Auto V3");
      if (Number(currentStep) > 2 && balanceMigration.depositAutoV3) {
        return balanceMigration.depositAutoV3;
      } else if (
        Number(currentStep) < 2 &&
        balanceMigration.depositAuto &&
        totalDepositAutoV2 &&
        totalSharesAutoV2
      ) {
        if (
          parseInt(totalDepositAutoV2.toString()) == 0 ||
          parseInt(balanceMigration.depositAuto) == 0 ||
          parseInt(totalSharesAutoV2.toString()) == 0
        ) {
          return 0;
        } else {
          console.log("auto v2");
          return BigInt(balanceMigration.depositAuto) * (BigInt(totalDepositAutoV2)) / (BigInt(totalSharesAutoV2));
        }
      } else {
        console.log("none found");
        return 0;
      }
    } else if (isLP() && balanceMigration.depositLP) {
      return balanceMigration.depositLP;
    } else {
      console.log("none ");
      return 0;
    }
  }

  function getRewards() {
    if (isStakingV2()) {
      return Number(currentStep) < 3 ? rewardLandV2 : lpFarmReward2;
    } else if (isStakingV3()) {
      return Number(currentStep) < 3 ? rewardLandV3 : lpFarmReward2;
    } else if (isStakingAutoV2()) {
      return lastRewardOld;
    } else if (isStakingAutoV3()) {
      return lastRewardV2 || 0;
    } else if (isLP()) {
      return currentStep == 1 ||
        currentStep == 2 ||
        currentStep !== "lp-2" ||
        Number(currentStep) == 3
        ? lpFarmReward
        : lpFarmReward2;
    } else {
      return 0;
    }
  }

  async function updateLPFarm() {
    try {
      setIsLoading(true);
      updateUserBalance();
      getBalance();

      const totalBNBValueinLPContract = Number(formatEther(totalBNBinLPContract)) * Number(prices.bnbPrice);
      let totalLANDValueinLPContract = 0;
      try {
        totalLANDValueinLPContract = Number(formatEther(totalLANDinLPContract?.toString() || '0')) * Number(prices.price);
      } catch (error: any) {
        console.warn('Error calculating LAND value, defaulting to 0:', error.message);
        totalLANDValueinLPContract = 0;
      }
      const totalUSDValue = Number(totalLANDValueinLPContract) + Number(totalBNBValueinLPContract);

      const percentageOfLPInVault = Number(totalLPInVault) / Number(totalLPV2Supply == 0 ? 1 : totalLPV2Supply);
      const USDValueinVault = Number(percentageOfLPInVault) * totalUSDValue;
      setTVL(USDValueinVault);
      const totalMoneyAnnual = 365 * Number(allocPoints[1]) * Number(prices.price);
      const farmAPR = (totalMoneyAnnual / USDValueinVault) * 100;

      setAPR(farmAPR);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function landPerYear() {
    const annualLand = BigInt(landPerBlock ?? 0) * (BigInt("10512000"))

    const totalLandPerYear = BigInt(annualLand) * (BigInt(allocPoints[1])) / (Number(BigInt(totalAllocPoint)) == 0 ? BigInt(1) : (BigInt(totalAllocPoint)));

    setTotalLandPerYear(totalLandPerYear);
  }

  function getAPY() {
    const apr =
      (Number(totalLandPerYear) / Number(landTokenStakeCurrentDepositTotal2)) *
      100;
    const autoAPR = ((1 + Number(apr) / 100 / 365) ** 365 - 1) * 100;

    return isStakingAutoV3() || isStakingAutoV2() ? autoAPR : apr;
  }

  const handleChangeAmount = (e: any) => {
    setAmount(e.target.value);
  };

  function depositInfo() {
    return (
      <>
        <div className="flex flex-1">
          Deposit
        </div>
        <div className="flex flex-1">
          <div className="text-[12px] leading-[18px] relative font-normal">
            {isStakingAutoV2() || isStakingAutoV3() ? "APY" : "APR"}
            <Image
              className="pl-[5px] cursor-pointer"
              onClick={() => {
                setDetails("APY");
              }}
              src={theme == 'dark' ? DetailsIconDark : DetailsIcon}
              alt="details"
            />
            <div
              ref={wrapperRef}
              className={`absolute z-[2] bg-[#ffffffb3] p-[20px] rounded-[16px] backdrop-blur-lg shadow-lg top-[-22px] left-[117px] ${
                details === "APY" ? "block" : "hidden"
              }`}
            >
              <div className="relative text-[#000] text-[14px] leading-[21px] w-[200px] md:w-[300px] text-left min-h-[40px]">
                The Auto LAND Vault automatically redeposits accrued LAND
                rewards. APY is estimated based on daily compounding with a 2%
                performance fee. All figures are estimated and by no means
                represent guaranteed returns.
              </div>
              <Image
                className="absolute top-[5px] right-[5px] cursor-pointer"
                onClick={() => {
                  setDetails(0);
                }}
                src={CloseIcon}
                alt="close"
              />
            </div>
          </div>
          <div className="text-[18px] leading-[27px] relative font-semibold">
            {abbreviateNumber(Number(isLP() ? APR : getAPY())) + "%"}
          </div>
        </div>
        <div className="flex flex-1">
          <div className="text-[12px] leading-[18px] relative font-normal">TVL</div>
          <div className="text-[18px] leading-[27px] relative font-semibold">
            {isLP()
              ? "$" + abbreviateNumber(Number(TVL?.toString().substr(0, 8)))
              : abbreviateNumber(
                  Number(formatEther(
                    (isStakingAutoV2() || isStakingAutoV3()
                      ? landTokenStakeCurrentDepositTotal
                      : landTokenStakeCurrentDepositTotal2
                    ).toString()
                  ))
                )}
          </div>
        </div>
      </>
    );
  }

  function withdrawInfo() {
    return (
      <>
        <div className="flex flex-1"></div>
        <div className="flex flex-1">
          <div className="text-[12px] leading-[18px] relative font-normal">Deposit</div>
          <div className="text-[18px] leading-[27px] relative font-semibold">
            {formatEther(getDepositBalance().toString())
              .substr(0, 8)}
          </div>
        </div>
        <div className="flex flex-1">
          <div className="text-[12px] leading-[18px] relative font-normal">
            Reward
            <Image
              className="pl-[5px] cursor-pointer"
              onClick={() => {
                setDetails("Reward");
              }}
              src={theme == 'dark' ? DetailsIconDark : DetailsIcon}
              alt="details"
            />
            <div
              ref={wrapperRef}
              className={`absolute z-[2] bg-[#ffffffb3] p-[20px] rounded-[16px] backdrop-blur-lg shadow-lg top-[-22px] left-[117px] ${
                details === "Reward" ? "block" : "hidden"
              }`}
            >
              <div className="relative text-[#000] text-[14px] leading-[21px] w-[200px] md:w-[300px] text-left min-h-[40px]">
                The Auto LAND Vault automatically redeposits accrued LAND
                rewards. APY is estimated based on daily compounding with a 2%
                performance fee. All figures are estimated and by no means
                represent guaranteed returns.
              </div>
              <Image
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => {
                  setDetails(0);
                }}
                src={CloseIcon}
                alt="close"
              />
            </div>
          </div>
          <div className="text-[18px] leading-[27px] relative font-semibold">
            {formatEther(getRewards().toString())
              .toString()
              .substr(0, 6)}
          </div>
        </div>
      </>
    );
  }

  const setMaxAmount = async () => {
    if (currentStep == 1) {
      setAmount(getDepositBalance());
    } else if (currentStep == 2) {
      let value = balanceOfLandV1;
      value = formatEther(value.toString());
      setAmount(value);
    } else if (currentStep == 4) {
      let balance;
      if (isLP()) {
        balance = balanceOfLpTokenV2;
      } else {
        balance = balanceOfLandV2
      }
      balance = formatEther(balance.toString());
      setAmount(balance);
    } else if (currentStep == "lp-2") {
      const lpBalance = formatEther(landBalance.lp.toString());
      setAmount(lpBalance);
    }
  };

  const getBalance = async () => {
    setLandBalance({
      v1: balanceOfLandV1,
      v2: balanceOfLandV2,
      lp: balanceOfLpToken,
      lp2: balanceOfLpTokenV2,
      bnb: bnbBalance?.value ?? 0
    });

    let balance1ETH = formatEther(balanceOfLandV1);
    let balance2ETH = formatEther(balanceOfLandV2);
    let balancelp1ETH = formatEther(balanceOfLpToken);
    let balancelp2ETH = formatEther(balanceOfLpTokenV2);
    let bnbBalanceETH = formatEther(bnbBalance?.value ?? 0);
    balance1ETH = balance1ETH;
    balance2ETH = balance2ETH;
    balancelp1ETH = balancelp1ETH;
    balancelp2ETH = balancelp2ETH;
    bnbBalanceETH = bnbBalanceETH;

    if (currentStep == 1) {
      setBalance(
        isLP() ? `${balancelp1ETH} LAND-BNB LP` : `${balance1ETH} LAND`
      );
    } else if (currentStep == 2) {
      setBalance(`${balance1ETH} LAND`);
    } else if (currentStep == 3 || currentStep == 4) {
      setBalance(
        isLP() ? `${balancelp2ETH} LANDv2-BNB LP` : `${balance2ETH} LANDv2`
      );
    } else if (currentStep == "lp-2") {
      setBalance(`${balancelp1ETH} LAND-BNB LP`);
    } else if (currentStep == "lp-4") {
      setBalance(`${bnbBalanceETH} BNB ${balance2ETH} LANDv2`);
    }
  };

  const processStep1 = async () => {
    if (isSkippable()) {
      isLP() ? setCurrentStep("lp-2") : setCurrentStep(2);
    } else {
      let amountLS = getDepositBalance();
      if (isLP()) {
        withdrawLP(amountLS);
      } else if (isStakingAutoV2()) {
        await withdrawStakingAutoV2(amountLS).then(() => {
          updateV1Data();
        });
      } else if (isStakingAutoV3()) {
        await withdrawStakingAutoV3(amountLS).then(() => {
          updateV1Data();
        });
      } else if (isStakingV2()) {
        await withdrawStakingV2(amountLS);
      } else if (isStakingV3()) {
        await withdrawStakingV3(amountLS);
      }
      updateUserBalance();
      getBalance();
    }
  };

  function isSkippable() {
    if (isLP()) {
      return getDepositBalance() == 0 && landBalance.lp > 0;
    } else {
      return getDepositBalance() == 0 && landBalance.v1 > 0;
    }
  }

  useEffect(() => {
    if (isSuccessWithdraw) {
      isLP() ? setCurrentStep("lp-2") : setCurrentStep(2);
    }
  }, [isSuccessWithdraw]);

  const processSplit = () => {
    if (amount == 0) {
      alert("Input amount of LP to split");
    } else {
      console.log(expectedLand);
      console.log(expectedEth);
      splitLP(
        parseEther(amount.toString()).toString(),
        expectedLand,
        expectedEth
      );
    }
  };

  useEffect(() => {
    if (expectedEth.toString() !== "0") {
      processSplit();
    }
  }, [expectedEth]);

  useEffect(() => {
    if (isSuccessSplit) {
      const landToMigrate = formatEther(
        amountSplitedTokens.land.toString()
      );
      setAmount(landToMigrate);
      setCurrentStep(2);
    }
  }, [isSuccessSplit]);

  const processStep2 = async () => {
    if (amount == 0) {
      alert("Input amount to migrate");
    } else {
      let amountLS = amount;
      amountLS = parseEther((amountLS).toString()).toString();
      await tokenMigrate(amountLS);
      updateUserBalance()
      getBalance();
    }
  };

  useEffect(() => {
    if (isSuccessMigrate) {
      if (isLP()) {
        const landToRecombine = formatEther(
          amountSplitedTokens.land.toString()
        );
        const bnbToRecombine = formatEther(
          amountSplitedTokens.bnb.toString()
        );
        setAmount(`${bnbToRecombine} BNB, ${landToRecombine} LAND`);
        updateUserBalance()
        getBalance();
        setCurrentStep("lp-4");
      } else {
        let approved = false;
        if (isStakingAutoV2() || isStakingAutoV3()) {
          approved = approveAutoLandV3OfLandV2;
        } else if (isStakingV2() || isStakingV3()) {
          approved = approveMasterchefOfLandV2;
        } else if (isLP()) {
          approved = approveMasterchefOfLpV2;
        }

        if (approved) setIsSuccessApprove(true);
        else setCurrentStep(3);
      }
    }
  }, [isSuccessMigrate]);

  const processRecombine = async () => {
    await recombine(
      ethAmount,
      amountSplitedTokens.land,
      // expectedLandV2,
      expectedEthV2
    );
  };

  useEffect(() => {
    if (expectedEthV2.toString() !== "0") {
      processRecombine();
    }
  }, [expectedEthV2]);

  useEffect(() => {
    if (isSuccessRecombine) {
      updateUserBalance()
      getBalance();
      setAmount(0);

      let approved = false;
      if (isStakingAutoV2() || isStakingAutoV3()) {
        approved = approveAutoLandV3OfLandV2;
      } else if (isStakingV2() || isStakingV3()) {
        approved = approveMasterchefOfLandV2;
      } else if (isLP()) {
        approved = approveMasterchefOfLpV2;
      }
      console.log(approved);
      if (approved) setIsSuccessApprove(true);
      else setCurrentStep(3);
    }
  }, [isSuccessRecombine]);

  const processStep3 = async () => {
    if (isStakingAutoV2() || isStakingAutoV3()) {
      await approveLandV2(AUTO_LAND_V3_CONTRACT_ADDRESS)
    } else if (isStakingV2() || isStakingV3()) {
      await approveLandV2(MASTERCHEF_CONTRACT_ADDRESS[bsc.id])
    } else if (isLP()) {
      await approveLpTokenV2(MASTERCHEF_CONTRACT_ADDRESS[bsc.id])
    }
  };

  useEffect(() => {
    if (isSuccessApprove) {
      setCurrentStep(4);
    }
  }, [isSuccessApprove]);

  const processStep4 = async () => {
    if (amount == 0) {
      alert("Input amount of LP to deposit");
    } else {
      let amountLS = amount;
      amountLS = parseEther(`${amountLS}`).toString();
      if (isStakingAutoV2() || isStakingAutoV3()) {
        await depositAutoLandv2(Number(amountLS))
        await updateUserBalance()
        await getBalance();
        
      } else if (isStakingV2() || isStakingV3()) {
        await depositLandv2(Number(amountLS))
        await updateUserBalance()
        await getBalance();
      } else if (isLP()) {
        await depositLP(Number(amountLS))
        await updateUserBalance()
        await getBalance();
      }
    }
  };

  useEffect(() => {
    if (isSuccessDeposit) {
      setCurrentStep(1);
      setIsSuccessApprove(false);
      setIsSuccessWithdraw(false);
      setIsSuccessRecombine(false);
      setIsSuccessMigrate(false);
      setIsSuccessSplit(false);
      setIsSuccessDeposit(false);
      initVault();
    }
  }, [isSuccessDeposit]);

  function step_1() {
    return (
      <div className={`flex justify-between p-[5px] pl-[10px] relative rounded-[12px] ${
        currentStep == 1 ? "bg-[#ffffff4d]" : ""
      }`}>
        <div className="flex items-center font-normal text-[16px] leading-[24px]">
          Step-1
          <Image
            className="pl-[5px] cursor-pointer"
            onClick={() => {
              setDetails(1);
            }}
            src={theme == 'dark' ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <button
          onClick={processStep1}
          className={`cursor-pointer pl-[4px] text-[20px] leading-[30px] text-right capitalize text-[#61cd81] disabled:bg-transparent disabled:text-[#888888] hover:text-[#1ee155] hover:duration-500 hover:bg-transparent active:text-[#06b844] active:duration-500 w-[174px] h-[50px] rounded-[12px] diabled:active:bg-transparent disabled:active:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
          disabled={currentStep != 1 || (getDepositBalance() == 0 && !isSkippable())}
        >
          {isSkippable() ? "Skip" : "Withdraw"}
        </button>
        <div
          ref={wrapperRef}
          className={`absolute z-[2] bg-[#ffffffb3] p-[20px] rounded-[16px] backdrop-blur-lg shadow-lg top-[-80px] left-[-10px] xl:top-0 xl:left-[100px] ${
            details === 1 ? "block" : "hidden"
          }`}
        >
          <div className="relative text-[#000] font-normal text-[14px] leading-[21px] w-[300px] text-left min-h-[40px]">
            <div className="absolute z-[3] left-auto right-[-30px] border-r-0 border-l-[10px] border-l-[#ffffffe6] xl:border-l-[#ffffffb3] xl:border-l-[10px] xl:top-0 xl:left-[-30px] xl:w-0 xl:h-0" />
            <div className="block xl:hidden absolute z-[3] bottom-[-30px] left-[53px] w-0 h-0 border-t-[10px] border-t-[#ffffffb3]" />
            {isLP() ? "Withdraw LP Tokens" : "Withdraw old token from old vault."}
          </div>
          <Image
            className="absolute top-[5px] right-[5px] cursor-pointer"
            onClick={() => {
              setDetails(0);
            }}
            src={CloseIcon}
            alt="close"
          />
        </div>
      </div>
    );
  }


  function step_lp_2() {
    return (
      <div className={`flex justify-between p-[5px] pl-[10px] relative rounded-[12px] ${
        currentStep == "lp-2" ? "bg-[#ffffff4d]" : ""
      }`}>
        <div className="flex items-center font-normal text-[16px] leading-[24px]">
          Step-2
          <Image
            className="pl-[5px] cursor-pointer"
            onClick={() => {
              setDetails("lp-2");
            }}
            src={theme == 'dark' ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <div>
          <button
            onClick={() => setMinValues(amount)}
            className={`cursor-pointer pl-[4px] text-[20px] leading-[30px] text-right capitalize text-[#61cd81] disabled:bg-transparent disabled:text-[#888888] hover:text-[#1ee155] hover:duration-500 hover:bg-transparent active:text-[#06b844] active:duration-500 w-[174px] h-[50px] rounded-[12px] diabled:active:bg-transparent disabled:active:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
            disabled={currentStep != "lp-2"}
          >
            Unpair
          </button>
        </div>
        <div
          ref={wrapperRef}
          className={`absolute z-[2] bg-[#ffffffb3] p-[20px] rounded-[16px] backdrop-blur-lg shadow-lg top-[-80px] left-[-10px] xl:top-0 xl:left-[100px] ${
            details === "lp-2" ? "block" : "hidden"
          }`}
        >
          <div className="relative text-[#000] font-normal text-[14px] leading-[21px] w-[300px] text-left min-h-[40px]">
            <div className="absolute z-[3] left-auto right-[-30px] border-r-0 border-l-[10px] border-l-[#ffffffe6] xl:border-l-[#ffffffb3] xl:border-l-[10px] xl:top-0 xl:left-[-30px] xl:w-0 xl:h-0" />
            <div className="block xl:hidden absolute z-[3] bottom-[-30px] left-[53px] w-0 h-0 border-t-[10px] border-t-[#ffffffb3]" />
            Split LP tokens back to LAND and BNB.
          </div>
          <Image
            className="absolute top-[5px] right-[5px] cursor-pointer"
            onClick={() => {
              setDetails(0);
            }}
            src={CloseIcon}
            alt="close"
          />
        </div>
      </div>
    );
  }

  function step_2() {
    return (
      <div className={`flex justify-between p-[5px] pl-[10px] relative rounded-[12px] ${
        currentStep == 2 ? "bg-[#ffffff4d]" : ""
      }`}>
        <div className="flex items-center font-normal text-[16px] leading-[24px]">
          {isLP() ? "Step-3" : "Step-2"}
          <Image
            className="pl-[5px] cursor-pointer"
            onClick={() => {
              setDetails(2);
            }}
            src={theme == 'dark' ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <div>
          <button
            onClick={processStep2}
            className={`cursor-pointer pl-[4px] text-[20px] leading-[30px] text-right capitalize text-[#61cd81] disabled:bg-transparent disabled:text-[#888888] hover:text-[#1ee155] hover:duration-500 hover:bg-transparent active:text-[#06b844] active:duration-500 w-[174px] h-[50px] rounded-[12px] diabled:active:bg-transparent disabled:active:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
            disabled={currentStep != 2}
          >
            Migrate
          </button>
        </div>
        <div
          ref={wrapperRef}
          className={`absolute z-[2] bg-[#ffffffb3] p-[20px] rounded-[16px] backdrop-blur-lg shadow-lg top-[-80px] left-[-10px] xl:top-0 xl:left-[100px] ${
            details === 2 ? "block" : "hidden"
          }`}
        >
          <div className="relative text-[#000] font-normal text-[14px] leading-[21px] w-[300px] text-left min-h-[40px]">
            <div className="absolute z-[3] left-auto right-[-30px] border-r-0 border-l-[10px] border-l-[#ffffffe6] xl:border-l-[#ffffffb3] xl:border-l-[10px] xl:top-0 xl:left-[-30px] xl:w-0 xl:h-0" />
            <div className="block xl:hidden absolute z-[3] bottom-[-30px] left-[53px] w-0 h-0 border-t-[10px] border-t-[#ffffffb3]" />
            Migrate old tokens to new tokens.
          </div>
          <Image
            className="absolute top-[5px] right-[5px] cursor-pointer"
            onClick={() => {
              setDetails(0);
            }}
            src={CloseIcon}
            alt="close"
          />
        </div>
      </div>
    );
  }

  function step_lp_4() {
    return (
      <div className={`flex justify-between p-[5px] pl-[10px] relative rounded-[12px] ${
        currentStep == "lp-4" ? "bg-[#ffffff4d]" : ""
      }`}>
        <div className="flex items-center font-normal text-[16px] leading-[24px]">
          Step-4
          <Image
            className="pl-[5px] cursor-pointer"
            onClick={() => {
              setDetails("lp-4");
            }}
            src={theme == 'dark' ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <div>
          <button
            onClick={() => setMinValuesV2(amountSplitedTokens.land)}
            className={`cursor-pointer pl-[4px] text-[20px] leading-[30px] text-right capitalize text-[#61cd81] disabled:bg-transparent disabled:text-[#888888] hover:text-[#1ee155] hover:duration-500 hover:bg-transparent active:text-[#06b844] active:duration-500 w-[174px] h-[50px] rounded-[12px] diabled:active:bg-transparent disabled:active:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
            disabled={currentStep != "lp-4"}
          >
            Combine
          </button>
        </div>
        <div
          ref={wrapperRef}
          className={`absolute z-[2] bg-[#ffffffb3] p-[20px] rounded-[16px] backdrop-blur-lg shadow-lg top-[-80px] left-[-10px] xl:top-0 xl:left-[100px] ${
            details === "lp-4" ? "block" : "hidden"
          }`}
        >
          <div className="relative text-[#000] font-normal text-[14px] leading-[21px] w-[300px] text-left min-h-[40px]">
            <div className="absolute z-[3] left-auto right-[-30px] border-r-0 border-l-[10px] border-l-[#ffffffe6] xl:border-l-[#ffffffb3] xl:border-l-[10px] xl:top-0 xl:left-[-30px] xl:w-0 xl:h-0" />
            <div className="block xl:hidden absolute z-[3] bottom-[-30px] left-[53px] w-0 h-0 border-t-[10px] border-t-[#ffffffb3]" />
            Recombine BNB and new LAND in LP pair.
          </div>
          <Image
            className="absolute top-[5px] right-[5px] cursor-pointer"
            onClick={() => {
              setDetails(0);
            }}
            src={CloseIcon}
            alt="close"
          />
        </div>
      </div>
    );
  }

  function step_3() {
    return (
      <div className={`flex justify-between p-[5px] pl-[10px] relative rounded-[12px] ${
        currentStep == 3 ? "bg-[#ffffff4d]" : ""
      }`}>
        <div className="flex items-center font-normal text-[16px] leading-[24px]">
          {isLP() ? "Step-5" : "Step-3"}
          <Image
            className="pl-[5px] cursor-pointer"
            onClick={() => {
              setDetails(3);
            }}
            src={theme == 'dark' ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <button
          onClick={processStep3}
          className={`cursor-pointer pl-[4px] text-[20px] leading-[30px] text-right capitalize text-[#61cd81] disabled:bg-transparent disabled:text-[#888888] hover:text-[#1ee155] hover:duration-500 hover:bg-transparent active:text-[#06b844] active:duration-500 w-[174px] h-[50px] rounded-[12px] diabled:active:bg-transparent disabled:active:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
          disabled={currentStep != 3}
        >
          Approve
        </button>
        <div
          ref={wrapperRef}
          className={`absolute z-[2] bg-[#ffffffb3] p-[20px] rounded-[16px] backdrop-blur-lg shadow-lg top-[-80px] left-[-10px] xl:top-0 xl:left-[100px] ${
            details === 3 ? "block" : "hidden"
          }`}
        >
          <div className="relative text-[#000] font-normal text-[14px] leading-[21px] w-[300px] text-left min-h-[40px]">
            <div className="absolute z-[3] left-auto right-[-30px] border-r-0 border-l-[10px] border-l-[#ffffffe6] xl:border-l-[#ffffffb3] xl:border-l-[10px] xl:top-0 xl:left-[-30px] xl:w-0 xl:h-0" />
            <div className="block xl:hidden absolute z-[3] bottom-[-30px] left-[53px] w-0 h-0 border-t-[10px] border-t-[#ffffffb3]" />
            Approve new vault.
          </div>
          <Image
            className="absolute top-[5px] right-[5px] cursor-pointer"
            onClick={() => {
              setDetails(0);
            }}
            src={CloseIcon}
            alt="close"
          />
        </div>
      </div>
    );
  }

  function step_4() {
    return (
      <div className={`flex justify-between p-[5px] pl-[10px] relative rounded-[12px] ${
        currentStep == 4 ? "bg-[#ffffff4d]" : ""
      }`}>
        <div className="flex items-center font-normal text-[16px] leading-[24px]">
          {isLP() ? "Step-6" : "Step-4"}
          <Image
            className="pl-[5px] cursor-pointer"
            onClick={() => {
              setDetails(4);
            }}
            src={theme == 'dark' ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <button
          onClick={processStep4}
          className={`cursor-pointer pl-[4px] text-[20px] leading-[30px] text-right capitalize text-[#61cd81] disabled:bg-transparent disabled:text-[#888888] hover:text-[#1ee155] hover:duration-500 hover:bg-transparent active:text-[#06b844] active:duration-500 w-[174px] h-[50px] rounded-[12px] diabled:active:bg-transparent disabled:active:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
          disabled={currentStep != 4}
        >
          Deposit
        </button>
        <div
          ref={wrapperRef}
          className={`absolute z-[2] bg-[#ffffffb3] p-[20px] rounded-[16px] backdrop-blur-lg shadow-lg top-[-80px] left-[-10px] xl:top-0 xl:left-[100px] ${
            details === 4 ? "block" : "hidden"
          }`}
        >
          <div className="relative text-[#000] font-normal text-[14px] leading-[21px] w-[300px] text-left min-h-[40px]">
            <div className="absolute z-[3] left-auto right-[-30px] border-r-0 border-l-[10px] border-l-[#ffffffe6] xl:border-l-[#ffffffb3] xl:border-l-[10px] xl:top-0 xl:left-[-30px] xl:w-0 xl:h-0" />
            <div className="block xl:hidden absolute z-[3] bottom-[-30px] left-[53px] w-0 h-0 border-t-[10px] border-t-[#ffffffb3]" />
            Deposit in new vault.
          </div>
          <Image
            className="absolute top-[5px] right-[5px] cursor-pointer"
            onClick={() => {
              setDetails(0);
            }}
            src={CloseIcon}
            alt="close"
          />
        </div>
      </div>
    );
  }

  return isLoading ? (
    <div className="flex justify-center my-auto">
      <ReactLoading type="cylon" color="#61cd81" />
    </div>
  ) : (
    <>
      <div className="flex flex-col items-center md:flex-row rounded-[12px]">
        <div className="flex flex-col items-center w-full gap-[20px] p-[20px]">
          <div className={`py-[10px] text-[28px] leading-[42px] capitalize text-center md:pt-[30px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
            {vaultName === "LP Farm" ? "LAND-BNB LP" : vaultName}
          </div>
          <div className="flex flex-col w-full gap-[20px]">
            <div className="relative text-right">
              <div className={`flex w-full justify-around py-[10px] px-[20px] rounded-[12px] bg-secondary ${
                currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === "lp-4" ? "bg-[#cccccc] text-[#888888]" : ""
              }`}>
                <input
                  onChange={handleChangeAmount}
                  value={amount}
                  disabled={currentStep === 1 || currentStep === 3 || currentStep === 2 || currentStep === "lp-4"}
                  className={`border-0 w-full text-[20px] leading-[30px] capitalize text-[#000] disabled:bg-[#cccccc] disabled:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
                />
                <button
                  onClick={setMaxAmount}
                  className={`cursor-pointer text-[#61cd81] pl-[4px] text-[20px] leading-[30px] text-right capitalize disabled:bg-transparent disabled:text-[#888888] hover:text-[#1ee155] hover:duration-500 hover:bg-transparent active:text-[#06b844] active:duration-500 diabled:active:bg-transparent disabled:active:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
                  disabled={currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === "lp-4"}
                >
                  MAX
                </button>
              </div>
              <div className="w-full pr-[10px] text-right text-text-primary">
                Balance: <b>{balance}</b>
              </div>
            </div>
            {Number(currentStep) >= 3 && (
              <div className="flex justify-between items-center text-text-primary">{depositInfo()}</div>
            )}
            <div className="flex justify-between items-center text-text-primary">{withdrawInfo()}</div>
            <div className="flex flex-col gap-[10px] text-text-primary">
              {step_1()}
              {isLP() && step_lp_2()}
              {step_2()}
              {isLP() && step_lp_4()}
              {step_3()}
              {step_4()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
