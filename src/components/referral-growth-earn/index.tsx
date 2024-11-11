import Image from "next/image";
import Earning from "../../../public/icons/referral-growth.svg"

export default function GrowthEarning() {
    return(
    <div className="flex justify-start items-center px-[6px] py-[7px] w-[85px] h-[34px] bg-white rounded-[50px] gap-2">
        <Image src={Earning} alt="Growth Earning" width={20} height={20}/>

        <p className="text-[#0A0A0A] text-sm font-medium leading-[22px]">Earn</p>
    </div>)
} 