import { useWriteContract } from "wagmi";
import { parseUnits } from "ethers";
import { BigNumberish } from "ethers";
import { config } from "../../../wagmi";
import CrossChainSenderAbi from "../../../abis/CrossChainSender.json"
import { 
  GAS_COSTS,
  MAJOR_WORK_CHAIN,
  CCIP_CHAIN_ID,
  CCIP_CHAIN_RECEIVER,
  CCIP_CHAIN_SENDER_CONTRACT_ADDRESS 
} from "../../../config/constants/environments";

export default function useTransfer(chainId: number) {
  const {
    data,
    isPending,
    isError,
    writeContract
  } = useWriteContract();

  async function transfer(chainId: number, amount: BigNumberish, action: number, feeNumber: number, feeAmount: number) {
    writeContract({
      address: CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId],
      abi: CrossChainSenderAbi,
      functionName: "transfer",
      chainId: chainId,
      args: [
        CCIP_CHAIN_ID[MAJOR_WORK_CHAIN.id],
        CCIP_CHAIN_RECEIVER[MAJOR_WORK_CHAIN.id],
        amount,
        action,
        feeNumber,
        feeAmount,
      ],
      value: parseUnits(GAS_COSTS[chainId].toString(), 18),
      gas: BigInt("1000000")
    })
  }

  return {
    transfer,
    isPending,
    isError,
    data
  }
}
