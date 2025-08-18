import { ethers, formatUnits } from "ethers";
import vaultAbi from '@/abis/Vault.json';
import usdcAbi from "@/abis/ERC20.json";
import { formatNumber } from '@/utils/helpers/format-numbers'
import useGetRwaPrice from "../contract/APIConsumerContract/useGetRwaPrice";
import { useChainId, useWalletClient } from "wagmi";
import { BigNumberish, formatEther } from "ethers";
import { LSRWA_VAULT_ADDRESS, RWA_CONTRACT_ADDRESS } from "@/config/constants/environments";
import { Address } from "viem";
import { Web3Provider } from '@ethersproject/providers';

export function usePerformance() {
  const { data: walletClient } = useWalletClient();

  const chainId = useChainId()
  const rwaPrice = useGetRwaPrice(chainId) as BigNumberish;

  const VAULT_ADDRESS: Address = LSRWA_VAULT_ADDRESS[chainId];
  const fetchTotalValue = async (signer: any) => {

    const vault = new ethers.Contract(VAULT_ADDRESS, vaultAbi, signer);

    let users: any = [];
    const depsoitEvents = await vault.queryFilter("DepositApproved", 0, "latest");

    for (const event of depsoitEvents) {
      const { user } = (event as any).args;
      if (!users.includes(user)) {
        users.push(user);
      }
    }

    const totalValue = await vault.totalDepositValue(users);
    return formatNumber(formatUnits(totalValue, 6));
  }

  const collateralValue = async () => {
    if (walletClient) {
      const provider = new Web3Provider(walletClient as any);

      const token = new ethers.Contract(RWA_CONTRACT_ADDRESS[chainId], usdcAbi, provider as unknown as ethers.Signer);
      let poolToken = await token.balanceOf(VAULT_ADDRESS);
      poolToken = formatUnits(poolToken, 18);

      const tokenPrice = parseFloat(Number(formatEther(rwaPrice ?? 0)).toString() || '1');

      return formatNumber(poolToken * tokenPrice);
    }
  }

  return {
    fetchTotalValue,
    collateralValue
  };
}
