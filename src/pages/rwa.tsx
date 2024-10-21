import type { NextPage } from 'next';
import Head from 'next/head';
import { HiMiniLockOpen } from "react-icons/hi2";
import Breadcrumb from '../components/common/breadcrumb';
import { BREADCRUMB } from '../utils/type';
import PriceGraph from '../components/price-line-chart';
import FinancialSummary from '../components/financial-summary';
import SwapToken from '../components/swap-token';
import BeneficalAssets from '../components/benefical-assets';
import InvestmentExplain from '../components/investment-explain';
import RwaCalculator from '../components/rwa-calculator';
import styles from '../styles/Home.module.css';

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
      <div className="bg-primary pt-[41px] pb-[25px] px-[20px] lg:px-[120px]">
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
      <div className="bg-secondary py-[60px] px-[10px] md:py-[80px] md:px-[40px] lg:px-[120px] lg:py-[80px]">
        <BeneficalAssets />
      </div>
      <div className="bg-primary py-[60px] px-[10px] md:py-[80px] md:px-[40px] lg:px-[120px] lg:py-[80px]">
        <RwaCalculator />
      </div>
      <div className="bg-secondary py-[60px] px-[10px] md:py-[80px] md:px-[40px] lg:px-[120px] lg:py-[80px]">
        <div className="flex items-center w-fit mx-auto mb-[30px] py-[6px] pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-primary">
          <div className="flex justify-center items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-secondary">
            <HiMiniLockOpen className="w-[18px] h-[24px] text-[#24BC48]" />
          </div>
          <span className="text-[14px] leading-[22px] tracking-[0.02em] font-semibold text-text-primary">Unlock your opportunity</span>
        </div>
        <InvestmentExplain />
      </div>
    </div>
  );
};

export default RwaPage;
