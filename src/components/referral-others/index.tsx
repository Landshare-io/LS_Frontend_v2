import { useGlobalContext } from "../../context/GlobalContext"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from "react";
import { IoCopy } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import ReferralCustomizeModal from "../referral-customize";

export default function ReferralOthers () {
    const { theme } = useGlobalContext();
    const [referralLink, setReferralLink] = useState<string>("https://app.landshare.io/?referrer=0x60307d37662f66B5b506B40645a41dDD89D83A35");
    const [showCheck, setShowCheck] = useState(false);
    const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 2000);
    };

    const handleOpenModal = () => {
        setShowCustomizeModal(true);
    }

    return(
        <div className="lg:w-[617px] w-full flex flex-col bg-third rounded-2xl p-6 h-fit gap-4 sm:gap-8 shadow-md">
            <div className="w-full flex justify-between items-end">
                <p className="text-text-secondary font-bold text-lg leading-7">Refer Others</p>

                <p className="text-sm leading-4 text-text-secondary cursor-pointer" onClick={handleOpenModal}>Customize</p>
            </div>

            <ConnectButton.Custom>
                {({
                account,
                chain,
                authenticationStatus,
                mounted,
                }) => {  
                    const ready = mounted && authenticationStatus !== "loading";

                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus || authenticationStatus === "authenticated");

                    return (
                        <div>
                            {(() => {
                                if (!connected) {
                                    return (
                                        <div className="w-full text-center py-3 rounded-xl bg-[#F6F8F9] text-[#61CD81] text-base leading-5">Connect your wallet to view link</div>
                                    );
                                }

                                if (chain.unsupported) {
                                    return (
                                        <div className="w-full text-center py-3 rounded-xl bg-[#F6F8F9] text-[#61CD81] text-base leading-5">Wrong network</div>
                                    );
                                }

                                if (!chain.unsupported && connected) {
                                    return (
                                        <div className="w-full flex items-center p-2 gap-4 rounded-lg bg-gray-500 bg-opacity-25">
                                            <p className="truncate break-words text-text-primary">
                                                {referralLink}
                                            </p>

                                            {showCheck 
                                            ? <FaCheck className={`cursor-pointer ${theme === `dark` ? "text-white" : ""}`}/> 
                                            : <IoCopy onClick={handleCopy} className={`cursor-pointer ${theme === `dark` ? "text-white" : ""}`}/>} 
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>

            

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

            <ReferralCustomizeModal showModal={showCustomizeModal} setShowModal={setShowCustomizeModal}/>
        </div>
    )
}