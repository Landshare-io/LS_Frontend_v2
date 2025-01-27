import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

interface HouseMapProps {
  houseInfo: any
}


export default function HouseMap({ houseInfo }: HouseMapProps) {
  return (
    <>
      <div className="bg-third py-[50px] px-[10px]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[20px]">
            <div className="flex flex-col">
              <h2 className={`text-text-primary text-[28px] ${BOLD_INTER_TIGHT.className}`}>
                About {houseInfo?.cityName}
              </h2>
              <p
                className="text-text-secondary flex flex-col text-[16px] gap-[20px] py-[10px] leading-none lg:leading-[30px]"
                dangerouslySetInnerHTML={{ __html: houseInfo?.aboutCity }}
              ></p>
            </div>
            <div className="mt-3 xl:mt-0">
              <div className="w-full">
                <iframe
                  src={houseInfo?.map}
                  width="100%"
                  height="444"
                  allowFullScreen={false}
                  loading="lazy"
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
