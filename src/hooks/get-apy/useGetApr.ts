import { useReadContracts } from "wagmi";
import { bsc } from "viem/chains";
import { formatEther } from "ethers";
import MasterchefAbi from '../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../config/constants/environments";

const SECONDS_PER_YEAR = 31_536_000
const BLOCK_TIME_SECONDS = 0.45
const BLOCKS_PER_YEAR = Math.floor(SECONDS_PER_YEAR / BLOCK_TIME_SECONDS)

export default function useGetApr(chainId: number) {
  const { data, isError, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
        abi: MasterchefAbi,
        functionName: "landPerBlock",
        chainId: bsc.id
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
        abi: MasterchefAbi,
        functionName: "BONUS_MULTIPLIER",
        chainId: bsc.id
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
        abi: MasterchefAbi,
        functionName: "poolInfo",
        args: [0],
        chainId: bsc.id
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
        abi: MasterchefAbi,
        functionName: "totalAllocPoint",
        chainId: bsc.id
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
        abi: MasterchefAbi,
        functionName: "totalStaked",
        chainId: bsc.id
      }
    ]
  }) as { data: any[], isError: boolean, isLoading: boolean, error: any }

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching APR error', error)
    return 0
  }

  const landPerBlock = BigInt(data?.[0]?.result ?? 0)
  const bonusMultiplier = BigInt(data?.[1]?.result ?? 1)
  const allocPoint = BigInt(data?.[2]?.result?.[1] ?? 0)
  const totalAllocPoint = BigInt(data?.[3]?.result ?? 0)
  const totalStaked = BigInt(data?.[4]?.result ?? 0)

  if (totalAllocPoint === 0n || totalStaked === 0n) return "0.00"

  // annualEmissionPool = landPerBlock * bonusMultiplier * blocksPerYear * allocPoint / totalAllocPoint
  const annualEmissionPool = (landPerBlock * bonusMultiplier * BigInt(BLOCKS_PER_YEAR) * allocPoint) / totalAllocPoint

  const annualEmissionPoolTokens = Number(formatEther(annualEmissionPool))
  const totalStakedTokens = Number(formatEther(totalStaked))

  const apr = totalStakedTokens > 0
    ? ((annualEmissionPoolTokens / totalStakedTokens) * 100).toFixed(2)
    : "0.00"

  return apr
}
