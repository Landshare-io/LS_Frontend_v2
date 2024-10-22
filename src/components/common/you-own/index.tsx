import React, { useState, useEffect } from "react";
import numeral from "numeral";
import { useHistory } from "react-router-dom";
import {
  LogoIcon,
  EnergyIcon,
  Lumber,
  Brick,
  Concrete,
  Steel,
  Credit
} from "./NftIcon";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { ethers } from "ethers";
import { useMediaQuery } from "react-responsive"
import "./YouOwn.css"
import LandshareLogo_Dark from "../../assets/img/new/logo-dark.svg"
import SwitchTheme from "../../components/Footer/SwitchTheme";

export default function YouOwn(){
  const { isDarkMode, setIsDarkMode } = useGlobalContext();
  const [show, setShow] = useState(false)
  const [youOwnShow, setYouOwnShow] = useState(false)
  const {
    signer,
    userResource,
    updateUserResources,
    nftCredits
  } = useGlobalContext();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  if (!userResource.resource) return null;
  let history = useHistory();

  useEffect(() => {
    if (!signer) return

    const intervalUpdateUserResource = setInterval(() => updateUserResources(), 60000) // One minute

    return () => clearInterval(intervalUpdateUserResource)
  }, [signer])
  const styleObject = {
    minWidth: "180px"
  };

  useEffect(() => {
    setYouOwnShow(isMobile ? show : true)
  }, [show, isMobile])

  return (
    <section className="bottom-[73px] md:bottom-0 bg-[#bce4fa] duration-500 sticky z-[999] opacity-90 shadow-lg py-3 dark:bg-third">
      <div className="flex justify-center">
        <div className="max-w-[1200px] w-[98%] sm:w-[90%] md:w-full">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex justify-between w-full">
              <span
                style={styleObject}
                className={`mb-2 inline-block font-semibold ${show ? "text-left" : "text-center"} text-text-secondary pr-10 md:pr-0`}
              >
                You own:
              </span>
              {isMobile && (
                <span className="cursor-pointer" onClick={() => setShow(!show)}>
                  {show ? (
                    <MdKeyboardArrowDown className="text-grey-800" />
                  ) : (
                    <MdKeyboardArrowUp className="text-grey-800" />
                  )}
                </span>
              )}
            </div>
            {youOwnShow && (
              <div className="mobile-youown">
                <div className="d-flex align-items-center">
                  <div className="w-8 h-8">
                    {isDarkMode ? <img src={LandshareLogo_Dark}></img> : <LogoIcon />}
                  </div>
                  <span
                    style={{ minWidth: "133px" }}
                    className="d-inline-block ps-2 pe-3 fw-bold fs-sm text-text-primary"
                  >
                    {userResource.landTokenBalance > 999999999999
                      ? numeral(
                        ethers.utils.formatEther(userResource.landTokenBalance.toString())
                      )
                        .format("0.[00]")
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : "0"}{" "}
                    <span className="fs-xs text-text-primary">LAND</span>
                  </span>
                  <span
                    className="cursor-pointer btn-buy-resources dark:bg-primary dark:text-text-primary"
                    onClick={() => history.push("/nft/resources")}
                  >
                    +
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <Lumber />
                  <span className="d-inline-block ps-2 pe-3 fw-bold fs-sm text-text-primary">
                    {numeral(userResource.resource[1]).format("0.[00]")}
                    <span className="fs-xs text-text-primary"> Lumber</span>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <Concrete />
                  <span className="d-inline-block ps-2 pe-3 fw-bold fs-sm text-text-primary">
                    {numeral(userResource.resource[3]).format("0.[00]")}
                    <span className="fs-xs text-text-primary"> Concrete</span>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="">
                    <Steel />
                  </span>
                  <span className="d-inline-block ps-2 pe-3 fw-bold fs-sm text-text-primary">
                    {numeral(userResource.resource[4]).format("0.[00]")}
                    <span className="fs-xs text-text-primary"> Steel</span>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="">
                    <EnergyIcon />
                  </span>
                  <span
                    style={{ minWidth: "133px" }}
                    className="d-inline-block ps-2 pe-3 fw-bold fs-sm text-text-primary"
                  >
                    {numeral(userResource.resource[0]).format("0.[00]")} / {userResource.maxPowerLimit}
                    <span className="fs-xs text-text-primary"> Power</span>
                  </span>
                  <span
                    className="cursor-pointer btn-buy-resources dark:bg-primary dark:text-text-primary"
                    onClick={() => history.push("/nft/resources")}
                  >
                    +
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="">
                    <Brick />
                  </span>
                  <span className="d-inline-block ps-2 pe-3 fw-bold fs-sm text-text-primary">
                    {numeral(userResource.resource[2]).format("0.[00]")}
                    <span className="fs-xs text-text-primary"> Brick</span>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <Credit />
                  <span className="d-inline-block ps-2 pe-3 fw-bold fs-sm text-text-primary">
                  {numeral(Number(nftCredits)).format("0.[00]")}
                    <span className="fs-xs text-text-primary"> Credits</span>
                  </span>
                </div>
               <SwitchTheme isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> 
              </div>

            )}
          </div>
        </div>
      </div>
    </section>
  );
};
