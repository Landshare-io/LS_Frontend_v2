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
      <div className="flex flex-col gap-[40px] items-center p-0 mlg:px-[20px] xl:pt-[40px] xl:px-0 xl:pb-[80px] max-w-[1200px] m-auto">
        <h1 className={`text-text-primary text-[34px] leading-[50px] mb-[-50px] mt-[-20px] md:text-[54px] md:leading-[68px] ${BOLD_INTER_TIGHT.className}`}>Our Current Assets</h1>
        <div className="flex flex-col p-0 gap-[40px] items-center mlg:w-full mlg:grid mlg:grid-cols-2 md:auto-cols-[minmax(381px,max-content)] lg:grid-cols-3 md:justify-between md:gap-y-[40px]">
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
