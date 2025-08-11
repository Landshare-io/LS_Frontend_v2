import Link from "next/link";
import Image from "next/image";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";
import { useTheme } from "next-themes";
import logo from "../../../../public/logo.svg";
import logoDark from "../../../../public/logo-dark.svg";

interface LogoProps {
  logoClassName?: string;
  textClassName?: string;
  showLogoText?: boolean;
}

export default function Logo({
  logoClassName,
  textClassName,
  showLogoText,
}: LogoProps) {
  const { theme } = useTheme();

  return (
    <Link className={`flex items-center gap-[7px] cursor-pointer`} href="/">
      <Image
        className={`w-[42px] h-[42px] md:w-[60px] md:h-[60px] ${logoClassName}`}
        src={theme == "dark" ? logoDark : logo}
        alt="logo"
      />
      {showLogoText && (
        <div
          className={`font-bold text-[20px] leading-[24px] text-[#0E1D18] dark:text-[#ffffff] ${BOLD_INTER_TIGHT.className} ${textClassName}`}
        >
          Landshare
        </div>
      )}
    </Link>
  );
}
