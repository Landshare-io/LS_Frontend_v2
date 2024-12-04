import { Fuul } from '@fuul/sdk';
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Slider from "../common/slider";
import { getCurrentEpoch } from '../../utils/helpers/generate-epochs';
import { leaderboardDataProps } from '../../utils/type';

export default function ReferralOverview() {
  const { address } = useAccount();
  const [pendingInvites, setPendingInvites] = useState<number>(0);
  const [approvedInvites, setApprovedInvites] = useState<number>(0);
  const [purchaseVolume, setPurchaseVolume] = useState<number>(0);
  const [referredVolume, setReferredVolume] = useState<number>(0);
  const [remainingInvitations, setRemainingInvitations] = useState<number>(0);
  const current_epoch = getCurrentEpoch();
  const [myLeaderboard, setMyLeaderboard] = useState<leaderboardDataProps[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (address) {
          const buy_conversions = await Fuul.getPointsLeaderboard({
            user_address: address,
            from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
            to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
            user_type: 'affiliate', 
            fields: 'referred_volume',
            conversions: '3'
          });

          const buy_sell_conversions = await Fuul.getPointsLeaderboard({
            user_address: address,
            from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
            to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
            user_type: 'affiliate', 
            fields: 'referred_volume',
            conversions: '4'
          });

          const totalPurchaseAmountSum = [...buy_conversions.results, ...buy_sell_conversions.results].reduce((sum, item) => sum + Number(item?.total_amount), 0);
          const totalReferredAmountSum = [...buy_sell_conversions.results].reduce((sum, item) => sum + Number(item?.referred_volume), 0);

          setPurchaseVolume(totalPurchaseAmountSum);
          setReferredVolume(totalReferredAmountSum);
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
          conversions: '3'
        });

        const { results: total_results } = await Fuul.getPayoutsLeaderboard({
          user_address: address,
          user_type: "affiliate",
          from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
          to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
        });

        setPendingInvites(pending_results.length);
        setApprovedInvites(total_results.length - pending_results.length);
        setRemainingInvitations(total_results.length - pending_results.length);
      } catch (error) {
        console.log(error);
      }
    }

    if (address) {
      fetchData();
    }
  }, [address]);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const res = await Fuul.getPointsLeaderboard({
          user_address : address,
          user_type : 'affiliate',
          fields: 'referred_volume,referred_users',
          from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
          to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
        });
  
        const formattedData = res?.results?.map((item: any) => ({
          rank: item.rank,
          account: item.account,
          total_amount: item.total_amount,
          referred_users: item.referred_users,
          referred_volume : item.referred_volume
        }));
  
        setMyLeaderboard(formattedData);
      }catch(error){
        console.log(error);
      }
    }

    if(address){
      fetchData();
    }
  }, [address]);

  return (
    <div className="flex flex-col w-full bg-third rounded-2xl p-6 h-auto gap-8 md:gap-5 shadow-lg">
      <p className="w-full flex justify-between text-text-primary font-bold text-lg leading-7">
        Overview
      </p>

      <div className="flex justify-between">
        <div>
          <p className="text-sm text-text-secondary font-normal leading-7">
            Pending invites <span className="text-[#61CD81]">ⓘ</span>
          </p>

          <p className="font-bold text-lg text-text-primary leading-7">{pendingInvites}</p>
        </div>

        <div>
          <p className="text-sm text-text-secondary font-normal leading-7 pr-2">
            Approved Invites
          </p>

          <p className="font-bold text-lg text-text-primary leading-7">{approvedInvites}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-sm text-text-secondary font-normal leading-7">
            Purchase Volume
          </p>

          <p className="font-bold text-lg text-text-primary leading-7">
            {purchaseVolume} LSRWA
          </p>
        </div>

        <div>
          <p className="text-sm text-text-secondary font-normal leading-7">
            Your Current Rank
          </p>
        
          <p className="font-bold text-lg text-text-primary leading-7">
            {myLeaderboard ? myLeaderboard[0]?.rank : ""} 
          </p>
        </div>
      </div>

      <div className="w-full">
        <p className="text-text-primary text-sm">{remainingInvitations} invites remaining</p>

        <div className='flex justify-between items-center gap-6'>
          <Slider percentage={approvedInvites * 20} />

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
