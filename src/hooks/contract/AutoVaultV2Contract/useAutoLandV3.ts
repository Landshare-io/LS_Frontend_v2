import { Address } from "viem";
import { BigNumberish } from "ethers";
import useTotal from "./useTotal";
import useUserInfo from "./useUserInfo";
import useTotalShares from "./useTotalShares";

export default function useAutoLandV3(address: Address | undefined) {
  const { data: total } = useTotal() as { data: BigNumberish };
  const { data: userInfo } = useUserInfo({ address }) as { data: BigNumberish[] };
  const { data: totalShares } = useTotalShares() as { data: BigNumberish };

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
