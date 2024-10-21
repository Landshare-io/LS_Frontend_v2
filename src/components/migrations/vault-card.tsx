import { useState, useEffect, useRef } from "react";
import { useAccount, useBalance } from "wagmi";
import { bsc } from "viem/chains";
import ReactLoading from "react-loading";
import { parseEther, formatEther, BigNumberish } from "ethers";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useLandshareV1Context } from "../../contexts/LandshareV1Context";
import { useLandshareV2Context } from "../../contexts/LandshareV2Context";
import { useLandshareFunctions } from "../../contexts/LandshareFunctionsProvider";
import { useMigrationContext } from "../../contexts/MigrationContext";
import useMigrateWithDrawLandv1 from "../../hooks/contract/migrations/useMigrateWithDrawLandV1";
import useTokenMigrate from "../../hooks/contract/migrations/useTokenMigrate";
import useMigrateApproveLandv2 from "../../hooks/useMigrateApproveLandv2";
import useMigrateApproveLandAndLpV2 from "../../hooks/contract/migrations/useMigrateApproveLandAndLpV2";
import useMigrateDepositLandv2 from "../../hooks/useMigrateDepositLandv2";
import useMigrateDepositLandAndLpV2 from "../../hooks/contract/migrations/useMigrateDepositLandAndMasterchefV2";
import useSplitLP from "../../hooks/contract/migrations/useSplitLp";
import useRecombine from "../../hooks/contract/migrations/useRecombine";
// import useRecombine from "../../hooks/useRecombine";

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
import useBalanceOfLpTokenV2 from "../../hooks/contract/LpTokenV2Contract/useBalanceOf";
import useTotalSupplyOfLpTokenV2 from "../../hooks/contract/LpTokenV2Contract/useTotalSupply";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";

import useTotalSupplyOfLpTokenV1 from "../../hooks/contract/LpTokenV1Contract/useTotalSupply";

import useBalanceOfLandTokenV1 from "../../hooks/contract/LandTokenV1Contract/useBalanceOf";
import useBalanceOfLpTokenV1 from "../../hooks/contract/LpTokenV1Contract/useBalanceOf";

import useGetReservesLpTokenV2 from "../../hooks/contract/PancakePairContract/useGetReserves";

import useTotalAllocPoint from "../../hooks/contract/MasterchefContract/useTotalAllocPoint";

import useGetReservesOfBNBApePair from "../../hooks/contract/BNBApePairContract/useGetReserves";

import { abbreviateNumber } from "../../utils/helpers/convert-numbers";
import DetailsIcon from "../../assets/img/icons/details.svg";
import DetailsIconDark from "../../assets/img/icons/details-dark.svg";
import CloseIcon from "../../assets/img/icons/close.svg";
import "./VaultCard.css";

