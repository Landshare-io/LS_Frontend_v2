import { useEffect } from "react";
import {
  getData,
  selectPropertiesRentalData
} from '../../lib/slices/firebase-slices/properties-rental';
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import BeneficalAsset from "./benefical-asset";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function BeneficalAssets() {
  const dispatch = useAppDispatch();
  const propertiesRentalData = useAppSelector(selectPropertiesRentalData);

  useEffect(() => {
    dispatch(getData())
  }, [dispatch])

  return (
    <>
      <div className="flex flex-col gap-[40px] items-center p-0 mlg:px-[20px] md:pt-[40px] xl:px-0 xl:pb-[80px] max-w-[1200px] m-auto">
        <h1 className={`text-text-primary text-[34px] leading-[50px] md:text-[54px] md:leading-[68px] ${BOLD_INTER_TIGHT.className}`}>
          Our Current Assets
        </h1>
        <div className="flex flex-col p-0 items-center mlg:w-full mlg:grid mlg:grid-cols-[minmax(381px,max-content),minmax(381px,max-content)] xl:grid-cols-[minmax(381px,max-content),minmax(381px,max-content),minmax(381px,max-content)] justify-between md:gap-y-[40px]">
          {propertiesRentalData.map((asset, index) => (
            <BeneficalAsset
              key={`benefical-asset-rental-${index}`}
              asset={asset}
              type="Rental Property"
            />
          ))}
        </div>
      </div>
    </>
  );
}
