import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { Helmet } from "react-helmet";
import { ethers } from "ethers";
import { useAccount, useChainId } from "wagmi";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useLandshareDAOContext } from "../../contexts/DAOContext";
import { useVaultBgProvider } from "../../contexts/VaultBgProvider";
import Breadcrumb from "../common/breadcrumb";
import CreateProposal from "./CreateProposal";
import ProposalsList from "./ProposalsList";
import Logo from "../../assets/img/icons/dao-land.svg";
import Telegram from "../../assets/img/icons/dao-telegram.svg";
import Gnosis from "../../assets/img/icons/dao-safe.svg";
import Contract from "../../assets/img/icons/dao-contract.svg";
import "./DAO.css";

const breadcrumbItems = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'Dao',
    url: '/dao'
  }
]

export default function DAO() {
  const { signer, bscLandTokenV2Contract } = useGlobalContext();
  const chainId = useChainId()
  const { address, isConnected } = useAccount();
  const { isDAOLoading, setDAOLoading } = useLandshareDAOContext();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isViewAll, setIsViewAll] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [balanceGnosis, setBalanceGnosis] = useState("");
  const [balanceMarketing, setBalanceMarketing] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);
  const { setBackgoundVault, setWithOverlayBg } = useVaultBgProvider();

  useEffect(() => {
    setBackgoundVault(false);
    setWithOverlayBg(false);
  }, [setBackgoundVault]);

  useEffect(() => {
    setDAOLoading(true);
    setTimeout(() => {
      setInitialLoad(false);
    }, 1500);
  }, []);

  useEffect(async () => {
    try {
      if (bscLandTokenV2Contract) {
        const daoBalance = await bscLandTokenV2Contract.balanceOf(
          process.env.REACT_APP_DAO_TREASURY
        );
        let balanceGnosisETH = ethers.utils.formatEther(daoBalance.toString());
        setBalanceGnosis(balanceGnosisETH);
        const marketingBalance = await bscLandTokenV2Contract.balanceOf(
          process.env.REACT_APP_MARKETING_TREASURY
        );
        let balanceMarketingETH = ethers.utils.formatEther(
          marketingBalance.toString()
        );
        setBalanceMarketing(balanceMarketingETH);
        setDAOLoading(false);
      }
    } catch (e) { }
  }, [bscLandTokenV2Contract]);

  const handleClickCreateProposal = async () => {
    if (typeof address == "undefined") {
      alert("Please connect your wallet.");
    } else if (
      chainId !== Number(process.env.REACT_APP_NET_ID)
    ) {
      alert("Please connect to the Binance Smart Chain.");
    } else {
      setIsCreating(true);
    }
  };

  const handleCloseDialog = () => {
    setIsCreating(false);
  };

  const refreshProposalList = () => {
    setRefreshCount((prevCount) => prevCount + 1);
  };
  return (
    <div>
      <Helmet>
        <title>Landshare - DAO</title>
        <meta
          name="description"
          content="View and create proposal in the Landshare DAO."
        ></meta>
      </Helmet>
      <div className="bg-primary pt-[41px] pb-[25px] px-[20px] lg:px-[120px]">
        <div className="max-w-[1200px] m-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      {/* {chain?.unsupported && (<div className="flex flex-col justify-center items-center text-center m-5 text-red-400 text-xl font-medium animate-[sparkling-anim_3s_linear_infinite]">
        Chain not Supported / Switch to BSC
      </div>)} */}
      {initialLoad ? (
        <div className="flex w-full min-h-[70vh] h-full items-center justify-center bg-primary">
          <ReactLoading type="bars" color="#61cd81" />
        </div>
      ) : (
        <div className="bg-primary dao-container" style={{ letterSpacing: "2%" }}>
          {isCreating && (
            <CreateProposal
              close={handleCloseDialog}
              title={title}
              body={body}
              refreshProposalList={refreshProposalList}
              balance={balanceGnosis}
            />
          )}
          <div className="flex gap-[40px] max-w-[1200px] w-full">
            <div className="bg-secondary dao-treasury">
              <div className="dao-treasury-box">
                <img src={Logo} className="logo" />
                <div className="title bg-primary">DAO Treasury</div>
              </div>
              <div className="divB">
                <div className="property-container mb-md-2">
                  <div className="property">
                    <>
                      {!isDAOLoading ? (
                        <>
                          <div className="text-text-primary">
                            {balanceGnosis != "" ? balanceGnosis?.match(/^-?\d+(?:\.\d{0,2})?/)[0] : balanceGnosis}
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-center align-items-center ">
                          <ReactLoading
                            className="balance-loader"
                            type="cylon"
                            color="#61cd81"
                          />
                        </div>
                      )}
                    </>
                    <div>Treasury</div>
                  </div>
                  <div className="property">
                    <>
                      {!isDAOLoading ? (
                        <>
                          <div className="text-text-primary">
                            {balanceMarketing != "" ? balanceMarketing?.match(/^-?\d+(?:\.\d{0,2})?/)[0] : balanceMarketing}
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-center align-items-center ">
                          <ReactLoading
                            className="balance-loader"
                            type="cylon"
                            color="#61cd81"
                          />
                        </div>
                      )}
                    </>
                    <div>Marketing</div>
                  </div>
                </div>
                <div className="links">
                  <a href="http://t.me/landshare" target="_blank">
                    <img src={Telegram} alt="telegram" />
                    <span className="social-label text-[#484848] dark:text-[#d4d4d4]">Discuss</span>
                  </a>
                  <a
                    href="https://app.safe.global/home?safe=bnb:0x28454a7Ec0eD4b3aAAA350a1D87304355643107f"
                    target="_blank"
                  >
                    <img src={Gnosis} alt="gnosis" />
                    <span className="social-label text-[#484848] dark:text-[#d4d4d4]">View Safe</span>
                  </a>
                  <a
                    href="https://bscscan.com/address/0x28454a7Ec0eD4b3aAAA350a1D87304355643107f"
                    target="_blank"
                  >
                    <img src={Contract} alt="contract" />
                    <span className="social-label text-[#484848] dark:text-[#d4d4d4]">Contract</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-secondary p-[10px] pt-[25px] md:p-[40px] shadow-lg  rounded-[14px]">
              <div className="latest-proposals-heading">
                <div className="text-text-primary pe-3 h1-text">
                  {isViewAll ? `All Proposals` : `Latest Proposals`}
                </div>
                <div className="btn-group">
                  <button className="text-button-text-secondary"
                    onClick={() => {
                      window.open("https://vote.landshare.io");
                    }}
                  >
                    View All
                  </button>
                  <button className="text-button-text-secondary"
                    disabled={isDAOLoading || chain?.id != 56}
                    onClick={handleClickCreateProposal}
                  >
                    Create
                  </button>
                </div>
              </div>
              <ProposalsList
                count={isViewAll ? 1000 : 10}
                refreshCount={refreshCount}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
