import { Address } from "viem";
import { BigNumberish } from "ethers";
import useTotal from "./useTotal";
import useUserInfo from "./useUserInfo";
import useTotalShares from "./useTotalShares";

export default function useAutoLandV3(chainId: number, address: Address | undefined) {
  const { data: total, refetch:refetchTotal, isLoading: isTotalLoading } = useTotal(chainId) as { data: BigNumberish, refetch: Function, isLoading: boolean };
  const { data: userInfo, refetch: refetchUserInfo, isLoading: isUserInfoLoading } = useUserInfo({ chainId, address }) as { data: BigNumberish[], refetch: Function, isLoading: boolean };
  const { data: totalShares, refetch: refetchTotalShares, isLoading: isTotalShareLoading } = useTotalShares(chainId) as { data: BigNumberish, refetch: Function, isLoading: boolean };

  const autoLandV3 = totalShares && BigInt(userInfo[0]) > BigInt(1) ? BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) : 0
  const autoReward = totalShares ? 
    (BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) - BigInt(userInfo[2]) > 0 ? (BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) - BigInt(userInfo[2])) : 0) 
  : 0

  function refetch() {
    refetchTotal();
    refetchUserInfo();
    refetchTotalShares();
  }

  return {
    total,
    totalSharesV3: totalShares,
    autoLandV3,
    autoReward,
    refetch,
    isLoading : isTotalLoading || isUserInfoLoading || isTotalShareLoading
  }
}
