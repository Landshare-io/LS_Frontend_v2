export default function ReferralEarning() {
    return(
    <div className="flex flex-col bg-white rounded-2xl p-6 w-[543px] h-[474px]">
        <p className="font-bold text-lg leading-7 text-[#0A0A0A]">Earnings</p>

        <div className="mt-[22px] flex justify-between">
            <div>
                <p className="text-[#535457] text-sm leading-[28px]">Total Earned</p>
                <p className="text-black font-bold leading-[22px]">0.000 USDT</p>
            </div>

            <div className="text-[#535457] text-base leading-[28px] flex flex-col items-end">
                <p>Commissions: <span className="font-bold text-black">0.00</span> <span>USDT</span></p>
                <p>Fee Rebates: <span className="font-bold text-black">0.00</span> <span>USDT</span></p>
            </div>
        </div>

        <hr className="w-full my-[22px] bg-[#D8D8D8]"/>

        <div className="flex justify-between items-center">
            <div>
                <p className="text-[#535457] text-sm leading-[28px]">Available to Claim</p>
                <p className="text-black font-bold leading-[22px]">0.000 USDT</p>
            </div>

            <div className="text-[#535457] text-base leading-[28px] flex flex-col items-end">
                <p>Total claimed: <span className="font-bold text-black">0.00</span> <span>USDT</span></p>
            </div>
        </div>

        <button className="w-full font-bold border border-[#61CD81] opacity-60 text-[#000000] text-sm mt-[22px] py-[13px] rounded-[100px]">Claim Earnings</button>

        <p className="text-sm mt-2 text-[#535457] leading-[22px]">Referral commissions and rebates are only tracked across Arbitrum and Mantle. Rewards can be claimed on Arbitrum.
            <span className="text-[#61CD81] font-bold">Learn more</span>
        </p>

        <p className="text-sm mt-[60px] text-[#535457] leading-[22px]">If you were referred by another trader, you’ll be able to see and claim available rebates here.</p>
    </div>)
}