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
            <h2 className="text-text-primary font-bold text-2xl leading-[22px]">Leaderboard</h2>

            <div className="w-full overflow-auto mb-[18px] lg:mb-6">
                <div className="min-w-[960px] text-text-primary grid grid-cols-6 mt-6 px-[18px] py-[11px] text-sm leading-[22px] text-left">
                    <p>Rank</p>
                    <p>Account</p>
                    <p>Earnings</p>
                    <p>Sign Ups</p>
                    <p>Total Taker Volume <span className="text-[#61CD81]">ⓘ</span></p>
                    <p>Tier</p>
                </div>

                {leaderboardData.map((data, index) => {
                    const { rank, account, earnings, signUps, totalTakerVolume, tier } = data;
                    const accountDisplay = `${account.slice(0, 6)}...${account.slice(-4)}`;

                    return (
                        <div key={index} className="text-text-primary min-w-[960px] grid grid-cols-6 font-bold bg-third rounded-2xl mt-6 px-[18px] py-[21px] text-sm leading-[22px] text-left">
                            <p>{rank}</p>
                            <p>{accountDisplay}</p>
                            <p>{earnings}</p>
                            <p>{signUps}</p>
                            <p>{totalTakerVolume}</p>
                            <p>{tier}</p>
                        </div>
                    )
                })}
            </div>

            <Pagination pageCount={pageCount} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </div>
    )
}