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
                <span className="w-fit h-[30px] rounded-[20px] flex gap-1 justify-center items-center font-medium text-[12px] px-2 py-1  tracking-[0.02em] text-primary-green bg-secondary  dark:text-text-fourth">
                    <div className="rounded-full bg-primary flex items-center justify-center h-full aspect-square">
                      <HiMapPin />
                    </div>
                    Location
                </span>
                <h2
                  className={`text-text-primary leading-normal text-[18px] md:text-[32px] ${BOLD_INTER_TIGHT.className}`}
                >
                  About {houseInfo?.cityName}
                </h2>
                <p
                  className="text-text-third flex flex-col text-[14px] gap-[8px] leading-none lg:leading-[30px]"
                  dangerouslySetInnerHTML={{ __html: houseInfo?.aboutCity }}
                ></p>
              </div>

              <Link href="/rwa">
                <Button
                  className={`w-[165px] h-[44px] text-white rounded-[100px] bg-[#61cd81]`}
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
