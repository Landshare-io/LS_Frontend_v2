import { useWriteContract } from 'wagmi'
import { bsc } from 'viem/chains';
import TokenMigrateAbi from "../../../abis/TokenMigrate.json";
import { TOKEN_MIGRATE_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useSwap() {
  const {
    data,
    isPending,
    writeContract
  } = useWriteContract();

  async function swap() {
    await writeContract({
      address: TOKEN_MIGRATE_CONTRACT_ADDRESS,
      abi: TokenMigrateAbi,
      functionName: "swap",
      chainId: bsc.id,
      args: []
    });
  }

  return {
    swap,
    isPending,
    data
  }
}
