import { bsc } from "viem/chains";
import { Address } from "viem";
import { BigNumberish } from "ethers";
import useUserInfoOfLandStakeV2 from "../LandTokenStakeV2/useUserInfo";
import useUserInfoOfLandStakeV3 from "../LandTokenStakeV3/useUserInfo";
import useUserInfoOfAutoLandV2 from "../AutoLandV2Contract/useUserInfo";
import useUserInfoOfAutoVaultV3 from "../AutoVaultV3Contract/useUserInfo";
import useUserInfoOfLandLPFarm from "../LandLPFarmContract/useUserInfo";

interface useMigrationBalanceProps {
  address: Address | undefined
}

export default function useMigrationBalance({ address }: useMigrationBalanceProps) {
  const { data: userInfoOfLandStakeV2 } = useUserInfoOfLandStakeV2({ address }) as { data: [BigNumberish, BigNumberish] }
  const { data: userInfoOfLandStakeV3 } = useUserInfoOfLandStakeV3({ address }) as { data: [BigNumberish, BigNumberish] }
  const { data: userInfoOfAutoLandV2 } = useUserInfoOfAutoLandV2({ address }) as { data: [BigNumberish, BigNumberish, BigNumberish, BigNumberish] }
  const { data: userInfoOfAutoVaultV3 } = useUserInfoOfAutoVaultV3({ chainId: bsc.id, address }) as { data: [BigNumberish, BigNumberish, BigNumberish, BigNumberish] }
  const { data: userInfoOfLandLPFarm } = useUserInfoOfLandLPFarm({ address }) as { data: [BigNumberish, BigNumberish] }

  return {
    depositV2: userInfoOfLandStakeV2[0],
    depositV3: userInfoOfLandStakeV3[0],
    depositAuto: userInfoOfAutoLandV2[0],
    depositAutoV3: userInfoOfAutoVaultV3[0],
    depositLP: userInfoOfLandLPFarm[0]
  }
}
