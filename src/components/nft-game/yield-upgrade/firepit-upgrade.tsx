import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Image from "next/image";
import ReactLoading from "react-loading";
import numeral from "numeral";
import Tooltip from "../../common/tooltip";
import Button from "../../common/button";
import {
  ChargeIcon,
  BrickIcon,
  LumberIcon,
  ConcreteIcon,
  SteelIcon,
} from "../../common/icons/nft";
import { OpenModalICon } from "../../common/icons/index";
import {
  getItemDurationWithDeadTime,
  validateItemDateWithDeadTime
} from "../../../utils/helpers/validator";
import useGetSetting from "../../../hooks/nft-game/axios/useGetSetting";
import { useGlobalContext } from "../../../context/GlobalContext";

interface FirepitUpgradeProps {
  item: any;
  btnTitle: string;
  colorType: number;
  onPurcharse: Function;
  type: string;
  disabled: boolean;
  isLoading: any;
  salvageItem: Function;
}

export default function FirepitUpgrade({
  item,
  btnTitle,
  colorType,
  onPurcharse,
  type = "yield",
  disabled = false,
  isLoading,
  salvageItem
}: FirepitUpgradeProps) {
  const { theme } = useGlobalContext();
  const { oneDayTime } = useGetSetting()
  const durationDate = getItemDurationWithDeadTime(item, oneDayTime) > 0 ? getItemDurationWithDeadTime(item, oneDayTime) : 0
  const havingItem = validateItemDateWithDeadTime(item)
  const [openModal, setOpenModal] = useState(false);
  const [maxLumberLimit, setMaxLumberLimit] = useState(
    (10 - Number(Math.ceil(durationDate))).toString()
  );
  const [lumberCount, setLumberCount] = useState(
    (10 - Number(Math.ceil(durationDate))).toString()
  );
  const colors = [
    "border-[2px] border-[#8f8f8f] bg-[#8f8f8f] disabled:!bg-[#8f8f8f]",
    "border-[2px] border-[#61cd81] bg-[#61cd81] disabled:!bg-[#61cd81]",
    "border-[2px] border-[#f1b258] bg-[#f1b258] disabled:!bg-[#f1b258]",
    "border-[2px] border-[#40bef6] bg-[#40bef6] disabled:!bg-[#40bef6]",
    "border-[2px] border-[#0b6c96] bg-[#0b6c96] disabled:!bg-[#0b6c96]",
    "border-[2px] border-[#f9c710] bg-[#f9c710] disabled:!bg-[#f9c710]",
    "border-[2px] border-[#1eceae] bg-[#1eceae] disabled:!bg-[#1eceae]",
  ];
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

  useEffect(() => {
    setMaxLumberLimit((item.buy[10] - Number(Math.ceil(durationDate))).toString());
    setLumberCount((item.buy[10] - Number(Math.ceil(durationDate))).toString());
  }, [durationDate]);

  const activeIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
  ];
  const disabledIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />
  ]
  const durationDateNode =
    Number(durationDate) > 1 ? (
      <>
        <span className={`text-[0.9rem] text-white font-semibold ${type}`}>
          {numeral(Number(durationDate)).format("0.[00]")}
        </span>{" "}
        days
      </>
    ) : Number(durationDate) === 1 ? (
      <>
        <span className={`text-[0.9rem] text-white font-semibold ${type}`}>
          {numeral(Number(durationDate)).format("0.[00]")}
        </span>{" "}
        day
      </>
    ) : (
      <span className={`text-[0.9rem] text-white font-semibold ${type}`}>less than 1 day</span>
    );

  return (
    <div className='w-[257px] flex flex-col duration-300 hover:shadow-md mr-[20px] md:mr-0 rounded-[20px] overflow-hidden'>
      <div className='bg-[#fff] dark:bg-inherit'>
        <div className='flex flex-col items-center bg-gradient-to-b from-[#689D77] to-[#3a9c5652] dark:from-[#68819D] dark:to-[#4da3a942]'>
          <div className='bg-[#00000030] w-full flex justify-center h-[49px] py-[8px]'>
            <span className='text-[16px] text-white font-semibold'>
              {item.name}
            </span>
          </div>
          <div className='flex flex-col w-full h-[260px] relative'>
            <Image
              className="m-auto"
              src={item.imgUrl}
              alt={item.name}
              width={180}
              height={180}
              draggable={false}
            />
            {Number(durationDate) ? (
              <div className='bottom-0 flex w-full justify-between items-end px-3 py-1 absolute'>
                <span className='text-[0.8rem] text-white font-semibold'>
                  Duration: {durationDateNode}{' '}
                  {(btnTitle != 'BUY' && Number(lumberCount) == 0
                    ? 3
                    : colorType) == 3 && 'left'}
                </span>
                <div>
                  {durationDate == 0 && (
                    <Tooltip content='No lumber loaded. Multiplier not active.'>
                      <div>
                        <svg
                          version='1.2'
                          baseProfile='tiny'
                          xmlns='http://www.w3.org/2000/svg'
                          x='0px'
                          y='0px'
                          width='26px'
                          height='26px'
                          viewBox='0 0 20 16'
                          className='cursor-pointer absolute bottom-[5px] right-[5px]'
                        >
                          <path
                            fill='#D61F33'
                            opacity='0.7'
                            d='M10,0L0,16h20L10,0z M11,13.908H9v-2h2V13.908z M9,10.908v-6h2v6H9z'
                          />
                        </svg>
                      </div>
                    </Tooltip>
                  )}
                  <div onClick={() => setOpenModal(true)}>
                    <OpenModalICon />
                  </div>
                </div>
              </div>
            ) : (
              <div className='bottom-0 flex w-full justify-end items-end px-3 py-1 absolute'>
                {btnTitle == 'SALVAGE' && durationDate == 0 && (
                  <Tooltip content='No lumber loaded. Multiplier not active.'>
                    <div>
                      <svg
                        version='1.2'
                        baseProfile='tiny'
                        xmlns='http://www.w3.org/2000/svg'
                        x='0px'
                        y='0px'
                        width='26px'
                        height='26px'
                        viewBox='0 0 20 16'
                        className='cursor-pointer absolute bottom-[5px] right-[5px]'
                      >
                        <path
                          fill='#D61F33'
                          opacity='0.7'
                          d='M10,0L0,16h20L10,0z M11,13.908H9v-2h2V13.908z M9,10.908v-6h2v6H9z'
                        />
                      </svg>
                    </div>
                  </Tooltip>
                )}
                <div onClick={() => setOpenModal(true)}>
                  <OpenModalICon />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='bg-[#6f8e9d66] py-[13px] px-[12px]'>
          <div
            className={`flex flex-col w-full h-[130px] rounded-[25px] bg-[#fff] relative bg-primary pt-[12px] ${colors[
              btnTitle != 'BUY' && Number(lumberCount) == 0 ? 3 : colorType
              ]
              }`}
          >
            <div className='flex flex-col px-[10px]'>
              <div className='flex items-center'>
                <span className='text-[#6f8e9d] text-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>
                  {btnTitle == 'BUY' ? 'Yield: ' : 'Load:  '}
                </span>
                <div className='status-value'>
                  {btnTitle == 'BUY' ? (
                    <>
                      <span className='font-semibold text-[12px] text-[#323131] mr-[4px] dark:text-text-primary'>
                        +{item.buyReward[9]}
                      </span>
                      <span className='text-[8px] font-semibold dark:text-text-secondary'>
                        {' '}
                        LAND
                      </span>
                      <span className='text-[9px] font-semibold leading-[18px] text-[#323131] ml-[2px] grey dark:text-text-secondary'>
                        {' '}
                        /year
                      </span>
                    </>
                  ) : (
                    <div className='flex items-center justify-between'>
                      <div>
                        <input
                          className='max-w-[50px] border-[1px] border-[#8d8d8d] dark:bg-[#49545b] dark:text-white rounded-[5px] text-right text-[0.8rem] px-[5px] mr-1'
                          type='number'
                          step='1'
                          max={maxLumberLimit}
                          value={lumberCount}
                          disabled={btnTitle === 'BUY'}
                          onChange={(e) => setLumberCount(e.target.value)}
                        />
                      </div>
                      <div className='flex justify-start items-center'>
                        <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] me-1 dark:text-text-secondary'>
                          Remain:
                        </span>
                        <div className='flex gap-[2px] items-center min-w-[20px] mt-1 text-[14px] font-normal dark:text-text-primary'>
                          {`${numeral(Number(durationDate)).format('0.[00]')} `}
                          {activeIcons[1]}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='border-b-[1px] border-[#00000050] w-full my-[8px]'></div>
              <div>
                {btnTitle === 'BUY' && (
                  <div className='flex items-center'>
                    <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>
                      Cost:{' '}
                    </span>
                    <div className='status-value w-full'>
                      <div className='flex justify-between'>
                        {item.buy
                          .slice(2, 7)
                          .map((cost: number, index: number) => {
                            if (Number(cost) > 0)
                              return (
                                <div
                                  key={`next-cost-${index}`}
                                  className='min-w-[20px] mt-1 text-[14px] font-normal dark:text-text-primary'
                                >
                                  {colorType == 0 ? (
                                    <div className='flex gap-[2px] items-center'>
                                      {`${cost} `}
                                      {disabledIcons[index]}
                                    </div>
                                  ) : (
                                    <div className='flex gap-[2px] items-center'>
                                      {`${cost} `}
                                      {activeIcons[index]}
                                    </div>
                                  )}
                                </div>
                              );
                          })}
                        {item.buy
                          .slice(2, 7)
                          .map((cost: number, index: number) => {
                            if (Number(cost) <= 0)
                              return (
                                <div
                                  key={`next-empty-${index}`}
                                  className='min-w-[20px] mt-1 text-[14px] font-normal'
                                ></div>
                              );
                          })}
                      </div>
                    </div>
                  </div>
                )}
                {btnTitle != 'BUY' && Number(lumberCount) == 0 && (
                  <div className='flex items-center'>
                    <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>
                      Cost:{' '}
                    </span>
                    <span className='status-value'>
                      {item.sell
                        .slice(2, 7)
                        .map((cost: number, index: number) => {
                          if (Number(cost) > 0)
                            return (
                              <div
                                key={`next-cost-${index}`}
                                className={`min-w-[20px] text-[14px] font-normal dark:text-text-primary`} // ${colors[(btnTitle != "BUY" && Number(lumberCount) == 0) ? 3 : colorType]}
                              >
                                {(btnTitle != 'BUY' && Number(lumberCount) == 0
                                  ? 3
                                  : colorType) == 0 ? (
                                  <div className='flex gap-[2px] items-center'>
                                    {`${cost} `}
                                    {disabledIcons[index]}
                                  </div>
                                ) : (
                                  <div className='flex gap-[2px] items-center'>
                                    {`${cost} `}
                                    {activeIcons[index]}
                                  </div>
                                )}
                              </div>
                            );
                        })}
                      {item.sell
                        .slice(2, 7)
                        .map((cost: number, index: number) => {
                          if (Number(cost) <= 0)
                            return (
                              <div
                                key={`next-empty-${index}`}
                                className='min-w-[20px]'
                              ></div>
                            );
                        })}
                    </span>
                  </div>
                )}
                {btnTitle != 'BUY' && Number(lumberCount) > 0 && (
                  <div className='flex justify-start items-center'>
                    <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] mr-1'>
                      Cost:
                    </span>
                    <div className='flex gap-[2px] items-center min-w-[20px] text-text-secondary mt-1 text-[14px] font-normal'>
                      {`${numeral(Number(lumberCount)).format('0.[00]')} `}
                      {activeIcons[1]}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => {
                if (btnTitle != 'BUY' && Number(lumberCount) == 0) {
                  salvageItem();
                } else {
                  onPurcharse(btnTitle != 'BUY' ? Number(lumberCount) : 0);
                }
              }}
              className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute text-button-text-secondary rounded-[20px]
              ${isLoading.type > -1 && isLoading.type != item.id
                  ? 'grey'
                  : colors[
                  btnTitle != 'BUY' && Number(lumberCount) == 0
                    ? 3
                    : colorType
                  ]
                }
              ${isLoading.type == item.id && isLoading.loading
                  ? 'd-flex justify-content-center align-items-center'
                  : ''
                }`}
              disabled={
                disabled ||
                (isLoading.type == item.id && isLoading.loading) ||
                (isLoading.type > -1 && isLoading.type != type)
              }
            >
              {isLoading.type == item.id && isLoading.loading ? (
                <div className='flex justify-center items-center'>
                  <ReactLoading
                    type='spin'
                    className='mr-2 mb-[4px]'
                    width='24px'
                    height='24px'
                  />
                  <span className='font-semibold'>Loading</span>
                </div>
              ) : (
                <span className='font-semibold text-button-text-secondary'>
                  {Number(lumberCount) == 0
                    ? 'SALVAGE'
                    : havingItem == -1
                      ? 'BUY'
                      : 'LOAD'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal),
            document.body.classList.remove('modal-open');
        }}
        style={customModalStyles}
        className='outline-none'
        overlayClassName='fixed m-auto inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm'
      >
        <div className='relative bg-white dark:bg-[#2e3740] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-xs w-full m-auto'>
          <button
            onClick={() => setOpenModal(false)}
            className='absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white transition-colors duration-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700'
            aria-label='Close'
          >
            ✕
          </button>
          <p className='text-sm text-gray-700 dark:text-gray-200 text-center leading-relaxed mt-2'>
            <span className='my-2 mx-3 text-[14px] pt-1 font-normal'>{`Add an outdoor fireplace to your property, increasing yields by x${item.buyReward[9]}. Must load lumber to activate yield multiplier, with 1 lumber being burned per day. Up to 10 lumber can be loaded at one time.`}</span>
          </p>
        </div>
      </ReactModal>
    </div>
  );
};
