import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { BOLD_INTER_TIGHT } from '../../config/constants/environments';
import { PAGES } from "../../config/constants/pages";
import Logo from '../common/logo';
import ConnectWallet from '../connect-wallet';
import MobileNavbar from './mobile';
import { PAGE } from "../../utils/type";
import { FiExternalLink } from 'react-icons/fi';

export default function Header() {
  const router = useRouter();
  const { pathname } = router;
  const { address } = useAccount()
  
  const [truncatedAddress, setTruncatedAddress] = React.useState("Not Connected");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (address) {
      setTruncatedAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address]);

  const overlayRouteChangeHandler = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      {isMobileMenuOpen && (
        <div className="w-full h-full fixed bg-[#80849890] z-10 top-0" />
      )}
      <div className="relative bg-primary px-[10px] pt-[20px] pb-[32px] xl:p-[32px]">
        <div className="flex justify-between items-center rounded-[90px] h-[64px] max-w-[1230px] m-auto xl:max-w-[1250px] pl-4 pr-4 mlg:pl-8 mlg:pr-8 md:h-[80px] bg-secondary">
          <Logo />
          <div className="flex itmes-center gap-[40px]">
            {PAGES.map((page: PAGE) => {
              return (
                <div className={`hidden mlg:flex items-center font-bold text-[15px] leading-[20px] text-[#0f0a0a] border-0 outline-0 bg-transparent ${pathname === page.path ? "text-[#0a0a0a]" : ""}`} key={page.name}>
                  {page.url ? (
                    <Link
                      href= {page?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex no-underline items-center gap-1 capitalize text-[14px] leading-[20px] relative transition-all duration-300 text-[#0f0a0a] dark:text-[#f1f1f1] after:absolute after:content-[' '] after:w-full after:h-[3px] after:top-[100%] after:bg-[#61cd81] after:transition-transform after:scale-x-[0] after:origin-right after:hover:scale-x-[1] after:hover:origin-left ${BOLD_INTER_TIGHT.className}`}
                    >
                      {page.name}
                      <FiExternalLink className="text-text-primary" />
                    </Link>
                  ) : (
                    <Link 
                      href={page?.path ?? ''} 
                      className={`text-[#0f0a0a] dark:text-[#f1f1f1] no-underline flex capitalize text-[14px] leading-[20px] relative transition-all duration-300 after:absolute after:content-[' '] after:w-full after:h-[3px] after:top-[100%] after:bg-[#61cd81] after:transition-transform after:scale-x-[0] after:origin-right after:hover:scale-x-[1] after:hover:origin-left ${BOLD_INTER_TIGHT.className}`}
                    >
                      {page.name}
                    </Link>
                  )}
                </div>
              );
            })}
            <div className="flex items-center gap-3">
              <ConnectWallet />
            </div>
          </div>
          {isMobileMenuOpen && (
            <>
              <div className={`absolute top-[80px] left-0 w-full transition ease-in-out delay-700 opacity-0 ${isMobileMenuOpen ? 'opacity-1' : ''}`}>
                <div className="flex flex-col gap-[10px] p-[30px] rounded-[16px] h-full bg-secondary">
                  {PAGES.map((page: PAGE) => {
                    return (
                      <div key={page.name} className='flex items-center'>
                        {page.url ? (
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className={`flex w-full justify-center items-center px-[24px] py-[13px] border-1 border-[#61cd81] rounded-[100px] text-[14px] leading-[20px] text-[#0a0a0a] dark:text-[#f1f1f1] no-underline ${pathname === page?.path ? 'text-[#0f0a0a]' : ''} ${BOLD_INTER_TIGHT.className}`}>
                              {page.name}
                            </div>
                          </a>
                        ) : (
                          <div
                            className={`flex w-full justify-center items-center px-[24px] py-[13px] border-1 border-[#61cd81] rounded-[100px] text-[14px] leading-[20px] text-[#0a0a0a] dark:text-[#f1f1f1] no-underline ${pathname === page?.path ? 'text-[#0f0a0a]' : ''} ${BOLD_INTER_TIGHT.className}`}
                            onClick={() => overlayRouteChangeHandler(page?.path ?? '')}
                          >
                            {page.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          <MobileNavbar />
        </div>
      </div>
    </div>
  );
}
