import React from "react";
import Image from "next/image";
import Button from "../common/button";
import Link from "next/link";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import IphoneMockup from "../../../public/img/rwa-mockup/lsrwa-express-iphone-mockup.png";
import FeatureBadge from "../common/feature-badge";
import { HiBolt } from "react-icons/hi2";

function LsrwaMadeEasy() {
  return (
    <div className="flex flex-col md:flex-row items-start md:justify-around md:items-center max-w-[1200px] m-auto ">
      <div className="flex flex-col justify-end w-full whitespace-normal max-w-fit md:max-w-[560px]">
        <FeatureBadge IconComponent={HiBolt} text="LSRWA Express" />
        <h1
          className={`text-text-primary text-[40px] leading-[50px] md:text-[54px] md:leading-[68px] my-[12px] ${BOLD_INTER_TIGHT.className}`}
        >
          LSRWA Express
        </h1>
        <h1
          className={`text-text-primary text-[40px] leading-[50px] md:text-[54px] md:leading-[68px] my-[12px] ${BOLD_INTER_TIGHT.className}`}
        >
          Buying LSRWA Made Easy
        </h1>
        <p className="line-clamp-4 mb-6 md:text-[16px] md:leading-[24px] md:tracking-[2%] lg:mb-[40px] lg:text-[18px] lg:leading-[28px] lg:tracking-[0.36px] text-[#535457] dark:text-[#a9abaf]">
          Simply deposit USDC and earn real-world, asset-backed yield—no need to
          manually handle $LSRWA tokens.
        </p>
        <div className="hidden md:flex gap-[16px]">
          {/* // todo: should navigate lsrwa express section  */}
          <Link href="/rwa">
            <Button className="bg-primary-green text-[#fff] px-[24px] py-[13px] rounded-[100px]">
              Buy LSRWA
            </Button>
          </Link>
          <Link href="https://docs.landshare.io/platform-features/lsrwa-express">
            <Button
              className="px-[24px] py-[13px] rounded-[100px] border-primary-green hover:bg-primary-green"
              textClassName="dark:text-[#fff]"
              outlined
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="flex w-full justify-end max-w-fit md:max-w-[550px]">
          <Image
            src={IphoneMockup}
            className="flex w-auto h-[280px] md:h-[450px]"
            alt="hero image 1"
          />
        </div>
      </div>
      <div className="mt-[20px] justify-around w-full flex gap-2 md:hidden">
        <Link className="w-full" href="/rwa">
          <Button
            className="rounded-[100px] py-[13px] w-full bg-primary-green"
            textClassName="text-[#fff]"
          >
            Buy Now
          </Button>
        </Link>

        <a
          className="w-full"
          href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa"
        >
          <Button
            className="rounded-[100px] py-[13px] w-full border-primary-green hover:bg-primary-green hover:text-white"
            textClassName="dark:text-[#fff]"
            outlined
          >
            Learn More
          </Button>
        </a>
      </div>
    </div>
  );
}

export default LsrwaMadeEasy;
