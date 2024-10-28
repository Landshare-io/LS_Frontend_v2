import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { VISIBLE_FOOTER_PAGES } from "../../config/constants/pages";
// import toast, { Toaster } from 'react-hot-toast';

import Logo from "../common/logo";
import SwitchTheme from "../common/switch-theme";
import { ADDRESS_BOOK_ID } from "../../config/constants/environments";
import IconCMC from "../../../public/icons/cmc.svg";
import IconMail from "../../../public/icons/email-13784.png";
import IconYoutube from "../../../public/icons/youtube.svg";
import IconTwitter from "../../../public/icons/twitter.svg";
import IconTelegram from "../../../public/icons/telegram.svg";
import IconDiscord from "../../../public/icons/discord-icon.svg";
import IconMailGreen from "../../../public/icons/mail-green.svg";
import IconArrowRight from "../../../public/icons/arrow-right.svg";

export default function Footer() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { pathname } = router;
  const isFooterVisible = VISIBLE_FOOTER_PAGES.map((allowedPath: string) =>
    pathname.startsWith(allowedPath)
  );
  if (!isFooterVisible) return null;

  function getSPKey(type: string, SPdata: any) {
    const accessData = {
      grant_type: "client_credentials",
      client_id: "18c3953f93f00ab7003571dbd4e0a915",
      client_secret: "333c3ddad56a7ca82093002c09ad2c2a",
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accessData),
    };

    fetch("https://api.sendpulse.com/oauth/access_token", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (type === "new-user") {
          addUserToSP(SPdata, data.access_token);
        }
        if (type === "new-bot") {
          // changeVarSP(SPdata, data.access_token)
        }

        if (type === "withdrawal") {
          // sendEmail(SPdata, data.access_token)
        }
      })
      .catch((error) => {
        //alert('ERROR get SP Key')
        console.error(error);
      });
  }

  function addUserToSP(emailData: any, access_token: string) {
    const apiUrl = `https://api.sendpulse.com/addressbooks/${ADDRESS_BOOK_ID}/emails`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        //alert('ERROR send user to SP')
        console.error(error.message);
      });
  }

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the default form submission
    const emailData = {
      emails: [
        {
          email: email,
        },
      ],
    };

    getSPKey("new-user", emailData);
    // toast.success("Subscribed your email successfully.")
  };

  return (
    <>
      <div className="bg-third dark:bg-primary px-[20px] mlg:px-[40px] pt-[80px] lg:px-[120px] border-top-2 border-primary less-padding">
        <div className="flex justify-between items-start flex-col md:items-center lg:flex-row justify-around gap-[20px] lg:flex-row lg:gap-[80px] xxl:gap-[200px] pb-[40px]">
          <div className="flex flex-col gap-[20px] basis-[25%] grow-[0.6]">
            <div className="flex flex-row-reverse justify-between items-center gap-[20px] lg:flex-col">
              <div className="flex w-full justify-between">
                <Logo showLogoText logoClassName="!w-[52.3px] !h-[54.4px]" />
                <div className="items-end">
                  <SwitchTheme />
                </div>
              </div>
            </div>
            <div className="text-[#141414F5] dark:text-[#dadadaf5] font-normal text-[14px] leading-[22px]">
              This site is operated by Landshare LLC, which is not a registered
              broker-dealer or investment advisor.
            </div>
            <div className="flex justify-between flex-wrap">
              <a
                href="https://t.me/landshare"
                className="w-[40px] h-[40px] rounded-[100px] outline-none flex justify-center items-center border-2 border-[#0A133920] dark:border-[#ffffff34]"
              >
                <Image src={IconTelegram} alt="telegram" />
              </a>
              <a
                href="https://discord.com/invite/p3tzFTnA8E"
                className="w-[40px] h-[40px] rounded-[100px] outline-none flex justify-center items-center border-2 border-[#0A133920] dark:border-[#ffffff34]"
              >
                <Image src={IconDiscord} alt="discord" width={20} height={20} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCh_2bvsdIdD2QuhtpR20Wag"
                className="w-[40px] h-[40px] rounded-[100px] outline-none flex justify-center items-center border-2 border-[#0A133920] dark:border-[#ffffff34]"
              >
                <Image src={IconYoutube} alt="youtube" />
              </a>
              <a
                href="https://twitter.com/landshareio"
                className="w-[40px] h-[40px] rounded-[100px] outline-none flex justify-center items-center border-2 border-[#0A133920] dark:border-[#ffffff34]"
              >
                <Image src={IconTwitter} alt="twitter" />
              </a>
              <a
                href="https://coinmarketcap.com/community/profile/Landshare/"
                className="w-[40px] h-[40px] rounded-[100px] outline-none flex justify-center items-center border-2 border-[#0A133920] dark:border-[#ffffff34]"
              >
                <Image src={IconCMC} alt="coinmarketcap" />
              </a>
              <a
                href="mailto:admin@landshare.io"
                className="w-[40px] h-[40px] rounded-[100px] outline-none flex justify-center items-center border-2 border-[#0A133920] dark:border-[#ffffff34]"
              >
                <Image src={IconMail} className="w-4 h-4" alt="mail" />
              </a>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-[25px] mlg:gap-[20px] mlg:max-w-[600px] xl:basis-[50%] xl:grid-cols-4 xl:justify-between grow-[2]">
            <div className="p-0 flex flex-col gap-[16px]">
              <span className="font-normal text-[14px] leading-[22px] text-[#0A133999] dark:text-[#cbcbcb]">
                Company
              </span>
              <div className="flex flex-col gap-[24px] text-text-primary">
                <a
                  href="https://landshare.io/about-us"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  About Us
                </a>
                <a
                  href="https://landshare.io/faqs"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  FAQ
                </a>
                <a
                  href="https://landshare.io/blog"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  Blog
                </a>
              </div>
            </div>
            <div className="p-0 flex flex-col gap-[16px]">
              <span className="font-normal text-[14px] leading-[22px] text-[#0A133999] dark:text-[#cbcbcb]">
                Useful Links
              </span>
              <div className="flex flex-col gap-[24px] text-text-primary">
                <a
                  href="https://bscscan.com/token/0xa73164db271931cf952cbaeff9e8f5817b42fa5c"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  BSC Scan
                </a>
                <a
                  href="https://landshare.medium.com/landshare-roadmap-q3-q4-2024-preview-630f74d736e7"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  Roadmap
                </a>

                <a
                  href="https://track.swipelux.com/?api-key=1d1fe8ad-a154-4dc0-a6bd-3fe8939ba7d0"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  Buy with card
                </a>
              </div>
            </div>
            <div className="p-0 flex flex-col gap-[16px]">
              <span className="font-normal text-[14px] leading-[22px] text-[#0A133999] dark:text-[#cbcbcb]">
                Token Trackers
              </span>
              <div className="flex flex-col gap-[24px] text-text-primary">
                <a
                  href="https://www.coingecko.com/en/coins/landshare"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  Coin Gecko
                </a>
                <a
                  href="https://www.dextools.io/app/en/bnb/pair-explorer/0x13f80c53b837622e899e1ac0021ed3d1775caefa?t=1718065952090"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  DexTools
                </a>
                <a
                  href="https://coinmarketcap.com/currencies/landshare/"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  CoinMarketCap
                </a>
              </div>
            </div>
            <div className="p-0 flex flex-col gap-[16px]">
              <span className="font-normal text-[14px] leading-[22px] text-[#0A133999] dark:text-[#cbcbcb]">
                Exchanges
              </span>
              <div className="flex flex-col gap-[24px] text-text-primary">
                <a
                  href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"
                  target="_blank"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  Pancake Swap
                </a>
                <a
                  href="https://www.gate.io/trade/LAND_USDT"
                  target="_blank"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  Gate.io
                </a>
                <a
                  href="https://www.mexc.com/exchange/LANDSHARE_USDT"
                  target="_blank"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  MEXC
                </a>
                <a
                  href="https://www.bitmart.com/trade/en-US?symbol=LAND_USDT"
                  target="_blank"
                  className="font-normaml text-[14px] leading-[22px]"
                >
                  BitMart
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col basis-[25%] mt-[20px] md:mt-0">
            <div className="w-full flex gap-[10px] mb-[8px]">
              <Image src={IconMailGreen} alt="mail green" />
              <span className="font-bold text-[16px] leading-[24px] text-text-primary">
                Our News Letter
              </span>
            </div>
            <div className="font-normal text-[14px] leading-[22px] text-text-third">
              Get the latest info and enjoy the benefits
            </div>
            <form
              className="flex items-center justify-between gap-[12px] mt-[24px] p-[6px] pl-[24px] w-full md:w-[280px] h-[44px] rounded-[50px] bg-gradient-to-r from-[#fffffff5] to-[#fffffff5] dark:from-[#222222] dark:to-[#222222] bg-[#1D4264]"
              onSubmit={handleSubscribe}
            >
              <input
                name="email"
                type="email"
                className="bg-transparent dark:text-white font-bold text-[14px] leading-[22px] no-underline outline-none color-[#00201C]"
                id="email"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">
                {/* Replace your image tag with the corresponding imported image */}
                <Image
                  src={IconArrowRight}
                  className="w-[32px] h-[32px] bg-[#66CE85] rounded-[30px]"
                  alt="arrow right"
                />
              </button>
            </form>
            {/* <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b28-ft" tabindex="-1" value="" /></div>
          <div class="a-badge">Powered by <a href="https://audienceful.com/?utm_source=form" target="_blank" title="Audienceful - email marketing from the future">Audienceful</a></div> */}
          </div>
        </div>
      </div>
      <div className="font-normal text-[14px] leading-[22px] text-center p-[20px] text-[#141414F5] dark:text-[#dbdbdbf5] bg-button-third">
        © 2024 Landshare LLC. All rights reserved.
      </div>
    </>
  );
}
