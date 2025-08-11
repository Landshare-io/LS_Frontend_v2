import type { NextPage } from "next";
import Head from "next/head";
import Breadcrumb from "../components/common/breadcrumb";
import { BREADCRUMB } from "../utils/type";
import styles from "../styles/Home.module.css";
import GrowthEarning from "../components/referral-growth-earn";
import LspOverView from "../components/lsp-overview";
import LspSummary from "../components/lsp-summary";
import LspLeaderBoard from "../components/lsp-leaderboard";
import LspCampaignTasks from "../components/lsp-campaign-tasks";
import LspRecentActivity from "../components/lsp-recent-activity";

const breadcrumbItems: BREADCRUMB[] = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Landshare Portal Page",
    url: "/referral",
  },
];

const Referral: NextPage = () => {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>Landshare Portal Page</title>
        <meta content="Refer & Earn" name="description" />
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
              Landshare Portal
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <div className="w-full grid lg:grid-cols-[62%_35%] grid-cols-1 gap-[32px]">
              <div className="flex flex-col gap-[32px]">
                <LspOverView />
                <LspSummary />
              </div>
              <div>
                <LspLeaderBoard />
              </div>
            </div>
            <LspCampaignTasks />
            <LspRecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
