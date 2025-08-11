import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import Carousel from "../common/carousel";
import CarouselItem from "../common/carousel/carousel-item";
import CarouselControl from "../common/carousel/carousel-control";
import FeatureBadge from "../common/feature-badge";
import Button from "../common/button";
import ImageHero1 from "../../../public/img/dashboard/rwa-hero-image-1.svg";
import ImageHero1_Dark from "../../../public/img/dashboard/rwa-hero-image-1-dark.svg";
import ImageHero2 from "../../../public/img/dashboard/rwa-hero-image-2.svg";
import ImageHero2_Dark from "../../../public/img/dashboard/rwa-hero-image-2-dark.svg";
import LsrwaMadeEasy from "../lsrwa-made-easy/LsrwaMadeEasy";

export default function HomeRwaHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <div className="pt-[40px] pb-[20px] px-[20px] md:pt-[20px] md:pb-[40px] md:px-[40px] lg:pt-[30px] lg:px-0 lg:pb-0">
      <Carousel
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setPaused={setPaused}
      >
        <CarouselItem activeIndex={activeIndex}>
          <LsrwaMadeEasy />
        </CarouselItem>
        <CarouselItem activeIndex={activeIndex}>
          <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center max-w-[1200px] m-auto ">
            <div className="flex flex-col justify-end w-full whitespace-normal max-w-fit md:max-w-[560px]">
              <FeatureBadge
                icon="/icons/cube.svg"
                text="The Future of Investment"
              />
              <h1
                className={`text-text-primary text-[40px] leading-[50px] md:text-[54px] md:leading-[68px] my-[12px] ${BOLD_INTER_TIGHT.className}`}
              >
                RWA Token is Now Live
              </h1>
              <p className="line-clamp-4 mb-6 md:text-[16px] md:leading-[24px] md:tracking-[2%] lg:mb-[40px] lg:text-[18px] lg:leading-[28px] lg:tracking-[0.36px] text-[#535457] dark:text-[#a9abaf]">
                The Landshare RWA Token Main Sale is now live! Our new
                tokenization model offers a simple and secure way to gain
                exposure to real estate directly on-chain.
              </p>
              <div className="hidden md:flex gap-[16px]">
                <Link href="https://dashboard.landshare.io">
                  <Button className="bg-primary-green text-[#fff] px-[24px] py-[13px] rounded-[100px]">
                    Buy Now
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
            <div className="flex w-full max-w-fit md:max-w-[550px]">
              <Image
                src={ImageHero1_Dark}
                className="hidden dark:flex w-full"
                alt="hero image 1"
              />
              <Image
                src={ImageHero1}
                className="flex dark:hidden w-full"
                alt="hero image 1"
              />
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
        </CarouselItem>
        <CarouselItem activeIndex={activeIndex}>
          <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center max-w-[1200px] m-auto">
            <div className="flex flex-col justify-end w-full whitespace-normal max-w-fit md:max-w-[560px]">
              <FeatureBadge icon="/icons/cube.svg" text="Stay Up To Date" />
              <h1
                className={`text-text-primary text-[40px] leading-[50px] md:text-[54px] md:leading-[68px] my-[12px] ${BOLD_INTER_TIGHT.className}`}
              >
                Get the Latest Updates
              </h1>
              <p className="line-clamp-4 mb-6 md:text-[16px] md:leading-[24px] md:tracking-[2%] lg:mb-[40px] lg:text-[18px] lg:leading-[28px] lg:tracking-[0.36px] text-[#535457] dark:text-[#a9abaf]">
                Stay plugged in to Landshare by following our social media
                pages. Get the latest project updates, developer insights,
                industry news, and much more.
              </p>
              <div className="hidden md:flex gap-[16px]">
                <Link href="https://linktr.ee/landshareio">
                  <Button className="text-[#fff] px-[24px] bg-primary-green py-[13px] rounded-[100px]">
                    Link Tree
                  </Button>
                </Link>
                <Link href="https://t.me/landshare">
                  <Button
                    className="px-[24px] py-[13px] rounded-[100px] border-primary-green hover:bg-primary-green hover:text-white"
                    textClassName="dark:text-[#fff]"
                    outlined
                  >
                    Telegram Community
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex w-full max-w-fit md:max-w-[550px]">
              <Image
                src={ImageHero2_Dark}
                className="hidden dark:flex w-full"
                alt="hero image 2"
              />
              <Image
                src={ImageHero2}
                className="flex dark:hidden w-full"
                alt="hero image 2"
              />
            </div>
            <div className="mt-[20px] justify-around w-full flex gap-2 md:hidden">
              <Link className="w-full" href="https://linktr.ee/landshareio">
                <Button
                  className="rounded-[100px] py-[13px] w-full bg-primary-green"
                  textClassName="text-[#fff]"
                >
                  Link Tree
                </Button>
              </Link>
              <Link className="w-full" href="https://t.me/landshare">
                <Button
                  className="rounded-[100px] py-[13px] w-full border-primary-green hover:bg-primary-green"
                  textClassName="dark:text-[#fff]"
                  outlined
                >
                  Telegram
                </Button>
              </Link>
            </div>
          </div>
        </CarouselItem>
      </Carousel>
      <CarouselControl
        paused={paused}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        carouselControlClass={"max-w-[1200px] m-auto "}
        count={3}
      />
    </div>
  );
}
