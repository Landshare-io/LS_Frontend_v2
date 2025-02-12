import { useRouter } from "next/router";
import { useChainId } from "wagmi";
import Image from "next/image";
import IconSofa from "../../../../public/icons/sofa.svg";
import IconBathroom from "../../../../public/icons/bathroom.svg";
import IconLocation from "../../../../public/icons/location.svg";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import useGetPropertyValues from "../../../hooks/contract/APIConsumerContract/useGetPropertyValues";
import { useTheme } from "next-themes";
import { BigNumberish, formatEther } from "ethers";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";
import 'react-loading-skeleton/dist/skeleton.css';

interface PropertyCardProps {
  property: any;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { theme } = useTheme();
  const chainId = useChainId();
  const router = useRouter();
  const {
    isLoading,
    data: propertyValue
  } = useGetPropertyValues(chainId, property?.coreLogicID ?? '0') as {
    isLoading: boolean,
    data: BigNumberish
  }

  return (
    <div className="pb-[10px] md:w-fit md:rounded-[24px] md:px-[20px] md:pb-[24px] max-w-[501px] relative cursor-pointer">
      <div className="relative rounded-[24px] shadow-lg z-[3] overflow-hidden" onClick={() => router.push(`/tokenized-asset/${property?.id}`)}>
        <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
          <div className="relative rounded-[24px] shadow-lg z-[3] w-full md:w-[390px] md:h-[292px]">
            <img className="w-full h-full object-cover rounded-t-[24px]" src={property?.pictures[0]} alt="property image" />
            <div className="absolute text-[14px] leading-[22px] tracking-[0.02em] text-[#ffffff] flex gap-[7px] left-0 bottom-0 bg-gradient-to-b from-transparent to-[#00000096] py-[4px] px-[8px] w-full">
              <Image src={IconLocation} alt="location" />
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">{property.address}</div>
            </div>
            <span className={`absolute left-0 top-[20px] shadow-md rounded-r-[15px] leading-[20px] tracking-[0.02em] text-[0.8rem] text-[#fff] py-[4px] px-[15px] ${property.type == "Rental Property" ? "bg-[#FF5454]" : "bg-[#3B98EE]"} ${BOLD_INTER_TIGHT.className}`}>
              {property.type}
            </span>
          </div>
          <div className="flex flex-col py-[20px] px-[30px] gap-[24px] bg-third">
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <span className="text-[12px] leading-[22px] text-center tracking-[0.24px] text-text-third">Property Value</span>
                {isLoading ? (<Skeleton className="rounded-lg" width={80} height={26} />) : (<span className={`text-[24px] leading-[30px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>${Number(formatEther(propertyValue)).toLocaleString()}</span>)}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] leading-[22px] text-center tracking-[0.24px] text-text-third">Rental Yield</span>
                {isLoading ? (<Skeleton className="rounded-lg" width={80} height={26} />) : (<span className={`text-[24px] leading-[30px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>{((property.grossRent * (1 - property.management) * 12 - property.insurance - property.tax) / Number(formatEther(propertyValue)) * 100).toFixed(2)}%</span>)}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] leading-[22px] text-center tracking-[0.24px] text-text-third">Ann. Return</span>
                {isLoading ? (<Skeleton className="rounded-lg" width={80} height={26} />) : (<span className={`text-[24px] leading-[30px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>{((property.grossRent * (1 - property.management) * 12 - property.insurance - property.tax) / Number(formatEther(propertyValue)) * 100 + property.appreciation).toFixed(2)}%</span>)}
              </div>
            </div>
            <div className="py-0 px-[10px] sm:p-0 flex justify-between">
              <span className="text-[12px] leading-[20px] rounded-[20px] tracking-[0.02em] md:text-[14px] md:leading-[22px] text-[#61CD81] md:py-[4px] md:px-[16px] bg-primary">Single Family</span>
              <div className="flex gap-[10px] md:gap-[20px]">
                {property?.bedrooms &&
                  <div className="flex items-center gap-[5px]">
                    <Image src={IconSofa} alt="sofa" />
                    <div className="text-[14px] font-medium leading-[22px] text-text-primary">{property?.bedrooms}</div>
                  </div>
                }
                {property?.bathrooms &&
                  <div className="flex items-center gap-[5px]">
                    <Image src={IconBathroom} alt="bathroom" />
                    <div className="text-[14px] font-medium leading-[22px] text-text-primary">{property?.bathrooms}</div>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="flex justify-between py-[16px] px-[20px] sm:px-[24px] bg-[#61cd81]">
            <span className={`text-[#fff] text-[16px] leading-[22px] tracking-[0.02em] ${BOLD_INTER_TIGHT.className}`}>
              LSRWA Holders Earn
            </span>
            <span className={`text-[#fff] text-[18px] leading-[22px] tracking-[0.02em] ${BOLD_INTER_TIGHT.className}`}>
            $ {Number((property?.grossRent - (property?.insurance + property?.tax + property?.management * property?.grossRent * 12) / 12) * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </SkeletonTheme>
      </div>
    </div>
  );
}
