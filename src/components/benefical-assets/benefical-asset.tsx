import Link from "next/link";
import Image from "next/image";
import { useChainId } from "wagmi";
import numeral from "numeral";
import { formatEther, BigNumberish } from "ethers";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "next-themes";
import usePropertyValues from "../../hooks/contract/APIConsumerContract/useGetPropertyValues";
import IconSofa from "../../../public/icons/sofa.svg";
import IconBathroom from "../../../public/icons/bathroom.svg";
import IconLocation from "../../../public/icons/location.svg";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import "react-loading-skeleton/dist/skeleton.css";

interface BeneficalAssetProps {
  asset: any;
  type: string;
}

export default function BeneficalAsset({ asset, type }: BeneficalAssetProps) {
  const { theme } = useTheme();
  const chainId = useChainId();
  const { isLoading, data: propertyValue } = usePropertyValues(chainId, asset.coreLogicID) as {
    isLoading: boolean;
    data: BigNumberish;
  };

  return (
    <Link
      className="relative cursor-pointer w-full max-w-[360px] sm:max-w-[420px]"
      href={`/tokenized-asset/${asset?.id}`}
    >
      <SkeletonTheme
        baseColor={theme === "dark" ? "#31333b" : "#dbdde0"}
        highlightColor={theme === "dark" ? "#52545e" : "#f6f7f9"}
      >
        <div className="w-full h-full flex flex-col border border-[#e6e7eb] dark:border-[#6e6e6e] bg-secondary rounded-[24px] overflow-hidden">
          {/* Main content that grows */}
          <div className="flex-grow flex flex-col justify-between">
            <div className="relative">
              <img
                src={asset?.pictures[0]}
                alt="property image"
                className="w-full h-[250px] rounded-t-[24px] object-cover object-center"
              />
              <div className="absolute flex items-center gap-[7.13px] text-[12px] leading-[20px] text-white bottom-[5px] left-[5px]">
                <Image src={IconLocation} alt="location" />
                <span className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {asset?.address ?? "3406 Parkview Drive, Rapid City, SD 57701"}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-[24px] px-[20px] pb-[16px] sm:px-[24px]">
              {[
                { label: "Property Value", value: isLoading ? null : `$${Number(formatEther(propertyValue)).toLocaleString()}` },
                {
                  label: "Rental Yield",
                  value: isLoading
                    ? null
                    : `${(
                        ((asset?.grossRent * (1 - asset?.management) * 12 - asset?.insurance - asset?.tax) /
                          Number(formatEther(propertyValue))) *
                        100
                      ).toFixed(2)}%`,
                },
                {
                  label: "Ann. Return",
                  value: isLoading
                    ? null
                    : `${(
                        ((asset?.grossRent * (1 - asset?.management) * 12 - asset?.insurance - asset?.tax) /
                          Number(formatEther(propertyValue))) *
                          100 +
                        asset?.appreciation
                      ).toFixed(2)}%`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col justify-center">
                  <label className="text-[12px] text-center text-text-secondary">{label}</label>
                  {value === null ? (
                    <Skeleton className="rounded-lg" height={28} />
                  ) : (
                    <span className={`text-[18px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>{value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-[24px] px-[20px] sm:px-[24px]">
              <span className="w-[117px] h-[30px] rounded-[20px] flex justify-center items-center font-medium text-[14px] text-[#428b58] bg-[#f4fcf6] dark:bg-primary dark:text-text-fourth">
                Single Family
              </span>
              {isLoading ? (
                <Skeleton className="rounded-lg" width={150} height={28} />
              ) : (
                <div className="flex gap-[20px]">
                  {asset?.bedrooms && (
                    <div className="flex items-center gap-[5px]">
                      <Image src={IconSofa} alt="bedrooms" />
                      <span className="font-medium text-[14px] text-text-primary">{asset?.bedrooms}</span>
                    </div>
                  )}
                  {asset?.bathrooms && (
                    <div className="flex items-center gap-[5px]">
                      <Image src={IconBathroom} alt="bathrooms" />
                      <span className="font-medium text-[14px] text-text-primary">{asset?.bathrooms}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#61cd81] py-[16px] px-[20px] sm:px-[24px] rounded-b-[24px] flex justify-between">
            <span className={`text-white text-[16px] ${BOLD_INTER_TIGHT.className}`}>LSRWA Holders Earn</span>
            <span className={`text-white text-[18px] ${BOLD_INTER_TIGHT.className}`}>
              ${numeral(
                (asset?.grossRent -
                  (asset?.insurance + asset?.tax + asset?.management * asset?.grossRent * 12) / 12) *
                  12
              ).format("0,0")}
            </span>
          </div>
        </div>
      </SkeletonTheme>
    </Link>
  );
}
