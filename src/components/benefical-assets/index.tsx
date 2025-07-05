import { useEffect } from "react";
import {
  getData,
  selectPropertiesRentalData,
} from "../../lib/slices/firebase-slices/properties-rental";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import BeneficalAsset from "./benefical-asset";
import { IoIosHome, IoIosInformationCircleOutline } from "react-icons/io";

export default function BeneficalAssets() {
  const dispatch = useAppDispatch();
  const propertiesRentalData = useAppSelector(selectPropertiesRentalData);

  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-[20px] items-center  pt-[40px] xl:px-0 xl:pb-[80px] max-w-[1200px] mx-auto">
      <div className="w-full flex items-start mb-0">
        <div className="flex items-center w-fit py-[6px] pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-primary">
          <div className="flex items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-secondary">
            <IoIosHome className="w-[24px] h-[24px] text-[#61CD81]" />
          </div>
          <span className="text-[14px] capitalize leading-[22px] tracking-[0.02em] font-semibold text-text-primary">
            Assets of the future
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row md:justify-between mb-1">
        <h2 className="text-text-primary font-bold text-[32px] md:text-[40px] lg:text-[56px]">
          Our Current Assets
        </h2>
        <div className="md:w-2/5">
          <div className="flex flex-col md:flex-row gap-1 md:items-start">
            <IoIosInformationCircleOutline
              size={22}
              className="hidden lg:block"
              color="#61CD81"
            />
            <div>
              <p className="text-text-secondary text-sm">
                Gain access to cash flow and appreciation from all of our assets
                by holding the Landshare RWA Token.
              </p>
              <a
                href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/lsrwa-tokenization-model"
                className="text-sm text-[#61CD81] hover:text-[#4ea869] font-medium"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[40px] w-full justify-items-center">
        {propertiesRentalData.map((asset, index) => (
          <BeneficalAsset
            key={`benefical-asset-rental-${index}`}
            asset={asset}
            type="Rental Property"
          />
        ))}
      </div>
    </div>
  );
}
