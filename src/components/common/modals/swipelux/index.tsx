"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";
import { useTheme } from "next-themes";
import Button from "../../button";
import { SWIPELUX_SETTING } from "../../../../config/constants/environments";
import IconSwipelux from "../../../../../public/icons/swipelux.svg";
import IconPancakeswap from "../../../../../public/icons/pancakeswap.png";
import IconGateio from "../../../../../public/icons/gateio.png";
import IconMEXC from "../../../../../public/icons/mexclogo.png";
import IconBitmart from "../../../../../public/icons/bitmartLogo.png";
import IconBingX from "../../../../../public/icons/bingx.png";

declare global {
  interface Window {
    SwipeluxWidget: any; // or provide a more specific type if known
  }
}

interface SwipeluxModalProps {
  isOpen: boolean;
  setIsOpen: Function;
}

export default function SwipeluxModal({
  isOpen,
  setIsOpen
}: SwipeluxModalProps) {
  const { theme } = useTheme();
  const [isWidgetCreated, setIsWidgetCreated] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "400px",
      width: "90%",
      height: "fit-content",
      backgroundColor: theme == "dark" ? "#31333b" : "#f6f7f9",
    },
    overlay: {
      background: '#00000080'
    }
  };

  useEffect(() => {
    if (isOpen && !isWidgetCreated) {
      const swipeluxContainer = document.getElementById("swipelux-container");
      if (swipeluxContainer) {
        if (window.SwipeluxWidget) {
          const widget = new window.SwipeluxWidget(swipeluxContainer, SWIPELUX_SETTING);
          widget.init();
          setIsWidgetCreated(true);
        } else {
          console.error("SwipeluxWidget is not loaded");
        }
      }
    }
  }, [isOpen, isWidgetCreated]);

  useEffect(() => {
    if (document.querySelector('script[src="https://app.swipelux.com/sdk.js"]')) return;
    const element = document.getElementById('swipelux-modal')

    if (element) {
      const script = document.createElement('script');
      script.type = "text/javascript"
      script.src = 'https://app.swipelux.com/sdk.js';
      script.async = true;
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  function openSwipelux() {
    if (isWidgetCreated == false) {
      const swipeluxContainer = document.getElementById("swipelux-container");
      const widget = new window.SwipeluxWidget(swipeluxContainer, SWIPELUX_SETTING);
      widget.init();
    }
    setIsWidgetCreated(true);
    setIsOpen(false);
    document.body.classList.remove('modal-open');
    const swipeluxModal = document.getElementById("swipelux-modal") as Element;
    swipeluxModal.classList.remove("hidden");
    swipeluxModal.classList.add("flex");
  }

  function closeSwipelux() {
    const swipeluxModal = document.getElementById("swipelux-modal") as Element;
    swipeluxModal.classList.remove("flex");
    swipeluxModal.classList.add("hidden");
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => { setIsOpen(false), document.body.classList.remove('modal-open'); }}
        style={customStyles}
      >
        <div className="w-full h-[460px] overflow-y-scroll">
          <Button 
            onClick={() => openSwipelux()} 
            className="h-[115px] w-full pb-[20px] border-b hover:bg-gray-300 transition-colors bg-transparent"
            textClassName="flex flex-col justify-center items-center"
          >
            <Image src={IconSwipelux} alt="" className="w-[40px]" />
            <div className="text-[24px] font-bold">Swipelux</div>
            <div className="text-[16px] text-[#b6b0b0]">Credit or Debit Card</div>
          </Button>
          <Link href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
            <Image src={IconPancakeswap} alt="" className="w-[40px]" />
            <div className="text-[24px] font-bold">PancakeSwap</div>
            <div className="text-[16px] text-[#b6b0b0]">Decentralized Exchange</div>
          </Link>
          <Link href="https://www.gate.io/trade/LANDSHARE_USDT" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
            <Image src={IconGateio} alt="" className="w-[40px]" />
            <div className="text-[24px] font-bold">Gate.io</div>
            <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
          </Link>
          <Link href="https://www.mexc.com/exchange/LANDSHARE_USDT" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
            <Image src={IconMEXC} alt="" className="w-[40px] h-[40px]" />
            <div className="text-[24px] font-bold">MEXC</div>
            <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
          </Link>
          <Link href="https://www.bitmart.com/trade/en-US?symbol=LAND_USDT" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full pt-[20px] pb-[20px] border-b hover:bg-gray-300 transition-colors">
            <Image src={IconBitmart} alt="" className="w-[40px] h-[40px]" />
            <div className="text-[24px] font-bold">Bitmart</div>
            <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
          </Link>
          <Link href="https://bingx.com/en/spot/LANDUSDT/" target="_blank" className="h-[115px] flex flex-col justify-center items-center w-full hover:bg-gray-300 transition-colors">
            <Image src={IconBingX} alt="" className="w-[40px] h-[40px]" />
            <div className="text-[24px] font-bold">BingX</div>
            <div className="text-[16px] text-[#b6b0b0]">Centralized Exchange</div>
          </Link>
        </div>
      </Modal>
      <div className="hidden fixed backdrop-brightness-50 top-0 w-full h-full z-50 justify-center items-center left-0" id="swipelux-modal" onClick={closeSwipelux}>
        <div className="flex items-center justify-center w-[90%] max-w-[400px] translate-y-[-5%] md:translate-y-0" id="swipelux-container">
        </div>
      </div>
    </>
  )
}
