import React from "react";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

// Define a type for the leaderboard user data
type User = {
  rank: number;
  address: string;
  score: number;
};

// Mock data for the leaderboard
const users: User[] = [
  { rank: 1, address: "0xf362...8247", score: 545 },
  { rank: 2, address: "0xf362...8247", score: 535 },
  { rank: 3, address: "0xf362...8247", score: 525 },
  { rank: 4, address: "0xf362...8247", score: 515 },
  { rank: 5, address: "0xf362...8247", score: 515 },
];

// Main App component
const App: React.FC = () => {
  return (
    // Centering container for the whole component

    <div className="w-full h-full bg-secondary p-4 flex flex-col justify-between rounded-3xl shadow-md border-text-third/40 dark:border-white/20 border-[1px]">
      {/* Header section */}
      <div className="flex justify-between items-center mb-4">
        <p
          className={`flex justify-between items-center text-[24px] leading-[30px]  ${BOLD_INTER_TIGHT.className}`}
        >
          Leaderboard
        </p>

        <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left text-text-secondary">
          85 Days Remaining
        </p>
      </div>

      {/* Leaderboard list */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-primary rounded-2xl"
          >
            {/* Rank and Address */}
            <div className="flex items-center justify-between w-full">
              <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left text-text-primary font-bold">
                #{user.rank}
              </p>
              <span className="text-[14px] leading-[22px] tracking-[0.02em] text-left text-text-primary">
                {user.address}
              </span>

              {/* Score */}
              <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left text-text-primary font-bold">
                {user.score} LSP
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer message */}
      <div className="text-center text-text-primary bg-primary py-2 flex items-center justify-center rounded-xl text-sm">
        Top 10 users share
        <span className="font-bold text-green-600 ms-1">$1000 USDC.</span>
      </div>
    </div>
  );
};

export default App;
