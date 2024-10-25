import { useState, useEffect } from 'react';
import { useChainId } from 'wagmi';
import { BigNumberish, formatEther } from 'ethers';
import { IoIosTrendingUp } from "react-icons/io";
import Logo from '../common/logo';
import Button from '../common/button';
import {
  getData,
  selectNetRentalPerMonth,
  selectAppreciation
} from '../../lib/slices/firebase-slices/properties-rental';
import useGetTotalValue from "../../hooks/contract/APIConsumerContract/useGetTotalValue";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { BOLD_INTER_TIGHT } from '../../config/constants/environments';

export default function RwaCalculator() {
  const chainId = useChainId()
  const dispatch = useAppDispatch();
  const netRentalPerMonth = useAppSelector(selectNetRentalPerMonth);
  const totalPropertyValue = useGetTotalValue(chainId) as BigNumberish;
  const appreciation = useAppSelector(selectAppreciation)
  const [initialInvestment, setInitialInvestment] = useState(5500);

  useEffect(() => {
    dispatch(getData())
  }, [dispatch])

  const scrollToElement = () => {
    const element = document.querySelector("#target-element");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <div className='flex flex-col p-0 max-w-[1200px] m-auto gap-[50px]'>
      <div className="flex items-center w-fit py-[6px] pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-secondary">
        <div className="flex items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-primary">
          <IoIosTrendingUp className="w-[24px] h-[24px] text-[#24BC48]" />
        </div>
        <span className="text-[14px] leading-[22px] tracking-[0.02em] font-semibold text-text-primary">Estimate your potential earnings</span>
      </div>
      <div className="flex flex-col w-full lg:flex-row gap-0 items-center p-0 max-w-[1200px] m-auto border-[2px] border-[#61CD81] rounded-[24px] overflow-hidden">
        <div className="flex flex-col flex-1 py-[34px] gap-[20px] justify-between px-[30px] h-[238px]">
          <div className="flex flex-col gap-[10px]">
            <h2 className="text-[28px] mlg:text-[32px] leading-[24px] text-text-primary font-bold">
              Calculate returns
            </h2>
            <h2 className="text-[14px] leading-[22px] text-text-primary">
              Calculate returns effortlessly and make informed financial decisions
              for a brighter future.
            </h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-[minmax(200px,max-content),minmax(310px,max-content),minmax(50px,max-content)] gap-[20px] gap-y-[10px]'>
            <span className={`text-[14px] leading-[22px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>Initial investment</span>
            <input 
              type="range" 
              min="1000" 
              max="10000" 
              value={initialInvestment} 
              onChange={(e) => setInitialInvestment(Number(e.target.value))} 
              className="w-full max-w-auto md:max-w-[310px] accent-[#61CD81]"
            />
            <span className={`text-[18px] leading-[22px] text-[#61CD81] ${BOLD_INTER_TIGHT.className}`}>${initialInvestment.toLocaleString()}</span>
            {/* <span className={`text-[14px] leading-[22px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>Monthly recurring investment</span>
            <input 
              type="range" 
              min="100" 
              max="5000" 
              value={monthlyInvestment} 
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))} 
              className="w-full max-w-[310px] accent-[#61CD81]"
            />
            <span className={`text-[18px] leading-[22px] text-[#61CD81] ${BOLD_INTER_TIGHT.className}`}>${monthlyInvestment.toLocaleString()}</span> */}
          </div>
          <div className="flex justify-between lg:justify-start items-center gap-[20px] text-text-primary">
            <div className='flex flex-col items-center'>
              <p className="text-[12px] leading-[22px] text-center">Annual rent return</p>
              <p className={`text-[18px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}>{(netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100).toFixed(3)} %</p>
            </div>
            <div className='flex flex-col items-center'>
              <p className="text-[12px] leading-[22px] text-center">Annual value growth</p>
              <p className={`text-[18px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}>{(appreciation / Number(formatEther(totalPropertyValue))).toFixed(3)}%</p>
            </div>
            <div className='flex flex-col items-center'>
              <p className="text-[12px] leading-[22px] text-center">Total annual return</p>
              <p className={`text-[18px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}>{(netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100 + appreciation / Number(formatEther(totalPropertyValue))).toFixed(3)}%</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full max-w-auto bg-[#61CD81] lg:max-w-[400px] overflow-hidden py-[24px] h-[268px] px-[20px] gap-[10px] justify-center items-center'>
          <Logo logoClassName='!w-[32px] !h-[32px] mb-[10px]' />
          <div>
            <p className={`text-[22px] leading-[32px] text-[#fff] text-center ${BOLD_INTER_TIGHT.className}`}>Projected returns in 5 years</p>
            <p className={`text-[40px] leading-[42px] text-[#fff] text-center ${BOLD_INTER_TIGHT.className}`}>
              $ {(initialInvestment * Math.pow(1 + Number((netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100 + appreciation / Number(formatEther(totalPropertyValue))).toFixed(3)) / 100, 5)).toLocaleString()}
            </p>
          </div>
          <Button 
            className='!bg-[#fff] w-full mt-[5px] rounded-[100px] py-[10px]' 
            textClassName={`text-[16px] leading-[24px] ${BOLD_INTER_TIGHT.className}`}
            onClick={() => scrollToElement()}
          >
            Invest Now   →
          </Button>
          <p className="text-[14px] leading-[22px] font-medium text-[#FFFFFFCC]">*Estimated annual returns, using yield statistics from all properties on the platform.</p>
        </div>
      </div>
    </div>
  );
};
