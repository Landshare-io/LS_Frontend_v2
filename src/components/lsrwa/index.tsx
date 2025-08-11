'use client';
import RequestHistory from "./RequestHistory";
import WalletInfoCard from "./WalletInfoCard";
import AccountCard from "./AccountCard";
import PerformanceCard from "./PerformanceCard";
import EpochInfoCard from "./EpochInfoCard";
import Image from 'next/image';

import { useWallet } from '@/hooks/lsrwa/useWallet';
import clsx from "clsx";
import { IoIosTrendingUp } from "react-icons/io";

export default function Rwa() {
    const {
        address,
        isConnected,
        disconnect,
        balance,
        symbol,
    } = useWallet();
    return (
        <main className="px-[20px] md:px-[66px] xl:px-[120px] py-20">
            <div className="flex items-center gap-[10px] p-[8px] pr-[30px] bg-white rounded-[50px] w-max">
                <IoIosTrendingUp className="w-[24px] h-[24px] text-[#24BC48]" />
                <p className="font-medium">Effortless, Real-World Yield</p>
            </div>
            <div className="mt-8">
                <p className="font-bold text-[54px]">LSRWA Express</p>
                <p className="text-gray">Simply deposit USDC and earn real-world, asset-backed yield—no need to manually handle $LSRWA tokens.</p>
                <p className="text-green">Learn more</p>
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
            </div> : <></>

        </main>
    );
}
