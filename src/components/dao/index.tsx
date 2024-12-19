import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import Head from "next/head";
import Image from "next/image";
import { BigNumberish, formatEther } from "ethers";
import { bsc } from "viem/chains";
import { useAccount, useChainId } from "wagmi";
import Breadcrumb from "../common/breadcrumb";
import DaoCreateProposal from "../dao-create-proposal";
import DaoProposalsList from "../dao-proposal-list";
import useBalanceOf from "../../hooks/contract/LandTokenContract/useBalanceOf";
import { 
  BOLD_INTER_TIGHT, 
  DAO_TREASURY_ADDRESS, 
  MARKETING_TREASURY_ADDRESS,
  MAJOR_WORK_CHAIN
} from "../../config/constants/environments";
import Logo from "../../../public/icons/dao-land.svg";
import Telegram from "../../../public/icons/dao-telegram.svg";
import Gnosis from "../../../public/icons/dao-safe.svg";
import Contract from "../../../public/icons/dao-contract.svg";

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
  const chainId = useChainId()
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isViewAll, setIsViewAll] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInitialLoad(false);
    }, 1500);
  }, []);

  const { data: balanceGnosis, isLoading: isBalanceGnosisLoading } = useBalanceOf({ chainId: bsc.id, address: DAO_TREASURY_ADDRESS }) as { data: BigNumberish, isLoading: boolean }
  const balanceGnosisValue = formatEther(balanceGnosis).match(/^-?\d+(?:\.\d{0,2})?/)
  const { data: balanceMarketing, isLoading: isBalanceMarketingLoading } = useBalanceOf({ chainId: bsc.id, address: MARKETING_TREASURY_ADDRESS }) as { data: BigNumberish, isLoading: boolean }
  const balanceMarketingValue = formatEther(balanceMarketing).match(/^-?\d+(?:\.\d{0,2})?/)

  const handleClickCreateProposal = async () => {
    if (typeof address == "undefined") {
      alert("Please connect your wallet.");
    } else if (
      chainId !== Number(MAJOR_WORK_CHAIN.id)
    ) {
      alert("Please connect to the Binance Smart Chain.");
    } else {
      setIsCreating(true);
    }
  };

  const refreshProposalList = () => {
    setRefreshCount((prevCount) => prevCount + 1);
  };
  return (
    <div>
      <Head>
        <title>Landshare - DAO</title>
        <meta
          name="description"
          content="View and create proposal in the Landshare DAO."
        />
      </Head>
      <div className="bg-primary pt-[41px] pb-[25px] px-[20px]">
        <div className="max-w-[1200px] m-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      {/* {chain?.unsupported && (<div className="flex flex-col justify-center items-center text-center m-5 text-red-400 text-xl font-medium animate-[sparkling_3s_linear_infinite]">
        Chain not Supported / Switch to BSC
      </div>)} */}
      {initialLoad ? (
        <div className="flex w-full min-h-[70vh] h-full items-center justify-center bg-primary">
          <ReactLoading type="bars" color="#61cd81" />
        </div>
      ) : (
        <div className="bg-primary py-0 px-[20px] md:pt-[20px] md:pb-[100px] mlg:pt-0 mlg:pb-[10px] mlg:px-0 xl:pt-0 xl:pb-[25px] xl:px-0 tracking-[2%]">
          {isCreating && (
            <DaoCreateProposal
              close={() => setIsCreating(false)}
              refreshProposalList={refreshProposalList}
              balance={balanceGnosis.toString()}
            />
          )}
          <div className="flex flex-col lg:flex-row gap-[40px] max-w-[1200px] w-full m-auto pb-10">
            <div className="bg-secondary flex flex-row lg:flex-col items-end justify-around p-[10px] mlg:min-w-[251px] lg:h-[478px] rounded-[14px] shadow-xl md:items-center mlg:justify-between mlg:p-[20px]">
              <div className="flex flex-col items-center">
                <Image alt="logo" src={Logo} className="w-[75px] sm:w-[100px] md:w-[130px] m-[5px]" />
                <div 
                  className={`text-[12px] leading-[14px] p-[5px] sm:text-[14px] sm:leading-[16px] md:px-[15px] md:text-[20px] text-[#61CD81] md:leading-[30px] rounded-[40px] w-full text-center bg-primary ${BOLD_INTER_TIGHT.className}`}
                >
                  DAO Treasury
                </div>
              </div>
              <div className="flex flex-col md:flex-row lg:flex-col items-center gap-[40px]">
                <div className="flex flex-row lg:flex-col items-center mb-[12px] gap-[20px] mb-md-2">
                  <div className="text-center">
                    <>
                      {!(isBalanceGnosisLoading || isBalanceMarketingLoading) ? (
                        <>
                          <div className="text-text-primary font-bold text-[16px] leading-[20px] sm:text-[20px] sm:leading-[24px] md:text-[24px] md:leading-[36px]">
                            {balanceGnosis ? (
                              balanceGnosisValue ? balanceGnosisValue[0] : formatEther(balanceGnosis)) 
                            : balanceGnosis}
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-center items-center text-[10px] leading-[14px] sm:text-[12px] sm:leading-[14px] md:text-[15px] md:leading-[22px] text-[#838383]">
                          <ReactLoading
                            className="balance-loader"
                            type="cylon"
                            color="#61cd81"
                          />
                        </div>
                      )}
                    </>
                    <div className="text-[12px] leading-[14px] md:text-[15px] md:leading-[22px] text-[#838383]">Treasury</div>
                  </div>
                  <div className="text-center">
                    <>
                      {!(isBalanceGnosisLoading || isBalanceMarketingLoading) ? (
                        <>
                          <div className="text-text-primary font-bold text-[16px] leading-[20px] sm:text-[20px] sm:leading-[24px] md:text-[24px] md:leading-[36px]">
                            {balanceMarketing ? (
                              balanceMarketingValue ? balanceMarketingValue[0] : formatEther(balanceMarketing)) 
                            : balanceMarketing}
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
                    <div className="text-[12px] leading-[14px] md:text-[15px] md:leading-[22px] text-[#838383]">Marketing</div>
                  </div>
                </div>
                <div className="flex justify-end gap-[17px] md:w-auto md:justify-start mlg:w-full mlg:gap-[20px] items-center">
                  <a 
                    href="http://t.me/landshare" 
                    target="_blank"
                    className="flex flex-col items-center gap-[3px] cursor-pointer"
                  >
                    <Image 
                      src={Telegram} 
                      alt="telegram" 
                      className="w-[20px] sm:w-[22px] md:w-[30px]"
                    />
                    <span className="hidden sm:flex text-[10px] leading-[14px] sm:text-[12px] sm:leading-[18px] text-[#484848] dark:text-[#d4d4d4]">Discuss</span>
                  </a>
                  <a
                    href="https://app.safe.global/home?safe=bnb:0x28454a7Ec0eD4b3aAAA350a1D87304355643107f"
                    target="_blank"
                    className="flex flex-col items-center gap-[3px] cursor-pointer"
                  >
                    <Image 
                      src={Gnosis} 
                      alt="gnosis" 
                      className="w-[20px] sm:w-[22px] md:w-[30px]"
                    />
                    <span className="hidden sm:flex text-[10px] leading-[14px] sm:text-[12px] sm:leading-[18px] text-[#484848] dark:text-[#d4d4d4]">View Safe</span>
                  </a>
                  <a
                    href="https://bscscan.com/address/0x28454a7Ec0eD4b3aAAA350a1D87304355643107f"
                    target="_blank"
                    className="flex flex-col items-center gap-[3px] cursor-pointer"
                  >
                    <Image 
                      src={Contract} 
                      alt="contract"
                      className="w-[20px] sm:w-[22px] md:w-[30px]"
                    />
                    <span className="hidden sm:flex text-[10px] leading-[14px] sm:text-[12px] sm:leading-[18px] text-[#484848] dark:text-[#d4d4d4]">Contract</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-secondary w-full p-[10px] pt-[25px] md:p-[40px] space-y-4 lg:space-y-0 shadow-xl rounded-[14px]">
              <div className={`flex justify-between pb-[30px] items-center tracking-0 leading-[30px] ${BOLD_INTER_TIGHT.className}`}>
                <div className="text-text-primary font-bold text-[24px] leading-[36px]">
                  {isViewAll ? `All Proposals` : `Latest Proposals`}
                </div>
                <div className="flex gap-[15px]">
                  <button className="text-button-text-secondary py-[5px] px-[5px] min-h-[32px] min-w-fit text-[12px] leading-[14px] bg-[#61CD81] md:min-w-[120px] md:min-h-[40px] border-0 rounded-[20px] font-normal md:text-[16px] md:leading-[24px] tracking-[0.02em] duration-500 disabled:bg-[#C2C5C3] hover:bg-[#87D99F] active:bg-[#06B844]"
                    onClick={() => {
                      window.open("https://vote.landshare.io");
                    }}
                  >
                    View All
                  </button>
                  <button className="text-button-text-secondary py-[5px] px-[5px] min-h-[32px] min-w-fit text-[12px] leading-[14px] bg-text-third md:min-w-[120px] md:min-h-[40px] border-0 rounded-[20px] font-normal md:text-[16px] md:leading-[24px] tracking-[0.02em] duration-500 disabled:bg-[#C2C5C3] hover:bg-[#87D99F] active:bg-[#06B844]"
                    disabled={(isBalanceGnosisLoading || isBalanceMarketingLoading) || chainId != bsc.id}
                    onClick={handleClickCreateProposal}
                  >
                    Create
                  </button>
                </div>
              </div>
              <DaoProposalsList
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
