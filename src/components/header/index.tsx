import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PAGES } from "../../config/constants/pages";
import { useGlobalContext } from "../../contexts/GlobalContext";
import Logo from "./Logo";
import ConnectWallet from "../ConnectWallet";
import MobileNavbar from "../RealWorldAssets/Buy/MobileNavbar";

// Importing types
import { PAGE } from "../../utils/type";

export default function Header() {
  const router = useRouter();
  const { pathname } = router;
  
  const { isDarkMode, account } = useGlobalContext();
  const [truncatedAddress, setTruncatedAddress] = React.useState("Not Connected");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (account) {
      setTruncatedAddress(`${account.slice(0, 6)}...${account.slice(-4)}`);
    }
  }, [account]);

  const overlayRouteChangeHandler = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      {isMobileMenuOpen && (
        <div className="w-full h-full fixed bg-[#80849890] z-10 top-0" />
      )}
      <div className="header-container bg-tw-primary">
        <div className="header-wrapper header-section-set-max-container pl-4 pr-4 mlg:pl-8 mlg:pr-8 bg-tw-secondary">
          <Logo />
          <div className="header-links-container">
            {PAGES.map((page: PAGE) => {
              return (
                <div className={`header-links-wrapper ${pathname === page.path ? "header-links-active" : ""} hidden mlg:block`} key={page.name}>
                  {page.url ? (
                    <Link
                      href= {page?.name == "Swap" ? "https://app.dsswap.io/info" : "https://app.transporter.io/?tab=token&token=LAND"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="header-link"
                    >
                      {page.name}
                    </Link>
                  ) : (
                    <Link href={page?.path ?? ''} className="header-link">
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
              <div className={`header-mobile-menu-container ${isMobileMenuOpen ? 'header-mobile-menu-container-open' : ''}`}>
                <div className="header-mobile-menu bg-tw-secondary">
                  {PAGES.map((page: PAGE) => {
                    return (
                      <div key={page.name}>
                        {page.url ? (
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className={`header-mobile-menu-item ${pathname === page?.path ? 'header-mobile-menu-item-active' : ''}`}>
                              {page.name}
                            </div>
                          </a>
                        ) : (
                          <div
                            className={`header-mobile-menu-item ${pathname === page?.path ? 'header-mobile-menu-item-active' : ''}`}
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
