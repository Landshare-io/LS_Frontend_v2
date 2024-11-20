import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import IconCoinStacked from "../../../public/icons/coin-stacked.svg";
import IconRWA from "../../../public/icons/home.svg";
import IconDashboard from "../../../public/icons/dashboard.svg";
import IconCube from "../../../public/icons/cube.svg";
import IconMenu from "../../../public/icons/menu.svg";
import LandDao from "../../../public/icons/land-dao.svg";
import DsSwap from "../../../public/icons/ds-swap.svg";
import LeftRight from "../../../public/icons/left-right.svg"
import { BsCreditCardFill } from "react-icons/bs";

export default function MobileNavbar() {
  const [isMore, setIsMore] = useState(false);
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="shadow-[0_-2px_10px_rgba(74,81,107,0.1)] bg-secondary px-[20px] py-[16px] fixed bottom-0 left-0 z-[99] flex w-full flex-col gap-[10px] mlg:hidden">
      <div className="flex justify-around">
        <div
          className="flex flex-col items-center gap-[5px] cursor-pointer"
          onClick={() => router.push("/vaults")}
        >
          <Image
            src={IconCoinStacked}
            alt="icon vault"
            className={`w-[20px] h-[20px] grayscale ${pathname.includes("/vaults") ? 'grayscale-0' : ''}`}
          />
          <span className={`font-medium text-[10px] leading-[16px] tracking-[0.02em] ${pathname.includes("/vaults") ? 'text-text-fourth' : 'text-text-secondary'}`}>Vault</span>
        </div>
        <div
          className="flex flex-col items-center gap-[5px] cursor-pointer"
          onClick={() => router.push("/rwa")}
        >
          <Image
            src={IconRWA}
            alt="icon rwa"
            className={`w-[20px] h-[20px] grayscale ${pathname.includes("/rwa") || pathname.includes("/RWA") ? 'grayscale-0' : ''}`}
          />
          <span className={`font-medium text-[10px] leading-[16px] tracking-[0.02em] ${pathname.includes("/rwa") || pathname.includes("/RWA") ? 'text-text-fourth' : 'text-text-secondary'}`}>RWA</span>
        </div>
        <div
          className="flex flex-col items-center gap-[5px] cursor-pointer"
          onClick={() => router.push("/dao")}
        >
          <Image
            src={LandDao}
            alt="landDao"
            className={`w-[20px] h-[20px] grayscale ${pathname.includes("/dao") || pathname.includes("/DAO") ? 'grayscale-0' : ''}`}
          />
          <span className={`font-medium text-[10px] leading-[16px] tracking-[0.02em] ${pathname.includes("/dao") || pathname.includes("/DAO") ? 'text-text-fourth' : 'text-text-secondary'}`}>DAO</span>
        </div>

        <div
          className="flex flex-col items-center gap-[5px] cursor-pointer"
          onClick={() => router.push("/nft/inventory")}
        >
          <Image
            src={IconCube}
            alt="icon nfts"
            className={`w-[20px] h-[20px] grayscale ${pathname.includes("/nft") || pathname.includes("/NFT") ? 'grayscale-0' : ''}`}
          />
          <span className={`font-medium text-[10px] leading-[16px] tracking-[0.02em] ${pathname.includes("/nft") || pathname.includes("/NFT") ? 'text-text-fourth' : 'text-text-secondary'}`}>NFTs</span>
        </div>
        <div
          className="flex flex-col items-center gap-[5px] cursor-pointer mobile-mavbar-more-item"
          onClick={() => setIsMore(((prevState) => !prevState))}
        >
          <Image
            src={IconMenu}
            alt="icon more"
          />
          <span className="font-medium text-[10px] leading-[16px] tracking-[0.02em] min-w-[25px] text-text-secondary">{isMore ? 'Less' : 'More'}</span>
          {isMore ? (
            <div className="absolute bottom-[82px] right-[20px] shadow-[0_0_4px_0_rgba(160,167,195,0.2)] rounded-[12px] py-[4px] min-w-[108px] bg-secondary">
              <a
                href="/migration"
                target="_blank"
                rel="noopener noreferrer"
                className="flex px-[16px] py-[10px] items-center gap-[4px] w-full"
              >
                <Image
                  src={IconCoinStacked}
                  alt="migration"
                  className="w-[20px] h-[20px] grayscale"
                />
                <span className="text-[12px] font-medium spacing-[20px] tracking-[0.24px] text-text-secondary">Migration</span>
              </a>
              <a
                href="https://dashboard.landshare.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex px-[16px] py-[10px] items-center gap-[4px] w-full"
              >
                <Image
                  src={IconDashboard}
                  alt="icon dashboard"
                  className="w-[20px] h-[20px] grayscale"
                />
                <span className="text-[12px] font-medium spacing-[20px] tracking-[0.24px] text-text-secondary">Dashboard</span>
              </a>
              <a
                href="https://app.dsswap.io/info"
                target="_blank"
                rel="noopener noreferrer"
                className="flex px-[16px] py-[10px] items-center gap-[4px] w-full"
              >
                <Image 
                  src={DsSwap} 
                  alt="landDao" 
                  className="w-[20px] h-[20px] grayscale" 
                />
                <span className="text-[12px] font-medium spacing-[20px] tracking-[0.24px] text-text-secondary">DS Swap</span>
              </a>
              <a
                href="https://app.transporter.io/?tab=token&token=LAND"
                target="_blank"
                rel="noopener noreferrer"
                className="flex px-[16px] py-[10px] items-center gap-[4px] w-full"
              >
                <Image
                  src={LeftRight}
                  alt="icon dashboard"
                  className="w-[20px] h-[20px] grayscale"
                />
                <span className="text-[12px] font-medium spacing-[20px] tracking-[0.24px] text-text-secondary">Bridge</span>
              </a>
              <a
                  href="https://pools.landshare.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex px-[16px] py-[10px] items-center gap-[4px] w-full"
                >
                  <BsCreditCardFill className="fill-[#b1b1b1]"/>
                  <span className="text-[12px] font-medium spacing-[20px] tracking-[0.24px] text-text-secondary">Lending</span>
              </a>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
