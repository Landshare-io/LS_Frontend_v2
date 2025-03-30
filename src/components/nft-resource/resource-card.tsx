import React, { useState } from "react";
import ReactModal from "react-modal";
import Image from "next/image";
import { InfoIcon } from "../common/icons/index";
import styles from "./resource-card.module.css"

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
    maxWidth: "400px",
    width: "fit-content",
    height: "fit-content",
    borderRadius: "20px",
    padding: 0,
    border: 0
  },
  overlay: {
    background: '#00000080'
  }
};

interface ResourceCardProps {
  children?: React.ReactNode;
  title: string;
  subTitle: string;
  imgSrc?: any;
  cost: {
    value: string;
    description: string;
  };
  cardClassName?: string;
}

export default function ResourceCard({
  children,
  title,
  subTitle,
  imgSrc,
  cost,
  cardClassName
}: ResourceCardProps) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex flex-col duration-300 hover:shadow-lg animate-[fadeIn] w-[251px] rounded-[10px] overflow-hidden m-[20px]">
      <div className={`flex flex-col h-[251px] ${cardClassName}`}>
        <div className="text-[16px] font-semibold text-white bg-[#00000033] rounded-top-[10px] text-center py-2">
          {title}
        </div>
        <div className="flex flex-col itmes-center relative h-full">
          <span className="text-[14px] font-semibold text-white text-center mt-2">
            {subTitle}
          </span>
          <Image src={imgSrc} alt="resource-img" className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]" />
          <div className={`flex w-full bottom-[10px] px-2 absolute ${title=="Gather Lumber" ? 'justify-between' : 'justify-center'}`}>
            {title=="Gather Lumber" && (
              <div className="w-[20px]"></div>
            )}
            <div>
              <span className="text-[14px] font-semibold mr-1">{cost.value}</span>
              <span className="text-[12px] font-semibold">{cost.description}</span>
            </div>
            {title=="Gather Lumber" && (
              <div className={`flex items-center ${styles.infoIcon}`} onClick={() => setOpenModal(true)}>
                <InfoIcon />
              </div>
            )}
          </div>
        </div>
      </div>
      {children}
      <ReactModal
        style={customModalStyles}
        isOpen={openModal}
        onRequestClose={() => { setOpenModal(!openModal), document.body.classList.remove('modal-open'); }}
      >
        <div className="flex min-h-fit justify-center items-center bg-primary">
          <span className="my-2 mx-3 text-[14px] text-text-primary">{`Gather lumber from nearby woods. Costs 15 power per Lumber and can gather 2 per day, or 3 with the Trees upgrade.`}</span>
        </div>
      </ReactModal>
    </div>
  );
};
