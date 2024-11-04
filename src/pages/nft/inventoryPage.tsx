import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import numeral from "numeral";
import {useReadContract, useDisconnect, useAccount, useConfig } from "wagmi";
import { useGlobalContext } from "../../context/GlobalContext";
import { ethers } from "ethers";
import useStakedBalance  from "../../hooks/contract/AssetStakeContract/useStakedBalance"

export default function InventoryPage() {
  const { isConnected, chainId, address } = useAccount();

  const { theme, isLoginLoading, isAuthenticated, getUserHouses } = useGlobalContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [depositedBalance, setDepositedBalance] = useState<string>("");

  const getHousesList = async () => {
    setIsLoading(true);
    await getUserHouses();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const updateDepositedBalance = async () => {
    if (chainId !== undefined && address !== undefined) {
        const balance = useStakedBalance(chainId, address);
        setDepositedBalance((ethers as any).utils.formatUnits(balance, 0));
      }
  }

  useEffect(() => {
    (async () => {
      if (!isConnected) return;
      if (isLoginLoading) return;
      if (!isAuthenticated) return;

      updateDepositedBalance();

      await getHousesList()

      const interval = setInterval(async () => {
        await getUserHouses();
      }, 60000);

      return () => clearInterval(interval);
    })()
  }, [isAuthenticated, isLoginLoading, isConnected]);

  return (
    <>
      <section className="bg-primary text-text-primary">
        <div className="flex w-full min-h-[70vh] h-full items-center justify-center bg-primary">
          <ReactLoading type="bars" color="#61cd81" />
        </div>
      </section>
    </>
  );
}
