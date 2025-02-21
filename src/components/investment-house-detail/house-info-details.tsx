import React, { useState } from "react";

import { SquareFootageIcon } from "../common/icons";
import { BigNumberish, formatEther } from "ethers";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useGlobalContext } from "../../context/GlobalContext";
import Collapse from "../common/collapse";
import { MonthlyExpenseIcon } from "../common/icons";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import 'react-loading-skeleton/dist/skeleton.css';

interface HouseInfoDetailsProps {
  houseInfo: any
  isLoading: boolean
  propertyValue: BigNumberish
}

export default function HouseInfoDetails({ houseInfo, isLoading, propertyValue }: HouseInfoDetailsProps) {
  const { theme } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
      <div className="max-w-[1200px] mx-auto py-3 md:py-5 my-2 text-text-primary">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="shadow-md bg-third p-4 rounded-xl">
              <p className={`text-[20px] md:text-[26px] font-bold mb-4 ${BOLD_INTER_TIGHT.className}`}>Investment Summary</p>

              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Property Value</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number(formatEther(propertyValue == 0 ? 1 : propertyValue)).toLocaleString()}</div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Net Annual Cash Flow</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number((houseInfo?.grossRent - (houseInfo?.insurance + houseInfo?.tax + houseInfo?.management * houseInfo?.grossRent * 12) / 12) * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Est. 1-Year Appreciation</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : 
                  Number(houseInfo?.appreciation / 100 * Number(formatEther(propertyValue == 0 ? 1 : propertyValue))).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </p>
              <p className={`text-[16px] md:text-[18px] flex items-center justify-between ${BOLD_INTER_TIGHT.className}`}>
                <div className="py-3">Ann. Return</div>
                <div className="py-3">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number((((houseInfo?.grossRent * (1 - houseInfo?.management) * 12 - houseInfo?.insurance - houseInfo?.tax) / Number(formatEther(propertyValue == 0 ? 1 : propertyValue)) * 100) + houseInfo?.appreciation)).toLocaleString(undefined, { maximumFractionDigits: 2 })}%</div>
              </p>

              <p className="text-[13px] italic">
                Note: Appreciation is estimated based on nationwide market projections and may change at any time.
              </p>
            </div>

            <div className="shadow-md bg-third p-4 my-4 rounded-xl">
              <p className={`text-[20px] md:text-[26px] font-bold mb-3 ${BOLD_INTER_TIGHT.className}`}>Property Details</p>

              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Year Built</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number(houseInfo?.yearBuilt)}</div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Square Footage</div>
                <div className="py-3 font-normal flex items-center">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number(houseInfo?.squareFootage)}&nbsp;<SquareFootageIcon fillColor={theme == 'dark' ? "#f1f1f1" : "#0a0a0a"} /></div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Units</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number(houseInfo?.units)}</div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Bed / Bath</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : houseInfo?.bedrooms + "/" + houseInfo?.bathrooms}</div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Rental Status</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : houseInfo?.status}</div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Property Type</div>
                <div className="py-3 font-normal">Single Family</div>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="shadow-md bg-third p-4 rounded-xl">
              <p className={`text-[20px] md:text-[26px] font-bold mb-3 ${BOLD_INTER_TIGHT.className}`}>Financials</p>

              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Gross Rent per Year</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number(houseInfo?.grossRent * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b mb-2">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Gross Rent per Month</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number(houseInfo?.grossRent).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </p>

              <div className="table-accordian">
                <div className="border-b">
                  <p className="text-[14px] md:text-[16px] flex justify-between mb-0">
                    <div className={`mb-3 mt-2 font-bold flex items-center ${BOLD_INTER_TIGHT.className}`} onClick={() => setIsOpen(!isOpen)}>
                      Monthly Expenses
                      <span className="ml-2">
                        <MonthlyExpenseIcon fillColor={theme == 'dark' ? "#f1f1f1" : "#0a0a0a"} />
                      </span>
                    </div>
                    <span className="mb-3 mt-2 font-normal">
                      {isLoading ? (
                        <Skeleton className="rounded-lg" width={80} height={24} />
                      ) : (
                        Number(houseInfo?.insurance / 12 + houseInfo?.tax / 12 + houseInfo?.grossRent * houseInfo?.management).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      )}
                    </span>
                  </p>
                  <Collapse isOpen={isOpen}>
                    <div className="mb-2">
                      <span className="text-[13px] md:text-[14px] flex justify-between">
                        <span className="mb-3 font-light">Property Taxes</span>
                        <span className="mb-3 font-thin">-${(houseInfo?.tax / 12).toFixed(2)}</span>
                      </span>
                      <span className="text-[13px] md:text-[14px] flex justify-between">
                        <span className="mb-3 font-light">Insurance</span>
                        <span className="mb-3 font-thin">-${(houseInfo?.insurance / 12).toFixed(2)}</span>
                      </span>
                      <span className="text-[13px] md:text-[14px] flex justify-between">
                        <span className="mb-3 font-light">Property Management</span>
                        <span className="mb-3 font-thin">-${houseInfo?.management * houseInfo?.grossRent}</span>
                      </span>
                    </div>
                  </Collapse>
                </div>
              </div>

              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Net Rent per Month</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number(houseInfo?.grossRent - (houseInfo?.insurance + houseInfo?.tax + houseInfo?.management * houseInfo?.grossRent * 12) / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </p>
              <p className="text-[14px] md:text-[16px] flex items-center justify-between border-b">
                <div className={`py-3 font-bold ${BOLD_INTER_TIGHT.className}`}>Net Annual Rent</div>
                <div className="py-3 font-normal">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number((houseInfo?.grossRent - (houseInfo?.insurance + houseInfo?.tax + houseInfo?.management * houseInfo?.grossRent * 12) / 12) * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </p>

              <p className={`text-[18px] md:text-[20px] font-bold flex items-center justify-between ${BOLD_INTER_TIGHT.className}`}>
                <div className="py-3">Rental Yield</div>
                <div className="py-3">{isLoading ? <Skeleton className="rounded-lg" width={80} height={24} /> : Number(((houseInfo?.grossRent * (1 - houseInfo?.management) * 12 - houseInfo?.insurance - houseInfo?.tax) / Number(formatEther(propertyValue == 0 ? 1 : propertyValue)) * 100)).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "%"}</div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
