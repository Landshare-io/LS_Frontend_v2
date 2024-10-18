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

interface useMigrateWithDrawLandv1Props {
  oldAutoBalance: BigNumberish
  address: Address | undefined
}

export default function useMigrateWithDrawLandv1({ oldAutoBalance, address }: useMigrateWithDrawLandv1Props) {
  const { isConnected } = useAccount();
  const [isSuccessWithdraw, setIsSuccessWithdraw] = useState(false);
  const balanceMigration = useMigrationBalance({ address });
  const { setScreenLoadingStatus } = useGlobalContext()
  const { data: totalSharesOfAutLandV1 } = useTotalSharesAutoLandV1() as { data: BigNumberish };
  const { data: balanceOfAutLandV1 } = useBalanceOfAutoLandV1() as { data: BigNumberish };
  const { data: totalSharesOfAutLandV2 } = useTotalSharesAutoLandV2() as { data: BigNumberish };
  const { data: balanceOfAutLandV2 } = useBalanceOfAutoLandV2() as { data: BigNumberish };
  
  const { withdraw: withdrawLPFarm, data: withdrawLPFramTx } = useWithdrawLPFarm();
  const { isSuccess: withdrawLPFramSuccess } = useWaitForTransactionReceipt({
    hash: withdrawLPFramTx,
    chainId: bsc.id
  });

  const { withdraw: withdrawAutoVaultV1, data: withdrawAutoVaultV1Tx } = useWithdrawAutoVaultV1();
  const { isSuccess: withdrawAutoVaultV1Success } = useWaitForTransactionReceipt({   
    hash: withdrawAutoVaultV1Tx,
    chainId: bsc.id
  });

  const { withdraw: withdrawAutoVaultV2, data: withdrawAutoVaultV2Tx } = useWithdrawAutoVaultV2();
  const { isSuccess: withdrawAutoVaultV2Success } = useWaitForTransactionReceipt({   
    hash: withdrawAutoVaultV2Tx,
    chainId: bsc.id
  });

  const { withdraw: withdrawLandTokenStakeV2, data: withdrawLandTokenStakeV2Tx } = useWithdrawLandTokenStakeV2();
  const { isSuccess: withdrawLandTokenStakeV2Success } = useWaitForTransactionReceipt({   
    hash: withdrawLandTokenStakeV2Tx,
    chainId: bsc.id
  });

  const { withdraw: withdrawLandTokenStakeV3, data: withdrawLandTokenStakeV3Tx } = useWithdrawLandTokenStakeV3();
  const { isSuccess: withdrawLandTokenStakeV3Success } = useWaitForTransactionReceipt({   
    hash: withdrawLandTokenStakeV3Tx,
    chainId: bsc.id
  });

  useEffect(() => {
    if (withdrawLPFramTx) {
      if (withdrawLPFramSuccess) {
        try {
          setScreenLoadingStatus("Transaction Completed")
          setIsSuccessWithdraw(true);
        } catch (error) {
          console.log("withdraw error", error)
          setScreenLoadingStatus("Transaction Failed.")
          setIsSuccessWithdraw(false);

          return () => {
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        }
      }
    }
  }, [withdrawLPFramTx, withdrawLPFramSuccess])

  useEffect(() => {
    if (withdrawAutoVaultV1Tx) {
      if (withdrawAutoVaultV1Success) {
        try {
          setScreenLoadingStatus("Transaction Completed")
          setIsSuccessWithdraw(true);
        } catch (error) {
          console.log("withdraw error", error)
          setScreenLoadingStatus("Transaction Failed.")
          setIsSuccessWithdraw(false);

          return () => {
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        }
      }
    }
  }, [withdrawAutoVaultV1Tx, withdrawAutoVaultV1Success])

  useEffect(() => {
    if (withdrawAutoVaultV2Tx) {
      if (withdrawAutoVaultV2Success) {
        try {
          setScreenLoadingStatus("Transaction Completed")
          setIsSuccessWithdraw(true);
        } catch (error) {
          console.log("withdraw error", error)
          setScreenLoadingStatus("Transaction Failed.")
          setIsSuccessWithdraw(false);

          return () => {
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        }
      }
    }
  }, [withdrawAutoVaultV2Tx, withdrawAutoVaultV2Success])

  useEffect(() => {
    if (withdrawLandTokenStakeV2Tx) {
      if (withdrawLandTokenStakeV2Success) {
        try {
          setScreenLoadingStatus("Transaction Completed")
          setIsSuccessWithdraw(true);
        } catch (error) {
          console.log("withdraw error", error)
          setScreenLoadingStatus("Transaction Failed.")
          setIsSuccessWithdraw(false);

          return () => {
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        }
      }
    }
  }, [withdrawLandTokenStakeV2Tx, withdrawLandTokenStakeV2Success])

  useEffect(() => {
    if (withdrawLandTokenStakeV3Tx) {
      if (withdrawLandTokenStakeV3Success) {
        try {
          setScreenLoadingStatus("Transaction Completed")
          setIsSuccessWithdraw(true);
        } catch (error) {
          console.log("withdraw error", error)
          setScreenLoadingStatus("Transaction Failed.")
          setIsSuccessWithdraw(false);

          return () => {
            setTimeout(() => {
              setScreenLoadingStatus("")
            }, 1000);
          }
        }
      }
    }
  }, [withdrawLandTokenStakeV3Tx, withdrawLandTokenStakeV3Success])

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
        setIsSuccessWithdraw(false);
        console.log("Error, withdraw: ", e);
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
        setIsSuccessWithdraw(false);
        console.log("Error, withdraw: ", e);
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
        setIsSuccessWithdraw(false);
        console.log("Error, withdraw: ", e);
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
        setIsSuccessWithdraw(false);
        console.log("Error, withdraw: ", e);
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
        setIsSuccessWithdraw(false);
        console.log("Error, withdraw: ", e);
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
    setIsSuccessWithdraw,
  };
}
