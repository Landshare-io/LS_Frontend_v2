import React, { useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import ReactModal from "react-modal";
import {
  ChargeIcon,
  BrickIcon,
  LumberIcon,
  ConcreteIcon,
  SteelIcon,
} from "../../common/icons/nft";
import Badge from "../../common/badge";
import FacilityContent from "./facility-content";
import { OpenModalIcon } from "../../common/icons/index";
import { useTheme } from "next-themes";
import useGetUserData from "../../../hooks/nft-game/axios/useGetUserData";
import useHandleFacilities from "../../../hooks/nft-game/axios/useHandleFacilities";
import windfarm1 from "../../../../public/img/production-facilities/windfarm1.webp";
import windfarm2 from "../../../../public/img/production-facilities/windfarm2.webp";
import windfarm3 from "../../../../public/img/production-facilities/windfarm3.webp";
import windfarm4 from "../../../../public/img/production-facilities/windfarm4.webp";
import windfarm5 from "../../../../public/img/production-facilities/windfarm5.webp";
import brick1 from "../../../../public/img/production-facilities/brick1.png";
import brick2 from "../../../../public/img/production-facilities/brick2.webp";
import brick3 from "../../../../public/img/production-facilities/brick3.webp";
import brick4 from "../../../../public/img/production-facilities/brick4.webp";
import brick5 from "../../../../public/img/production-facilities/brick5.webp";
import concrete1 from "../../../../public/img/production-facilities/concrete1.webp";
import concrete2 from "../../../../public/img/production-facilities/concrete2.webp";
import concrete3 from "../../../../public/img/production-facilities/concrete3.webp";
import concrete4 from "../../../../public/img/production-facilities/concrete4.webp";
import concrete5 from "../../../../public/img/production-facilities/concrete5.webp";
import lumber1 from "../../../../public/img/production-facilities/lumber1.webp";
import lumber2 from "../../../../public/img/production-facilities/lumber2.webp";
import lumber3 from "../../../../public/img/production-facilities/lumber3.webp";
import lumber4 from "../../../../public/img/production-facilities/lumber4.webp";
import lumber5 from "../../../../public/img/production-facilities/lumber5.webp";
import steel1 from "../../../../public/img/production-facilities/steel1.webp";
import steel2 from "../../../../public/img/production-facilities/steel2.webp";
import steel3 from "../../../../public/img/production-facilities/steel3.webp";
import steel4 from "../../../../public/img/production-facilities/steel4.webp";
import steel5 from "../../../../public/img/production-facilities/steel5.webp";
import BoostImg from "../../../../public/icons/boost.png";

interface FacilityProps {
  type: number;
  isBoosts?: boolean;
}

export default function Facility({
  type,
  isBoosts = false
}: FacilityProps) {
  const { address } = useAccount();
  const { theme } = useTheme();
  const { facilities } = useGetUserData()
  const [isLoading, setIsLoading] = useState({
    type: -1, loading: false
  });
  const { buyOrUpgradeFacility } = useHandleFacilities(address, setIsLoading)
  const [openModal, setOpenModal] = useState(false);

  if (facilities.length < 1) return null
  
  const icons: Record<any, any> = {
    "Wind Farm": <ChargeIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
    "Lumber Mill": <LumberIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
    "Brick Factory": <BrickIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
    "Concrete Plant": <ConcreteIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
    "Steel Mill": <SteelIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
  };
  const modalIcons: Record<any, any> = {
    "Wind Farm": <ChargeIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
    "Lumber Mill": <LumberIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
    "Brick Factory": <BrickIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
    "Concrete Plant": <ConcreteIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
    "Steel Mill": <SteelIcon className="" iconColor={theme == 'dark' ? "#e4e4e4" : "#161616"} />,
  };
  const facilityImages: Record<any, any> = {
    "Wind Farm": [windfarm1, windfarm1, windfarm1, windfarm1, windfarm1, windfarm2, windfarm2, windfarm2, windfarm2, windfarm2, windfarm3, windfarm3, windfarm3, windfarm3, windfarm3, windfarm4, windfarm4, windfarm4, windfarm4, windfarm4, windfarm5, windfarm5, windfarm5, windfarm5, windfarm5],
    "Lumber Mill": [lumber1, lumber1, lumber1, lumber1, lumber1, lumber2, lumber2, lumber2, lumber2, lumber2, lumber3, lumber3, lumber3, lumber3, lumber3, lumber4, lumber4, lumber4, lumber4, lumber4, lumber5, lumber5, lumber5, lumber5, lumber5],
    "Brick Factory": [brick1, brick1, brick1, brick1, brick1, brick2, brick2, brick2, brick2, brick2, brick3, brick3, brick3, brick3, brick3, brick4, brick4, brick4, brick4, brick4, brick5, brick5, brick5, brick5, brick5],
    "Concrete Plant": [concrete1, concrete1, concrete1, concrete1, concrete1, concrete2, concrete2, concrete2, concrete2, concrete2, concrete3, concrete3, concrete3, concrete3, concrete3, concrete4, concrete4, concrete4, concrete4, concrete4, concrete5, concrete5, concrete5, concrete5, concrete5],
    "Steel Mill": [steel1, steel1, steel1, steel1, steel1, steel2, steel2, steel2, steel2, steel2, steel3, steel3, steel3, steel3, steel3, steel4, steel4, steel4, steel4, steel4, steel5, steel5, steel5, steel5, steel5],
  };

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "400px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0,
      backgroundColor: theme == "dark" ? "#31333b" : "#f6f7f9",
    },
    overlay: {
      background: '#00000080'
    }
  };

  const description = (
    <div className="flex flex-col gap-[3px] py-[10px]">
      <p>
        The {facilities[type].currentFacility?.name || facilities[type].nextFacility?.name} {facilities[type].currentFacility?.name || facilities[type].nextFacility?.name == "Wind Farm" && "automatically"} produces{" "}
        {facilities[type].currentFacility?.name || facilities[type].nextFacility?.name == "Wind Farm" ? "Power" : facilities[type].currentFacility?.name || facilities[type].nextFacility?.name.split(/(\s+)/)[0]} over time.
      </p>
      <p className="flex items-end gap-[1px]">
        <b>Current {facilities[type].currentFacility?.name || facilities[type].nextFacility?.name} LVL {facilities[type].currentFacility?.level ?? 0}:</b>{" "}
        {facilities[type].currentFacility?.buyReward[2 + type] ?? 0} {modalIcons[facilities[type].currentFacility?.name || facilities[type].nextFacility?.name]}/day
      </p>
      <p className="flex items-end gap-[1px]">
        <b>Next {facilities[type].currentFacility?.name || facilities[type].nextFacility?.name} LVL {facilities[type].nextFacility?.level ?? facilities[type].maxLevel}:</b>{" "}
        {facilities[type].nextFacility?.buyReward[2 + type] ?? 0} {modalIcons[facilities[type].currentFacility?.name || facilities[type].nextFacility?.name]}/day
      </p>
      <p>
        <b>{(facilities[type].currentFacility?.level ?? 0) > facilities[type].maxLevel && `We set your ${facilities[type].currentFacility?.name || facilities[type].nextFacility?.name} level as a max level cause of you have not got enough activated houses.`}</b>
      </p>
    </div>
  );

  return (
    <>
      <div className="m-auto flex flex-col max-w-[300px] overflow-hidden rounded-[15px] animate-[fadeIn] duration-300">
        <div className="flex items-center justify-between py-[11px] px-[16px] bg-[#162246]">
          <span className="text-[16px] font-semibold leading-[24px] text-[#ffffff]">{facilities[type].currentFacility?.name || facilities[type].nextFacility?.name}</span>
          {facilities[type].currentFacility?.level ? (
            facilities[type].currentFacility?.level > facilities[type].maxLevel ? (
              <Badge label1="LVL" label2={facilities[type].maxLevel} className="bg-[#fff]" />
            ) : (
              <Badge label1="LVL" label2={facilities[type].currentFacility?.level} className="bg-[#fff]" />
            )
          ) : (
            <Badge label1="" label2="" className="" />
          )}
        </div>
        <div className='w-full h-[300px] bg-gradient-to-b from-[#9E9E9E] to-[#c3c3c300] relative'>
          {isBoosts && (
            <Image src={BoostImg} alt={facilities[type].currentFacility?.name || facilities[type].nextFacility?.name} className="absolute top-[12px] left-[12px]" />
          )}
          <Image
            src={(facilities[type].currentFacility?.level ?? 0) == 0 ?
              facilityImages[facilities[type].currentFacility?.name || facilities[type].nextFacility?.name][0] :
              ((facilities[type].currentFacility?.level ?? 0) > 24 ?
                facilityImages[facilities[type].currentFacility?.name || facilities[type].nextFacility?.name][24] :
                facilityImages[facilities[type].currentFacility?.name || facilities[type].nextFacility?.name][(facilities[type].currentFacility?.level ?? 0) - 1])}
            alt={facilities[type].currentFacility?.name || facilities[type].nextFacility?.name}
            className="translate-x-[-50%] w-[280px] h-[280px] left-[50%] top-0 absolute"
          />
          <div className="flex absolute items-end w-full justify-between px-3 bottom-[5px]">
            {facilities[type].currentFacility ? (
              <div className="flex items-end bottom-0">
                <span className={`font-semibold text-[12px] leading-[18px] text-[#000000] opacity-50 mr-2 ${theme == 'dark' ? "text-[#ffffff]" : "text-[#000000]"}`}>Current Yield: </span>
                <div className="flex items-center">
                  {icons[facilities[type].currentFacility?.name || facilities[type].nextFacility?.name]}
                  <span className={`leading-[24px] ml-1 text-[16px] font-semibold ${theme == 'dark' ? "text-[#e6e6e6]" : "text-[#161616]"}`}>{facilities[type].currentFacility.buyReward[2 + type]} </span>
                  <span className={`ml-1 text-[16px] font-semibold ${theme == 'dark' ? "text-[#e6e6e6]" : "text-[#161616]"}`}>/day</span>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div className="facility-svg">
              <div onClick={() => setOpenModal(true)}>
                <OpenModalIcon />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-secondary">
          <div className={`flex px-[17px] py-[20px] ${theme == 'dark' ? "bg-[#5c727e66]" : "bg-[#6f8e9d66]"}`}>
            <FacilityContent
              type={type}
              nextLevel={facilities[type].nextFacility?.level ?? facilities[type].maxLevel}
              maxLevel={facilities[type].maxLevel}
              color={(facilities[type].maxLevel > 0) ? ((facilities[type].currentFacility?.level ?? 0) > 0 ? (facilities[type].currentFacility?.level == facilities[type].maxLevel ? "bg-[#1eceae] border-[2px] border-[#1eceae]" : "bg-[#ec9821] border-[2px] border-[#ec9821]") : "bg-[#61cd81] border-[2px] border-[#61cd81]") : 'bg-[#8f8f8f] border-[2px] border-[#8f8f8f] hover:bg-transparent hover:text-[#8f8f8f]'}
              upgradeFacility={() => buyOrUpgradeFacility(type)}
              isLoading={isLoading}
              activated={facilities[type].maxLevel > 0}
              nextLevelInfo={facilities[type].nextFacility}
            />
          </div>
        </div>
      </div>
      <div className="text-center w-full">
        {facilities[type].currentFacility?.level ? (
          facilities[type].currentFacility?.level > facilities[type].maxLevel ? (
            <span className="mt-[9px] text-[#8f8f8f] text-[18px] font-semibold">
              {`You own ${facilities[type].currentFacility?.name || facilities[type].nextFacility?.name} `}
              <b className={theme == 'dark' ? "text-[#ffffff]" : "text-[#000000]"}>Level {Number(facilities[type].maxLevel ?? 0)}</b>
            </span>
          ) : (
            <span className="mt-[9px] text-[#8f8f8f] text-[18px] font-semibold">
              {`You own ${facilities[type].currentFacility?.name || facilities[type].nextFacility?.name} `}
              <b className={theme == 'dark' ? "text-[#ffffff]" : "text-[#000000]"}>Level {Number(facilities[type].currentFacility?.level ?? 0)}</b>
            </span>
          )
        ) : (
          <span className="mt-[9px] text-[#8f8f8f] text-[18px] font-semibold">
            {`You do not own any ${facilities[type].currentFacility?.name || facilities[type].nextFacility?.name}`}
          </span>
        )}
      </div>
      {description && (
        <ReactModal
          isOpen={openModal}
          onRequestClose={() => { setOpenModal(!openModal), document.body.classList.remove('modal-open'); }}
          style={customModalStyles}
        >
          <div className="flex min-h-full justify-center items-center dark:bg-[#3c3c3c] dark:text-white">
            <span className="my-2 mx-3 text-[14px]">{description}</span>
          </div>
        </ReactModal>
      )}
    </>
  );
};
