import { useEffect, useState } from "react";
import { 
  useAccount,
  useWaitForTransactionReceipt
} from "wagmi";
import { bsc } from "viem/chains";
import { BigNumberish } from "ethers";
import { Address } from "viem";
import useMigrationBalance from "./useMigrationBalance";
import useWithdrawLPFarm from "../LandLPFarmContract/useWithdraw";
import useTotalSharesAutoLandV1 from "../AutoLandV1Contract/useTotalShares";
import useBalanceOfAutoLandV1 from "../AutoLandV1Contract/useBalanceOf";
import useTotalSharesAutoLandV2 from "../AutoLandV2Contract/useTotalShares";
import useBalanceOfAutoLandV2 from "../AutoLandV2Contract/useBalanceOf";
import useWithdrawAutoVaultV1 from "../AutoLandV1Contract/useWithdraw";
import useWithdrawAutoVaultV2 from "../AutoLandV2Contract/useWithdraw";
import useWithdrawLandTokenStakeV2 from "../LandTokenStakeV2/useWithdraw";
import useWithdrawLandTokenStakeV3 from "../LandTokenStakeV3/useWithdraw";
import { useGlobalContext } from "../../../context/GlobalContext";

let isSuccessWithdrawState = false

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

interface useMigrateWithDrawLandv1Props {
  oldAutoBalance: BigNumberish
  address: Address | undefined
}

