import { useWriteContract } from "wagmi";
import { parseUnits } from "ethers";
import { BigNumberish } from "ethers";
import { bsc, bscTestnet } from "viem/chains";
import CrossChainSenderAbi from "../../../abis/CrossChainSender.json"
import { 
  GAS_COSTS,
  IS_TEST_MODE,
  CCIP_CHAIN_ID,
  CCIP_CHAIN_RECEIVER,
  CCIP_CHAIN_SENDER_CONTRACT_ADDRESS 
} from "../../../config/constants/environments";

export default function useTransfer(chainId: number) {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function transfer(chainId: number, amount: BigNumberish, action: number, feeNumber: number, feeAmount: number) {
    await writeContract({
      address: CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId],
      abi: CrossChainSenderAbi,
      functionName: "transfer",
      chainId: chainId,
      args: [
        CCIP_CHAIN_ID[IS_TEST_MODE ? bscTestnet.id : bsc.id],
        CCIP_CHAIN_RECEIVER[IS_TEST_MODE ? bscTestnet.id : bsc.id],
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
    data
  }
}
