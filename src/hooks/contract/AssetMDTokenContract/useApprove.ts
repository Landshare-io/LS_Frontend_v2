import { useWriteContract } from 'wagmi'
import { Address } from 'viem';
import { BigNumberish } from 'ethers';
import { bsc } from 'viem/chains';
import AssetToken from "../../../abis/AssetToken.json";
import { ASSET_MD_TOKEN_ADDRESS } from "../../../config/constants/environments";

export default function useApprove() {
  const {
    data,
    isError,
    isPending,
    writeContract
  } = useWriteContract();

  async function approve(approveAddress: Address, amount: number | BigNumberish) {
    await writeContract({
      address: ASSET_MD_TOKEN_ADDRESS,
      abi: AssetToken,
      functionName: "approve",
      chainId: bsc.id,
      args: [approveAddress, amount]
    });
  }

  return {
    approve,
    isPending,
    isError,
    data
  }
}
