import { useEffect, useState } from "react";
import { BigNumberish, formatEther } from "ethers";
import {
  RWA_LP_CONTRACT_ADDRESS,
  MASTERCHEF_CONTRACT_ADDRESS,
} from "../../config/constants/environments";

import useBalanceOfRwaLp from "../contract/RwaLpTokenContract/useBalanceOf";
import useBalanceOfUsdt from "../contract/UsdtContract/useBalanceOf";
import useBalanceOfRwa from "../contract/RWAContract/useBalanceOf";
import useTotalSupplyOfRwaLp from "../contract/RwaLpTokenContract/useTotalSupply";
import useGetRwaPrice from "../contract/APIConsumerContract/useGetRwaPrice";

export default function useLsrwaUsdtLpTvl(chainId: number) {
  const lpAddress = RWA_LP_CONTRACT_ADDRESS[chainId];
  const chefAddress = MASTERCHEF_CONTRACT_ADDRESS[chainId];

  const { data: usdtBal } = useBalanceOfUsdt(chainId, lpAddress) as { data: BigNumberish };
  const { data: lsrwaBal } = useBalanceOfRwa(chainId, lpAddress) as { data: BigNumberish };
  const { data: lpInChef } = useBalanceOfRwaLp(chainId, chefAddress) as { data: BigNumberish };

  const lpSupply = useTotalSupplyOfRwaLp(chainId) as BigNumberish;
  const rwaPrice = useGetRwaPrice(chainId) as BigNumberish;

  const [tvlUsd, setTvlUsd] = useState(0);

  useEffect(() => {
    if (!usdtBal || !lsrwaBal || !lpSupply || !lpInChef || !rwaPrice) return;

    try {
      const usdt = Number(formatEther(usdtBal));
      const lsrwa = Number(formatEther(lsrwaBal));
      const price = Number(formatEther(rwaPrice));
      const lpTotal = Number(formatEther(lpSupply));
      const lpStaked = Number(formatEther(lpInChef));

      const totalValue = usdt + (lsrwa * price) / 2; // ✅ HALVE LSRWA VALUE
      const vaultPortion = lpStaked / lpTotal;

      setTvlUsd(totalValue * vaultPortion);
    } catch (err) {
      console.error("Failed to calculate LSRWA-USDT TVL", err);
    }
  }, [usdtBal, lsrwaBal, lpSupply, lpInChef, rwaPrice]);

  return tvlUsd;
}
