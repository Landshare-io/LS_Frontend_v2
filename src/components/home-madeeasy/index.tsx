'use client';

import Image from "next/image"
import { IoIosTrendingUp } from "react-icons/io";

const MadeEasy = () => {
    return (
        <div className='flex flex-col-reverse md:flex-row bg-white w-full px-[20px] py-[40px] md:px-[46px] md:py-[80px]'>
            <div className="flex-1">
                <div className="flex justify-center md:justify-end">
                    <Image
                        src="/img/dashboard/iphone.png"
                        alt="Logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: 'auto', height: '00%' }}
                    />
                </div>
            </div>
            <div className="flex-1 mt-[20px] md:mt-[200px]">
                <div className="w-full md:w-[471px]">
                    <div className="flex items-center gap-[10px] p-[6px] pr-[20px] bg-white rounded-[50px] w-max">
                        <IoIosTrendingUp className="w-[24px] h-[24px] text-[#24BC48]" />
                        <p className="font-medium">LSRWA Express</p>
                    </div>
                    <div className="mt-[20px]">
                        <p className="font-bold lg:text-[50px] md:text-[32px] text-[24px] leading-[60px]">Buying LSRWA Made Easy</p>
                        <p className="mt-[20px] text-gray">Simply deposit USDC and earn real-world, asset-backed yield—no need to manually handle $LSRWA tokens.</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between mt-[20px]">
                        <div>
                            <button className="py-[13px] w-full md:w-fit px-[63px] rounded-full font-bold text-[white] text-[14px] bg-[#61CD81] hover:bg-[#3d9f5a]">Buy LSRWA</button>
                        </div>
                        <div>
                            <button className="py-[13px] mt-4 md:mt-0 w-full md:w-fit px-[63px] rounded-full font-bold text-[#0A0A0A] text-[14px] bg-[white] hover:bg-[#f3efef] border-[1px] border-[#61CD81]">Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MadeEasy