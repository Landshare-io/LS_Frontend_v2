import React, { useState } from "react";
import ReactLoading from "react-loading";
import ReactModal from "react-modal";
import Image from "next/image";
import Button from "../../common/button";
import { OpenModalICon } from "../../common/icons/index";
import useGetSetting from "../../../hooks/nft-game/axios/useGetSetting";

interface HireHandymanUpgradeProps {
  item: any;
  btnTitle: string;
  colorType: number;
  onPurcharse: Function;
  type?: string;
  duration?: number;
  disabled?: boolean;
  houseDurability?: number;
  houseMaxDurability?: number;
  isLoading?: any;
}

export default function HireHandymanUpgrade({
  item,
  btnTitle,
  colorType,
  onPurcharse,
  type = "yield",
  duration = 0,
  disabled = false,
  houseDurability = 0,
  houseMaxDurability = 100,
  isLoading,
}: HireHandymanUpgradeProps) {
  const { oneDayTime } = useGetSetting();
  const [openModal, setOpenModal] = useState(false);
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

  let durationNode = null;
  if (duration > 0) {
    const durationDate = Math.floor(
      Number(duration) / oneDayTime
    );

    durationNode =
      durationDate > 1 ? (
        <>
          <span className={`duration-date ${type}`}>
            Cooldown: {durationDate}
          </span>{" "}
          days
        </>
      ) : durationDate === 1 ? (
        <>
          <span className={`duration-date ${type}`}>
            Cooldown: {durationDate}
          </span>{" "}
          day
        </>
      ) : (
        <span className={`duration-date ${type}`}>
          Cooldown: less than 1 day
        </span>
      );
  }

  return (
		<div className='w-[257px] flex flex-col duration-300 hover:shadow-md mr-[10px] md:mr-[40px] rounded-[20px] overflow-hidden'>
			<div className='bg-[#fff] dark:bg-inherit'>
				<div className='flex flex-col items-center bg-gradient-to-b from-[#68819D] to-[#4da3a942]'>
					<div className='bg-[#00000030] w-full flex justify-center h-[49px] py-[8px]'>
						<span className='text-lg tracking-wide text-white font-semibold'>
							{item.title}
						</span>
					</div>
					<div className='flex flex-col w-full h-[210px] relative'>
						<Image
							className='absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] h-[180px] w-auto'
							src={item.imgUrl}
							alt={item.title}
						/>
						{durationNode ? (
							<div className='bottom-0 flex w-full justify-between items-end px-3 py-1 absolute'>
								<span className='text-[0.8rem] text-white font-semibold'>
									{durationNode}
								</span>
								<div onClick={() => setOpenModal(true)}>
									<OpenModalICon />
								</div>
							</div>
						) : (
							<div className='bottom-0 flex w-full justify-end px-4 py-1 absolute'>
								<div onClick={() => setOpenModal(true)}>
									<OpenModalICon />
								</div>
							</div>
						)}
					</div>
				</div>
				<div className='bg-[#6f8e9d66] dark:!bg-[#49545b] py-[13px] px-[12px]'>
					<div
						className={`flex flex-col w-full h-[130px] rounded-[25px] bg-[#fff] relative bg-primary ${colors[colorType]}`}
					>
						<div className='flex flex-col px-[10px]'>
							<div className='flex justify-start items-center pt-[12px]'>
								<span className='text-[#6f8e9d] text-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>
									Restore Durability:{' '}
								</span>
								<span className='font-semibold text-[14px] text-[#323131] dark:text-text-primary'>
									{houseMaxDurability}%
								</span>
							</div>
							<div className='border-b-[1px] border-[#00000050] w-full my-[8px]'></div>
							<div>
								<div>
									<span className='text-[#6f8e9d] text-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>
										Cost:{' '}
									</span>
									<span
										className={`font-semibold text-[14px] text-[#323131] dark:text-text-primary ${
											houseDurability == houseMaxDurability
												? 'text-grey-800'
												: ''
										}`}
									>
										1 LAND
									</span>
								</div>
							</div>
						</div>
						<Button
							onClick={() => onPurcharse()}
							className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute rounded-[20px] text-button-text-secondary ${
								isLoading.type > -1 && isLoading.type != type
									? 'grey'
									: colors[colorType]
							} 
              ${
								isLoading.type == item.id && isLoading.loading
									? 'flex justify-center items-center'
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
										className='me-2 mb-[4px]'
										width='24px'
										height='24px'
									/>
									<span className='font-semibold'>Loading</span>
								</div>
							) : (
								<span className='font-semibold'>{btnTitle}</span>
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
			>
				<div className='flex min-h-full justify-center items-center'>
					<span className='my-2 mx-3 text-[14px] pt-1 font-normal'>
						The Hire Handyman consumable allows you to restore your property to
						100% every 14 days for a flat rate of 1 LAND.
					</span>
				</div>
			</ReactModal>
		</div>
	);
};
