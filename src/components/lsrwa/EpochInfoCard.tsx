'use client';

import EpochProgressBar from "./EpochProgressBar";

export default function EpochInfoCard() {

  return (
    <div className="flex flex-col justify-between w-full shadow-[1px_3px_4px_0px_rgba(0,0,0,0.15)] p-[14px]">
      <EpochProgressBar />
    </div>
  );
}
