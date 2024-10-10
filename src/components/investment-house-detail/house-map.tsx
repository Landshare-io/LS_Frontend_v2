import { useMemo } from "react";
import { 
  getData,
  selectPropertyRentalData
} from "../../lib/slices/firebase-slices/properties-rental-item";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

interface HouseMapProps {
  itemId: string
}


export default function HouseMap({ itemId }: HouseMapProps) {
  const dispatch = useAppDispatch();
  const houseInfo = useAppSelector(selectPropertyRentalData) as any;

  useMemo(async () => {
    dispatch(getData(itemId))
  }, [itemId]);

  return (
    <>
      <div className="bg-third py-[50px]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[20px]">
            <div className="flex flex-col">
              <h2 className={`text-text-primary text-[28px] ${BOLD_INTER_TIGHT.className}`}>
                About {houseInfo?.cityName}
              </h2>
              <p
                className="text-text-secondary flex flex-col text-[16px] gap-[20px]"
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
