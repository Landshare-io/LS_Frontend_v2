import { FaFileLines } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useGlobalContext } from "../../context/GlobalContext";
import { HiIdentification } from "react-icons/hi2";
import { IoLink, IoPersonAdd } from "react-icons/io5"
import { MdArrowOutward } from "react-icons/md";

export default function ReferralParticipate() {
    const router = useRouter();
    const {setKycopen} = useGlobalContext();

    return(
        <div className="w-full grid md:grid-cols-3 grid-cols-1 h-fit gap-6">
            <div className="w-full md:flex md:col-span-2 bg-third rounded-[32px] p-5 gap-6 shadow-lg">
                <div className="w-[304px] shrink-0 h-[304px] bg-[#24BC481A] rounded-[32px] max-md:mx-auto">
                    <div className="relative w-full h-full p-5">
                        <div className="absolute top-5 left-5 w-10 h-10 bg-none border-[#239942] border-l-[1.5px] border-t-[1.5px] rounded-tl-2xl"/>
                        <div className="absolute top-5 right-5 w-10 h-10 bg-none border-[#239942] border-r-[1.5px] border-t-[1.5px] rounded-tr-2xl"/>
                        <div className="absolute bottom-5 left-5 w-10 h-10 bg-none border-[#239942] border-l-[1.5px] border-b-[1.5px] rounded-bl-2xl"/>
                        <div className="absolute bottom-5 right-5 w-10 h-10 bg-none border-[#239942] border-r-[1.5px] border-b-[1.5px] rounded-br-2xl"/>

                        <FaUser className="absolute w-16 h-16 text-[#61CD81] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <p className="max-md:mt-6 text-text-primary font-bold text-lg">KYC Verification</p>
                        <div className="mt-[29px] flex justify-start items-center w-full">
                            <FaFileLines className="w-6 h-6 text-[#61CD81]"/>
                            
                            <div className="flex justify-between items-center grow px-1">
                                {Array.from({ length: 10 }, (_, index) => (
                                        <div
                                            key={index}
                                            className={`${
                                                index === 0 || index === 9 ? "w-2" : "w-4"
                                            } h-[1px] bg-[#B5B5B5] rounded-full`}
                                        />
                                ))}
                            </div>
                            <FaUserCircle className="w-5 h-5 text-[#0000004D] flex-none"/>
                        </div>

                        <p className="mt-[29px] text-text-secondary text-sm">
                            Identity verification is required for both the referrer and referee to participate in Landshare's Referral Program and engage with the LSRWA security tokens.
                        </p>
                    </div>

                    <button className="w-fit bg-[#61CD81] px-6 py-[13px] rounded-[100px] text-white" onClick={() => setKycopen(true)}>
                        Verify now
                    </button>
                </div>
            </div>

            <div className="flex flex-col justify-between bg-third rounded-[32px] p-5 gap-6 shadow-lg">
                <div>
                    <p className="text-text-primary font-bold text-lg">How To Get Started</p>

                    <p className="text-text-secondary text-sm mt-[29px]">The verification process is fast and simple. Once you complete the steps, you'll be able to generate a unique invitation link, as well as buy or sell LSRWA tokens whenever you like.</p>

                    <div className="w-full flex justify-start items-center mt-[29px]">
                        <div className="flex justify-center items-center w-10 h-10 rounded-full border-[2px] border-[#61CD81]">
                            <HiIdentification className="flex-none w-6 h-6 text-[#61CD81]"/>
                        </div>
                        <hr className="grow h-[2px] bg-[#61CD81]"/>
                        <div className="flex justify-center items-center w-10 h-10 rounded-full border-[2px] border-[#61CD81]">
                            <IoLink className="flex-none w-6 h-6 text-[#61CD81]"/>
                        </div>
                        <hr className="grow h-[2px] bg-[#61CD81]"/>
                        <div className="flex justify-center items-center w-10 h-10 rounded-full border-[2px] border-[#61CD81]">
                            <IoPersonAdd className="flex-none w-6 h-6 text-[#61CD81]"/>
                        </div>
                    </div>

                    <div className="flex justify-between text-sm text-text-primary py-[10px] font-medium">
                        <p>Pass Key</p>
                        <p>Generate Invite Link</p>
                        <p>Refer Friends</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={()=>router.push('rwa')}
                        className="bg-[#61CD81] px-6 py-[13px] rounded-[100px] text-white">
                        Buy LSRWA
                    </button>

                    <a 
                        href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa"
                        className="flex justify-start items-center text-[#61CD81] font-bold text-sm">
                        <p>Learn more about LSRWA</p> 
                        <MdArrowOutward className="w-4 h-4 text-[#61CD81]"/>
                    </a>
                </div>
            </div>
        </div>
    )
}