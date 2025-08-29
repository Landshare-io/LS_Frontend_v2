'use client';
import RequestHistory from "./RequestHistory";
import WalletInfoCard from "./WalletInfoCard";
import AccountCard from "./AccountCard";
import PerformanceCard from "./PerformanceCard";
import EpochInfoCard from "./EpochInfoCard";
import clsx from "clsx";
import { IoIosTrendingUp } from "react-icons/io";
import { useAccount } from "wagmi";
import { useState } from "react";


export default function RwaEpoch() {
    const {
        isConnected,
    } = useAccount();

    const [fetchHistoryData, setFetchHistoryData] = useState(false)

    return (
        <div className="px-[10px] xl:px-0 xl:w-[1200px] xl:m-auto mt-[43px]">
            <div className="w-full flex items-start mb-0">
                <div className="flex items-center w-fit py-[6px] pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-secondary">
                    <div className="flex items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-primary">
                        <IoIosTrendingUp className="w-[24px] h-[24px] text-[#24BC48]" />
                    </div>
                    <span className="text-[14px] capitalize leading-[22px] tracking-[0.02em] font-medium text-text-primary">
                        Effortless, Real-World Yield
                    </span>
                </div>
            </div>
            <div className="mt-[10px]">
                <p className="text-text-primary font-bold text-[36px] md:text-[40px] lg:text-[56px]">LSRWA Express</p>
                <p className="mt-[8px] md:mt-[9.33px] w-[257px] md:w-[400px] text-text-secondary text-sm lg:text-start text-[14px] font-normal">Simply deposit USDC and earn real-world, asset-backed yield — no need to manually handle $LSRWA tokens.</p>
                {/* <p className="text-sm text-[#61CD81] hover:text-[#4ea869] font-medium">Learn more</p> */}
            </div>
            <div className={clsx('mt-[40px] md:mt-[54px] xl:gap-[20px]', isConnected ? 'grid grid-cols-5' : '')}>
                <div className="col-span-5 xl:col-span-3">
                    <WalletInfoCard fetchHistoryData={fetchHistoryData} setFetchHistoryData={setFetchHistoryData}/>
                    <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-[10px] md:gap-[19px]">
                        <AccountCard />
                        <PerformanceCard />
                    </div>
                </div>
                {isConnected && (
                    <div className="col-span-5 xl:col-span-2 xl:h-[565px] mt-[40px] xl:mt-0">
                        <RequestHistory fetchHistoryData={fetchHistoryData} setFetchHistoryData={setFetchHistoryData}/>
                    </div>
                )}
            </div>
            <div className="mt-[36px] xl:mt-[17px]">
                <EpochInfoCard />
            </div>

        </div>
    );
}
