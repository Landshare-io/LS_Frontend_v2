
import { useState } from "react";
import { useAccount, useChainId, useReadContracts, useWriteContract } from 'wagmi';
import vaultAbi from '@/abis/Vault.json';
import { formatUnits } from 'ethers';
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import numeral from "numeral";

export function useDepositorAccount() {
  const [compounding, setCompounding] = useState(false);
  const [harvesting, setHarvesting] = useState(false);
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId()
  const VAULT_ADDRESS = LSRWA_VAULT_ADDRESS[chainId];

  const { data, isLoading, refetch, error } = useReadContracts({
    contracts: [
      {
        address: (VAULT_ADDRESS as any),
        abi: vaultAbi,
        functionName: 'users',
        args: [address],
      },
      {
        address: (VAULT_ADDRESS as any),
        abi: vaultAbi,
        functionName: 'calculateHarvest',
        args: [address],
      },
      {
        address: (VAULT_ADDRESS as any),
        abi: vaultAbi,
        functionName: 'rewardAPR',
      },
    ],
    allowFailure: false,
    query: {
      enabled: !!address,
    },
  });

  const setAutoCompound = async (status: any) => {

    try {
      await writeContractAsync({
        address: (VAULT_ADDRESS as any),
        abi: vaultAbi,
        functionName: 'setAutoCompound',
        args: [status],
      });
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
    }
  }
  const compound = async () => {
    setCompounding(true);
    try {
      await writeContractAsync({
        address: (VAULT_ADDRESS as any),
        abi: vaultAbi,
        functionName: 'compound',
      });
      refetch();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setCompounding(false);
    }
  }
  const harvestReward = async () => {
    setHarvesting(true);
    try {
      await writeContractAsync({
        address: (VAULT_ADDRESS as any),
        abi: vaultAbi,
        functionName: 'harvest',
      });
      await refetch();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setHarvesting(false);
    }
  }

  const deposited = numeral(Number(formatUnits((data as any)?.[0][0] ?? "0", 6))).format("0.[000]");
  const autoCompound = (data as any)?.[0][1] ?? false;
  const reward = Number(numeral(Number(formatUnits((data as any)?.[1] ?? "0", 6))).format("0.[000]"));
  const rewardAPR = Number((data as any)?.[2] ?? "0") * 0.01;

  return {
    deposited,
    reward,
    rewardAPR,
    autoCompound,
    setAutoCompound,
    compound,
    compounding,
    harvestReward,
    harvesting,
    isLoading,
    error,
  };
}
