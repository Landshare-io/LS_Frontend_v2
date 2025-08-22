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
        <main className="px-[10px] md:px-[66px] xl:px-[120px] py-10 md:py-[20px]">
            <div className="flex items-center gap-[10px] p-[8px] pr-[30px]  bg-secondary rounded-[50px] w-max">
                <IoIosTrendingUp className="w-[24px] h-[24px] text-[#24BC48]" />
                <p className="text-[12px] md:text-[14px] leading-[22px] tracking-[0.02em] capitalize font-semibold text-text-primary">Effortless, Real-World Yield</p>
            </div>
            <div className="mt-4 md:mt-8">
                <p className="text-text-primary font-bold text-[36px] md:text-[40px] lg:text-[56px]">LSRWA Express</p>
                <p className="pt-[8px] w-[257px] md:w-[400px] text-text-secondary text-sm lg:text-start text-[14px] font-normal">Simply deposit USDC and earn real-world, asset-backed yield — no need to manually handle $LSRWA tokens.</p>
                {/* <p className="text-sm text-[#61CD81] hover:text-[#4ea869] font-medium">Learn more</p> */}
            </div>
            <div className={clsx('mt-8 gap-10', isConnected ? 'grid grid-cols-5' : '')}>
                <div className="col-span-5 xl:col-span-3">
                    <WalletInfoCard />
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        <AccountCard />
                        <PerformanceCard />
                    </div>
                </div>
                {isConnected && (
                    <div className="col-span-5 xl:col-span-2 lg:h-[565px] overflow-hidden">
                        <RequestHistory />
                    </div>
                )}
            </div>
            <div className="mt-8">
                <EpochInfoCard />
            </div>

        </main>
    );
}
