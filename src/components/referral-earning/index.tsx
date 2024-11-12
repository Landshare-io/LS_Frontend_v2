export default function ReferralEarning() {
  return (
    <div className="w-full h-full flex flex-col justify-between bg-third rounded-2xl p-6 shadow-lg">
      <p className="font-bold text-lg leading-7 text-text-primary">Earnings</p>

      <div className="">
        <div className="mt-[22px] flex justify-between">
          <div>
            <p className="text-text-secondary text-sm leading-[28px]">
              Total Earned
            </p>
            <p className="text-text-primary font-bold leading-[22px]">
              0.000 USDT
            </p>
          </div>

          <div className="text-text-secondary text-sm leading-[28px] flex flex-col items-end">
            <p>
              Commissions:{" "}
              <span className="font-bold text-text-primary">0.00</span>{" "}
              <span className="text-text-primary">USDT</span>
            </p>
            <p>
              Fee Rebates:{" "}
              <span className="font-bold text-text-primary">0.00</span>{" "}
              <span className="text-text-primary">USDT</span>
            </p>
          </div>
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

        <p className="text-sm mt-2 text-text-secondary leading-[22px]">
          Referral commissions and rebates are only tracked across Arbitrum and
          Mantle. Rewards can be claimed on Arbitrum.{" "}
          <span className="text-[#61CD81] font-bold  cursor-pointer">
            Learn more
          </span>
        </p>
      </div>

      <p className="text-sm mt-[60px] md:mt-[66px] text-text-secondary leading-[22px]">
        If you were referred by another trader, you’ll be able to see and claim
        available rebates here.
      </p>
    </div>
  );
}
