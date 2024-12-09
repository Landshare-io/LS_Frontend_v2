import { useEffect, useState } from "react";
import Pagination from "../common/pagination";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../common/table";
import { Fuul } from '@fuul/sdk';
import { useAccount } from "wagmi";
import { getCurrentEpoch } from "../../utils/helpers/generate-epochs";
import CircleLoader from "../common/circle-loader";
import { leaderboardDataProps } from "../../utils/type";
import { USDC_ADDRESS } from '../../config/constants/environments';
import { useChainId } from 'wagmi';
import Tooltip from "../common/tooltip";

export default function ReferralLeaderBoard() {
  const chainId = useChainId();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(0);
  const [leaderboardData, setLeaderboardData] = useState<leaderboardDataProps[]>();
  const [myLeaderboard, setMyLeaderboard] = useState<leaderboardDataProps[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [myRank, setMyRank] = useState<number>(0);
  const {address} = useAccount();
  const current_epoch = getCurrentEpoch();

  useEffect(()=>{
    const fetchData = async () => {
      setLoading(false);

      try{
        const res = await Fuul.getPayoutsLeaderboard({
          currency_address :  USDC_ADDRESS[chainId],
          page : currentPage,
          page_size : pageSize, 
          user_type : 'affiliate',
          fields: 'referred_volume,referred_users',
          from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
          to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
        });
  
        const formattedData = res?.results?.map((item: any) => ({
          rank: item.rank,
          account: item.address,
          total_amount: item.total_amount,
          referred_users: item.referred_users,
          referred_volume : item.referred_volume
        }));
  
        setPageCount(res.total_results + 1); 
        setLeaderboardData(formattedData);
      }catch (error: any){
        console.log(error);
      }finally{
        setLoading(true);
      }
    }

    fetchData();
  }, [currentPage]);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const res = await Fuul.getPayoutsLeaderboard({
          currency_address :  USDC_ADDRESS[chainId],
          user_address : address,
          user_type : 'affiliate',
          fields: 'referred_volume,referred_users',
          from: current_epoch?.start_date ? new Date(current_epoch.start_date) : undefined,
          to: current_epoch?.end_date ? new Date(current_epoch.end_date) : undefined,
        });
  
        const formattedData = res?.results?.map((item: any) => ({
          rank: item.rank,
          account: item.address,
          total_amount: item.total_amount,
          referred_users: item.referred_users,
          referred_volume : item.referred_volume
        }));
  
        setMyLeaderboard(formattedData);
        setMyRank(formattedData[0].rank);
      }catch(error){
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const formatEpochDates = (startDate?: string, endDate?: string): string => {
    const startMonth = startDate ? new Date(startDate + 1).toLocaleString('default', { month: 'long' }) : 'Unknown';
    const endMonth = endDate ? new Date(new Date(endDate).setMonth(new Date(endDate).getMonth())).toLocaleString('default', { month: 'long' }) : 'Unknown';
    return `${startMonth} ${startDate?.slice(-2)} - ${endMonth} ${endDate?.slice(-2)}`;
  }

  return (
    <div className="mt-12">
      <div className="text-sm text-text-secondary font-normal flex flex-col lg:flex-row  gap-1 items-baseline">
        <h2 className="text-text-primary font-bold text-2xl leading-[22px]">
          Leaderboard
        </h2>
        <div>
          <span className="lg:px-2 w-fit my-6 text-text-primary text-sm font-normal">
            {formatEpochDates(current_epoch?.start_date, current_epoch?.end_date)}
          </span>
          <Tooltip position="bottom"  content="At the end of each epoch, the top 3 referrers will receive up to $100 USDC in bonus, but the reward cannot exceed 10% of their total referral amount. For example, if the #3 referrer brings in $500 worth of buys, their bonus will be $50 (10% of their referral amount).">
            <span className="ms-[2px] text-[#61CD81] cursor-default">ⓘ</span>
          </Tooltip>
        </div>
      </div>
      <div className="mt-[10px] text-text-secondary text-sm">The program operates in 3-month epochs.</div>

      {loading ?
          <Table className="border-separate text-text-primary border-spacing-y-3 min-h-[210px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Rank</TableHead>
                <TableHead className="w-1/5">Account</TableHead>
                <TableHead className="w-1/5">Claimed Earnings</TableHead>
                <TableHead className="w-1/5">
                  Approved invites
                </TableHead>
                <TableHead className="w-1/5">
                  Purchase Volume
                  <Tooltip tooltipClassName="-translate-x-48 md:-translate-x-24" position="bottom" content="Total purchases made by referred users. Only approved referrals who have completed the 30-day hold period are included here.">
                    <span className="ms-1 text-[#61CD81] cursor-default">ⓘ</span>
                  </Tooltip>
                </TableHead>
              </TableRow>
            </TableHeader>
    
            <TableBody>
              {leaderboardData?.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10).map((data, index) => {
                const { rank, account, total_amount, referred_users, referred_volume } =
                  data;
                const accountDisplay = `${account.slice(0, 6)}...${account.slice(
                  -4
                )}`;

                if(address?.toLowerCase() !== account?.toLowerCase()){
                  return (
                    <TableRow
                      className="bg-secondary mb-3 shadow-md shadow-gray-400/10 rounded-xl"
                      key={index}
                    >
                      <TableCell className="rounded-l-xl">{rank}</TableCell>
                      <TableCell>{accountDisplay}</TableCell>
                      <TableCell>{total_amount.toFixed(2)}</TableCell>
                      <TableCell>{referred_users}</TableCell>
                      <TableCell className="rounded-r-xl">{(referred_volume/ Math.pow(10, 12)).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                }else{
                  return (
                    <TableRow
                        className="mb-3 shadow-md shadow-gray-400/10 rounded-xl text-[#0B6C96] bg-[#0B6C961A] font-bold"
                      >
                      <TableCell className="rounded-l-xl border border-r-0 border-[#0B6C9680]">{rank}</TableCell>
                      <TableCell className="border-y border-[#0B6C9680]">{accountDisplay}</TableCell>
                      <TableCell className="border-y border-[#0B6C9680]">{total_amount.toFixed(2)}</TableCell>
                      <TableCell className="border-y border-[#0B6C9680]">{referred_users}</TableCell>
                      <TableCell className="rounded-r-xl border border-l-0 border-[#0B6C9680]">{(referred_volume/ Math.pow(10, 12)).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                }
              })}
    
              {myLeaderboard?.map((data, index) => {
                const { rank, account, total_amount, referred_users, referred_volume } =
                  data;
                const accountDisplay = `${account.slice(0, 6)}...${account.slice(
                  -4
                )}`;
                if(myRank > pageSize * pageCount){
                  return (
                      <TableRow
                        className="mb-3 shadow-md shadow-gray-400/10 rounded-xl text-[#0B6C96] bg-[#0B6C961A] font-bold"
                      >
                      <TableCell className="rounded-l-xl border border-r-0 border-[#0B6C9680]">{rank}</TableCell>
                      <TableCell className="border-y border-[#0B6C9680]">{accountDisplay}</TableCell>
                      <TableCell className="border-y border-[#0B6C9680]">{total_amount.toFixed(2)}</TableCell>
                      <TableCell className="border-y border-[#0B6C9680]">{referred_users}</TableCell>
                      <TableCell className="rounded-r-xl border border-l-0 border-[#0B6C9680]">{(referred_volume/ Math.pow(10, 12)).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
      :<CircleLoader/>}

      <div className="w-full flex justify-between items-center">
        {myRank > 0 && 
          <div className="flex-1 text-text-primary font-bold text-base">
            Your rank: <span>{myRank}</span> 
          </div>
        }

        <div className="w-full flex justify-end flex-1">
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
