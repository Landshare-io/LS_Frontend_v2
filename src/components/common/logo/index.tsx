import Link from "next/link";
import Image from 'next/image';
import { useGlobalContext } from "../../../context/GlobalContext";
import logo from "../../../../public/logo.svg";
import logoDark from "../../../../public/logo-dark.svg";

export default function Logo() {
  const { theme } = useGlobalContext();

  return (
    <Link
      className={`flex itmes-center gap-[7px] cursor-pointer`}
      href="/"
    >
      <Image 
        className="w-[60px] h-[60px]" 
        src={theme == 'dark' ? logoDark : logo} 
        alt="logo" 
      />
      {/* <div className="font-bold font-[20px] leading-[24px] text-[#0E1D18] dark:text-[#ffffff]">Landshare</div> */}
    </Link>
  );
}