import { LP_TOKEN_V2_CONTRACT_ADDRESS, MASTERCHEF_CONTRACT_ADDRESS, LP_TOKEN_V1_CONTRACT_ADDRESS } from "../../config/constants/environments";

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
  const { isDarkMode } = useGlobalContext();
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
  }) as { data: BigNumberish, refetch: Function }

  const { data: landInLP } = useBalanceOfLandToken({ chainId: bsc.id, address: LP_TOKEN_V1_CONTRACT_ADDRESS }) as { data: BigNumberish, refetch: Function }

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
  const { data: autoBalanceV1 } = useUserInfoOfAutoLandV1({ address }) as { data: [BigNumberish, BigNumberish, BigNumberish, BigNumberish] };
  const oldAutoBalance = autoBalanceV1[0]
  const { data: totalSharesAutoOld } = useTotalSharesOfAutoLandV1() as { data: BigNumberish };
  const { data: totalDepositAutoOld } = useBalanceOfAutoLandV1() as { data: BigNumberish }
  const lastRewardOld = BigInt(oldAutoBalance) * BigInt(totalDepositAutoOld) / (BigInt(totalSharesAutoOld) - BigInt(autoBalanceV1[2])) 

  // AutoLAND V2 info
  const { data: totalSharesAutoV2 } = useTotalSharesOfAutoLandV2() as { data: BigNumberish };
  const { data: totalDepositAutoV2 } = useBalanceOfAutoLandV2() as { data: BigNumberish }
  const { data: useInfoAutoV2 } = useUserInfoOfAutoLandV2({ address }) as { data: [BigNumberish, BigNumberish, BigNumberish, BigNumberish] };
  const lastRewardV2 = BigInt(useInfoAutoV2[0]) * BigInt(totalDepositAutoV2) / (BigInt(totalSharesAutoV2) - BigInt(useInfoAutoV2[2]))

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

  const reservesBNB = useGetReservesOfBNBApePair(bsc.id) as [BigNumberish, BigNumberish]
  const bnbPrice = Number(BigInt(reservesBNB[1]) / BigInt(reservesBNB[0]))

  const {
    landTokenV2Contract,
    lpTokenV2Contract,
    price,
  } = useGlobalContext();
  const {
    balanceMigration,
    landTokenStakeCurrentDepositTotal,
    landTokenStakeCurrentDepositTotal2,
    AutoLandV1Contract,
    landStakeContractV2,
    landStakeContractV3,
  } = useMigrationContext();
  const {
    contract: {
      landTokenContract,
      lpTokenContract,
      landStakeAutoContract,
      landStakeContractLP,
    },
  } = useLandshareV1Context();
  const {
    contract: { masterchefContract },
    balance: { masterChefDepositBalance },
    value: { rewardPool2 },
  } = useLandshareV2Context();

  const {
    startTransaction,
    startTransactionRefresh,
    endTransaction,
    transactionResult,
    state,
  } = useLandshareFunctions();

  useEffect(() => {
    updateLPFarm();
    landPerYear();
  }, []);

  useEffect(() => {
    if (masterchefContract) {
      getAPY();
    }
  }, [masterchefContract]);

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
    checkAllowance,
    approveLandv2Auto,
    approveLandv2Masterchief,
    approveLPMasterchief,
    isSuccessApprove,
    setIsSuccessApprove,
  } = useMigrateApproveLandv2({
    state,
    startTransaction,
    endTransaction,
    transactionResult,
    amount,
  });

  const {
    depositAutoLandv2,
    depositLandv2,
    depositLP,
    isSuccessDeposit,
    setIsSuccessDeposit,
  } = useMigrateDepositLandv2({
    state,
    startTransaction,
    endTransaction,
    transactionResult,
  });

  const { splitLP, isSuccessSplit, amountSplitedTokens, setIsSuccessSplit } =
    useSplitLP({
      state,
      startTransactionRefresh,
      endTransaction,
      transactionResult,
    });

  const { recombine, isSuccessRecombine, setIsSuccessRecombine } = useRecombine(
    {
      state,
      startTransactionRefresh,
      endTransaction,
      transactionResult,
    }
  );

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
      } else if (Number(currentStep) > 3 && masterChefDepositBalance) {
        return masterChefDepositBalance;
      } else {
        return 0;
      }
    } else if (isStakingV3()) {
      if (Number(currentStep) < 3 && balanceMigration.depositV3) {
        return balanceMigration.depositV3;
      } else if (Number(currentStep) > 3 && masterChefDepositBalance) {
        return masterChefDepositBalance;
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
      return Number(currentStep) < 3 ? rewardLandV2 : rewardPool2;
    } else if (isStakingV3()) {
      return Number(currentStep) < 3 ? rewardLandV3 : rewardPool2;
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

      const totalBNBValueinLPContract = Number(formatEther(totalBNBinLPContract)) * Number(bnbPrice);
      let totalLANDValueinLPContract = 0;
      try {
        totalLANDValueinLPContract = Number(formatEther(totalLANDinLPContract?.toString() || '0')) * Number(price);
      } catch (error: any) {
        console.warn('Error calculating LAND value, defaulting to 0:', error.message);
        totalLANDValueinLPContract = 0;
      }
      const totalUSDValue = Number(totalLANDValueinLPContract) + Number(totalBNBValueinLPContract);

      const percentageOfLPInVault = Number(totalLPInVault) / Number(totalLPV2Supply == 0 ? 1 : totalLPV2Supply);
      const USDValueinVault = Number(percentageOfLPInVault) * totalUSDValue;
      setTVL(USDValueinVault);
      const totalMoneyAnnual = 365 * Number(allocPoints[1]) * Number(price);
      const farmAPR = (totalMoneyAnnual / USDValueinVault) * 100;

      setAPR(farmAPR);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function landPerYear() {
    const landPerBlock = await masterchefContract.landPerBlock();

    const annualLand = BigInt(landPerBlock) * (BigInt("10512000"))

    const totalLandPerYear = BigInt(annualLand) * (BigInt(allocPoints[1])) / (BigInt(totalAllocPoint));

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
        <div className="flex justify-center w-full font-bold text-gray-800">
          Deposit
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            {isStakingAutoV2() || isStakingAutoV3() ? "APY" : "APR"}
            <img
              className="cursor-pointer"
              onClick={() => {
                setDetails("APY");
              }}
              src={isDarkMode ? DetailsIconDark : DetailsIcon}
              alt="details"
            />
            <div
              ref={wrapperRef}
              className={`absolute z-10 bg-white p-4 rounded-lg shadow-lg ${
                details === "APY" ? "block" : "hidden"
              }`}
            >
              <div className="relative text-gray-800 text-sm">
                The Auto LAND Vault automatically redeposits accrued LAND
                rewards. APY is estimated based on daily compounding with a 2%
                performance fee. All figures are estimated and by no means
                represent guaranteed returns.
              </div>
              <img
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => {
                  setDetails(0);
                }}
                src={CloseIcon}
                alt="close"
              />
            </div>
          </div>
          <div>{abbreviateNumber(isLP() ? APR.toString() : getAPY()) + "%"}</div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div>TVL</div>
          <div>
            {isLP()
              ? "$" + abbreviateNumber(TVL?.toString().substr(0, 8))
              : abbreviateNumber(
                  formatEther(
                    (isStakingAutoV2() || isStakingAutoV3()
                      ? landTokenStakeCurrentDepositTotal
                      : landTokenStakeCurrentDepositTotal2
                    ).toString()
                  )
                )}
          </div>
        </div>
      </>
    );
  }

  function withdrawInfo() {
    return (
      <>
        <div className="flex justify-center w-full font-bold text-gray-800"></div>
        <div className="flex justify-between items-center w-full">
          <div>Deposit</div>
          <div>
            {formatEther(getDepositBalance().toString())
              .substr(0, 8)}
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            Reward
            <img
              className="cursor-pointer"
              onClick={() => {
                setDetails("Reward");
              }}
              src={isDarkMode ? DetailsIconDark : DetailsIcon}
              alt="details"
            />
            <div
              ref={wrapperRef}
              className={`absolute z-10 bg-white p-4 rounded-lg shadow-lg ${
                details === "Reward" ? "block" : "hidden"
              }`}
            >
              <div className="relative text-gray-800 text-sm">
                The Auto LAND Vault automatically redeposits accrued LAND
                rewards. APY is estimated based on daily compounding with a 2%
                performance fee. All figures are estimated and by no means
                represent guaranteed returns.
              </div>
              <img
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => {
                  setDetails(0);
                }}
                src={CloseIcon}
                alt="close"
              />
            </div>
          </div>
          <div>
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
      let value = await landTokenContract.balanceOf(address);
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
      bnb: bnbBalance
    });

    let balance1ETH = formatEther(balanceOfLandV1);
    let balance2ETH = formatEther(balanceOfLandV2);
    let balancelp1ETH = formatEther(balanceOfLpToken);
    let balancelp2ETH = formatEther(balanceOfLpTokenV2);
    let bnbBalanceETH = formatEther(bnbBalance);
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
          createOldContracts();
        });
      } else if (isStakingAutoV3()) {
        await withdrawStakingAutoV3(amountLS).then(() => {
          createOldContracts();
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
      amountLS = parseEther(amountLS).toString();
      await tokenMigrate(amountLS);
      updateUserBalance()
      getBalance();
    }
  };

  useEffect(async () => {
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
          approved = await checkAllowance(
            landTokenV2Contract,
            landTokenV2Contract,
            process.env.REACT_APP_AUTOLANDV3
          );
        } else if (isStakingV2() || isStakingV3()) {
          approved = await checkAllowance(
            landTokenV2Contract,
            landTokenV2Contract,
            process.env.REACT_APP_MASTERCHEF
          );
        } else if (isLP()) {
          approved = await checkAllowance(
            lpTokenV2Contract,
            lpTokenV2Contract,
            process.env.REACT_APP_MASTERCHEF
          );
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
      expectedLandV2,
      expectedEthV2
    );
  };

  useEffect(() => {
    if (expectedEthV2.toString() !== "0") {
      processRecombine();
    }
  }, [expectedEthV2]);

  useEffect(async () => {
    if (isSuccessRecombine) {
      updateUserBalance()
      getBalance();
      setAmount(0);

      let approved = false;
      if (isStakingAutoV2() || isStakingAutoV3()) {
        approved = await checkAllowance(
          landTokenV2Contract,
          landTokenV2Contract,
          process.env.REACT_APP_AUTOLANDV3
        );
      } else if (isStakingV2() || isStakingV3()) {
        approved = await checkAllowance(
          landTokenV2Contract,
          landTokenV2Contract,
          process.env.REACT_APP_MASTERCHEF
        );
      } else if (isLP()) {
        approved = await checkAllowance(
          lpTokenV2Contract,
          lpTokenV2Contract,
          process.env.REACT_APP_MASTERCHEF
        );
      }
      console.log(approved);
      if (approved) setIsSuccessApprove(true);
      else setCurrentStep(3);
    }
  }, [isSuccessRecombine]);

  const processStep3 = async () => {
    if (isStakingAutoV2() || isStakingAutoV3()) {
      await approveLandv2Auto();
    } else if (isStakingV2() || isStakingV3()) {
      await approveLandv2Masterchief();
    } else if (isLP()) {
      approveLPMasterchief();
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
        await depositAutoLandv2(amountLS).then(async () => {
          updateUserBalance()
          await getBalance();
        });
      } else if (isStakingV2() || isStakingV3()) {
        await depositLandv2(amountLS).then(async () => {
          updateUserBalance()
          await getBalance();
        });
      } else if (isLP()) {
        await depositLP(amountLS).then(async () => {
          updateUserBalance()
          await getBalance();
        });
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
      <div className={`flex justify-between p-2 px-4 rounded-md ${
        currentStep == 1 ? "bg-white/30" : ""
      }`}>
        <div className="flex items-center gap-2">
          Step-1
          <img
            className="cursor-pointer"
            onClick={() => {
              setDetails(1);
            }}
            src={isDarkMode ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <button
          onClick={processStep1}
          className="bg-[#61cd81] hover:bg-[#1ee155] active:bg-[#06b844] text-white font-semibold text-sm py-2 px-4 rounded-md transition-colors"
          disabled={currentStep != 1 || (getDepositBalance() == 0 && !isSkippable())}
        >
          {isSkippable() ? "Skip" : "Withdraw"}
        </button>
        <div
          ref={wrapperRef}
          className={`absolute z-10 bg-white p-4 rounded-lg shadow-lg ${
            details === 1 ? "block" : "hidden"
          }`}
        >
          <div className="relative text-gray-800 text-sm">
            {isLP() ? "Withdraw LP Tokens" : "Withdraw old token from old vault."}
          </div>
          <img
            className="absolute top-2 right-2 cursor-pointer"
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
      <div className={`flex justify-between p-2 px-4 rounded-md ${
        currentStep == "lp-2" ? "bg-white/30" : ""
      }`}>
        <div className="flex items-center gap-2">
          Step-2
          <img
            className="cursor-pointer"
            onClick={() => {
              setDetails("lp-2");
            }}
            src={isDarkMode ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <div>
          <button
            onClick={() => setMinValues(amount)}
            className="bg-[#61cd81] hover:bg-[#1ee155] active:bg-[#06b844] text-white font-semibold text-sm py-2 px-4 rounded-md transition-colors"
            disabled={currentStep != "lp-2"}
          >
            Unpair
          </button>
        </div>
        <div
          ref={wrapperRef}
          className={`absolute z-10 bg-white p-4 rounded-lg shadow-lg ${
            details === "lp-2" ? "block" : "hidden"
          }`}
        >
          <div className="relative text-gray-800 text-sm">
            Split LP tokens back to LAND and BNB.
          </div>
          <img
            className="absolute top-2 right-2 cursor-pointer"
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
      <div className={`flex justify-between p-2 px-4 rounded-md ${
        currentStep == 2 ? "bg-white/30" : ""
      }`}>
        <div className="flex items-center gap-2">
          {isLP() ? "Step-3" : "Step-2"}
          <img
            className="cursor-pointer"
            onClick={() => {
              setDetails(2);
            }}
            src={isDarkMode ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <div>
          <button
            onClick={processStep2}
            className="bg-[#61cd81] hover:bg-[#1ee155] active:bg-[#06b844] text-white font-semibold text-sm py-2 px-4 rounded-md transition-colors"
            disabled={currentStep != 2}
          >
            Migrate
          </button>
        </div>
        <div
          ref={wrapperRef}
          className={`absolute z-10 bg-white p-4 rounded-lg shadow-lg ${
            details === 2 ? "block" : "hidden"
          }`}
        >
          <div className="relative text-gray-800 text-sm">
            Migrate old tokens to new tokens.
          </div>
          <img
            className="absolute top-2 right-2 cursor-pointer"
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
      <div className={`flex justify-between p-2 px-4 rounded-md ${
        currentStep == "lp-4" ? "bg-white/30" : ""
      }`}>
        <div className="flex items-center gap-2">
          Step-4
          <img
            className="cursor-pointer"
            onClick={() => {
              setDetails("lp-4");
            }}
            src={isDarkMode ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <div>
          <button
            onClick={() => setMinValuesV2(amountSplitedTokens.land)}
            className="bg-[#61cd81] hover:bg-[#1ee155] active:bg-[#06b844] text-white font-semibold text-sm py-2 px-4 rounded-md transition-colors"
            disabled={currentStep != "lp-4"}
          >
            Combine
          </button>
        </div>
        <div
          ref={wrapperRef}
          className={`absolute z-10 bg-white p-4 rounded-lg shadow-lg ${
            details === "lp-4" ? "block" : "hidden"
          }`}
        >
          <div className="relative text-gray-800 text-sm">
            Recombine BNB and new LAND in LP pair.
          </div>
          <img
            className="absolute top-2 right-2 cursor-pointer"
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
      <div className={`flex justify-between p-2 px-4 rounded-md ${
        currentStep == 3 ? "bg-white/30" : ""
      }`}>
        <div className="flex items-center gap-2">
          {isLP() ? "Step-5" : "Step-3"}
          <img
            className="cursor-pointer"
            onClick={() => {
              setDetails(3);
            }}
            src={isDarkMode ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <button
          onClick={processStep3}
          className="bg-[#61cd81] hover:bg-[#1ee155] active:bg-[#06b844] text-white font-semibold text-sm py-2 px-4 rounded-md transition-colors"
          disabled={currentStep != 3}
        >
          Approve
        </button>
        <div
          ref={wrapperRef}
          className={`absolute z-10 bg-white p-4 rounded-lg shadow-lg ${
            details === 3 ? "block" : "hidden"
          }`}
        >
          <div className="relative text-gray-800 text-sm">
            Approve new vault.
          </div>
          <img
            className="absolute top-2 right-2 cursor-pointer"
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
      <div className={`flex justify-between p-2 px-4 rounded-md ${
        currentStep == 4 ? "bg-white/30" : ""
      }`}>
        <div className="flex items-center gap-2">
          {isLP() ? "Step-6" : "Step-4"}
          <img
            className="cursor-pointer"
            onClick={() => {
              setDetails(4);
            }}
            src={isDarkMode ? DetailsIconDark : DetailsIcon}
            alt="details"
          />
        </div>
        <button
          onClick={processStep4}
          className="bg-[#61cd81] hover:bg-[#1ee155] active:bg-[#06b844] text-white font-semibold text-sm py-2 px-4 rounded-md transition-colors"
          disabled={currentStep != 4}
        >
          Deposit
        </button>
        <div
          ref={wrapperRef}
          className={`absolute z-10 bg-white p-4 rounded-lg shadow-lg ${
            details === 4 ? "block" : "hidden"
          }`}
        >
          <div className="relative text-gray-800 text-sm">
            Deposit in new vault.
          </div>
          <img
            className="absolute top-2 right-2 cursor-pointer"
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
      <div className="flex flex-col lg:flex-row rounded-xl">
        <div className="p-5 lg:px-10">
          <img
            src={isLP() ? LPLogo : isStakingAutoV3() || isStakingAutoV2() ? AutoLANDIcon : LandsharLogo}
            alt="landshare"
            className="w-40 lg:w-52"
          />
        </div>
        <div className="flex flex-col w-full gap-5 p-5">
          <div className="font-bold text-2xl lg:text-3xl text-center capitalize">
            {vaultName === "LP Farm" ? "LAND-BNB LP" : vaultName}
          </div>
          <div className="flex flex-col w-full gap-5">
            <div className="flex flex-col w-full gap-5">
              <div className={`flex w-full justify-between p-4 bg-gray-100 rounded-xl ${
                currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === "lp-4" ? "disabled" : ""
              }`}>
                <input
                  onChange={handleChangeAmount}
                  value={amount}
                  disabled={currentStep === 1 || currentStep === 3 || currentStep === 2 || currentStep === "lp-4"}
                  className="w-full font-bold text-lg capitalize text-black"
                />
                <button
                  onClick={setMaxAmount}
                  className="font-bold text-lg text-[#61cd81] hover:text-[#1ee155] active:text-[#06b844] transition-colors"
                  disabled={currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === "lp-4"}
                >
                  MAX
                </button>
              </div>
              <div className="text-right text-gray-800">
                Balance: <b>{balance}</b>
              </div>
            </div>
            {Number(currentStep) >= 3 && (
              <div className="flex justify-between items-center">{depositInfo()}</div>
            )}
            <div className="flex justify-between items-center">{withdrawInfo()}</div>
            <div className="flex flex-col gap-2">
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
