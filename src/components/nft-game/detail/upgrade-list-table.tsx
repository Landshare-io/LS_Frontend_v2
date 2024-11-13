import React, { useState } from "react";
import { useChainId, useAccount } from "wagmi";
import {
  ChargeIcon,
  BrickIcon,
  LumberIcon,
  ConcreteIcon,
  SteelIcon,
} from "../../common/icons/nft";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetUserGameItem from "../../../hooks/nft-game/axios/useGetUserGameItem";
import useGetUserData from "../../../hooks/nft-game/axios/useGetUserData";
import { productionUpdgradesData } from "../../../config/constants/game-data";

export default function UpgradeListTable({
  house
}: { house: any }) {
  const [selTab, setSelTab] = useState(0);
  const { theme } = useGlobalContext();
  const chainId = useChainId()
  const { address } = useAccount()
  const {
    premiumNfts,
    yieldUpgrades,
    fortificationItems,
    hasConcreteFoundation,
    hasFireplace,
    hasHarvester,
    hasGenerator
  } = useGetUserGameItem(house, chainId, address)
  const { facilities } = useGetUserData()

  const icons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
  ];

  return (
    <div className="max-w-[1200px] px-0 mb-5 mt-3">
      <div className="flex flex-col-reverse justify-around duration-700">
        <div className="hidden mlg:p-[10px] mlg:flex mlg:flex-1">
          <div className="mx-[5px] my-[10px] overflow-hidden flex-1 flex flex-col justify-between">
            <table className="w-full bg-[#c5d2d8] rounded-[10px] overflow-hidden h-[65%] dark:bg-transparent">
              <thead className="bg-[#0b6c96] h-[40px] dark:bg-secondary">
                <tr>
                  <th className="text-center text-[14px] text-[#fff] w-[40%]">
                    Name
                  </th>
                  <th className="text-center text-[14px] text-[#fff] w-[35%]">
                    Current Yield
                  </th>
                  <th className="text-center text-[14px] text-[#fff] w-[25%]">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="dark:bg-third">
                {facilities.sort((a, b) => a.sortingId - b.sortingId).map((facility, type) => (
                  <tr className="mx-[10px]" key={facility.currentFacility?.name || facility.nextFacility?.name}>
                    <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                      {facility.currentFacility?.name || facility.nextFacility?.name}
                    </td>
                    <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                      <div className="flex gap-[5px] justify-center items-center">
                        {facility.currentFacility?.level ? facility.currentFacility?.buyReward[2 + type] : "0"}{" "}
                        {icons[type]} / day
                      </div>
                    </td>
                    <td className="text-center text-[#1b6967] dark:text-text-secondary">
                      Lvl {facility.currentFacility?.level ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full bg-[#c5d2d8] rounded-[10px] overflow-hidden h-[34%] dark:bg-transparent">
              <thead className="bg-[#0b6c96] h-[40px] dark:bg-secondary">
                <tr>
                  <th className="text-center text-[14px] text-[#fff]">Name</th>
                  <th className="text-center text-[14px] text-[#fff]">Multiplier</th>
                </tr>
              </thead>
              <tbody className="dark:bg-third">
                {premiumNfts.map((pItem, index) => (
                  <tr className="mx-[10px]" key={`premium-nft-${index}`}>
                    <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                      {pItem.name}
                    </td>
                    <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                      {pItem.hasNft ? `+${pItem.multiplier}` : (
                        <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>
                          {((pItem.onChainItems?.length ?? 0) - (pItem.backendItems?.length ?? 0)) > 0 ? 'OWNED' : 'Not Own'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mx-[5px] my-[10px] overflow-hidden flex-1">
            <table className="w-full bg-[#c5d2d8] rounded-[10px] overflow-hidden h-full dark:bg-transparent">
              <thead className="bg-[#0b6c96] h-[40px] dark:bg-secondary">
                <tr>
                  <th className="text-center text-[14px] text-[#fff]">Name</th>
                  <th className="text-center text-[14px] text-[#fff]">Multiplier</th>
                </tr>
              </thead>
              <tbody className="dark:bg-third">
                {yieldUpgrades.map((item, idx) => (
                  <tr
                    className="mx-[10px] h-[40px]"
                    key={`${item.name}-${idx}`}
                  >
                    <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                      {item.name}{(item.name == 'Garden' && item.specialButtonName !== '') && ` / ${item.specialButtonName}`}
                    </td>
                    <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                      {item.hasUpgrade ? (
                        <>+{item.buyReward[9]} LAND / Year</>
                      ) : (
                        <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mx-[5px] my-[10px] overflow-hidden flex-1">
            <table className="w-full bg-[#c5d2d8] rounded-[10px] overflow-hidden h-full dark:bg-transparent">
              <thead className="bg-[#0b6c96] h-[40px] dark:bg-secondary">
                <tr>
                  <th className="text-center text-[14px] text-[#fff]">Name</th>
                  <th className="text-center text-[14px] text-[#fff]">
                    Owned/Not Owned
                  </th>
                </tr>
              </thead>
              <tbody className="dark:bg-third">
                {productionUpdgradesData.filter((item: any) => item.sortingId === 0).map((item, index) => (
                  <tr className="mx-[10px] h-[30px]" key={`${item.title}-${index}`}>
                    <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                      {item.title}
                    </td>
                    <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                      {house.activeToolshedType === item.id ? (
                        "Owned"
                      ) : (
                        <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="mx-[10px] h-[30px]">
                  <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                    Concrete Foundation
                  </td>
                  <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                    {hasConcreteFoundation ? (
                      "Owned"
                    ) : (
                      <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                    )}
                  </td>
                </tr>
                <tr className="mx-[10px] h-[30px]">
                  <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                    Harvester
                  </td>
                  <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                    {hasHarvester ? (
                      "Owned"
                    ) : (
                      <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                    )}
                  </td>
                </tr>
                {fortificationItems.map((fort, index) => (
                  <tr className="mx-[10px] h-[30px]" key={fort.title}>
                    <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                      {fort.title}
                    </td>
                    <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                      {fort.hasFort ? (
                        "Owned"
                      ) : (
                        <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="mx-[10px] h-[30px]">
                  <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                    Firepit
                  </td>
                  <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                    {hasFireplace ? (
                      "Owned"
                    ) : (
                      <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                    )}
                  </td>
                </tr>
                <tr className="mx-[10px] h-[30px]">
                  <td className="text-center text-[#0b6c96] dark:text-text-secondary">
                    Generator
                  </td>
                  <td className="text-center text-[#263238] text-[14px] dark:text-text-primary">
                    {hasGenerator ? (
                      "Owned"
                    ) : (
                      <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col p-[10px] h-[380px] flex-1 mlg:hidden">
          <div className="flex h-[44px] justify-between bg-[#e0e0e0] rounded-[5px]">
            <div
              className={
                selTab == 0
                  ? "flex-1 justify-center p-[5px] bg-[#0b6c96] text-[#fff] m-[5px] rounded-[5px] flex items-center text-center text-[13px]"
                  : "flex-1 justify-center p-[5px] rounded-[5px] text-[#858585] flex items-center text-center text-[13px] cursor-pointer mlg:text-[#fff]"
              }
              onClick={() => setSelTab(0)}
            >
              Facilities
            </div>
            <div
              className={
                selTab == 1
                  ? "flex-1 justify-center p-[5px] bg-[#0b6c96] text-[#fff] m-[5px] rounded-[5px] flex items-center text-center text-[13px]"
                  : "flex-1 justify-center p-[5px] rounded-[5px] text-[#858585] flex items-center text-center text-[13px] cursor-pointer mlg:text-[#fff] text-text-secondary"
              }
              onClick={() => setSelTab(1)}
            >
              Yield Upgrades
            </div>
            <div
              className={
                selTab == 2
                  ? "flex-1 justify-center p-[5px] bg-[#0b6c96] text-[#fff] m-[5px] rounded-[5px] flex items-center text-center text-[13px]"
                  : "flex-1 justify-center p-[5px] rounded-[5px] text-[#858585] flex items-center text-center text-[13px] cursor-pointer mlg:text-[#fff] text-text-secondary"
              }
              onClick={() => setSelTab(2)}
            >
              Production Upgrades
            </div>
          </div>
          {selTab == 0 && (
            <div className="mx-[5px] my-[10px] overflow-hidden flex-1">
              <table className="w-full bg-[#c5d2d8] rounded-[10px] overflow-hidden h-full">
                <thead className="bg-[#0b6c96] h-[40px] dark:bg-secondary">
                  <tr>
                    <th className="text-center text-[14px] text-[#fff] w-[40%]">
                      Name
                    </th>
                    <th className="text-center text-[14px] text-[#fff] w-[35%]">
                      Current Yield
                    </th>
                    <th className="text-center text-[14px] text-[#fff] w-[25%]">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.sort((a, b) => a.sortingId - b.sortingId).map((facility, type) => (
                    <tr className="mx-[10px] h-[30px]" key={facility.currentFacility?.name || facility.nextFacility?.name}>
                      <td className="text-center text-[#0b6c96]">
                        {facility.currentFacility?.name || facility.nextFacility?.name}
                      </td>
                      <td className="text-center text-[#263238] text-[14px]">
                        <div className="flex items-center justify-center gap-[5px]">
                          {facility.currentFacility?.level ? facility.currentFacility?.buyReward[2 + type] : "0"}{" "}
                          {icons[type]} / day
                        </div>
                      </td>
                      <td className="text-center text-[#1b6967]">
                        Lvl {facility.currentFacility?.level ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selTab == 1 && (
            <div className="mx-[5px] my-[10px] overflow-hidden flex-1">
              <table className="w-full bg-[#c5d2d8] rounded-[10px] overflow-hidden h-full">
                <thead className="bg-[#0b6c96] h-[40px] dark:bg-secondary">
                  <tr>
                    <th className="text-center text-[14px] text-[#fff]">Name</th>
                    <th className="text-center text-[14px] text-[#fff]">Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {yieldUpgrades.map((item, idx) => (
                    <tr
                      className="mx-[10px] h-[30px]"
                      key={`${item.name}-${idx}`}
                    >
                      <td className="text-center text-[#0b6c96]">
                        {item.name}{(item.name == 'Garden' && item.specialButtonName !== '') && ` / ${item.specialButtonName}`}
                      </td>
                      <td className="text-center text-[#263238] text-[14px]">
                        {item.hasUpgrade ? (
                          <>+{item.buyReward[9]} LAND / Year</>
                        ) : (
                          <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="w-full bg-[#c5d2d8] rounded-[10px] overflow-hidden h-full mt-2">
                <thead className="bg-[#0b6c96] h-[40px] dark:bg-secondary">
                  <tr>
                    <th className="text-center text-[14px] text-[#fff]">Name</th>
                    <th className="text-center text-[14px] text-[#fff]">Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {premiumNfts.map((pItem, index) => (
                    <tr className="mx-[10px] h-[30px]" key={`premium-nft-${index}`}>
                      <td className="text-center text-[#0b6c96]">
                        {pItem.name}
                      </td>
                      <td className="text-center text-[#263238] text-[14px]">
                        {pItem.hasNft ? `+${pItem.multiplier}` : (
                          <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>
                            {((pItem.onChainItems?.length ?? 0) - (pItem.backendItems?.length ?? 0)) > 0 ? 'OWNED' : 'Not Own'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selTab == 2 && (
            <div className="mx-[5px] my-[10px] overflow-hidden flex-1">
              <table className="w-full bg-[#c5d2d8] rounded-[10px] overflow-hidden h-full">
                <thead className="bg-[#0b6c96] h-[40px] dark:bg-secondary">
                  <tr>
                    <th className="text-center text-[14px] text-[#fff]">Name</th>
                    <th className="text-center text-[14px] text-[#fff]">
                      Owned/Not Owned
                    </th>
                  </tr>
                </thead>
                <tbody className="dark:bg-third">
                  {productionUpdgradesData.filter(item => item.sortingId === 0).map((item, index) => (
                    <tr className="mx-[10px] h-[30px]" key={`${item.title}-${index}`}>
                      <td className="text-center text-[#0b6c96]">
                        {item.title}
                      </td>
                      <td className="text-center text-[#263238] text-[14px]">
                        {house.activeToolshedType === item.id ? (
                          "Owned"
                        ) : (
                          <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="mx-[10px] h-[30px]">
                    <td className="text-center text-[#0b6c96]">
                      Concrete Foundation
                    </td>
                    <td className="text-center text-[#263238] text-[14px]">
                      {hasConcreteFoundation ? (
                        "Owned"
                      ) : (
                        <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                      )}
                    </td>
                  </tr>
                  <tr className="mx-[10px] h-[30px]">
                    <td className="text-center text-[#0b6c96]">
                      Harvester
                    </td>
                    <td className="text-center text-[#263238] text-[14px]">
                      {hasHarvester ? (
                        "Owned"
                      ) : (
                        <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                      )}
                    </td>
                  </tr>
                  {fortificationItems.map((fort, index) => (
                    <tr className="mx-[10px] h-[30px]" key={fort.title}>
                      <td className="text-center text-[#0b6c96]">
                        {fort.title}
                      </td>
                      <td className="text-center text-[#263238] text-[14px]">
                        {fort.hasFort ? (
                          "Owned"
                        ) : (
                          <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="mx-[10px] h-[30px]">
                    <td className="text-center text-[#0b6c96]">
                      Firepit
                    </td>
                    <td className="text-center text-[#263238] text-[14px]">
                      {hasFireplace ? (
                        "Owned"
                      ) : (
                        <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                      )}
                    </td>
                  </tr>
                  <tr className="mx-[10px] h-[30px]">
                    <td className="text-center text-[#0b6c96]">
                      Generator
                    </td>
                    <td className="text-center text-[#263238] text-[14px]">
                      {hasGenerator ? (
                        "Owned"
                      ) : (
                        <div style={{ color: theme == 'dark' ? "#ffffff" : "#0b6c96" }}>Not Owned</div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
