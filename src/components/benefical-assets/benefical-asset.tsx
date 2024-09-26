import Link from "next/link";
import Image from "next/image";
import { formatEther } from "ethers";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useGlobalContext } from "../../context/GlobalContext";
import usePropertyValues from "../../hooks/contract/APIConsumerContract/useGetPropertyValues";
import IconSofa from "../../../public/icons/sofa.svg";
import IconBathroom from "../../../public/icons/bathroom.svg";
import IconLocation from "../../../public/icons/location.svg";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import { BigNumberish } from "ethers";

interface BeneficalAssetProps {
  asset: any;
  type: string;
}

export default function BeneficalAsset({ asset, type }: BeneficalAssetProps) {
  const { theme } = useGlobalContext();
  const { isLoading, data: propertyValue } = usePropertyValues(asset.coreLogicID) as {
    isLoading: boolean,
    data: BigNumberish
  }

  return (
    <Link className="relative cursor-pointer w-[311px] sm:w-[361px] md:w-[381px]" href={`/tokenized-asset/${asset?.id}`}>
      <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
        <div
          className={`absolute w-[120px] h-[28px] right-0 top-[16px] z-10 rounded-l-[50px] rounded-r-[20px] text-[12px] leading-[20px] text-right tracking-[0.02em] text-[#fff] flex justify-center items-center ${type == "Rental Property" ? "bg-[#FF5454]" : "bg-[#3B98EE]"} ${BOLD_INTER_TIGHT.className}`}
        >
          {type}
        </div>
        <div className="w-[300px] sm:w-[350px] rounded-[24px] md:w-[370px] border-[1px] border-[#e6e7eb] dark:border-[#6e6e6e] bg-secondary">
          <div className="relative">
            <img
              src={asset?.pictures[0]}
              alt="property image"
              className="relative w-full h-[220px] sm:h-[240px] rounded-t-[24px] object-cover md:h-[250px] object-center"
            />
            <div className="absolute flex items-center gap-[7.13px] text-[12px] leading-[20px] tracking-[0.02em] text-[#fff] bottom-[5px] left-[5px]">
              <Image src={IconLocation} alt="location" className="w-auto" />
              <span className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">{asset?.address ?? '3406 Parkview DriveRapid City, SD 57701'}</span>
            </div>
          </div>
          <div className="flex justify-between pt-[24px] px-[20px] pb-[16px] sm:px-[24px]">
            <div className="flex flex-col justify-center">
              <label className="text-[12px] leading-[20px] text-center tracking-[0.02em] text-text-secondary">Property Value</label>
              {isLoading ? (<Skeleton className="rounded-lg" height={28} />) : (<span className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>${Number(formatEther(propertyValue)).toLocaleString()}</span>)}
            </div>
            <div className="flex flex-col justify-center">
              <label className="text-[12px] leading-[20px] text-center tracking-[0.02em] text-text-secondary">Rental Yield</label>
              {isLoading ? (<Skeleton className="rounded-lg" height={28} />) : (<span className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>{((asset?.grossRent * (1 - asset?.management) * 12 - asset?.insurance - asset?.tax) / Number(formatEther(propertyValue)) * 100).toFixed(2)}%</span>)}
            </div>
            <div className="flex flex-col justify-center">
              <label className="text-[12px] leading-[20px] text-center tracking-[0.02em] text-text-secondary">Ann. Return</label>
              {isLoading ? (<Skeleton className="rounded-lg" height={28} />) : (<span className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}>{((asset?.grossRent * (1 - asset?.management) * 12 - asset?.insurance - asset?.tax) / Number(formatEther(propertyValue)) * 100 + asset?.appreciation).toFixed(2)}%</span>)}
            </div>
          </div>
          <div className="flex justify-between mb-[24px] px-[20px] sm:px-[24px]">
            <span className="w-[117px] h-[30px] rounded-[20px] flex justify-center items-center font-medium text-[14px] leading-[22px] tracking-[0.02em] text-[#428b58] bg-[#f4fcf6] dark:bg-primary dark:text-text-fourth">Single Family</span>
            {isLoading ? (<Skeleton className="rounded-lg" width={150} height={28} />) : (
              <div className="flex gap-[20px]">
                {asset?.bedrooms &&
                  <div className="flex items-center gap-[5px]">
                    <Image src={IconSofa} alt="sofa" />
                    <span className="font-medium text-[14px] leading-[22px] text-text-primary">{asset?.bedrooms}</span>
                  </div>
                }
                {asset?.bathrooms &&
                  <div className="flex items-center gap-[5px]">
                    <Image src={IconBathroom} alt="sofa" />
                    <span className="font-medium text-[14px] leading-[22px] text-text-primary">{asset?.bathrooms}</span>
                  </div>
                }
            </div>)}
          </div>
        </div>
      </SkeletonTheme>
    </Link>
  );
}
