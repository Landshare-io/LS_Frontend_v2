import React, { useState } from "react";
import ReactModal from "react-modal";
import YieldUpgradeCost from "./yield-upgrade-cost";
import ProductionUpgradeCost from "./production-upgrade-cost";
import { OpenModalICon } from "../../common/icons/index";
import Tooltip from "../../common/tooltip";
import { getItemDuration } from "../../../utils/helpers/validator";
import useGetSetting from "../../../hooks/nft-game/axios/useGetSetting";

interface YieldUpgradeProps {
  item: any;
  type: string;
  btnTitle: string;
  colorType: number;
  onPurcharse: Function;
  disabled?: boolean;
  isLoading?: any;
}


export default function YieldUpgrade({
  item,
  type,
  btnTitle,
  colorType,
  onPurcharse,
  disabled = false,
  isLoading
}: YieldUpgradeProps) {
  const [openModal, setOpenModal] = useState(false);
  const { oneDayTime } = useGetSetting()
  const descriptions: Record<string, string> = {
    "Hardwood Floors": `Install natural hardwood floors to your property. Increases LAND yields by x${
      item.buyReward[9] ?? ""
    }. Increase lumber repair cost by 1 per 10% repaired.`,
    Landscaping: `Add brick landscaping to your property. Unlocks the Garden upgrade and increases LAND yields by x${
      item.buyReward[9] ?? ""
    }. Increase brick and lumber repair cost by 1 per 10% repaired.`,
    Garden: `Add a garden to your property for 7 days. Requires the landscaping upgrade. Increases LAND yields by x${
      item.buyReward[9] ?? ""
    }.`,
    Trees: `Plant additional trees on your property, increasing LAND yields by x${
      item.buyReward[9] ?? ""
    }. Allows user to gather up to 3 lumber per day using the Gather Lumber function, up from 2.`,
    "Kitchen Remodel": `Remodel your kitchen, increasing yields by x${
      item.buyReward[9] ?? ""
    }. Unlocks Steel Appliances upgrade. Increases lumber and brick repair costs by 1 per 10% repaired.`,
    "Bathroom Remodel": `Remodel your bathroom, increasing yields by x${
      item.buyReward[9] ?? ""
    }. Unlocks Jacuzzi Tub upgrade. Increases lumber, brick, and concrete repair costs by 1 per 10% repaired.`,
    "Jacuzzi Tub": `Add a Jacuzzi Tub to your bathroom, increasing yields by x${
      item.buyReward[9] ?? ""
    }. Increases concrete repair cost by 1 per 10% repaired.`,
    "Steel Siding": `Install steel siding to your property, increasing yields by x${
      item.buyReward[9] ?? ""
    }. Requires a concrete fortification. Increases steel repair cost by 1 per 10% repaired.`,
    "Steel Application": `Modernize your kitchen with steel appliances, increasing LAND yields by x${
      item.buyReward[9] ?? ""
    }. Requires the Kitchen Renovation upgrade. Increases steel repair cost by 1 per 10% repaired.`,
    Cellar: `Add a cellar to your property, increasing yields by x${
      item.buyReward[9] ?? ""
    }. Requires an ACTIVE brick fortification to gain multiplier. User only needs to build upgrade once, and multiplier will be active any time brick fortification is active. Increases steel, lumber, concrete, and brick repair cost by 1 per 10% repaired.`,
    "Finished Basement": `Finish your basement to increase yields by x${
      item.buyReward[9] ?? ""
    }. Requires ACTIVE steel fortification to gain multiplier. User only needs to build upgrade once, and multiplier will be active any time steel fortification is active. Increases steel, lumber, concrete, and brick repair cost by 1 per 10% repaired.`,
    Firepit: `Burn lumber in your outdoor firepit to increase LAND yields by x${
      item.buyReward[9] ?? ""
    }. Burns 1 lumber per day and allows user to frontload up to 10 lumber. If lumber is depleted, the upgrade multiplier will be removed. Increases brick repair cost by 1 per 10% repaired.`,
    "Hire Handyman": `Hire a Handyman to restore your durability to 100%. Costs ${
      item.buy[1] ?? ""
    } LAND per 10% repaired. Useable once per ${item.buyReward[10] ?? ""} days.`,
    "Lumber Toolshed": `The Toolshed reduces repair costs for your property. Only one toolshed type (Lumber, Brick, Concrete, or Steel) can be active at a time. Lumber Toolshed decreases power costs on repairs by ${
      item.buyReward[2] * 100
    }% and resource costs on repairs for lumber by ${
      item.buyReward[3] * 100
    }%.`,
    "Brick Toolshed": `The Toolshed reduces repair costs for your property. Only one toolshed type (Lumber, Brick, Concrete, or Steel) can be active at a time. Brick Toolshed decreases power costs on repairs by ${
      item.buyReward[2] * 100
    }% and resource costs on repairs for the brick by ${
      item.buyReward[4] * 100
    }%.`,
    "Concrete Toolshed": `The Toolshed reduces repair costs for your property. Only one toolshed type (Lumber, Brick, Concrete, or Steel) can be active at a time. Concrete Toolshed decreases power costs on repairs by ${
      item.buyReward[2] * 100
    }% and resource costs on repairs for concrete by ${
      item.buyReward[5] * 100
    }%.`,
    "Steel Toolshed": `The Toolshed reduces repair costs for your property. Only one toolshed type (Lumber, Brick, Concrete, or Steel) can be active at a time. Steel Toolshed decreases power costs on repairs by ${
      item.buyReward[2] * 100
    }% and resource costs on repairs for steel by ${
      item.buyReward[6] * 100
    }%.`,
    "Concrete Foundation": `Pour a concrete foundation for your property. Reduces daily durability loss from 10% to ${
     10 - item.buyReward[7] * 10 
    }%.`,
    Harvester: `Reduces harvest cost from 20 power to ${
      (20 * Number(item.buyReward[11] * 100)) / 100
    } power for each resource type harvested.`,
    "Fortification Brick": `Fortifies your property with bricks, increasing maximum durability by ${
      item.buyReward[7]
    }%. Stacks with other fortification types for a maximum durability of 130%. Must have an active Brick Fortification to benefit from Cellar upgrade.`,
    "Fortification Concrete": `Fortifies your property with concrete, increasing maximum durability by ${
      item.buyReward[7]
    }%. Stacks with other fortification types for a maximum durability of 130%. Must have an active Concrete Fortification to build Steel Siding upgrade.`,
    "Fortification Steel": `Fortifies your property with steel, increasing maximum durability by ${
      item.buyReward[7]
    }%. Stacks with other fortification types for a maximum durability of 130%. Must have an active Steel Fortification to benefit from the Finished Basement upgrade.`,
    "Generator": `Reduce the power repair cost by ${item.buyReward[2] * 100}.`
  };
  const colors = [
    "grey",
    "green",
    "yellow",
    "blue",
    "dark-blue",
    "light-yellow",
    "light-blue",
  ];

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
      border: 0
    },
    overlay: {
      background: '#00000080'
    }
  };

  let durationDateNode = null
  let fertilizeDateNode = null
  const durationDay = getItemDuration(item, oneDayTime)
  if (item.name === "Garden") {
    if (item.isBought) {
      durationDateNode = item.gardenDurationTime > 1 ? (
        <>
          Garden: <span className={`duration-date ${type}`}>{item.gardenDurationTime}</span> days
        </>
      ) : item.gardenDurationTime === 1 ? (
        <>
          Garden: <span className={`duration-date ${type}`}>{item.gardenDurationTime}</span> day
        </>
      ) : (
        <>
          Garden: <span className={`duration-date ${type}`}>less than 1 day</span>
        </>
      );
      
      const fertilizeTime = getItemDuration(item, oneDayTime)
      fertilizeDateNode = fertilizeTime > 1 ? (
        <>
          Fertilize: <span className={`duration-date ${type}`}>{fertilizeTime}</span> days
        </>
      ) : fertilizeTime === 1 ? (
        <>
          Fertilize: <span className={`duration-date ${type}`}>{fertilizeTime}</span> day
        </>
      ) : (
        fertilizeTime > 0 ? (
          <>
            Fertilize: <span className={`duration-date ${type}`}>less than 1 day</span>
          </>
        ) : null
      );
    }
  } else {
    if (item.buy[10] > 0) {
      durationDateNode = durationDay > 1 ? (
          <>
            Duration: <span className={`duration-date ${type}`}>{durationDay}</span> days left
          </>
        ) : durationDay === 1 ? (
          <>
             Duration: <span className={`duration-date ${type}`}>{durationDay}</span> day left
          </>
        ) : (
          durationDay > 0 ? (
            <>
              Duration: <span className={`duration-date ${type}`}>less than 1 day</span> left
            </>
          ) : null
        );
    }
  }

  let message = ''
  if (item.dependencyItems?.length > 0) {
    const dItems = item.dependencyItems.filter((dItem: any) => dItem.isActivated == false)
    if (dItems.length > 0)
      message = `*Require ${dItems.map((dItem: any) => dItem.name).join(", ")}`
  }

  return (
    <>
      <div
        className="w-[257px] flex flex-col duration-300 hover:shadow-md mr-[10px] md:mr-[40px]"
      >
        <div className="bg-[#fff]">
          <div
            className={`flex flex-col items-center ${type}`}
          >
            <div className="bg-[#00000033] w-full flex justify-center h-[49px] py-[8px]">
              <span className="text-[16px] text-white font-semibold">{item.name}</span>
            </div>
            <div className="flex flex-col w-full h-[210px] relative">
              <img
                className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%] h-[18px] w-auto"
                src={item.imgUrl}
                alt={item.name}
              />
              {durationDay ? (
                item.name === "Garden" ? (
                  item.isBought ? (
                    <div className="px-[12px] bottom-0 flex w-full justify-between items-end py-1 absolute">
                      <div className={`text-[0.8rem] text-white font-semibold ${type}`}>
                        {fertilizeDateNode} <br />
                        {durationDateNode}
                      </div>
                      <div>
                        {message && (
                          <Tooltip content={(
                            <>
                              Missing Dependency: <br />
                              {message}.<br />
                              Multiplier not active.
                            </>
                          )}>
                            <div>
                              {/* svg icons must be wrapped around a div */}
                              <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"
                                x="0px" y="0px" width="26px" height="26px" viewBox="0 0 20 16" className="cursor-pointer absolute bottom-[5px] right-[5px]">
                                <path fill="#D61F33" opacity="0.7" d="M10,0L0,16h20L10,0z M11,13.908H9v-2h2V13.908z M9,10.908v-6h2v6H9z"/>
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
                    <div className="px-[12px] flex w-full justify-end px-4 py-1 absolute">
                      {message && (
                        <Tooltip content={(
                          <>
                            Missing Dependency: <br />
                            {message}.<br />
                            Multiplier not active.
                          </>
                        )}>
                          <div>
                            {/* svg icons must be wrapped around a div */}
                            <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"
                              x="0px" y="0px" width="26px" height="26px" viewBox="0 0 20 16" className="cursor-pointer absolute bottom-[5px] right-[5px]">
                              <path fill="#D61F33" opacity="0.7" d="M10,0L0,16h20L10,0z M11,13.908H9v-2h2V13.908z M9,10.908v-6h2v6H9z"/>
                            </svg>
                          </div>
                        </Tooltip>
                      )}
                      <div onClick={() => setOpenModal(true)}>
                        <OpenModalICon />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="px-[12px] bottom-0 flex w-full justify-between items-end py-1 absolute">
                    <div className={`text-[0.8rem] text-white font-semibold ${type}`}>
                      {durationDateNode}
                    </div>
                    <div>
                      {message && (
                        <Tooltip content={(
                          <>
                            Missing Dependency: <br />
                            {message}.<br />
                            Multiplier not active.
                          </>
                        )}>
                          <div>
                            {/* svg icons must be wrapped around a div */}
                            <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"
                              x="0px" y="0px" width="26px" height="26px" viewBox="0 0 20 16" className="cursor-pointer absolute bottom-[5px] right-[5px]">
                              <path fill="#D61F33" opacity="0.7" d="M10,0L0,16h20L10,0z M11,13.908H9v-2h2V13.908z M9,10.908v-6h2v6H9z"/>
                            </svg>
                          </div>
                        </Tooltip>
                      )}
                      <div onClick={() => setOpenModal(true)}>
                        <OpenModalICon />
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="px-[12px] bottom-0 flex w-full justify-end px-4 py-1 absolute">
                  {message && (
                    <Tooltip content={(
                      <>
                        Missing Dependency: <br />
                        {message}.<br />
                        Multiplier not active.
                      </>
                    )}>
                      <div>
                        {/* svg icons must be wrapped around a div */}
                        <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"
                          x="0px" y="0px" width="26px" height="26px" viewBox="0 0 20 16" className="cursor-pointer absolute bottom-[5px] right-[5px]">
                          <path fill="#D61F33" opacity="0.7" d="M10,0L0,16h20L10,0z M11,13.908H9v-2h2V13.908z M9,10.908v-6h2v6H9z"/>
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
          <div className="bg-[#6f8e9d66] px-[12px] py-[13px]">
            {type == "yield" ? (
              <YieldUpgradeCost
                color={colors[colorType]}
                btnLabel={btnTitle}
                onPurcharse={onPurcharse}
                disabled={disabled}
                isLoading={isLoading}
                type={item.id}
                item={item}
                colorType={colorType}
              />
            ) : (
              <ProductionUpgradeCost
                color={colors[colorType]}
                btnLabel={btnTitle}
                onPurcharse={onPurcharse}
                disabled={disabled}
                isLoading={isLoading}
                type={item.id}
                item={item}
                colorType={colorType}
              />
            )}
          </div>
        </div>
      </div>
      <div className="max-w-[257px] text-center mt-2">
        <span className="text-[#8f8f8f] text-[15px] font-medium">
          {message}
        </span>
      </div>
      <ReactModal
        isOpen={openModal}
        onRequestClose={() => { setOpenModal(!openModal), document.body.classList.remove('modal-open'); }}
        style={customModalStyles}
      >
        <div className="flex min-h-full justify-center items-center">
          <span className="my-2 mx-3 text-[14px]">
            {descriptions[item.name] ?? ""}
          </span>
        </div>
      </ReactModal>
    </>
  );
};
