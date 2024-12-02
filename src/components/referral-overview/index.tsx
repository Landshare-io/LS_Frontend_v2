import { Fuul } from '@fuul/sdk';
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Slider from "../common/slider";
import { getCurrentEpoch } from '../../utils/helpers/generate-epochs';

export default function ReferralOverview() {
  const { address } = useAccount();
  const [pendingInvites, setPendingInvites] = useState<number>(0);
  const [approvedInvites, setApprovedInvites] = useState<number>(0);
  const [purchaseVolume, setPurchaseVolume] = useState<number>(0);
  const [referredVolume, setReferredVolume] = useState<number>(0);
  const [remainingInvitations, setRemainingInvitationsNumber] = useState<number>(0);
  const current_epoch = getCurrentEpoch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (address) {
          const pending_users = await Fuul.getPointsLeaderboard({
            user_address: address,
            from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
            to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
            user_type: 'affiliate', //If user reach out first conversation, pending users can assume as total
            fields: 'referred_volume',
            conversions: '3'
          });

          setPendingInvites(pending_users.results.length);

          const invited_users = await Fuul.getPointsLeaderboard({
            user_address: address,
            from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
            to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
            user_type: 'affiliate', //After completed all conversations, these are approved users 
            fields: 'referred_volume',
            conversions: '4'
          });

          const totalPurchaseAmountSum = [...pending_users.results, ...invited_users.results].reduce((sum, item) => sum + Number(item?.total_amount), 0);
          const totalReferredAmountSum = [...invited_users.results].reduce((sum, item) => sum + Number(item?.referred_volume), 0);

          setPurchaseVolume(totalPurchaseAmountSum);
          setReferredVolume(totalReferredAmountSum);
          setApprovedInvites(invited_users.results.length);
        }
      } catch (error: any) {
        console.log(error);
      }
    }

    fetchData();
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { results: pending_results } = await Fuul.getPayoutsLeaderboard({
          user_address: address,
          user_type: "affiliate",
          from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
          to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
          conversions: 'buy'
        });

        const { results: total_results } = await Fuul.getPayoutsLeaderboard({
          user_address: address,
          user_type: "affiliate",
          from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
          to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
          conversions: 'buy'
        });

        setPendingInvites(pending_results.length);
        setApprovedInvites(total_results.length - pending_results.length);
        setRemainingInvitationsNumber((total_results.length - pending_results.length) % 5);
      } catch (error) {
        console.log(error);
      }
    }

    if (address) {
      fetchData();
    }
  }, [address]);

  return (
    <div className="flex flex-col w-full bg-third rounded-2xl p-6 h-auto gap-8 md:gap-[29px] shadow-lg">
      <p className="w-full flex justify-between text-text-primary font-bold text-lg leading-7">
        Overview
      </p>

      <div className="flex justify-start gap-6">
        <div>
          <p className="text-sm text-text-secondary font-normal leading-7">
            Pending invites <span className="text-[#61CD81]">ⓘ</span>
          </p>

          <p className="font-bold text-lg text-text-primary leading-7">{pendingInvites}</p>
        </div>

        <div className="pr-6">
          <p className="text-sm text-text-secondary font-normal leading-7">
            Total Approved Invites
          </p>

          <p className="font-bold text-lg text-text-primary leading-7">{approvedInvites - pendingInvites}</p>
        </div>

        <div>
          <p className="text-sm text-text-secondary font-normal leading-7">
            Total Purchase Volume
          </p>

          <p className="font-bold text-lg text-text-primary leading-7">
            {purchaseVolume} USDT
          </p>
        </div>
      </div>

      <div className="w-full">
        <p className="text-text-primary text-sm">{remainingInvitations} invites remaining</p>

        <div className='flex justify-between items-center gap-6'>
          <Slider percentage={remainingInvitations} />

          <div className='w-20 shrink-0'>
            <p className='text-text-secondary text-base'>Earn Bonus</p>
            <p className='text-text-primary font-bold text-lg'>10 USDC</p>
          </div>
        </div>

        <p className="text-text-secondary text-sm">{remainingInvitations * 20}% completed</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold text-[#61CD81] text-sm mt-[3px] cursor-pointer">
          Learn more
        </p>
        <p className="font-bold text-[#61CD81] text-sm mt-[3px] cursor-pointer">
          Stake LSRWA
        </p>
      </div>
    </div>
  );
}
