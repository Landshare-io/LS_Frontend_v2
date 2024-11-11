import {useState} from "react";
import Pagination from "../common/pagination"

interface leaderboardDataProps {
    rank : number;
    account : string;
    earnings : number;
    signUps : number;
    totalTakerVolume : string;
    tier : string;
}

export default function ReferralLeaderBoard () {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(4);

    //Static Data
    const leaderboardData: leaderboardDataProps[] = 
        [
            {
                rank : 1,
                account : "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
                earnings : 8561367,
                signUps : 2,
                totalTakerVolume : "3.31B USDT",
                tier : "Tier 1"
            },
            {
                rank : 2,
                account : "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
                earnings : 8561367,
                signUps : 2,
                totalTakerVolume : "3.31B USDT",
                tier : "Tier 1"
            },
            {
                rank : 3,
                account : "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
                earnings : 8561367,
                signUps : 2,
                totalTakerVolume : "3.31B USDT",
                tier : "Tier 1"
            },
            {
                rank : 4,
                account : "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
                earnings : 8561367,
                signUps : 2,
                totalTakerVolume : "3.31B USDT",
                tier : "Tier 1"
            },
            {
                rank : 5,
                account : "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
                earnings : 8561367,
                signUps : 2,
                totalTakerVolume : "3.31B USDT",
                tier : "Tier 1"
            },
            {
                rank : 6,
                account : "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
                earnings : 8561367,
                signUps : 2,
                totalTakerVolume : "3.31B USDT",
                tier : "Tier 1"
            },
        ]

    return(
        <div className="mt-12">
            <p className="text-[#000000] font-bold text-2xl leading-[22px]">Leaderboard</p>

            <div className="grid grid-cols-5 sm:grid-cols-6  mt-6 px-[18px] py-[11px] text-sm leading-[22px] text-left">
                <p>Rank</p>
                <p className="col-span-2">Account</p>
                <p>Earnings</p>
                <p>Sign Ups</p>
                <p className="hidden sm:block">Total Taker Volume <span className="text-[#61CD81]">ⓘ</span></p>
                <p className="text-right hidden sm:block">Tier</p>
            </div>

            {leaderboardData.map((data, index) => (
                <div key={index} className="grid grid-cols-5 sm:grid-cols-6 font-bold bg-[#FFFFFF] rounded-2xl mt-6 px-[18px] py-[21px] text-sm leading-[22px] text-left">
                    <p>{data.rank}</p>
                    <p className="col-span-2">{`${data.account.slice(0, 6)}...${data.account.slice(-4)}`}</p>
                    <p>{data.earnings}</p>
                    <p>{data.signUps}</p>
                    <p className="hidden sm:block">{data.totalTakerVolume}</p>
                    <p className="text-right hidden sm:block">{data.tier}</p>
                </div>
            ))}

            <div className="flex justify-end mt-[18px] lg:mt-6">
                <Pagination pageCount={pageCount} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            </div>
        </div>
    )
}