import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import numeral from "numeral";
import { ethers } from "ethers";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import ReactApexCharts from "react-apexcharts";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Modal from "react-modal";
import ToggleButton from "../toggle-button";
import IconSwipelux from "../../../../public/icons/swipelux.svg";
import IconPancakeswap from "../../../../public/icons/pancakeswap.png";
import IconGateio from "../../../../public/icons/gateio.png";
import IconMEXC from "../../../../public/icons/mexclogo.png";
import IconBitmart from "../../../../public/icons/bitmartLogo.png";
import IconBingX from "../../../../public/icons/bingx.png";
import IconTokenPair from "../../../../public/icons/token-pair.svg";

export default function PriceGraph({
  containerClassName,
  titleIconStyle,
  titleStyle,
  type,
  landPrice,
  isDataLoading,
  isRWAPage
}) {
  const { isDarkMode } = useGlobalContext()
  const [isLoading, setIsLoading] = useState(true);
  const [selection, setSelection] = useState("one_month");
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);
  const router = useRouter();
  const [recentData, setRecentData] = useState({ pair: "", price: 0, change_price: 0, date: Date.now() });
  const [rwaGraphData, setRWAGraphData] = useState();
  const [landGraphData, setLandGraphData] = useState();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isWidgetCreated, setIsWidgetCreated] = useState(false);
  const swipeluxContainer = document.getElementById("swipelux-container");
  const settings = {
    apiKey: '1d1fe8ad-a154-4dc0-a6bd-3fe8939ba7d0'
  };
  const widget = new window.SwipeluxWidget(swipeluxContainer, settings);


  let dueDate = {
    one_week: new Date(new Date().setDate(new Date().getDate() - 7)),
    one_month: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    one_year: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  }

  useEffect(() => {
    fetchGraphData()
  }, [])

  function openSwipelux() {
    if (isWidgetCreated == false) {
      widget.init();
    }
    setIsWidgetCreated(true);
    setIsBuyModalOpen(false);
    document.body.classList.remove('modal-open');
    const swipeluxModal = document.getElementById("swipelux-modal");
    swipeluxModal.classList.remove("hidden");
    swipeluxModal.classList.add("flex");
  }

  function closeSwipelux() {
    const swipeluxModal = document.getElementById("swipelux-modal");
    swipeluxModal.classList.remove("flex");
    swipeluxModal.classList.add("hidden");
  }

  async function fetchLandData(dueTimeStamp, now) {
    const { data: { data: { data: { quotes: data1 } } } } = await axios.get(process.env.REACT_APP_LANDPRICE_URL);
    let market_caps = [];
    let prices = [];
    let total_volumes = [];
    for (let i = 0; i < data1?.length; i++) {
      if (Math.floor(Date.parse(data1[i].timestamp) / 1000) >= Math.floor(dueTimeStamp / 1000) && Math.floor(Date.parse(data1[i].timestamp) / 1000) <= Math.floor(now / 1000)) {
        let market_cap = [
          data1[i].timestamp, data1[i].quote.USD.market_cap
        ];
        let total_volume = [
          data1[i].timestamp, data1[i].quote.USD.volume_24h
        ];
        let price = [
          data1[i].timestamp, data1[i].quote.USD.price
        ];
        market_caps.push(market_cap);
        prices.push(price);
        total_volumes.push(total_volume);
      }
    }
    let data2 = { prices: prices, market_caps: market_caps, total_volumes: total_volumes };
    setLandGraphData(data2);
  }

  async function fetchRWAData() {
    const pricesQuery = `
            query{
              valueUpdateds {
                blockTimestamp
                value
                id
              }
            }
          `;
    const client = new ApolloClient({
      uri: "https://api.studio.thegraph.com/query/81176/landshare-price/v0.1.0",
      cache: new InMemoryCache(),
    });
    const rwaData = await client
      .query({
        query: gql(pricesQuery),
      })
    if (rwaData) {
      const gData = [];
      rwaData.data.valueUpdateds.filter((value) => Number(value.blockTimestamp) > 1702900000).sort((a, b) => {
        return Number(a.blockTimestamp) - Number(b.blockTimestamp);
      }).map((data) => {
        gData.push([
          Number(data.blockTimestamp) * 1000,
          parseFloat(Number(ethers.utils.formatEther(data.value)).toFixed(6))
        ])
      });
      gData.push([
        Date.now(),
        gData[gData.length - 1][1]
      ]);
      setRWAGraphData(gData);
    }
  }

  async function fetchGraphData() {
    fetchRWAData()
    fetchLandData(dueDate.one_week, Date.now())
  }

  const handleClick = () => {
    if (type === "rwa") {
      router.push("/rwa");
      window.scrollTo(0, 0); // Scroll to the top after navigation
    } else if (type === "land") {
      setIsBuyModalOpen(true);
      document.body.classList.add('modal-open');
    }
  };

  useEffect(() => {
    if (rwaGraphData != undefined && landGraphData) {
      (async () => {
        const now = Date.now()
        switch (type) {
          case 'land':
            setSelection("one_week")
            setIsLoading(true);
            const { data: { price: landPrice } } = await axios.get(process.env.REACT_APP_LANDMARKET_URL);
            setSeries([{
              data: landGraphData?.prices ?? []
            }])
            setRecentData({
              pair: "LAND / USD",
              price: landPrice,

              change_price: (landGraphData.prices[Number(landGraphData.prices.length) - Number(1)]
              [1]
                - landGraphData.prices[0][1]) /
                landGraphData.prices[0][1] * 100,
              date: now
            })
            setIsLoading(false);
            break;
          case 'rwa':
            if (rwaGraphData[0][0] > dueDate[selection]) {
              setSeries([{ data: [...rwaGraphData, [dueDate[selection], null]] }]);
            } else {
              const filtered = rwaGraphData.filter((value) => Number(value[0]) > new Date(dueDate[selection]).getTime());
              const data = [[new Date(dueDate[selection]).getTime(), rwaGraphData[rwaGraphData.length - filtered.length - 1][1]]];
              setSeries([{
                data: data.concat(filtered)
              }]);
            }
            setRecentData({
              pair: "LSRWA / USD",
              price: Number(rwaGraphData[rwaGraphData.length - 1][1]),
              change_price: rwaGraphData[1][1] != 0 ? (rwaGraphData[rwaGraphData.length - 1][1] - rwaGraphData[1][1]) / rwaGraphData[1][1] * 100 : 0,
              date: now
            });
            setIsLoading(false);
            break;
        }
      })()
    }
  }, [selection, type, rwaGraphData, landGraphData]);

  useEffect(() => {
    if (type == "rwa") {
      setSelection("one_month");
    }
  }, [type])

  const options = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      animations: {
        enabled: false
      },
      foreColor: isDarkMode ? "#fff" : "#000"
    },
    xaxis: {
      type: "datetime"
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        formatter: function (value) {
          if (String(value) == "5e-324")
            return 0
          return Number(numeral(value).format('0.000'))
        }
      }
    },
    colors: ["#61CD81"],
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (seriesName) => seriesName.toFixed(5),
      }
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

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "400px",
      width: "90%",
      height: "fit-content"
    },
  };

  function openSwipelux() {
    if (isWidgetCreated == false) {
      widget.init();
    }
    setIsWidgetCreated(true);
    setIsBuyModalOpen(false);
    document.body.classList.remove('modal-open');
    const swipeluxModal = document.getElementById("swipelux-modal");
    swipeluxModal.classList.remove("hidden");
    swipeluxModal.classList.add("flex");
  }

  function closeSwipelux() {
    const swipeluxModal = document.getElementById("swipelux-modal");
    swipeluxModal.classList.remove("flex");
    swipeluxModal.classList.add("hidden");
  }

  return (

    <div className={`rounded-[12px] overflow-visible p-[14px] md:w-full md:rounded-[16px] lg:rounded-[10px] lg:p-[18px] bg-third ${containerClassName}`}>
      <Modal
        isOpen={isBuyModalOpen}
        onRequestClose={() => { setIsBuyModalOpen(false), document.body.classList.remove('modal-open'); }}
        style={customStyles}
        contentLabel="current-apr Modal"
      >
        <div className="w-full h-[460px] overflow-y-scroll">
          <button onClick={() => openSwipelux()} className="h-[115px] flex flex-col justify-center items-center w-full pb-[20px] border-b relative hover:bg-gray-300 transition-colors">
            <Image src={IconSwipelux} alt="" className="w-[40px]" />
            <div className="text-[24px] font-bold">Swipelux</div>
            <div className="text-[16px] text-[#b6b0b0]">Credit or Debit Card</div>
          </button>
          <a href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
            <Image src={IconPancakeswap} alt="" className="w-[40px]" />
            <div className="text-[24px] font-bold">PancakeSwap</div>
            <div className="text-[16px] text-[#b6b0b0]">Decentralized Exchange</div>
          </a>
          <a href="https://www.gate.io/trade/LANDSHARE_USDT" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
            <Image src={IconGateio} alt="" className="w-[40px]" />
            <div className="text-[24px] font-bold">Gate.io</div>
            <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
          </a>
          <a href="https://www.mexc.com/exchange/LANDSHARE_USDT" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
            <Image src={IconMEXC} alt="" className="w-[40px] h-[40px]" />
            <div className="text-[24px] font-bold">MEXC</div>
            <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
          </a>
          <a href="https://www.bitmart.com/trade/en-US?symbol=LAND_USDT" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
            <Image src={IconBitmart} alt="" className="w-[40px] h-[40px]" />
            <div className="text-[24px] font-bold">Bitmart</div>
            <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
          </a>
          <a href="https://bingx.com/en/spot/LANDUSDT/" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full hover:bg-gray-300 transition-colors">
            <Image src={IconBingX} alt="" className="w-[40px] h-[40px]" />
            <div className="text-[24px] font-bold">BingX</div>
            <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
          </a>
        </div>
      </Modal>
      <div className="hidden fixed backdrop-brightness-50 top-0 w-full h-full z-50 justify-center items-center left-0" id="swipelux-modal" onClick={closeSwipelux}>
        <div className="flex items-center justify-center w-[90%] max-w-[400px] translate-y-[-5%] md:translate-y-0" id="swipelux-container">
        </div>
      </div>
      <div className="flex items-center gap-[5px] mb-[16.42px] justify-between">
        <div className="flex flex-row items-center gap-1">
          <Image src={IconTokenPair} alt="token pair" className="h-[24px]" style={titleIconStyle} />
          <div className="graph-title text-text-primary" style={titleStyle}>
            {recentData.pair}
          </div>
        </div>

      </div>
      <div className="price-graph-header">
        <div className="price-garph-price-status">
          {(type == "land" ? isDataLoading : isLoading) ? (<SkeletonTheme baseColor={`${isDarkMode ? "#31333b" : "#dbdde0"}`} highlightColor={`${isDarkMode ? "#52545e" : "#f6f7f9"}`}><Skeleton className="rounded-lg" height={28} /></SkeletonTheme>) : (
            <div className="price-graph-price-content">
              <span className="price-graph-price-data text-text-primary">${type == "land" ? landPrice : recentData?.price?.toFixed(5)}</span>
              {recentData.change_price >= 0 ? (
                <span className="price-graph-price-change-positive"> + {recentData.change_price.toFixed(2)} %</span>
              ) : (
                <span className="price-graph-price-change-negative"> {recentData.change_price.toFixed(2)} %</span>
              )}
            </div>)}
          <div className="flex flex-column  gap-2  justify-content-center ">
            <span className="price-graph-price-date">{new Date(recentData.date).toDateString()}</span>
            <div className="flex flex-row justify-content-between">
              {!isRWAPage && (
                <button onClick={handleClick} className="outline-none w-[100px] h-[30px] rounded-full bg-[#61cd81] text-white hover:bg-[#87e7a4] transition ease fs-14 fw-500">
                  {type === "rwa" ? "Buy LSRWA" : "Buy LAND"}
                </button>
              )}
              <div className="price-graph-period-option price-graph-period-option-mobile">
                <ToggleButton
                  onClick={() => setSelection("one_week")}
                  active={selection === "one_week"}
                  type="pricegraph"
                >
                  1W
                </ToggleButton>
                {type == "rwa" ?
                  <ToggleButton
                    onClick={() => setSelection("one_month")}
                    active={selection === "one_month"}
                    type="pricegraph"
                  >
                    1M
                  </ToggleButton>
                  : (<></>)
                }
                {/* {type == "rwa" ?
            (<ToggleButton
              onClick={() => setSelection("one_year")}
              active={selection === "one_year"}
            >
              1Y
            </ToggleButton>) : (<></>)
          } */}
              </div>
            </div>

          </div>
        </div>
        <div className="price-graph-period-option">
          <ToggleButton
            onClick={() => setSelection("one_week")}
            active={selection === "one_week"}
            type="pricegraph"
          >
            1W
          </ToggleButton>
          {type == "rwa" ?
            <ToggleButton
              onClick={() => setSelection("one_month")}
              active={selection === "one_month"}
              type="pricegraph"
            >
              1M
            </ToggleButton>
            : (<></>)
          }
          {/* {type == "rwa" ?
            (<ToggleButton
              onClick={() => setSelection("one_year")}
              active={selection === "one_year"}
            >
              1Y
            </ToggleButton>) : (<></>)
          } */}
        </div>
      </div>
      <div className="price-chart" id="chart-timeline">
        <SkeletonTheme baseColor={`${isDarkMode ? "#31333b" : "#dbdde0"}`} highlightColor={`${isDarkMode ? "#52545e" : "#f6f7f9"}`}>
          {isLoading ?
            <Skeleton className="rounded-lg ml-2" height={300} /> :
            <ReactApexCharts
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
