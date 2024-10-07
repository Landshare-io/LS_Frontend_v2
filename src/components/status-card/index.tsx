import { useState, useEffect } from "react";
import { useChainId } from "wagmi";
import Link from "next/link";
import { bsc } from "viem/chains";
import { FiExternalLink } from "react-icons/fi";
import { BigNumberish, formatEther } from "ethers";
import Counter from "../common/counter";
import { abbreviateNumber } from "../../utils/helpers/convert-numbers";
import useGetTotalValue from "../../hooks/contract/APIConsumerContract/useGetTotalValue";
import useGetPrice from "../../hooks/get-apy/useGetPrice";
import useBalanceOf from "../../hooks/contract/LandTokenContract/useBalanceOf";
import usePoolInfo from "../../hooks/contract/MasterchefContract/usePoolInfo";
import useWBNBBalanceOf from "../../hooks/contract/WBNBTokenContract/useBalanceOf";
import useLpTokenBalanceOf from "../../hooks/contract/LpTokenV2Contract/useBalanceOf";
import useTotalSupply from "../../hooks/contract/LpTokenV2Contract/useTotalSupply";
import useTotalStaked from "../../hooks/contract/MasterchefContract/useTotalStaked";
import useGetApy from "../../hooks/get-apy/useGetApy";
import { LP_TOKEN_V2_CONTRACT_ADDRESS, MASTERCHEF_CONTRACT_ADDRESS } from "../../config/constants/environments";
import { 
  getData,
  selectNetRentalPerMonth,
  selectAppreciation,
} from '../../lib/slices/firebase-slices/properties-rental';
import { useAppDispatch, useAppSelector } from "../../lib/hooks";

export default function StatusCard() {
  const dispatch = useAppDispatch();
  const chainId = useChainId()
  const netRentalPerMonth = useAppSelector(selectNetRentalPerMonth);
  const appreciation = useAppSelector(selectAppreciation);
  const [apr, setApr] = useState(0);
  const [vaultBal, setVaultBal] = useState(0);
  const apy = useGetApy(chainId);
  const { bnbPrice, coinPrice: coin } = useGetPrice(chainId)
  const allocPoints = usePoolInfo(chainId, 1) as any[];
  const totalPropertyValue = useGetTotalValue(chainId) as BigNumberish;
  const { data: landAmountInLp } = useBalanceOf({ chainId, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish };
  const { data: totalBNBinLp } = useWBNBBalanceOf({ chainId, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish };
  const { data: totalLpInVault } = useLpTokenBalanceOf({ chainId, address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id] }) as { data: BigNumberish };
  const { data: totalLpSupply } = useTotalSupply(chainId) as { data: BigNumberish };
  const { data: totalDeposited } = useTotalStaked(chainId) as { data: BigNumberish };

  useEffect(() => {
    dispatch(getData())
    const totalBNBValueinLpContract = Number(formatEther(totalBNBinLp)) * Number(bnbPrice);
    const totalLANDValueinLpContract = Number(formatEther(landAmountInLp)) * Number(coin) * Number(bnbPrice);
    const totalUSDValue = totalBNBValueinLpContract + totalLANDValueinLpContract;
    const percentageOfLPInVault = Number((totalLpInVault)) / Number((totalLpSupply));
    const USDValueinVault = percentageOfLPInVault * totalUSDValue;
    const totalMoneyAnnual = 365 * Number(allocPoints[1]) * Number(coin) * Number(bnbPrice);
    const farmApr = (totalMoneyAnnual / USDValueinVault) * 100;
    const vaultBalance = Number(USDValueinVault) + Number(formatEther(totalPropertyValue)) + Number(Number(coin) * Number(bnbPrice) * Number(formatEther(totalDeposited)));
    setApr(farmApr);
    setVaultBal(vaultBalance);
  }, [totalBNBinLp, landAmountInLp, totalLpInVault, totalLpSupply, allocPoints, totalDeposited])

  return (
    <div className="bg-primary">
      <div className="flex w-full justify-center items-center px-[20px] translate-y-[60px]">
        <div className="max-w-[1200px] w-full bg-secondary py-[30px] grid grid-cols-4 justify-between px-[16px] lg:px-[0px] gap-y-[40px] relative border-2 border-[#fff] dark:border-[#42444d] rounded-[20px] shadow shadow-lg">
        <div className="col-span-2 md:col-span-1 h-full flex flex-col justify-center space-y-2 p-[0px] border-r-[0px] border-[#61cd81] md:border-r-[2px]">
          <div className="w-full text-center text-xl md:text-2xl font-bold flex justify-center text-text-primary">
              <Counter duration={10} formatType={"dollar"} number={vaultBal.toString()} decimal={0}></Counter>
            </div>
            <div className="flex items-end gap-[4px] justify-center w-full text-center text-[12px] md:text-sm text-text-secondary font-medium">
              Total Value Locked
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 h-full flex flex-col justify-center space-y-2 p-[0px] border-r-[0px] border-[#61cd81] md:border-r-[2px]">
            <div className="w-full text-center text-xl md:text-2xl font-bold flex justify-center text-text-primary">
              <Counter duration={10} number={abbreviateNumber(Number(apy.toFixed(2)))} decimal={2} formatType={"percent"}></Counter>
            </div>
            <div className="flex items-end justify-center gap-[4px] w-full text-center text-[12px] md:text-sm text-text-secondary font-medium">
              Staking APY <Link href="/vaults"><FiExternalLink className="text-[#61cd81] mb-1" /></Link>
            </div>
          </div>
          <div className="absolute w-[80%] top-[50%] left-[50%] transform -translate-x-1/2 h-[2px] block md:hidden">
            <div className="w-full h-full bg-[#61cd81] "></div>
          </div>
          <div className="col-span-2 md:col-span-1 h-full flex flex-col justify-center space-y-2 p-[0px] border-r-[0px] border-[#61cd81] md:border-r-[2px]">
            <div className="w-full text-center text-xl md:text-2xl font-bold flex justify-center text-text-primary">
              <Counter duration={10} number={abbreviateNumber(Number(apr.toFixed(0)))} decimal={2} formatType={"percent"}></Counter>
            </div>
            <div className="flex items-end justify-center gap-[4px] w-full text-center text-[12px] md:text-sm text-text-secondary font-medium">
              LP Farm APR <Link href="/vaults"><FiExternalLink className="text-[#61cd81] mb-1" /></Link>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 h-full flex flex-col justify-center space-y-2 p-[0px]">
            <div className="w-full text-center text-xl md:text-2xl font-bold flex justify-center text-text-primary">
              <Counter duration={10} number={Number(
                netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100 + appreciation / Number(formatEther(totalPropertyValue))
              ).toFixed(3)} decimal={2} formatType={"percent"}></Counter>
            </div>
            <div className="flex items-end justify-center gap-[4px] w-full text-center text-[12px] md:text-sm text-text-secondary font-medium">
              RWA APR <Link href="/rwa"><FiExternalLink className="text-[#61cd81] mb-1" /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

