import { useState } from "react";
import Pagination from "../common/pagination";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../common/table";

interface leaderboardDataProps {
  rank: number;
  account: string;
  earnings: number;
  signUps: number;
  totalTakerVolume: string;
  tier: string;
}

export default function ReferralLeaderBoard() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(4);

  //Static Data
  const leaderboardData: leaderboardDataProps[] = [
    {
      rank: 1,
      account: "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
      earnings: 8561367,
      signUps: 2,
      totalTakerVolume: "3.31B USDT",
      tier: "Tier 1",
    },
    {
      rank: 2,
      account: "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
      earnings: 8561367,
      signUps: 2,
      totalTakerVolume: "3.31B USDT",
      tier: "Tier 1",
    },
    {
      rank: 3,
      account: "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
      earnings: 8561367,
      signUps: 2,
      totalTakerVolume: "3.31B USDT",
      tier: "Tier 1",
    },
    {
      rank: 4,
      account: "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
      earnings: 8561367,
      signUps: 2,
      totalTakerVolume: "3.31B USDT",
      tier: "Tier 1",
    },
    {
      rank: 5,
      account: "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
      earnings: 8561367,
      signUps: 2,
      totalTakerVolume: "3.31B USDT",
      tier: "Tier 1",
    },
    {
      rank: 6,
      account: "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
      earnings: 8561367,
      signUps: 2,
      totalTakerVolume: "3.31B USDT",
      tier: "Tier 1",
    },
  ];

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
            <TableHead className="min-w-[100px] w-auto">Tier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((data, index) => {
            const { rank, account, earnings, signUps, totalTakerVolume, tier } =
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
                <TableCell>{earnings}</TableCell>
                <TableCell>{signUps}</TableCell>
                <TableCell>{totalTakerVolume}</TableCell>
                <TableCell className="rounded-r-xl">{tier}</TableCell>
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
