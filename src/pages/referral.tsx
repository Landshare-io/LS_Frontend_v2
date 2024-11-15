import type { NextPage } from "next";
import Head from "next/head";
import Breadcrumb from "../components/common/breadcrumb";
import { BREADCRUMB } from "../utils/type";
import styles from "../styles/Home.module.css";
import GrowthEarning from "../components/referral-growth-earn";
import ReferralOverview from "../components/referral-overview";
import ReferralOthers from "../components/referral-others";
import ReferralEarning from "../components/referral-earning";
import ReferralLeaderBoard from "../components/referral-leaderboard";

const breadcrumbItems: BREADCRUMB[] = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Referral Page",
    url: "/RWA",
  },
];

const Referral: NextPage = () => {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>Landshare - Referral</title>
        <meta content="app.landshare.io" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div className="bg-primary pb-[40px] sm:px-5 px-[10px] lg:px-[120px]">
        <div className="max-w-[1200px] m-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-12">
            <GrowthEarning />
          </div>

          <div className="my-6">
            <p className="font-bold text-[28px] leading-[22px] text-text-primary">
              Referrals
            </p>
          </div>
          <div className="w-full grid lg:grid-cols-[52%_48%] grid-cols-1 gap-[40px]">
            <div className="flex flex-col gap-[40px] ">
              <ReferralOverview />
              <ReferralOthers />
            </div>
            <div>
              <ReferralEarning />
            </div>
          </div>
          <ReferralLeaderBoard />
        </div>
      </div>
    </div>
  );
};

export default Referral;
