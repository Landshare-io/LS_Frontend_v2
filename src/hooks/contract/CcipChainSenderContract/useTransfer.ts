import { useWriteContract } from "wagmi";
import { bsc } from "viem/chains";
import CrossChainSenderAbi from "../../../abis/CrossChainSender.json"
import { 
  GAS_COSTS,
  CCIP_CHAIN_ID,
  CCIP_CHAIN_RECEIVER,
  CCIP_CHAIN_SENDER_CONTRACT_ADDRESS 
} from "../../../config/constants/environments";
import { BigNumberish, parseEther } from "ethers";

export default function useTransfer() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function transfer(chainId: number, amount: BigNumberish) {
    await writeContract({
      address: CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId],
      abi: CrossChainSenderAbi,
      functionName: "transfer",
      chainId: bsc.id,
      args: [
        CCIP_CHAIN_ID[56],
        CCIP_CHAIN_RECEIVER[56],
        amount,
        0,
        0,
        500000,
        {
          value: GAS_COSTS[chainId],
          gasLimit: BigInt("1000000")
        }
      ]
    });
  }

  return {
    transfer,
    isPending,
    data
  }
}
