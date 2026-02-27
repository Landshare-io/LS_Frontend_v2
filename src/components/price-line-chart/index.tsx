"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import numeral from "numeral";
import { ApexOptions } from "apexcharts";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ApexChart from "../common/apexchart";
import Button from "../common/button";
import { useTheme } from "next-themes";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import ToggleButton from "../common/toggle-button";
import IconTokenPair from "../../../public/icons/token-pair.svg";
import useFetchRwa from "../../hooks/apollo/useFetchRwa";
import useFetchLandData from "../../hooks/axios/useFetchLandData";
import useGetLandPrice from "../../hooks/axios/useGetLandPrice";
import 'react-loading-skeleton/dist/skeleton.css';

interface PriceGraphProps {
  containerClassName?: string;
  type: string;
  showBuyButton: boolean;
  titleClassName?: string;
}

export default function PriceGraph({
  containerClassName,
  type,
  showBuyButton,
  titleClassName
}: PriceGraphProps) {
  let dueDate = {
    "one_week": new Date(new Date().setDate(new Date().getDate() - 7)),
    "one_month": new Date(new Date().setMonth(new Date().getMonth() - 1)),
    "one_year": new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  } as {
    [key: string]: Date
  }

  const router = useRouter();
  const { theme } = useTheme();
  const rwaGraphData = useFetchRwa();
  const { price: landGraphData, isLoading: isLandGraphDataLoading, earlyPrice, latestPrice } = useFetchLandData(dueDate.one_week, Date.now());
  const { price: landPrice, isLoading: isLandPriceDataLoading } = useGetLandPrice();
  

  const [isLoading, setIsLoading] = useState(true);
  const [selection, setSelection] = useState("one_month");
  const [series, setSeries] = useState<[{
    data: any[]
  }]>([
    {
      data: [],
    },
  ]);
  const [recentData, setRecentData] = useState({ pair: "", price: 0, change_price: 0, date: Date.now() });


  const handleClick = () => {
    if (type === "rwa") {
      router.push("/rwa");
      window.scrollTo(0, 0);
    } else if (type === "land") {
      window.open("https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C", "_blank");
    }
  };
  // function that takes every n point in the prices array to reduce the number of points so the graph becomes clear
  function takeEveryNth(data: any[], n: number) {
    return data.filter((_, index) => index % n === 0);
  }
  const interval = 25; // Take every 25th point

  useEffect(() => {
    (async () => {
      if (rwaGraphData.length === 0 || landGraphData.prices.length === 0) return;

      const now = Date.now()
      switch (type) {
        case 'land':
          const reducedData = takeEveryNth(landGraphData.prices, interval);
          setSelection("one_week")
          setIsLoading(true);
          setSeries([{
            data: reducedData ?? []
          }])
          setRecentData({
            pair: "LAND / USD",
            price: landPrice,
            change_price: ((latestPrice) - (earlyPrice)) / earlyPrice * 100,
            date: now
          })
          setIsLoading(false);
          console.log(earlyPrice)
          console.log(latestPrice)
          break;
        case 'rwa':
          let change_price = 0
          if (rwaGraphData[0][0] > dueDate[selection]) {
            setSeries([{ data: [...rwaGraphData, [dueDate[selection], null]] }]);
            change_price = rwaGraphData[1][1] != 0 ? (rwaGraphData[rwaGraphData.length - 1][1] - rwaGraphData[1][1]) / rwaGraphData[1][1] * 100 : 0
          } else {
            const filtered = rwaGraphData.filter((value) => Number(value[0]) > new Date(dueDate[selection]).getTime());
            const data = [[new Date(dueDate[selection]).getTime(), rwaGraphData[rwaGraphData.length - filtered.length - 1][1]]].concat(filtered);
            const result = Object.values(
              data.reduce((acc: any, [timestamp, value]) => {
                const date = new Date(timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
                acc[date] = [timestamp, value]; // Always keep the last one
                return acc;
              }, {})
            );
            setSeries([{
              data: result
            }]);
            change_price = data.length > 1 ? (data[0][1] != 0 ? (data[data.length - 1][1] - data[0][1]) / data[0][1] * 100 : 0) : 0
          }
          setRecentData({
            pair: "LSRWA / USD",
            price: Number(rwaGraphData[rwaGraphData.length - 1][1]),
            change_price: change_price,
            date: now
          });
          setIsLoading(false);
          break;
      }
    })()
  }, [selection, type, rwaGraphData, landGraphData, landPrice]);

  useEffect(() => {
    if (type == "rwa") {
      setSelection("one_month");
    }
  }, [type])

  const options: ApexOptions = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      background: theme === 'dark' ? '#383838' : '#ffffff',
      animations: {
        enabled: false
      },
      foreColor: theme == 'dark' ? "#fff" : "#000",
      toolbar: {
        show: false
      }
    },
    xaxis: {
      type: "datetime"
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        formatter: function (value: number) {
          if (String(value) == "5e-324")
            return '0'
          return Number(numeral(value).format('0.000')).toString()
        }
      }
    },
    colors: ["#61CD81"],
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
      // style: "hollow",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (seriesName) => seriesName.toFixed(5),
      }
    },
    theme: {
      mode: theme == 'dark' ? "dark" : "light",
      
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0,
        stops: [0, 100],
      },
      pattern: {
        strokeWidth: 1
      }
    },
    grid: {
      strokeDashArray: 5
    }
  };

  return (
    <div className={`rounded-[12px] overflow-visible p-[14px] md:w-full md:rounded-[16px] lg:rounded-[10px] lg:p-[18px] bg-third ${containerClassName}`}>
      <div className="flex items-center gap-[5px] mb-[16.42px] justify-between">
        <div className="flex flex-row items-center gap-1">
          <Image src={IconTokenPair} alt="token pair" className="h-[24px] w-[24px]" />
          <div className={`text-text-primary text-[16px] leading-[24px] ${BOLD_INTER_TIGHT.className} ${titleClassName}`}>
            {recentData.pair}
          </div>
        </div>

      </div>
      <div className="flex flex-col gap-[12px] sm:flex-row sm:justify-between sm:mb-[5px] sm:w-full">
        <div className="flex flex-col gap-[5px]">
          {(isLoading || isLandGraphDataLoading || isLandPriceDataLoading) ? (
            <SkeletonTheme 
              baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} 
              highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}
            >
              <Skeleton className="rounded-lg" height={28} />
            </SkeletonTheme>
          ) : (
            <div className="flex gap-[10px]">
              <span className={`text-text-primary ${BOLD_INTER_TIGHT.className} text-[24px] leading-[30px]`}>
                ${type == "land" ? landPrice.toFixed(5) : recentData?.price?.toFixed(5)}
              </span>
              <span className={`text-[14px] leading-[22px] tracking-[0.02em] ${recentData.change_price >= 0 ? "text-[#74cc50]" : "text-[#e93838]"} ${BOLD_INTER_TIGHT.className}`}>
                {recentData.change_price >= 0 ? "+ " : ""} {recentData.change_price.toFixed(2)} %
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2 justify-center">
            <span className="text-[14px] leading-[22px] tracking-[0.02em] text-[#CBCBCB]">
              {new Date(recentData.date).toDateString()}
            </span>
            <div className="flex gap-2 justify-between">
              {showBuyButton && (
                <Button 
                  onClick={handleClick} 
                  className="outline-none w-[100px] h-[30px] rounded-full bg-[#61cd81] hover:bg-[#87e7a4] transition ease fs- fw-500"
                  textClassName="text-white text-sm"
                >
                  {type === "rwa" ? "Buy LSRWA" : "Buy LAND"}
                </Button>
              )}
              <div className="flex md:hidden gap-[10px]">
                <ToggleButton
                  className="w-[60px] h-[30px] text-[14px]"
                  onClick={() => setSelection("one_week")}
                  active={selection === "one_week"}
                  type="pricegraph"
                >
                  1W
                </ToggleButton>
                {type == "rwa" ?
                  <>
                    <ToggleButton
                      className="w-[60px] h-[30px] text-[14px]"
                      onClick={() => setSelection("one_month")}
                      active={selection === "one_month"}
                      type="pricegraph"
                    >
                      1M
                    </ToggleButton>
                    <ToggleButton
                      className="w-[60px] h-[30px] text-[14px]"
                      onClick={() => setSelection("one_year")}
                      active={selection === "one_year"}
                      type="pricegraph"
                    >
                      1Y
                    </ToggleButton>
                  </>
                  : (<></>)
                }
              </div>
            </div>

          </div>
        </div>
        <div className="hidden md:flex gap-[10px]">
          <ToggleButton
            className="w-[60px] h-[30px] text-[14px]"
            onClick={() => setSelection("one_week")}
            active={selection === "one_week"}
            type="pricegraph"
          >
            1W
          </ToggleButton>
          {type == "rwa" ?
            <>
              <ToggleButton
                className="w-[60px] h-[30px] text-[14px]"
                onClick={() => setSelection("one_month")}
                active={selection === "one_month"}
                type="pricegraph"
              >
                1M
              </ToggleButton>
              <ToggleButton
                className="w-[60px] h-[30px] text-[14px]"
                onClick={() => setSelection("one_year")}
                active={selection === "one_year"}
                type="pricegraph"
              >
                1Y
              </ToggleButton>
            </>
            : (<></>)
          }
        </div>
      </div>
      <div className="mr-[-22px] md:mr-0 ml-[-15px] pr-[25px] md:pr-0 h-[300px]" id="chart-timeline">
        <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
          {isLoading || isLandGraphDataLoading || isLandPriceDataLoading ?
            <Skeleton className="rounded-lg ml-2 w-full" height={300} /> :
              <ApexChart
                options={options}
                series={series}
                type="area"
                height={300}
              />}
        </SkeletonTheme>
      </div>
    </div>
  );
}