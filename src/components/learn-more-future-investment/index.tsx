import Image from "next/image";
import Button from "../common/button";
import { useTheme } from "next-themes";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import IllustrationMap from "../../../public/img/dashboard/illustration-map.webp";
import IllustrationMapMobile from "../../../public/img/dashboard/illustration-map-mobile.webp";
import IllustrcationMapDark from "../../../public/img/dashboard/Illustration_map_dark.webp";

export default function MoreInvestment() {
  const { theme } = useTheme();

  return (
    <div className="bg-[#E6E6F2] md:py-[100px]  dark:bg-[#222222] p-0 md:px-[20px] xl:px-[120px] xl:py-[100px]">
      <div className="pt-[200px] pb-[100px] px-[20px] md:p-[80px] rounded-0 md:rounded-[24px] relative section-set-max-container max-w-[1200px] m-auto bg-[#0A1339] dark:bg-secondary">
        {theme == "dark" ? (
          <>
            <Image
              src={IllustrationMapMobile}
              alt="illustration map"
              className="block md:hidden absolute top-[46.3px] left-0 w-full"
            />
            <Image
              src={IllustrcationMapDark}
              alt="illustration map"
             className="hidden md:block absolute w-[840px] bottom-0 right-0"
            />
          </>
        ) : (
          <>
            <Image
              src={IllustrationMapMobile}
              alt="illustration map"
              className="block md:hidden absolute top-[46.3px] left-0 w-full"
            />
            <Image
              src={IllustrationMap}
              alt="illustration map"
              className="hidden md:block absolute w-[840px] bottom-0 right-0"
            />
          </>
        )}
        <div className="relative z-10 ">
          <p
            className={`text-[32px] leading-[40px] text-center md:text-start md:text-[54px] md:leading-[68px] text-white ${BOLD_INTER_TIGHT.className}`}
          >
            Learn more about the
            <br /> future of property
            <br /> investment
          </p>
          <div className="flex flex-col md:flex-row gap-[16px] mt-[40px]">
            <a target="_blank" href="https://docs.landshare.io">
              <Button
                textClassName="text-[#fff]"
                className="w-full md:w-auto px-[24px] py-[13px] bg-primary-green rounded-[100px]"
              >
                View Docs
              </Button>
            </a>
            <a
              target="_blank"
              href="https://docs.landshare.io/"
              // href="https://uploads-ssl.webflow.com/649664b4d452680d2964b449/654d29c8dd036fc324fd3393_Whitepaper.pdf"
            >
              <Button
                textClassName="text-[#fff] dark:text-[#fff]"
                className="w-full md:w-auto px-[24px] py-[13px] border-primary-green hover:bg-primary-green rounded-[100px]"
                outlined
              >
                Whitepaper
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
