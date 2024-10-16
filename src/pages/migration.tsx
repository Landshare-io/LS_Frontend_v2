import React, { useEffect, useState } from "react";
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Head } from "next/document";
import { formatEther, parseEther } from "ethers";
import { useAccount, useChainId } from "wagmi";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useLandshareFunctions } from "../../contexts/LandshareFunctionsProvider";
import { useLandshareV1Context } from "../../contexts/LandshareV1Context";
import { useLandshareNftContext } from "../../contexts/LandshareNftContext";
import { useVaultBgProvider } from "../../contexts/VaultBgProvider";
import useTokenMigrate from "../../hooks/useTokenMigrate";
import SelectVault from "./SelectVault";
import VaultCard from "./VaultCard";
import ConnectWallet from "../ConnectWallet";
import "./Migration.css";

const Migration: NextPage = () => {
  const { isConnected, address } = useAccount();
  const {
    signer,
    account,
    userResource,
    notifyError,
    notifySuccess,
    updateUserResources,
    isLoginLoading,
    isDarkMode
  } = useGlobalContext();
  const {
    contract: {
      houseNFTContract,
      houseBNFTContract,
      NFTStakeContract,
      NFTBStakeContract
    },
    address: {
      houseNFTAddress,
      houseBNFTAddress
    }
  } = useLandshareNftContext();
  const chainId = useChainId()
  const router = useRouter();
  const [vaultName, setVaultName] = useState("Select A Vault");
  const [onlyMigration, setOnlyMigration] = useState(false);
  const [balance, setBalance] = useState(0);
  const { setBackgoundVault, setWithOverlayBg } = useVaultBgProvider();
  const {
    state,
    startTransactionRefresh,
    endTransaction,
    transactionResult,

  } = useLandshareFunctions();
  const {
    contract: { landTokenContract },
  } = useLandshareV1Context();
  const [v1AssetDepositedHouses, setV1AssetDepositedHouses] = useState([]);
  const [v1TransferableHouses, setV1TransferableHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);





  const { tokenMigrate } = useTokenMigrate({
    state,
    startTransactionRefresh,
    endTransaction,
    transactionResult,

  });

  useEffect(() => {
    setBackgoundVault(false);
    setWithOverlayBg(false);
  }, [setBackgoundVault]);

  useEffect(() => {
    if (landTokenContract) getBalance();
  }, [landTokenContract]);

  const handleClickMigrationOption = (e: any) => {
    setVaultName("Select A Vault");
    setOnlyMigration(e.target.checked);
  };

  const processMigration = async () => {
    try {
      if (balance == 0) {
        alert("No balance to migrate");
      } else {
        const amountLS = parseEther(balance.toString()).toString();
        await tokenMigrate(amountLS);
      }
    } catch (e) { }
  };

  const getBalance = async () => {
    try {
      let value = await landTokenContract.balanceOf(address);
      value = formatEther(value.toString());
      setBalance(value);
    } catch (e) { }
  };

  return (
    <div>
      <div className={`page-container  bg-tw-primary ${!isConnected ? "no-padding-top" : ""}`}>
        <Head>
          <title>Landshare - Migration</title>
        </Head>
        <div className={`migration-container ${!isConnected ? "no-padding-top" : ""}`}>
          {!isConnected ? (
            <div className="text-center d-flex flex-column justify-content-center align-items-center">
              <ConnectWallet />
            </div>
          ) : (
            <div>
              {chainId != 56 ?
                (<div className="flex flex-col justify-center items-center text-center m-5 text-red-400 text-xl font-medium animate-[sparkling-anim_3s_linear_infinite]">
                  Chain not Supported / Switch to BSC
                </div>) : (
                  <>
                    <h1 className="text-tw-text-primary">Landshare Token Migration</h1>
                    <p className="text-tw-text-primary">
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
                    <div className="migration-option ms-1">
                      <input
                        type="checkbox"
                        name="only-migration"
                        id="only-migration"
                        onChange={handleClickMigrationOption}
                      />
                      <label htmlFor="only-migration" className="text-tw-text-primary">
                        Migrate unstaked tokens from wallet
                      </label>
                    </div>
                    {onlyMigration ? (
                      <>
                        <div className="only-migration-container mt-4">
                          <div className="amount-input">
                            <input
                              type="text"
                              disabled
                              className="disabled"
                              value={
                                balance.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
                              }
                            />
                          </div>
                          <button
                            className="migrate-button"
                            onClick={processMigration}
                          >
                            Migrate
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="migration-card bg-tw-secondary">
                        <div>
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
