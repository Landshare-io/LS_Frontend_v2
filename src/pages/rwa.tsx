import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useChainId, useAccount } from 'wagmi';
import { HiMiniLockOpen } from "react-icons/hi2";
import { Fuul } from '@fuul/sdk';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '../components/common/breadcrumb';
import { BREADCRUMB } from '../utils/type';
import PriceGraph from '../components/price-line-chart';
import FinancialSummary from '../components/financial-summary';
import SwapToken from '../components/swap-token';
import BeneficalAssets from '../components/benefical-assets';
import RwaCalculator from '../components/rwa-calculator';
import styles from '../styles/Home.module.css';
import MoreInvestment from '../components/learn-more-future-investment';

const breadcrumbItems: BREADCRUMB[] = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'Real World Assets',
    url: '/RWA'
  }
]

const RwaPage: NextPage = () => {
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const referralCode = searchParams.get('af');

  useEffect(() => {
    if (referralCode) {
      Fuul.sendPageview("rwa");
    }
  }, [referralCode]);
  const { isConnected } = useAccount();
  const chainId = useChainId()

  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>Landshare - RWA Portal</title>
        <meta
          content="app.landshare.io"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <div className="bg-primary pb-[25px] px-[20px] lg:px-[120px]">
        <div className="max-w-[1200px] m-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="bg-primary pb-[60px] px-[10px] md:pb-[80px] md:px-[40px] lg:px-[120px]">
        <div className="flex flex-col-reverse lg:flex-row max-w-[1200px] m-auto justify-between gap-[20px]">
          <div className="flex flex-col w-full gap-[24px]">
            <div className="hidden md:block">
              <PriceGraph
                containerClassName="p-[24px] w-full"
                titleClassName="text-[16px] leading-[24px]"
                type="rwa"
                showBuyButton={false}
              />
            </div>
            <FinancialSummary />
          </div>
          <SwapToken />
        </div>
      </div>
      <div className="bg-secondary py-[60px] px-[10px] md:py-[80px] md:px-[40px] lg:px-[120px] lg:py-[40px]">
        <BeneficalAssets />
      </div>
      <div className="bg-primary py-[60px] px-[10px] md:py-[80px] md:px-[40px] lg:px-[120px] lg:py-[80px]">
        <RwaCalculator />
      </div>
      <MoreInvestment />
    </div>
  );
};

export default RwaPage;
