import Link from "next/link";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import Button from "../common/button";
import { HiMapPin } from "react-icons/hi2";

interface HouseMapProps {
  houseInfo: any;
}

export default function HouseMap({ houseInfo }: HouseMapProps) {
  return (
    <>
      <div className="bg-third py-[50px] px-[10px]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-[60%_40%]">
            <div className="flex flex-col gap-6 justify-between w-[90%]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center w-fit py-[6px] pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-primary">
                  <div className="flex items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-secondary">
                    <HiMapPin className="w-[24px] h-[24px] text-[#61CD81]" />
                  </div>
                  <span className="text-[14px] capitalize leading-[22px] tracking-[0.02em] font-semibold text-text-primary">
                    Location
                  </span>
                </div>
                <h2
                  className={`text-text-primary leading-normal text-[18px] md:text-[32px] ${BOLD_INTER_TIGHT.className}`}
                >
                  About {houseInfo?.cityName}
                </h2>
                <p
                  className="text-[#0A1339]/60 dark:text-text-third flex flex-col text-[14px] gap-[8px] lg:leading-[30px] "
                  dangerouslySetInnerHTML={{ __html: houseInfo?.aboutCity }}
                ></p>
              </div>

              <Link href="/rwa">
                <Button
                  className={`w-[185px] h-[44px] text-white rounded-[100px] bg-[#61cd81]`}
                  textClassName=" text-[100%]"
                >
                  See More Properties
                </Button>
              </Link>
            </div>
            <div className="mt-3 xl:mt-0">
              <div className="w-full h-full">
                <iframe
                  src={houseInfo?.map}
                  width="100%"
                  height="100%"
                  allowFullScreen={false}
                  loading="lazy"
                  className="rounded-lg shadow-lg md:h-full h-[340px]"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
