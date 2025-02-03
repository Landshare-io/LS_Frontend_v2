import Link from "next/link";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import Button from "../common/button";

interface HouseMapProps {
  houseInfo: any;
}

export default function HouseMap({ houseInfo }: HouseMapProps) {
  return (
    <>
      <div className="bg-third py-[50px] px-[10px]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-[60%_40%]">
            <div className="flex flex-col w-[90%]">
              <h2
                className={`text-text-primary leading-normal text-[18px] md:text-[32px] ${BOLD_INTER_TIGHT.className}`}
              >
                About {houseInfo?.cityName}
              </h2>
              <p
                className="text-text-secondary flex flex-col text-[16px] gap-[20px] py-[10px] leading-none lg:leading-[30px]"
                dangerouslySetInnerHTML={{ __html: houseInfo?.aboutCity }}
              ></p>
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
              <div className="w-full">
                <iframe
                  src={houseInfo?.map}
                  width="100%"
                  height="444"
                  allowFullScreen={false}
                  loading="lazy"
                  className="rounded-lg shadow-lg md:h-[444px] h-[340px]"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
