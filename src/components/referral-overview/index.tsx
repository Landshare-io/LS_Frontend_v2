import { Fuul } from '@fuul/sdk';
import { useEffect } from "react";
import { useAccount } from "wagmi";
import Slider from "../common/slider";

export default function ReferralOverview() {
  const {address} = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if(address){
        const res = await Fuul.getPointsLeaderboard({ 
          user_address: address, 
          from: new Date('2000-01-01'),
          to: new Date(),
          user_type: 'end_user',
        });
      }
    }
    
    fetchData();
  }, [address])

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

          <p className="font-bold text-lg text-text-primary leading-7">0</p>
        </div>

        <div className="pr-6">
          <p className="text-sm text-text-secondary font-normal leading-7">
            Total Approved Invites
          </p>

          <p className="font-bold text-lg text-text-primary leading-7">1</p>
        </div>

        <div>
          <p className="text-sm text-text-secondary font-normal leading-7">
            Total Purchase Volume 
          </p>
          
          <p className="font-bold text-lg text-text-primary leading-7">
            0 USDT
          </p>
        </div>
      </div>

      <div className="w-full">
        <p className="text-text-primary text-sm">4 invites remaining</p>

        <Slider percentage = {10}/>

        <p className="text-text-secondary text-sm">20% completed</p>
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
