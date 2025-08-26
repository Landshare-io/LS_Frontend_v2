'use client';
import RequestHistory from "./RequestHistory";
import WalletInfoCard from "./WalletInfoCard";
import AccountCard from "./AccountCard";
import PerformanceCard from "./PerformanceCard";
import EpochInfoCard from "./EpochInfoCard";
import clsx from "clsx";
import { IoIosTrendingUp } from "react-icons/io";
import { useAccount } from "wagmi";

export default function RwaEpoch() {
    const {
        isConnected,
    } = useAccount();
    return (
        <main className="px-[10px] md:px-0 md:w-[1200px] md:m-auto mt-[43px] md:mt-[78px]">
            <div className="flex items-center gap-[10px] p-[8px] pr-[30px]  bg-secondary rounded-[50px] w-max">
                <IoIosTrendingUp className="w-[24px] h-[24px] text-[#24BC48]" />
                <p className="text-[12px] md:text-[14px] leading-[22px] tracking-[0.02em] capitalize font-semibold text-text-primary">Effortless, Real-World Yield</p>
            </div>
            <div className="mt-[10px]">
                <p className="text-text-primary font-bold text-[36px] md:text-[40px] lg:text-[56px]">LSRWA Express</p>
                <p className="mt-[8px] md:mt-[9.33px] w-[257px] md:w-[400px] text-text-secondary text-sm lg:text-start text-[14px] font-normal">Simply deposit USDC and earn real-world, asset-backed yield — no need to manually handle $LSRWA tokens.</p>
                {/* <p className="text-sm text-[#61CD81] hover:text-[#4ea869] font-medium">Learn more</p> */}
            </div>
            <div className={clsx('mt-[40px] md:mt-[54px] gap-[20px]', isConnected ? 'grid grid-cols-5' : '')}>
                <div className="col-span-5 xl:col-span-3">
                    <WalletInfoCard />
                    <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-[10px] md:gap-[19px]">
                        <AccountCard />
                        <PerformanceCard />
                    </div>
                </div>
                {isConnected && (
                    <div className="col-span-5 xl:col-span-2 lg:h-[565px] mt-[40px] md:mt-0">
                        <RequestHistory />
                    </div>
                )}
            </div>
            <div className="mt-[36px] md:mt-[17px] mb-[43px] md:mb-[118px]">
                <EpochInfoCard />
            </div>

        </main>
    );
}
