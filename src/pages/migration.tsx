import React, { useEffect, useState } from "react";
import type { NextPage } from 'next';
import Head from "next/head";
import { BigNumberish, formatEther, parseEther } from "ethers";
import { useAccount, useChainId } from "wagmi";
import useBalanceOf from "../hooks/contract/LandTokenV1Contract/useBalanceOf";
import useTokenMigrate from "../hooks/contract/migrations/useTokenMigrate";
import SelectVault from "../components/migrations/select-vault";
import VaultCard from "../components/migrations/vault-card";
import ConnectWallet from "../components/connect-wallet";
import { BOLD_INTER_TIGHT } from "../config/constants/environments";

const Migration: NextPage = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId()
  const [vaultName, setVaultName] = useState("Select A Vault");
  const [onlyMigration, setOnlyMigration] = useState(false);
  const { data: balanceData } = useBalanceOf({ address }) as { data: BigNumberish }
  const balance = formatEther(balanceData.toString())
  const displayedBalance = balance.toString().match(/^-?\d+(?:\.\d{0,4})?/)

  const { tokenMigrate } = useTokenMigrate({ address });

  const handleClickMigrationOption = (e: any) => {
    setVaultName("Select A Vault");
    setOnlyMigration(e.target.checked);
  };

  const processMigration = async () => {
    try {
      if (Number(balance) == 0) {
        alert("No balance to migrate");
      } else {
        const amountLS = parseEther(balance.toString()).toString();
        await tokenMigrate(amountLS);
      }
    } catch (e) { }
  };

  return (
    <div>
      <div className={`flex justify-center pt-[40px] px-[10px] pb-[10px] bg-primary min-h-[70vh] ${!isConnected ? "p-0" : ""}`}>
        <Head>
          <title>Landshare - Migration</title>
        </Head>
        <div className={`p-0 flex justify-center mlg:pt-[40px] max-w-[664.14px] ${!isConnected ? "p-0" : ""}`}>
          {!isConnected ? (
            <div className="text-center flex flex-col justify-center items-center">
              <ConnectWallet />
            </div>
          ) : (
            <div>
              {chainId != 56 ?
                (<div className="flex flex-col justify-center items-center text-center m-5 text-red-400 text-xl font-medium animate-[sparkling_3s_linear_infinite]">
                  Chain not Supported / Switch to BSC
                </div>) : (
                  <>
                    <h1 className={`text-text-primary text-[40px] md:text-[48px] text-capitalize ${BOLD_INTER_TIGHT.className}`}>Landshare Token Migration</h1>
                    <p className="text-[16px] md:text-[18px] mb-[30px] mt-[15px] text-text-primary">
                      To migrate with us, simply select your vault below and follow
                      the steps. Need help? Check out our detailed guides{" "}
                      <a
                        href="https://docs.landshare.io/token-migration/token-migration-guide"
                        target="_blank"
                      >
                        here
                      </a>
                      .
                    </p>
                    <div className="flex items-center gap-[6px] text-[14px] ml-1">
                      <input
                        type="checkbox"
                        name="only-migration"
                        id="only-migration"
                        className="accent-[#61cd81] text-white cursor-pointer"
                        onChange={handleClickMigrationOption}
                      />
                      <label htmlFor="only-migration" className="text-text-primary">
                        Migrate unstaked tokens from wallet
                      </label>
                    </div>
                    {onlyMigration ? (
                      <>
                        <div className="bg-[#f2f4f5] p-[20px] rounded-[5px] flex gap-[10px] mt-4">
                          <div className="relative w-full">
                            <input
                              type="text"
                              disabled
                              className={`w-full border-0 bg-[#fff] rounded-[12px] py-[10px] px-[20px] text-[20px] leading-[30px] text-capitalize text-[#000] disabled:bg-[#cccccc] disabled:text-[#888888] ${BOLD_INTER_TIGHT.className}`}
                              value={
                                displayedBalance ? displayedBalance[0] : 0
                              }
                            />
                          </div>
                          <button
                            className="w-[174px] h-[50px] bg-[#61cd81] border-0 rounded-[12px] font-semibold text-[18px] leading-[22px] duration-500 hover:bg-[#87D99F] active:bg-[06B844] disable:bg-[#3c3c3b33] text-button-text-secondary"
                            onClick={processMigration}
                          >
                            Migrate
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-[20px] bg-secondary">
                        <div className="p-[16px]">
                          <SelectVault value={vaultName} setValue={setVaultName} />
                        </div>
                        {vaultName === "Select A Vault" ? (
                          <></>
                        ) : (
                          <VaultCard
                            vaultName={vaultName}
                            initVault={() => setVaultName("Select A Vault")}
                          />
                        )}
                      </div>
                    )}
                  </>
                )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Migration;
