import React, { useState } from "react";
import { useChainId, useAccount } from "wagmi";
import ReactModal from "react-modal";
import { BigNumberish } from "ethers";
import { useGlobalContext } from "../../../context/GlobalContext";
import YieldUpgrade from "../production-upgrade/yield-upgrade";
import FirepitUpgrade from "./firepit-upgrade";
import {
  validateResource,
  validateItemDate,
  getItemDuration,
  getDependencyItem,
  validateItemDateWithDeadTime
} from "../../../utils/helpers/validator";
import { yieldUpdgradesData } from "../../../config/constants/game-data";
import useGetSetting from "../../../hooks/nft-game/axios/useGetSetting";
import useGetResource from "../../../hooks/nft-game/axios/useGetResource";
import useGetUserData from "../../../hooks/nft-game/axios/useGetUserData";
import useHandleAddons from "../../../hooks/nft-game/axios/useHandleAddons";
import useBalanceOfLand from "../../../hooks/contract/LandTokenContract/useBalanceOf"

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
  const { notifyError } = useGlobalContext();
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "300px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0,
      background: 'transparent'
    },
    overlay: {
      background: '#00000080',
      zIndex: 99999
    }
  };
  
  const { userData } = useGetUserData()
  const { oneDayTime } = useGetSetting()
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
  const { resource } = useGetResource()
  const { data: landTokenAmount } = useBalanceOfLand({ chainId, address }) as { data: BigNumberish }


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

    if (await validateResource(resource, item.buy.slice(2, 7))) {
      if (amount > landTokenAmount) {
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
        <div className="flex overflow-x-auto md:grid md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content)] md:gap-[45px] mlg:md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] lg:mlg:md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] justify-between" style={{ rowGap: "45px" }}>
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
              havingItem = validateItemDateWithDeadTime(yieldItem)

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
        <div className="w-[300px] p-[20px]">
          <div className="text-[15px] text-center">
            Warning: Salvaging will remove this upgrade. Proceed?
          </div>
          <div className="flex mt-[20px]">
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[1px] border-[#00a8f3] bg-[#00a8f3] cursor-pointer text-white"
              onClick={() => {
                setOpenSalvageModal(false);
                salvageAddon(isOwn, salvageAddonId, hasAddonId);
              }}
            >
              Yes
            </div>
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[1px] border-[#00a8f3] bg-transparent cursor-pointer"
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