export default function useMigrateWithDrawLandv1({ oldAutoBalance, address }: useMigrateWithDrawLandv1Props) {
  const { isConnected } = useAccount();
  const [isSuccessWithdraw, setIsSuccessWithdraw] = useState(isSuccessWithdrawState);
  const balanceMigration = useMigrationBalance({ address });
  const { setScreenLoadingStatus } = useGlobalContext()
  const { data: totalSharesOfAutLandV1 } = useTotalSharesAutoLandV1() as { data: BigNumberish };
  const { data: balanceOfAutLandV1 } = useBalanceOfAutoLandV1() as { data: BigNumberish };
  const { data: totalSharesOfAutLandV2 } = useTotalSharesAutoLandV2() as { data: BigNumberish };
  const { data: balanceOfAutLandV2 } = useBalanceOfAutoLandV2() as { data: BigNumberish };
  
  const { withdraw: withdrawLPFarm, data: withdrawLPFramTx, isError: isWithdrawLPError } = useWithdrawLPFarm();
  const { isSuccess: withdrawLPFarmSuccess, data: withdrawLPFarmStatusData } = useWaitForTransactionReceipt({
    hash: withdrawLPFramTx,
    chainId: bsc.id
  });

  const { withdraw: withdrawAutoVaultV1, data: withdrawAutoVaultV1Tx, isError: isWithdrawAutoError } = useWithdrawAutoVaultV1();
  const { isSuccess: withdrawAutoVaultV1Success, data: withdrawAutoVaultV1StatusData } = useWaitForTransactionReceipt({   
    hash: withdrawAutoVaultV1Tx,
    chainId: bsc.id
  });

  const { withdraw: withdrawAutoVaultV2, data: withdrawAutoVaultV2Tx, isError: isWithdrawAutoV2Error } = useWithdrawAutoVaultV2();
  const { isSuccess: withdrawAutoVaultV2Success, data: withdrawAutoVaultV2StatusData } = useWaitForTransactionReceipt({   
    hash: withdrawAutoVaultV2Tx,
    chainId: bsc.id
  });

  const { withdraw: withdrawLandTokenStakeV2, data: withdrawLandTokenStakeV2Tx, isError: isWithdrawLandStakeV2Error } = useWithdrawLandTokenStakeV2();
  const { isSuccess: withdrawLandTokenStakeV2Success, data: withdrawLandTokenStakeV2StatusData } = useWaitForTransactionReceipt({   
    hash: withdrawLandTokenStakeV2Tx,
    chainId: bsc.id
  });

  const { withdraw: withdrawLandTokenStakeV3, data: withdrawLandTokenStakeV3Tx, isError: isWithdrawLandStakeV3Error } = useWithdrawLandTokenStakeV3();
  const { isSuccess: withdrawLandTokenStakeV3Success, data: withdrawLandTokenStakeV3StatusData } = useWaitForTransactionReceipt({   
    hash: withdrawLandTokenStakeV3Tx,
    chainId: bsc.id
  });

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setIsSuccessWithdraw(isSuccessWithdrawState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateIsSuccessWithdraw = (newIsSuccessWithdraw: boolean) => {
    isSuccessWithdrawState = newIsSuccessWithdraw;
    notifySubscribers();
  };

  useEffect(() => {
    if (isWithdrawLPError) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (withdrawLPFramTx) {
      if (withdrawLPFarmStatusData) {
        if (withdrawLPFarmSuccess) {
          try {
            setScreenLoadingStatus("Transaction Completed")
            updateIsSuccessWithdraw(true);
          } catch (error) {
            console.log("withdraw error", error)
            setScreenLoadingStatus("Transaction Failed.")
            updateIsSuccessWithdraw(false);
          }
        }
      }
    }
  }, [withdrawLPFramTx, withdrawLPFarmStatusData, withdrawLPFarmSuccess, isWithdrawLPError])

  useEffect(() => {
    if (isWithdrawAutoError) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (withdrawAutoVaultV1Tx) {
      if (withdrawAutoVaultV1StatusData) {
        if (withdrawAutoVaultV1Success) {
          try {
            setScreenLoadingStatus("Transaction Completed")
            updateIsSuccessWithdraw(true);
          } catch (error) {
            setScreenLoadingStatus("Transaction Failed.")
            updateIsSuccessWithdraw(false);
          }
        }
      }
    }
  }, [withdrawAutoVaultV1Tx, withdrawAutoVaultV1StatusData, withdrawAutoVaultV1Success, isWithdrawAutoError])

  useEffect(() => {
    if (isWithdrawAutoV2Error) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (withdrawAutoVaultV2Tx) {
      if (withdrawAutoVaultV2StatusData) {
        if (withdrawAutoVaultV2Success) {
          try {
            setScreenLoadingStatus("Transaction Completed")
            updateIsSuccessWithdraw(true);
          } catch (error) {
            setScreenLoadingStatus("Transaction Failed.")
            updateIsSuccessWithdraw(false);
          }
        }
      }
    }
  }, [withdrawAutoVaultV2Tx, withdrawAutoVaultV2StatusData, withdrawAutoVaultV2Success, isWithdrawAutoV2Error])

  useEffect(() => {
    if (isWithdrawLandStakeV2Error) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (withdrawLandTokenStakeV2Tx) {
      if (withdrawLandTokenStakeV2StatusData) {
        if (withdrawLandTokenStakeV2Success) {
          try {
            setScreenLoadingStatus("Transaction Completed")
            updateIsSuccessWithdraw(true);
          } catch (error) {
            setScreenLoadingStatus("Transaction Failed.")
            updateIsSuccessWithdraw(false);
          }
        }
      }
    }
  }, [withdrawLandTokenStakeV2Tx, withdrawLandTokenStakeV2StatusData, withdrawLandTokenStakeV2Success, isWithdrawLandStakeV2Error])

  useEffect(() => {
    if (isWithdrawLandStakeV3Error) {
      setScreenLoadingStatus("Transaction Failed.")
    } else if (withdrawLandTokenStakeV3Tx) {
      if (withdrawLandTokenStakeV3StatusData) {
        if (withdrawLandTokenStakeV3Success) {
          try {
            setScreenLoadingStatus("Transaction Completed")
            updateIsSuccessWithdraw(true);
          } catch (error) {
            setScreenLoadingStatus("Transaction Failed.")
            updateIsSuccessWithdraw(false);
          }
        }
      }
    }
  }, [withdrawLandTokenStakeV3Tx, withdrawLandTokenStakeV3StatusData, withdrawLandTokenStakeV3Success, isWithdrawLandStakeV3Error])

  async function withdrawLP(amount: number) {
    if (isConnected == true) {
      if (Number(balanceMigration.depositLP) === 0) {
        return;
      }
      if (Number(balanceMigration.depositLP) < amount) {
        window.alert("Insufficient deposit amount");
        return;
      }
      if (Number(balanceMigration.depositLP) === 0) {
        window.alert("No deposit found");
        return;
      }

      try {
        setScreenLoadingStatus("Transaction is in progress...")
        withdrawLPFarm(amount);
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.");
        updateIsSuccessWithdraw(false);
      }
      
    }
  }

  async function withdrawStakingAutoV2(amount: number) {
    amount = Number(BigInt(amount) * BigInt(totalSharesOfAutLandV1) / BigInt(balanceOfAutLandV1))

    if (isConnected == true) {
      if (Number(oldAutoBalance) === 0) {
        window.alert("No deposit found");
        return;
      }

      try {
        setScreenLoadingStatus("Transaction is in progress...")
        withdrawAutoVaultV1(amount)
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.");
        updateIsSuccessWithdraw(false);
      }
      
    }
  }

  async function withdrawStakingAutoV3(amount: number) {
    amount = Number(BigInt(amount) * BigInt(totalSharesOfAutLandV2) / BigInt(balanceOfAutLandV2));

    if (isConnected == true) {
      if (Number(balanceMigration.depositAuto) === 0) {
        return;
      }
      if (Number(balanceMigration.depositAuto) < amount) {
        window.alert("Insufficient deposit amount");
        return;
      }
      if (Number(balanceMigration.depositAuto) === 0) {
        window.alert("No deposit found");
        return;
      }

      try {
        setScreenLoadingStatus("Transaction is in progress...")
        withdrawAutoVaultV2(amount)
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.", false);
        updateIsSuccessWithdraw(false);
      }
      
    }
  }
  async function withdrawStakingV2(amount: number) {
    if (isConnected == true) {
      if (Number(balanceMigration.depositV2) === 0) {
        return;
      }
      if (Number(balanceMigration.depositV2) < amount) {
        window.alert("Insufficient deposit amount");
        return;
      }
      if (Number(balanceMigration.depositV2) === 0) {
        window.alert("No deposit found");
        return;
      }

      try {
        setScreenLoadingStatus("Transaction is in progress...")
        withdrawLandTokenStakeV2(amount);
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.", false);
        updateIsSuccessWithdraw(false);
      }
      
    }
  }
  async function withdrawStakingV3(amount: number) {
    if (isConnected == true) {
      if (Number(balanceMigration.depositV3) === 0) {
        return;
      }
      if (Number(balanceMigration.depositV3) < amount) {
        window.alert("Insufficient deposit amount");
        return;
      }
      if (Number(balanceMigration.depositV3) === 0) {
        window.alert("No deposit found");
        return;
      }

      try {
        setScreenLoadingStatus("Transaction is in progress...")
        withdrawLandTokenStakeV3(amount);
      } catch (e) {
        setScreenLoadingStatus("Transaction Failed.");
        updateIsSuccessWithdraw(false);
      }
      
    }
  }
  return {
    withdrawLP,
    withdrawStakingAutoV2,
    withdrawStakingAutoV3,
    withdrawStakingV2,
    withdrawStakingV3,
    isSuccessWithdraw,
    setIsSuccessWithdraw: updateIsSuccessWithdraw,
  };
}
