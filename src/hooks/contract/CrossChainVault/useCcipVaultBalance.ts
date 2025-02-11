import { Address } from "viem";
import useTotal from "./useTotal";
import useTotalShares from "./useTotalShares";
import useUserInfo from "./useUserInfo";
import { BigNumberish } from "ethers";
import { AUTO_VAULT_MAIN_CHAINS } from "../../../config/constants/environments";

export default function useCcipVaultBalance(chainId: number, address: Address | undefined) {
  const { data: total, isLoading: isTotalLoading } = useTotal(AUTO_VAULT_MAIN_CHAINS[0].id) as { data: BigNumberish, isLoading: boolean }
  const { data: totalShares, isLoading: isTotalSharesLoading } = useTotalShares(AUTO_VAULT_MAIN_CHAINS[0].id) as { data: BigNumberish, isLoading: boolean }
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo(AUTO_VAULT_MAIN_CHAINS[0].id, address) as { data: [BigNumberish, BigNumberish, BigNumberish, BigNumberish], isLoading: boolean }

  const autoLandV3 = totalShares ? BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) : 0
  const autoReward = totalShares ? 
    (BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) - BigInt(userInfo[2]) > 0 ? (BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) - BigInt(userInfo[2])) : 0)
    : 0

  return {
    total,
    totalSharesV3: totalShares,
    autoLandV3,
    autoReward,
    isLoading: isTotalLoading || isUserInfoLoading || isTotalSharesLoading
  }
}
