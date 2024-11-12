export default function ReferralOthers () {
    return(
        <div className="lg:w-[617px] w-full flex flex-col bg-third rounded-2xl p-6 h-fit gap-4 sm:gap-8 shadow-md">
            <div className="w-full flex justify-between items-end">
                <p className="text-text-secondary font-bold text-lg leading-7">Refer Others</p>

                <p className="text-sm leading-4 text-text-secondary">Customize</p>
            </div>

            <button className="w-full py-3 rounded-xl bg-[#F6F8F9] text-[#61CD81] text-base leading-5">Connect your wallet to view link</button>

            <div className="sm:flex justify-between text-text-primary text-base leading-5">
                <div className="space-y-1">
                    <p>LSRWA Incentives</p>
                    <p>Fast and deep liquidity</p>
                </div>
                
                <div className="space-y-1">
                    <p>All collateral earns interest</p>
                    <p>Unbeatable fees: 0-0.02%</p>
                </div>
            </div>
        </div>
    )
}