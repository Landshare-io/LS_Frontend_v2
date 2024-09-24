import { useReadContracts } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../config/constants/environments";
import { toBigInt } from "ethers";

export default function useLandPerBlock() {
  const { data, isError, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: MASTERCHEF_CONTRACT_ADDRESS,
        abi: MasterchefAbi,
        functionName: "landPerBlock",
        chainId: bsc.id
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS,
        abi: MasterchefAbi,
        functionName: "poolInfo",
        args: [0],
        chainId: bsc.id
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS,
        abi: MasterchefAbi,
        functionName: "totalAllocPoint",
        chainId: bsc.id
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS,
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

  const annualLand = data[0].result * toBigInt("10512000");
  const totalLandPerYear = annualLand * data[1].result[1] / data[2].result;
  const apr = ((Number(totalLandPerYear) / Number(data[3].result)) * 100).toFixed(2);

  return apr
}
