import Image from "next/image";
import { Inter_Tight } from 'next/font/google';
import Button from "../common/button";
import { useGlobalContext } from "../../context/GlobalContext";
import IllustrationMap from "../../../public/img/dashboard/illustration-map.png";
import IllustrationMapMobile from "../../../public/img/dashboard/illustration-map-mobile.png";
import IllustrcationMapDark from "../../../public/img/dashboard/Illustration_map_dark.png"

const boldInterTight = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});


export default function MoreInvestment() {
  const { theme } = useGlobalContext();

  return (
    <div className="bg-[#E6E6F2] dark:bg-[#222222] p-0 lg:px-[20px] xl:px-[120px] xl:py-[100px]">
      <div className="pt-[200px] pb-[100px] px-[20px] md:p-[80px] rounded-0 md:rounded-[24px] relative section-set-max-container max-w-[1200px] m-auto bg-[#0A1339] dark:bg-secondary">
        {theme == 'dark' ? (
          <>
            <Image 
              src={IllustrationMapMobile}
              alt="illustration map"
              className="block md:hidden absolute top-[46.3px] left-0 w-full"
            />
            <Image 
              src={IllustrcationMapDark}
              alt="illustration map"
              className="hidden md:block absolute w-auto bottom-0 right-0"
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
              className="hidden md:block absolute w-auto bottom-0 right-0"
            />
          </>
        )}
        <div className="relative z-10">
          <p className={`text-[32px] leading-[40px] text-center md:text-start md:text-[54px] md:leading-[68px] text-white ${boldInterTight.className}`}>
            Learn more about the<br /> future of property<br /> investment
          </p>
          <div className="flex flex-col md:flex-row gap-[16px] mt-[40px]">
            <a target="_blank" href="https://docs.landshare.io">
              <Button textClassName="text-[#fff]" className="w-full md:w-auto px-[24px] py-[13px] rounded-[100px]">View Docs</Button>
            </a>
            <a target="_blank" href="https://uploads-ssl.webflow.com/649664b4d452680d2964b449/654d29c8dd036fc324fd3393_Whitepaper.pdf">
              <Button textClassName="text-[#fff] dark:text-[#fff]" className="w-full md:w-auto px-[24px] py-[13px] rounded-[100px]" outlined>
                Whitepaper
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
