export default function ReferralEarning() {
  return (
    <div className="w-full h-full flex flex-col justify-between bg-third rounded-2xl p-6 shadow-lg">
      <p className="font-bold text-lg leading-7 text-text-primary">Earnings</p>

      <div className="">
        <div className="mt-[22px] flex justify-between">
          <p className="text-text-secondary text-sm leading-[28px]">
            Total Earned
          </p>

          <p className="font-bold text-text-primary text-lg leading-[28px] flex flex-col items-end">
              0.00 USDT
          </p>
        </div>

        <hr className="w-full my-[22px] bg-[#D8D8D8]" />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-text-secondary text-sm leading-[28px]">
              Available to Claim
            </p>
            <p className="text-text-primary font-bold leading-[22px]">
              0.000 USDT
            </p>
          </div>

          <div className="text-text-secondary text-sm leading-[28px] flex flex-col items-end">
            <p>
              Total claimed:{" "}
              <span className="font-bold text-text-primary">0.00</span>{" "}
              <span className="text-text-primary">USDT</span>
            </p>
          </div>
        </div>

        <button
          disabled
          className="w-full font-bold border  border-[#61CD81] opacity-60 text-text-primary text-sm mt-[22px] py-[13px] rounded-[100px]"
        >
          Claim Earnings
        </button>

      </div>

      <div className="text-sm mt-[60px] md:mt-[66px] text-text-secondary leading-[22px]">
        <p className="text-[#FF0000] font-bold">
          30-Day Holding Requirement
        </p>
        <p>
          Both the referrer and referee must wait until the referee holds the LSRWA tokens for at least 30 days before rewards can be claimed.
        </p>
      </div>
     
    </div>
  );
}
