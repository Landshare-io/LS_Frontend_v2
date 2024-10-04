import { useReadContract } from 'wagmi'
import CrossChainSenderAbi from "../../../abis/CrossChainSender.json"
import { CCIP_CHAIN_SENDER_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function useMinTransferAmount(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId],
    abi: CrossChainSenderAbi,
    functionName: "minTransferAmount",
    args: [],
    chainId: chainId
  })

  if (isLoading) return [0, 0]
  if (isError) {
    console.log('Fetching CcipChainSender minTransferAmount error', error)
    return 0
  }

  return data
}
