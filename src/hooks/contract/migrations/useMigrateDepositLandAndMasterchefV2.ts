import { useState, useEffect } from "react";
import { bsc } from "viem/chains";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import useBalanceOfLandToken from "../LandTokenContract/useBalanceOf";
import useBalanceOfLpTokenV2 from "../LpTokenV2Contract/useBalanceOf";
import useDepositAutoVaultV3 from "../AutoVaultV3Contract/useDeposit";
import useDepositMastchef from "../MasterchefContract/useDeposit";
import { useGlobalContext } from "../../../context/GlobalContext";

let isSuccessDepositState = false

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

interface useMigrateDepositLandAndLpV2Props {
  address: Address | undefined
}

export default function useMigrateDepositLandAndLpV2({ address }: useMigrateDepositLandAndLpV2Props) {
  const { isConnected } = useAccount()
  const [isSuccessDeposit, setIsSuccessDeposit] = useState(isSuccessDepositState);
  const {  setScreenLoadingStatus } = useGlobalContext();
  const { data: balanceOfLandToken, refetch: refetchLandTokenBalance } = useBalanceOfLandToken({ chainId: bsc.id, address });
  const { data: balanceOfLpToken, refetch: refetchLpTokenBalance } = useBalanceOfLpTokenV2({ chainId: bsc.id, address });
  
  const { deposit: autoVaultV3Deposit, data: autoVaultV3DepositTx, isError:isDepositAutoV3Error } = useDepositAutoVaultV3(bsc.id)
  const { isSuccess: autoVaultV3DepositSuccess, data: autoVaultV3DepositStatusData } = useWaitForTransactionReceipt({   
    hash: autoVaultV3DepositTx,
    chainId: bsc.id
  });

  const { deposit: masterchefDeposit, data: masterchefDepositTx, isError: isDepositError } = useDepositMastchef(bsc.id)
  const { isSuccess: masterchefDepositSuccess, data: masterchefDepositStatusData } = useWaitForTransactionReceipt({   
    hash: masterchefDepositTx,
    chainId: bsc.id
  });

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setIsSuccessDeposit(isSuccessDepositState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateIsSuccessDeposit = (newIsSuccessDeposit: boolean) => {
    isSuccessDepositState = newIsSuccessDeposit;
    notifySubscribers();
  };

  useEffect(() => {
    if (isDepositAutoV3Error) {
      setScreenLoadingStatus("Transaction Failed.")
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    } else if (autoVaultV3DepositTx) {
      if (autoVaultV3DepositStatusData) {
        if (autoVaultV3DepositSuccess) {
          try {
            refetchLandTokenBalance()
            setScreenLoadingStatus("Transaction Completed.")
            updateIsSuccessDeposit(true);
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          } catch (error) {
            console.log("deposit error", error)
            updateIsSuccessDeposit(false);
            setScreenLoadingStatus("Transaction Failed.")
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        }
      }
    }
  }, [autoVaultV3DepositTx, autoVaultV3DepositStatusData, autoVaultV3DepositSuccess, isDepositAutoV3Error])

  useEffect(() => {
    if (isDepositError) {
      setScreenLoadingStatus("Transaction Failed.")
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    } else if (masterchefDepositTx) {
      if (masterchefDepositStatusData) {
        if (masterchefDepositSuccess) {
          try {
            refetchLandTokenBalance()
            refetchLpTokenBalance()
            setScreenLoadingStatus("Transaction Completed.")
            updateIsSuccessDeposit(true);
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          } catch (error) {
            console.log("deposit error", error)
            updateIsSuccessDeposit(false);
            setScreenLoadingStatus("Transaction Failed.")
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        }
      }
    }
  }, [masterchefDepositTx, masterchefDepositStatusData, masterchefDepositSuccess, isDepositError])

  async function depositAutoLandv2(amount: number) {
    if (isConnected == true) {
      if (Number(amount) > Number(balanceOfLandToken)) {
        window.alert("Insufficient Balance");
        return;
      }
      try {
        setScreenLoadingStatus("Transaction is Pending...")
        autoVaultV3Deposit(amount);
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.");
        updateIsSuccessDeposit(false);
        setTimeout(() => {
          setScreenLoadingStatus("")
        }, 1000);
      }
    }
  }

  async function depositLandv2(amount: number) {
    if (isConnected == true) {
      if (Number(amount) > Number(balanceOfLandToken)) {
        window.alert("Insufficient Balance");
        return;
      }
      try {
        setScreenLoadingStatus("Transaction is Pending...")
        masterchefDeposit(0, amount)
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.");
        updateIsSuccessDeposit(false);
        setTimeout(() => {
          setScreenLoadingStatus("")
        }, 1000);
      }
    }
  }

  async function depositLP(amount: number) {
    if (isConnected == true) {
      if (Number(amount) > Number(balanceOfLpToken)) {
        window.alert("Insufficient Balance");
        return;
      }
      try {
        setScreenLoadingStatus("Transaction is Pending...")
        masterchefDeposit(1, amount);
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.");
        updateIsSuccessDeposit(false);
        setTimeout(() => {
          setScreenLoadingStatus("")
        }, 1000);
      }
    }
  }

  return {
    depositAutoLandv2,
    depositLandv2,
    depositLP,
    isSuccessDeposit,
    setIsSuccessDeposit: updateIsSuccessDeposit,
  };
}
