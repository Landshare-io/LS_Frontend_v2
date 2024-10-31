import React, { useState, useEffect } from "react";
import { useChainId, useAccount } from "wagmi";
import ReactModal from "react-modal";
import { useDisconnect } from "wagmi";
import { ethers } from "ethers";
import { useGlobalContext } from "../../../contexts/GlobalContext";
import { useLandshareNftContext } from "../../../contexts/LandshareNftContext";
import { YieldUpgrade } from "../yieldUpgrade/YieldUpgrade";
import { FirepitUpgrade } from "../yieldUpgrade/FirepitUpgrade";
import gameSetting from "../../../contexts/game/setting.json";
import axios from "../../../helper/axios";
import {
  validateDependency,
  validateResource,
  validateItemDate,
  getItemDuration,
  getDependencyItem,
  validateItemDateWithDeadTime,
  getItemDurationWithDeadTime
} from "../../../helper/validator";
import { yieldUpdgradesData } from "../UpgradeBoxData";

import useHandleAddons from "../../../hooks/nft-game/axios/useHandleAddons";

import "./UpgradeSection.css";

interface YieldUpdgradesProps {
  house: any
  setHouse: Function
}

export default function YieldUpgrades({
  house,
  setHouse
}: YieldUpdgradesProps) {
  const chainId = useChainId();
  const { address } = useAccount()
  const { 
    signer,
    account,
    provider,
    userData,
    notifyError, 
    notifySuccess,
    oneDayTime,
    helperContract,
    helperBContract,
    settingContract,
    resourceContract,
    landTokenV2Contract,
    userResource,
    setUserResource
  } = useGlobalContext();
  const { disconnect } = useDisconnect();
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
      display: 'flex',
      alignItems: 'center',
    },
    overlay: {
      background: '#00000080'
    }
  };

  const isOwn = house?.userId == userData?.id
  const [salvageAddonId, setSalvageAddonId] = useState(-1);
  const [hasAddonId, setHasAddonId] = useState(-1);
  const [openSalvageModal, setOpenSalvageModal] = useState(false);
  const [isLoading, setIsLoading] = useState({ type: -1, loading: false });

  const { 
    buyAddon, 
    handleFireplace, 
    fertilizeGardenAction, 
    salvageAddon, 
    buyTreeAddonHandler 
  } = useHandleAddons(chainId, address, house, setHouse, setIsLoading);


  const buyTreeAddon = async (item: any) => {
    setIsLoading({ type: item.id, loading: true });

    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (!house.isActivated) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please Activate First");
    }

    if (!isOwn) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("You are not an owner of this house");
    }

    if (validateItemDate(item, oneDayTime)) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("You've already buy this addon");
    }

    const amount = item.buy[1]

    if (await validateResource(userResource, item.buy.slice(2, 7))) {
      if (amount > userResource.landTokenBalance) {
        setIsLoading({ type: -1, loading: false });
        return notifyError("Not enough LAND tokens");
      } else {
        await buyTreeAddonHandler(item);
      }
    } else {
      setIsLoading({ type: -1, loading: false });
      notifyError("Not enough resource");
    }
  };

  const confirmSalvageAddon = async (addonId: number, hasItemId: number) => {
    setOpenSalvageModal(true);
    setSalvageAddonId(addonId);
    setHasAddonId(hasItemId)
  };

  return (
    <div className="max-w-[1200px] px-0 my-5">
      {house.yieldUpgrades.length < 1 ? (
        <></>
      ) : (
        <div className="flex flex-col md:grid md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content)] md:gap-[45px] mlg:md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] lg:mlg:md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] justify-between" style={{ rowGap: "45px" }}>
          {yieldUpdgradesData.map((item: any) => {
            let yieldItem, havingItem
            if (item.title == 'Garden') {
              if (validateItemDate(house.yieldUpgrades.filter((yItem: any) => yItem.name == item.title && yItem.specialButtonName == '')[0], oneDayTime)) {
                yieldItem = {
                  ...house.yieldUpgrades.filter((yItem: any) => yItem.name == item.title && yItem.specialButtonName == 'FERTILIZE')[0],
                  isBought: true,
                  gardenDurationTime: getItemDuration(house.yieldUpgrades.filter((yItem: any) => yItem.name == item.title && yItem.specialButtonName == '')[0], oneDayTime)
                }
                havingItem = true
              } else {
                yieldItem = {
                  ...house.yieldUpgrades.filter((yItem: any) => yItem.name == item.title && yItem.specialButtonName == '')[0],
                  isBought: false,
                  gardenDurationTime: 0
                }
                havingItem = false
              }
            } else {
              yieldItem = house.yieldUpgrades.filter((yItem: any) => yItem.name == item.title)[0]
              havingItem = validateItemDate(yieldItem, oneDayTime)
            }

            const dependencyItems = getDependencyItem(house, yieldItem.id, oneDayTime)

            if (item.title == 'Fireplace') {
              havingItem = validateItemDateWithDeadTime(yieldItem, oneDayTime)

              return (
                <div
                  key={`yield-upgrade-${yieldItem.id}`}
                  className="w-[257px] mr-[10px] sm:mr-[40px]"
                >
                  <FirepitUpgrade
                    item={{
                      ...yieldItem,
                      imgUrl: item.imgUrl,
                      dependencyItems: dependencyItems
                    }}
                    type="yield"
                    btnTitle={
                      havingItem == 1 ? 'BURN' : (havingItem == 0 ? 'BURN' : 'BUY')
                    }
                    colorType={
                      (!house.isActivated || house.onSale) ? 0 :
                        (havingItem == 1 ? 2 : (havingItem == 0 ? 2 : 1))
                      }
                    onPurcharse={
                      (lumberCount: number) => handleFireplace(isOwn, yieldItem, lumberCount)
                    }
                    disabled={house.onSale || !house.isActivated}
                    salvageItem={() => confirmSalvageAddon(yieldItem.id, yieldItem.hasItemId)}
                    isLoading={isLoading}
                  />
                </div>
              )
            } else {
              return (
                <div
                  key={`yield-upgrade-${yieldItem.id}`}
                  className="w-[257px] mr-[10px] sm:mr-[40px]"
                >
                  <YieldUpgrade
                    item={{
                      ...yieldItem,
                      imgUrl: item.imgUrl,
                      dependencyItems: dependencyItems
                    }}
                    type="yield"
                    btnTitle={
                      havingItem ? 
                        (yieldItem.name == 'Garden' ? 
                          yieldItem.specialButtonName : 
                          (yieldItem.name == 'Trees' ? 'OWNED' : 'SALVAGE'))
                        : 'BUY'
                    }
                    disabled={house.onSale || !house.isActivated}
                    colorType={
                      (!house.isActivated || house.onSale) ? 0 :
                      (havingItem ? 
                        (yieldItem.name == 'Garden' ? 2 : 3) 
                        : 1)
                    }
                    onPurcharse={
                      havingItem ? 
                        yieldItem.name == 'Garden' ? () => fertilizeGardenAction(isOwn, yieldItem) : 
                        (yieldItem.name == 'Trees' ? () => {} : () => confirmSalvageAddon(yieldItem.id, yieldItem.hasItemId))
                        : (yieldItem.name == 'Trees' ? () => buyTreeAddon(yieldItem) : () => buyAddon(isOwn, yieldItem))
                    }
                    isLoading={isLoading}
                  />
                </div>
              )
            }
          })}
        </div>
      )}
      
      <ReactModal
        isOpen={openSalvageModal}
        onRequestClose={() => { setOpenSalvageModal(!openSalvageModal), document.body.classList.remove('modal-open'); }}
        style={customModalStyles}
      >
        <div className="modal_body">
          <div className="modal_header">
            Warning: Salvaging will remove this upgrade. Proceed?
          </div>
          <div className="modal_buttons">
            <div
              className="modal_buttons_yes cursor-pointer"
              onClick={() => {
                setOpenSalvageModal(false);
                salvageAddon(isOwn, salvageAddonId, hasAddonId);
              }}
            >
              Yes
            </div>
            <div
              className="modal_buttons_no cursor-pointer"
              onClick={() => {
                setIsLoading({ type: -1, loading: false });
                setOpenSalvageModal(false);
                setSalvageAddonId(-1);
                setHasAddonId(-1);
              }}
            >
              No
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};
