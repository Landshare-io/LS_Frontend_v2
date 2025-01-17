import { Address } from "viem";
import useTotal from "./useTotal";
import useTotalShares from "./useTotalShares";
import useUserInfo from "./useUserInfo";
import { BigNumberish } from "ethers";
import { AUTO_VAULT_MAIN_CHAINS } from "../../../config/constants/environments";

export default function useCcipVaultBalance(chainId: number, address: Address | undefined) {
  const { data: total } = useTotal(AUTO_VAULT_MAIN_CHAINS[0].id) as { data: BigNumberish }
  const { data: totalShares } = useTotalShares(AUTO_VAULT_MAIN_CHAINS[0].id) as { data: BigNumberish }
  const { data: userInfo } = useUserInfo(AUTO_VAULT_MAIN_CHAINS[0].id, address) as { data: [BigNumberish, BigNumberish, BigNumberish, BigNumberish] }

  const autoLandV3 = totalShares ? BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) : 0
  const autoReward = totalShares ? 
    (BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) - BigInt(userInfo[2]) > 0 ? (BigInt(userInfo[0]) * BigInt(total) / BigInt(totalShares) - BigInt(userInfo[2])) : 0)
    : 0

  return {
    total,
    totalSharesV3: totalShares,
    autoLandV3,
    autoReward
  }
}
