import React, { useState } from "react";
import numeral from "numeral";
import ReactLoading from "react-loading";
import Image from "next/image";
import ReactModal from "react-modal";
import {
  ChargeIcon,
  BrickIcon,
  LumberIcon,
  ConcreteIcon,
  SteelIcon,
} from "../../common/icons/nft";
import Button from "../../common/button";
import { OpenModalICon } from "../../common/icons/index";
import { useGlobalContext } from "../../../context/GlobalContext";

interface FireplaceUpgradeProps {
  item: any;
  btnTitle: string;
  colorType: number;
  onPurcharse: Function;
  type?: string;
  durationDate?: number;
  disabled?: boolean;
  isLoading?: any;
}

export default function FireplaceUpgrade({
  item,
  btnTitle,
  colorType,
  onPurcharse,
  type = "yield",
  durationDate = 0,
  disabled = false,
  isLoading,
}: FireplaceUpgradeProps) {
  const [openModal, setOpenModal] = useState(false);
  const [lumberCount, setLumberCount] = useState("10");
  const colors = [
    "border-[2px] border-[#8f8f8f] bg-[#8f8f8f]",
    "border-[2px] border-[#61cd81] bg-[#61cd81]",
    "border-[2px] border-[#f1b258] bg-[#f1b258]",
    "border-[2px] border-[#40bef6] bg-[#40bef6]",
    "border-[2px] border-[#0b6c96] bg-[#0b6c96]",
    "border-[2px] border-[#f9c710] bg-[#f9c710]",
    "border-[2px] border-[#1eceae] bg-[#1eceae]",
  ];
  const { theme } = useGlobalContext();
  const activeIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
  ];
  const disabledIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#283d26"} />
  ]
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "600px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0
    },
    overlay: {
      background: '#00000080'
    }
  };

  return (
    <div className="w-[257px] flex flex-col duration-300 hover:shadow-md mr-[10px] md:mr-[40px] rounded-[20px] overflow-hidden">
      <div className="bg-[#fff]">
        <div className="flex flex-col items-center bg-gradient-to-b from-[#68819D] to-[#4da3a942]">
          <div className="bg-[#00000030] w-full flex justify-center h-[49px] py-[8px]">
            <span className="text-[16px] text-white font-semibold">{item.title}</span>
          </div>
          <div className="flex flex-col w-full h-[210px] relative">
            <Image
              className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] h-[180px] w-auto"
              src={item.imgUrl}
              alt={item.title}
            />
            {durationDate ? (
              <div className="px-[12px] bottom-0 flex w-full justify-between items-end px-3 py-1 absolute">
                <span className="text-[0.8rem] text-white font-semibold">
                  Duration: {durationDate} {colorType == 3 && "left"}
                </span>
                <div onClick={() => setOpenModal(true)}>
                  <OpenModalICon />
                </div>
              </div>
            ) : (
              <div className="px-[12px] bottom-0 flex w-full justify-end px-4 py-1 absolute">
                <div onClick={() => setOpenModal(true)}>
                  <OpenModalICon />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#6f8e9d66] py-[13px] px-[12px]">
          <div className={`flex flex-col w-full h-[130px] rounded-[25px] bg-[#fff] relative bg-primary ${colors[colorType]}`}>
            <div className="flex flex-col px-[10px]">
              <div className="flex justify-start items-center pt-[12px]">
                <span className="text-[#6f8e9d] text-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary">
                  {btnTitle == "BUY" ? "Burn lumber for power: " : "Consume: "}
                </span>
                {btnTitle == "BUY" ? (
                  <span className="flex gap-[2px] items-center font-semibold text-[14px] text-[#323131] dark:text-text-primary">
                    {item.buyReward[2]} {activeIcons[0]} / 1 {activeIcons[1]}
                  </span>
                ) : (
                  <input
                    className="max-w-[50px] border-[1px] border-[#8d8d8d] rounded-[5px] text-right text-[0.8rem] px-[5px]"
                    type="number"
                    value={lumberCount}
                    disabled={btnTitle === "BUY"}
                    onChange={(e) => setLumberCount(e.target.value)}
                  />
                )}
              </div>
              <div className="border-b-[1px] border-[#00000050] w-full my-[8px]"></div>
              <div>
                {btnTitle === "BUY" ? (
                  <div className="flex items-center">
                    <span className="text-[#6f8e9d] text-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary">Cost: </span>
                    <span className="dark:text-text-primary">
                      {item.buy.slice(2, 7).map((cost: number, index: number) => {
                        if (Number(cost) > 0)
                          return (
                            <div
                              key={`next-cost-${index}`}
                              className="min-w-[20px] font-semibold flex gap-[2px] items-center text-[14px] font-medium"
                            >
                              {colorType == 0 ? (
                                <>
                                  {`${cost} `}
                                  {disabledIcons[index]}
                                </>
                              ) : (
                                <>
                                  {`${cost} `}
                                  {activeIcons[index]}
                                </>
                              )}
                            </div>
                          );
                      })}
                      {item.buy.slice(2, 7).map((cost: number, index: number) => {
                        if (Number(cost) <= 0)
                          return (
                            <div
                              key={`next-empty-${index}`}
                              className="min-w-[20px]"
                            ></div>
                          );
                      })}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-[#6f8e9d] text-semibold text-[10px] ml-[4px] pr-[2px] text-text-secondary">Receive: </span>
                    <span className="flex gap-[2px] items-center font-semibold text-[14px] text-[#323131] text-text-primary">
                      {numeral(
                        (Number(lumberCount) * item.buyReward[2])
                      ).format("0.[00]")}{" "}
                      {activeIcons[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => onPurcharse(lumberCount)}
              className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute rounded-[20px] text-button-text-secondary ${((isLoading.type > -1) && (isLoading.type != type)) ? 'grey' : colors[colorType]} 
              ${isLoading.type == item.id && isLoading.loading
                  ? "flex justify-center items-center"
                  : ""
                }`}
              disabled={
                disabled || (isLoading.type == item.id && isLoading.loading) || ((isLoading.type > -1) && (isLoading.type != type))
              }
            >
              {isLoading.type == item.id && isLoading.loading ? (
                <div className='flex justify-center items-center'>
                  <ReactLoading
                    type="spin"
                    className="me-2 mb-[4px]"
                    width="24px"
                    height="24px"
                  />
                  <span className="font-semibold">Loading</span>
                </div>
              ) : (
                <span className="font-semibold">{btnTitle}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={openModal}
        onRequestClose={() => { setOpenModal(!openModal), document.body.classList.remove('modal-open'); }}
        style={customModalStyles}
      >
        <div className="flex min-h-full justify-center items-center">
          <span className="my-2 mx-3 pt-1 text-[14px] font-normal">{`Burn lumber for power with the Firepit upgrade. Each lumber generates ${Number(item.buyReward[2])
            } power.`}</span>
        </div>
      </ReactModal>
    </div>
  );
};
