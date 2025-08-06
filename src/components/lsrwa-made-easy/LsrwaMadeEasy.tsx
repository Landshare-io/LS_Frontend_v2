import React from "react";
import Image from "next/image";
import { FaBoltLightning } from "react-icons/fa6";
import Button from "../common/button";

function LsrwaMadeEasy() {
  return (
    <div className="flex flex-col gap-[40px]  items-center p-0 mlg:px-[20px] xl:px-0 xl:pb-[80px] max-w-[1200px] m-auto">
      <div className="flex lg:flex-row [@media(min-width:820px)_and_(max-width:1024px)]:flex-row lg:gap-20 gap-6 lg:justify-around flex-col justify-center items-center">
        <section className="flex justify-center">
          <Image
            src="/img/rwa-mockup/lsrwa-express-iphone-mockup.png"
            alt="iphone-mockup"
            className="z-50"
            width={350}
            height={100}
          />
        </section>
        <section className="flex flex-col justify-center md:w-2/3 w-full gap-4">
          <div className="flex xl:items-start items-center w-fit py-[6px] bg-white pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-secondary dark:bg-secondary">
            <div className="flex items-center justify-center p-[4px] w-[32px] h-[32px] rounded-[30px] bg-primary">
              <FaBoltLightning className="size-[20px] text-[#24BC48]" />
            </div>
            <span className="text-[14px] leading-[22px] capitalize tracking-[0.02em] font-bold text-text-primary">
              LSRWA Express
            </span>
          </div>
          <h2
            id="target-element"
            className={` text-text-primary lg:w-auto md:w-2/3 w-full   lg:leading-[64px] text-[32px] leading-normal md:text-[40px] lg:text-[56px] font-bold`}
          >
            Buying LSRWA Made Easy
          </h2>
          <p className="text-text-secondary text-sm   w-[85%] ">
            Simply deposit USDC and earn real-world, asset-backed yield—no need
            to manually handle $LSRWA tokens.
          </p>
          <div className="flex md:flex-row flex-col gap-4">
            <Button className="w-full  py-[13px] px-[24px] rounded-full bg-primary-green text-white">
              Buy LSRWA
            </Button>
            <Button
              outlined
              className="w-full py-[13px] px-[24px] rounded-full border-primary-green"
            >
              Learn more
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LsrwaMadeEasy;
