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

interface leaderboardDataProps {
  rank: number;
  account: string;
  total_amount: number;
  total_attributions: number;
  // totalTakerVolume: string;
  // tier: string;
}

export default function ReferralLeaderBoard() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [leaderboardData, setLeaderboardData] = useState<leaderboardDataProps[]>();

  useEffect(()=>{
    const fetchData = async () => {
      const res = await Fuul.getPointsLeaderboard({});

      setPageCount(res.results.length / 10 + 1);

      const formattedData = res?.results?.map((item: any) => ({
        rank: item.rank,
        account: item.account ?? 0, // Provide a default value if account is missing
        total_amount: item.total_amount,
        total_attributions: item.total_attributions,
      }));

      setLeaderboardData(formattedData);
    }

    fetchData();
  }, [])

  const getCurrentEpoch = () => {
    const today = new Date();
    
    const currentMonthIndex = today.getMonth();
    
    const previousMonthIndex = (currentMonthIndex + 11) % 12;
    const nextMonthIndex = (currentMonthIndex + 1) % 12;     

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const previousMonth = monthNames[previousMonthIndex];
    const currentMonth = monthNames[currentMonthIndex];
    const nextMonth = monthNames[nextMonthIndex];

    return `${previousMonth} 25 - ${nextMonth} 25`;
}

  return (
    <div className="mt-12">
      <h2 className="text-text-primary font-bold text-2xl leading-[22px]">
        Leaderboard
        <span className="px-2 w-fit my-6 text-text-primary text-sm font-normal">{getCurrentEpoch()}  <span className="text-[#61CD81]">ⓘ</span></span>
      </h2>

      <div className="mt-[10px] text-text-secondary text-sm">The program operates in 3-month epochs.</div>

      <Table className="border-separate text-text-primary border-spacing-y-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5">Rank</TableHead>
            <TableHead className="w-1/5">Account</TableHead>
            <TableHead className="w-1/5">Claimed Earnings</TableHead>
            <TableHead className="w-1/5">
              Approved invites
            </TableHead>
            <TableHead className="w-1/5">
              Purchase Volume <span className="text-[#61CD81]"> ⓘ</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {leaderboardData?.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10).map((data, index) => {
            const { rank, account, total_amount, total_attributions } =
              data;
            const accountDisplay = `${account.slice(0, 6)}...${account.slice(
              -4
            )}`;
            return (
              <TableRow
                className="bg-secondary mb-3 shadow-md shadow-gray-400/10 rounded-xl"
                key={index}
              >
                <TableCell className="rounded-l-xl">{rank}</TableCell>
                <TableCell>{accountDisplay}</TableCell>
                <TableCell>{total_amount}</TableCell>
                <TableCell>{"0"}</TableCell>
                <TableCell className="rounded-r-xl">{"totalTakerVolume"}</TableCell>
              </TableRow>
            );
          })}

          {/* test Data */}
          
          <TableRow
              className="bg-secondary mb-3 shadow-md shadow-gray-400/10 rounded-xl"
            >
            <TableCell className="rounded-l-xl">{"1"}</TableCell>
            <TableCell >{"0xf362…8247"}</TableCell>
            <TableCell >{"85,613.67 USDC"}</TableCell>
            <TableCell >{"0"}</TableCell>
            <TableCell className="rounded-r-xl">{"totalTakerVolume"}</TableCell>
          </TableRow>

          <TableRow
              className="mb-3 shadow-md shadow-gray-400/10 rounded-xl text-[#0B6C96] bg-[#0B6C961A] font-bold"
            >
            <TableCell className="rounded-l-xl border border-r-0 border-[#0B6C9680]">{"1"}</TableCell>
            <TableCell className="border-y border-[#0B6C9680]">{"0xf362…8247"}</TableCell>
            <TableCell className="border-y border-[#0B6C9680]">{"85,613.67 USDC"}</TableCell>
            <TableCell className="border-y border-[#0B6C9680]">{"0"}</TableCell>
            <TableCell className="rounded-r-xl border border-l-0 border-[#0B6C9680]">{"totalTakerVolume"}</TableCell>
          </TableRow>

        </TableBody>
      </Table>

      <div className="flex justify-between">
        <div className="text-text-primary font-bold text-base">
          Your rank: 34 
        </div>

        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
