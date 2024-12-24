import { useMemo } from "react";
import { useRouter } from 'next/router'
import Link from "next/link";
import { bsc } from "viem/chains";
import { BigNumberish } from "ethers";
import type { NextPage } from 'next';
import { BackIcon } from "../../components/common/icons";
import { useGlobalContext } from "../../context/GlobalContext";
import HouseInfoCarouselComponent from "../../components/investment-house-detail/house-info-carousel";
import HouseTotalInvestMent from "../../components/investment-house-detail/house-total-investment";
import HouseFaqs from "../../components/investment-house-detail/house-faqs";
import HouseMap from "../../components/investment-house-detail/house-map";
import { 
  getData,
  selectIsLoading,
  selectPropertyRentalData
} from "../../lib/slices/firebase-slices/properties-rental-item";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import usePropertyValues from "../../hooks/contract/APIConsumerContract/useGetPropertyValues";


const MarketPlace: NextPage = () => {
  const router = useRouter()
  const { houseId } = router.query as { houseId: string };
  const { theme } = useGlobalContext();
  const dispatch = useAppDispatch();
  const houseInfo = useAppSelector(selectPropertyRentalData) as any;
  const isLoading = useAppSelector(selectIsLoading)
  const { data: propertyValue } = usePropertyValues(bsc.id, houseInfo?.coreLogicID) as { data: BigNumberish}

  useMemo(async () => {
    dispatch(getData(houseId))
  }, [houseId]);


  return (
    <div className="bg-primary">
      <div className="max-w-[1200px] m-auto p-[10px]">
        <Link
          className="flex items-center hover:cursor-pointer border-b-[2px] border-b-transparent hover:border-b-[#e5e5e5] w-fit"
          href="/rwa"
        >
          <BackIcon className="w-[16px] h-[16px]" fillColor={theme == 'dark' ? "#cbcbcb" : "#0a0a0a"} />
          <span className="ml-2 text-text-secondary"> Back to the List</span>
        </Link>
      </div>
      <HouseInfoCarouselComponent houseInfo={houseInfo} isLoading={isLoading} />
      <HouseTotalInvestMent houseInfo={houseInfo} isLoading={isLoading} propertyValue={propertyValue} />
      <HouseFaqs />
      <HouseMap houseInfo={houseInfo} />
    </div>
  );
};

export default MarketPlace;
