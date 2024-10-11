import React from "react";
import { useRouter } from 'next/router'
import Link from "next/link";
import { BackIcon } from "../../components/common/icons";
import { useGlobalContext } from "../../context/GlobalContext";
import HouseInfoCarouselComponent from "../../components/investment-house-detail/house-info-carousel";
import HouseTotalInvestMent from "../../components/investment-house-detail/house-total-investment";
import HouseInfoDetails from "../../components/investment-house-detail/house-info-details";
import HouseMap from "../../components/investment-house-detail/house-map";


const MarketPlace = () => {
  const router = useRouter()
  const { houseId } = router.query as { houseId: string };
  const { theme } = useGlobalContext();
  return (
    <div className="bg-primary">
      <div className="max-w-[1200px] m-auto">
        <Link
          className="flex items-center hover:cursor-pointer border-b-[2px] border-b-transparent hover:border-b-[#e5e5e5] w-fit"
          href="/rwa"
        >
          <BackIcon className="w-[16px] h-[16px]" fillColor={theme == 'dark' ? "#cbcbcb" : "#0a0a0a"} />
          <span className="ml-2 text-text-secondary"> Back to the List</span>
        </Link>
      </div>
      <HouseInfoCarouselComponent itemId={houseId} />
      <HouseTotalInvestMent itemId={houseId} />
      <HouseInfoDetails itemId={houseId} />
      <HouseMap itemId={houseId} />
    </div>
  );
};

export default MarketPlace;
