import { Fuul } from "@fuul/sdk";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Slider from "../common/slider";
import { getCurrentEpoch } from "../../utils/helpers/generate-epochs";
import { leaderboardDataProps } from "../../utils/type";
import { USDC_ADDRESS } from "../../config/constants/environments";
import { useChainId } from "wagmi";
import Tooltip from "../common/tooltip";

export default function ReferralOverview() {
  const chainId = useChainId();
  const { address } = useAccount();
  const [pendingInvites, setPendingInvites] = useState<number>(0);
  const [approvedInvites, setApprovedInvites] = useState<number>(0);
  const [purchaseVolume, setPurchaseVolume] = useState<number>(0);
  const [remainingInvitations, setRemainingInvitations] = useState<number>(0);
  const [myLeaderboard, setMyLeaderboard] = useState<leaderboardDataProps[]>();
  const current_epoch = getCurrentEpoch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (address) {
          const total_conversions = await Fuul.getPayoutsLeaderboard({
            currency_address: USDC_ADDRESS[chainId],
            user_address: address,
            from: current_epoch?.start_date
              ? new Date(current_epoch.start_date)
              : undefined,
            to: current_epoch?.end_date
              ? new Date(current_epoch.end_date)
              : undefined,
            user_type: "affiliate",
            fields: "referred_volume",
          });

          let totalPurchaseAmountSum = 0;

          total_conversions.results.forEach((result, index) => {
            totalPurchaseAmountSum += result?.referred_volume
              ? Number(result.referred_volume) / Math.pow(10, 12)
              : 0;
          });

          setPurchaseVolume(Number(totalPurchaseAmountSum.toFixed(2)));
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { results: conversions } = await Fuul.getUserPayoutsByConversion({
          user_address: address ?? "",
          from: current_epoch?.start_date
            ? new Date(current_epoch.start_date)
            : new Date(),
          to: current_epoch?.end_date
            ? new Date(current_epoch.end_date)
            : new Date(),
        });

        let pendingCount = 0;
        let approvedCount = 0;

        conversions.map((conversion) => {
          if (conversion.conversion_name === "Purchase") {
            pendingCount++;
          } else if (conversion.conversion_name === "Purchase and hold") {
            approvedCount++;
          }
        });

        setPendingInvites(pendingCount);
        setApprovedInvites(approvedCount <= 5 ? approvedCount : 5);
        setRemainingInvitations(5 - approvedCount);
      } catch (error) {
        console.log(error);
      }
    };

    if (address) {
      fetchData();
    }
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Fuul.getPayoutsLeaderboard({
          currency_address: USDC_ADDRESS[chainId],
          user_address: address,
          user_type: "affiliate",
          fields: "referred_volume,referred_users",
          from: current_epoch?.start_date
            ? new Date(current_epoch.start_date)
            : undefined,
          to: current_epoch?.end_date
            ? new Date(current_epoch.end_date)
            : undefined,
        });

        const formattedData = res?.results?.map((item: any) => ({
          rank: item.rank,
          account: item.address,
          total_amount: item.total_amount,
          referred_users: item.referred_users,
          referred_volume: item.referred_volume,
        }));

        setMyLeaderboard(formattedData);
      } catch (error) {
        console.log(error);
      }
    };

    if (address) {
      fetchData();
    }
  }, [address]);

  return (
    <div className="flex flex-col w-full bg-third rounded-2xl p-6 h-auto gap-8 md:gap-4 shadow-lg">
      <p className="w-full flex justify-between text-text-primary font-bold text-lg leading-7">
        Overview
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-text-secondary font-normal flex gap-1">
              <p>Pending Invites</p>
              <Tooltip content="These are users you’ve referred who bought at least 50 LSRWA tokens but haven’t yet completed the 30-day holding period.">
                <span className="text-[#61CD81] cursor-default">ⓘ</span>
              </Tooltip>
            </div>

            <p className="font-bold text-lg text-text-primary">
              {pendingInvites}
            </p>
          </div>

          <div>
            <p className="text-sm text-text-secondary font-normal pr-2">
              Approved Invites
            </p>

            <p className="font-bold text-lg text-text-primary">
              {approvedInvites}
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <div className="text-sm text-text-secondary font-normal">
              Purchase Volume
              <Tooltip
                position="bottom"
                content="Total purchases made by referred users. Only approved referrals who have completed the 30-day hold period are included here."
              >
                <span className="ms-1 text-[#61CD81] cursor-default">ⓘ</span>
              </Tooltip>
            </div>
            <p className="font-bold text-lg text-text-primary">
              {purchaseVolume} LSRWA
            </p>
          </div>

          <div>
            <p className="text-sm text-text-secondary font-normal">
              Your Current Rank
            </p>

            <p className="font-bold text-lg text-text-primary">
              {myLeaderboard && myLeaderboard[1]?.rank
                ? myLeaderboard[1]?.rank
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="w-full my-[2px] bg-secondary" />

      <div className="w-full flex gap-6">
        <div className="flex flex-col flex-grow">
          <p className="text-text-primary text-sm">
            {remainingInvitations} invites remaining
          </p>
          <Slider percentage={approvedInvites * 20} />
          <p className="text-text-secondary text-sm">
            {approvedInvites * 20}% completed
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-text-secondary text-base">Earn Bonus</p>
          <p className="text-text-primary font-bold text-lg">10 USDC</p>
        </div>
      </div>
    </div>
  );
}
