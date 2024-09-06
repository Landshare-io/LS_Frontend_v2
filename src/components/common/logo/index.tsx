import Link from "next/link";
import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import { useGlobalContext } from "../../../context/GlobalContext";
import logo from "../../../../public/logo.svg";
import logoDark from "../../../../public/logo-dark.svg";

const boldInterTight = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});

interface LogoProps {
  showLogoText?: boolean;
}

export default function Logo({ showLogoText }: LogoProps) {
  const { theme } = useGlobalContext();

  return (
    <Link
      className={`flex items-center gap-[7px] cursor-pointer`}
      href="/"
    >
      <Image 
        className="w-[42px] h-[42px] md:w-[60px] md:h-[60px]" 
        src={theme == 'dark' ? logoDark : logo} 
        alt="logo" 
      />
      {showLogoText && (
        <div className={`font-bold text-[20px] leading-[24px] text-[#0E1D18] dark:text-[#ffffff] ${boldInterTight.className}`}>Landshare</div>
      )}
    </Link>
  );
}
