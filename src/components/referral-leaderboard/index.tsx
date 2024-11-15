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

  return (
    <div className="mt-12">
      <h2 className="text-text-primary font-bold text-2xl leading-[22px]">
        Leaderboard
      </h2>
      <Table className="border-separate text-text-primary border-spacing-y-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] ">Rank</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Earnings</TableHead>
            <TableHead className="min-w-[110px] lg:min-w-max">
              Sign Ups
            </TableHead>
            <TableHead className="min-w-[200px] lg:min-w-max">
              Total Taker Volume <span className="text-[#61CD81]">ⓘ</span>
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
                <TableCell>{"totalTakerVolume"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
