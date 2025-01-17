import { useWriteContract } from "wagmi";
import { parseUnits } from "ethers";
import { BigNumberish } from "ethers";
import CrossChainSenderAbi from "../../../abis/CrossChainSender.json"
import { 
  GAS_COSTS,
  AUTO_VAULT_MAIN_CHAINS,
  CCIP_CHAIN_ID,
  CCIP_CHAIN_RECEIVER,
  CCIP_CHAIN_SENDER_CONTRACT_ADDRESS 
} from "../../../config/constants/environments";

export default function useTransfer(chainId: number) {
  const {
    data,
    isPending,
    isError,
    error,
    writeContract
  } = useWriteContract();

  async function transfer(chainId: number, amount: BigNumberish, action: number, feeNumber: number, feeAmount: number) {
    writeContract({
      address: CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId],
      abi: CrossChainSenderAbi,
      functionName: "transfer",
      chainId: chainId,
      args: [
        CCIP_CHAIN_ID[AUTO_VAULT_MAIN_CHAINS[0].id],
        CCIP_CHAIN_RECEIVER[AUTO_VAULT_MAIN_CHAINS[0].id],
        amount,
        action,
        feeNumber,
        feeAmount,
      ],
      // value: parseUnits(GAS_COSTS[chainId].toString(), 18),
      // gas: BigInt("1000000")
    })
  }

  return {
    transfer,
    isPending,
    isError,
    error,
    data
  }
}
