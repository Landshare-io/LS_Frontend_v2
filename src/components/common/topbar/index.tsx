import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import goOther from "../../../../public/icons/go_other.png";
import goOtherWhite from "../../../../public/icons/go_other_white.png";
import { BackIcon } from "../../common/icons/nft";
import { useGlobalContext } from "../../../context/GlobalContext";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface TopbarProps {
  isNftList?: boolean;
}

export default function Topbar({ isNftList }: TopbarProps) {
  const { theme } = useGlobalContext();
  const router = useRouter()
  const pathName = router.pathname;

  return (
    <>
      <div className="w-full overflow-hidden px-2">
        <div className="flex flex-nowrap items-center mt-12 mb-[30px] overflow-x-auto no-scrollbar">
          <span
            className={`cursor-pointer whitespace-nowrap  mr-[20px] pr-[5px] pb-3 relative mr-[20px] hover:text-normal hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-[1px] hover:after:w-full hover:after:h-[6px] hover:after:bg-[#656565] hover:after:rounded-[10px] after:ease-in-out duration-300 ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"} ${(pathName.includes("/inventory") || (pathName.includes("/nft") && !pathName.includes("/resources")) && !pathName.includes("/mint")) &&
              `after:content-[""] after:absolute after:left-0 after:bottom-[1px] after:w-full after:h-[6px] after:!bg-[#61cd81] after:rounded-[10px] ${BOLD_INTER_TIGHT.className}`
              }`}
            onClick={() => router.push("/nft/inventory")}
          >
            Property Overview
          </span>
          <span
            className={`relative mr-[20px] hover:text-normal hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-[1px] hover:after:w-full hover:after:h-[6px] hover:after:bg-[#656565] hover:after:rounded-[10px] duration-300 pb-3  mr-[20px] pr-[5px] cursor-pointer after:ease-in-out ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"} ${pathName.includes("/marketplace") && `after:content-[""] after:absolute after:left-0 after:bottom-[1px] after:w-full after:h-[6px] after:bg-[#61cd81] after:rounded-[10px] ${BOLD_INTER_TIGHT.className}`
            }`}
            onClick={() => router.push("/marketplace")}
          >
            Marketplace
          </span>
          <span
            className={`relative mr-[20px] hover:text-normal hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-[1px] hover:after:w-full hover:after:h-[6px] hover:after:bg-[#656565] hover:after:rounded-[10px] duration-300 pb-3  mr-[20px] pr-[5px] cursor-pointer after:ease-in-out ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"} ${pathName.includes("/resources") && `after:content-[""] after:absolute after:left-0 after:bottom-[1px] after:w-full after:h-[6px] after:bg-[#61cd81] after:rounded-[10px] ${BOLD_INTER_TIGHT.className}`
            }`}
            onClick={() => router.push("/nft/resources")}
          >
            Resources
          </span>
          <span
            className={`cursor-pointer whitespace-nowrap  mr-[20px] pr-[5px] pb-3 relative mr-[20px] hover:text-normal hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-[1px] hover:after:w-full hover:after:h-[6px] hover:after:bg-[#656565] hover:after:rounded-[10px] duration-300 after:ease-in-out ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"} ${(pathName.includes("/mint")) &&
              `after:content-[""] after:absolute after:left-0 after:bottom-[1px] after:w-full after:h-[6px] after:bg-[#81db9b] after:rounded-[10px] ${BOLD_INTER_TIGHT.className}`
              }`}
            onClick={() => router.push("/nft/mint")}
          >
            Mint
          </span>
          <span className={`whitespace-nowrap  mr-[20px] pr-[5px] relative mr-[20px] hover:text-normal hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-[1px] hover:after:w-full hover:after:h-[6px] hover:after:bg-[#656565] duration-300 hover:after:rounded-[10px] pb-3 cursor-pointer after:ease-in-out ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"}`}>
            <a
              href="https://docs.landshare.io/platform-features/nft-ecosystem"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-decoration-none flex gap-1 items-center ${theme == 'dark' ? "text-[#eaf3f3]" : "text-[#131414]"}`}
            >
              <Image src={theme == 'dark' ? goOtherWhite : goOther} alt="go other" className="w-[16px] h-[16px]" />
              <span>Game Guide</span>
            </a>
          </span>
        </div>
        
        {isNftList ? (
          <div className="mt-2"></div>
        ) : (
          <div className="flex items-center mt-[5px] md:mt-[20px] ml-[6px] text-[#131414]">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => router.push("/nft/inventory")}
            >
              <BackIcon />
              <span className="px-2 fs-xs cursor-pointer text-text-secondary">
                Back to the list
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
