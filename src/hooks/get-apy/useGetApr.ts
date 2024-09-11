import { useReadContracts } from "wagmi";
import { toBigInt } from "ethers";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../abis/Masterchef.json';
import { MASTERCHEFCONTRACT_ADDRESS } from "../../config/constants/environments";

export default function useLandPerBlock() {
  const { data } = useReadContracts({
    contracts: [
      {
        address: MASTERCHEFCONTRACT_ADDRESS,
        abi: MasterchefAbi,
        functionName: "landPerBlock",
        chainId: bsc.id
      },
      {
        address: MASTERCHEFCONTRACT_ADDRESS,
        abi: MasterchefAbi,
        functionName: "poolInfo",
        args: [0],
        chainId: bsc.id
      },
      {
        address: MASTERCHEFCONTRACT_ADDRESS,
        abi: MasterchefAbi,
        functionName: "totalAllocPoint",
        chainId: bsc.id
      },
      {
        address: MASTERCHEFCONTRACT_ADDRESS,
        abi: MasterchefAbi,
        functionName: "totalStaked",
        chainId: bsc.id
      }
    ]
  }) as { data: any[] }


  console.log('==========================data', data)

  const annualLand = toBigInt(data[0]) * toBigInt('10512000')
  const totalLandPerYear = annualLand * toBigInt(data[1][1]) / toBigInt(data[2])
  const apr = totalLandPerYear / toBigInt(data[3]) * toBigInt(100)

  return apr.toString()
}
