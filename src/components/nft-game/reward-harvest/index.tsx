import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import HarvestCards from "./harvest-cards";

import { useGlobalContext } from "../../../context/GlobalContext";
import useGetGameItems from "../../../hooks/nft-game/axios/useGetGameItems";
import useGetItem from "../../../hooks/nft-game/axios/useGetItem";
import useCheckHasItem from "../../../hooks/nft-game/axios/useCheckHasItem";
import useGetResource from "../../../hooks/nft-game/axios/useGetResource";
import useBuyOverdrive from "../../../hooks/nft-game/axios/useBuyOverdrive";
import useGetSetting from "../../../hooks/nft-game/axios/useGetSetting";

interface RewardHarvestProps {
  setTotalHarvestCost: Function;
  selectedResource: boolean[];
  setSelectedResource: Function;
}

export default function RewardHarvest({
  setTotalHarvestCost,
  selectedResource,
  setSelectedResource
}: RewardHarvestProps) {
  const { theme } = useGlobalContext();
  const [isLoading, setIsLoading] = useState({ type: -1, loading: false });
  const { notifyError } = useGlobalContext();
  const { harvestCost } = useGetSetting();
  const { boostItemsList } = useGetGameItems();
  const { boostItem } = useGetResource()
  const [openModal, setOpenModal] = useState(false);
  const [selectedOverdrive, setSelectedOverdrive] = useState<any>({});
  const { buyOverdrive } = useBuyOverdrive(setIsLoading)

  const harvester = useGetItem("Harvester")
  const hasHarvster = useCheckHasItem(harvester, -1)

  useEffect(() => {
    let cost = 0
    selectedResource.map((sR: boolean) => {
      if (sR) {
        cost += harvestCost
      }
    })

    setTotalHarvestCost(cost / (hasHarvster ? 2 : 1));
  }, [hasHarvster, selectedResource])


  const buyOverdriveSelect = async (item: any) => {
    if (!localStorage.getItem("jwtToken-v2")) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("Please login!");
    }

    if (boostItem.item == item.id) {
      setIsLoading({ type: -1, loading: false });
      return notifyError("You have already acitvate this boost!");
    }

    setSelectedOverdrive(item)
    setOpenModal(true)
  };

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

  return (
    <div className="flx flex-col">
      <div className="flex pb-[20px] overflow-x-auto md:grid md:grid-cols-[minmax(200px,max-content),minmax(200px,max-content),minmax(200px,max-content)] lg:grid-cols-[minmax(200px,max-content),minmax(200px,max-content),minmax(200px,max-content),minmax(200px,max-content)] xl:grid-cols-[minmax(200px,max-content),minmax(200px,max-content),minmax(200px,max-content),minmax(200px,max-content),minmax(200px,max-content)] justify-start md:justify-between gap-[1rem] md:gap-0">
        {boostItemsList.map((item, type) => {
          const isActivatedBoost = boostItem.item == item.id
          return (
            <HarvestCards
              key={`harvestable-card-${type}`}
              item={item}
              type={type}
              colorType={isActivatedBoost ? 3 : 2}
              btnTitle={isActivatedBoost ? 'ACTIVE' : 'BOOST'}
              selectedResource={selectedResource}
              setSelectedResource={setSelectedResource}
              onPurcharse={() =>
                isActivatedBoost ? {} : buyOverdriveSelect(item)
              }
              isLoading={isLoading}
            />
          );
        })}
      </div>
      <ReactModal
        style={customModalStyles}
        isOpen={openModal}
				onRequestClose={() => { setOpenModal(!openModal), document.body.classList.remove('modal-open'); }}
      >
        <div className="p-[20px] max-w-[300px] bg-third">
          <div className="text-[15px] text-center text-text-primary">
            Boosting this resource will cancel your existing boost. Continue?
          </div>
          <div className="flex mt-[20px]">
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] border-[#00a8f3] border-[1px] bg-[#00a8f3] cursor-pointer text-button-text-secondary"
              onClick={() => {
                setOpenModal(false)
                buyOverdrive(selectedOverdrive, setSelectedOverdrive)
              }}
            >
              Yes
            </div>
            <div
              className="flex-1 text-center m-[5px] p-[5px] rounded-[10px] cursor-pointer bg-primary text-text-secondary"
              onClick={() => {
                setIsLoading({ type: -1, loading: false });
                setOpenModal(false);
              }}
            >
              No
            </div>
          </div>
        </div>
      </ReactModal>
    </div >
  );
};
