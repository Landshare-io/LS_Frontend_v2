import Image from "next/image";
import KYC_Referral_User from "../../../public/icons/referral-kyc-user.svg";
import KYC_Referral_File from "../../../public/icons/referral-kyc-file.svg";
import KYC_Referral_Line from "../../../public/icons/referral-kyc-line.svg";
import KYC_Referral_Person from "../../../public/icons/referral-kyc-person.svg";
import LSRWA_Pass_Key from "../../../public/icons/referral-pass-kyc.svg";
import LSRWA_Purchase_Tokens from "../../../public/icons/referral-purchase-tokens.svg";
import LSRWA_Hold from "../../../public/icons/referral-hold.svg";
import Green_Arrow from "../../../public/icons/green-arrow-forward.svg";
import { useRouter } from "next/router";
import { useGlobalContext } from "../../context/GlobalContext";

export default function ReferralParticipate() {
    const router = useRouter();
    const {setKycopen, setZeroIDModalOpen} = useGlobalContext();

    return(
        <div className="w-full grid md:grid-cols-3 grid-cols-1 h-fit gap-6">
            <div className="md:flex md:col-span-2 bg-third rounded-[32px] p-5 gap-6 shadow-lg">
                <Image src={KYC_Referral_User} alt="KYC Referral Page" className="w-[304px] h-[304px] max-md:mx-auto shadow-lg"/>

                <div>
                    <p className="max-md:mt-6 text-text-primary font-bold text-lg">KYC Verification</p>

                    <div className="mt-[29px] flex justify-start w-full">
                        <Image src={KYC_Referral_File} alt="KYC Referral User" className="w-6 h-6 flex-none"/>
                        <Image src={KYC_Referral_Line} alt="KYC Referral Line" className="flex-1 !w-0"/>
                        <Image src={KYC_Referral_Person} alt="KYC Referral Person" className="w-6 h-6 flex-none"/>
                    </div>

                    <p className="mt-[29px] text-text-secondary text-sm">
                        Identity verification is required for both the referrer and referee to participate in Landshare's Referral Program and engage with the LSRWA security tokens.
                    </p>

                    <button className="mt-20 bg-[#61CD81] px-6 py-[13px] rounded-[100px] text-white" onClick={() => setKycopen(true)}>
                        Verify now
                    </button>
                </div>
            </div>

            <div className="bg-third rounded-[32px] p-5 gap-6 shadow-lg">
                <p className="text-text-primary font-bold text-lg">How To Get Started</p>

                <p className="text-text-secondary text-sm mt-[29px]">The onboarding process is quick and easy. After completing these initial steps, you are free to buy or sell RWA Token at any time.</p>

                <div className="w-full flex justify-start items-center mt-[29px]">
                    <Image src={LSRWA_Pass_Key} alt="LSRWA Pass Key" className="flex-none w-10 h-10"/>
                    <hr className="grow h-[2px] bg-[#61CD81]"/>
                    <Image src={LSRWA_Purchase_Tokens} alt="LSRWA Purchase Tokens" className="flex-none w-10 h-10"/>
                    <hr className="grow h-[2px] bg-[#61CD81]"/>
                    <Image src={LSRWA_Hold} alt="LSRWA Hold" className="flex-none w-10 h-10"/>
                </div>

                <div className="mt-16 flex items-center gap-6">
                    <button 
                        onClick={()=>router.push('rwa')}
                        className="bg-[#61CD81] px-6 py-[13px] rounded-[100px] text-white">
                        Buy LSRWA
                    </button>

                    <a 
                        href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa"
                        className="flex justify-start items-center text-[#61CD81] font-bold text-sm">
                        <p>Learn More</p> 
                        <Image src={Green_Arrow} alt="green arrow"/>
                    </a>
                </div>
            </div>
        </div>
    )
}