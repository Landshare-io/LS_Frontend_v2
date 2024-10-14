import { useState } from 'react';
import Logo from '../common/logo';
import Button from '../common/button';
import { BOLD_INTER_TIGHT } from '../../config/constants/environments';

export default function RwaCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(5500);
  const [monthlyInvestment, setMonthlyInvestment] = useState(2400);

  const totalAnnualReturn = 21.0; // Sample percentage for total annual return
  const projectedReturns = initialInvestment + monthlyInvestment * 5; // Just an example calculation

  return (
    <div className="flex gap-0 items-center p-0 max-w-[1200px] m-auto border-[2px] border-[#61CD81] rounded-[24px] overflow-hidden ">
      <div className="flex flex-col flex-1 py-[24px] px-[30px] gap-[20px] h-[238px]">
        <h2 className="text-[18px] leading-[24px] text-text-primary">Calculate returns effortlessly and make informed financial decisions for a brighter future.</h2>        
        <div className='grid grid-cols-1 md:grid-cols-[minmax(200px,max-content),minmax(310px,max-content),minmax(50px,max-content)] gap-[20px] gap-y-[10px]'>
          <span className={`text-[14px] leading-[22px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>Initial investment</span>
          <input 
            type="range" 
            min="1000" 
            max="10000" 
            value={initialInvestment} 
            onChange={(e) => setInitialInvestment(Number(e.target.value))} 
            className="w-full max-w-[310px] accent-[#61CD81]"
          />
          <span className={`text-[18px] leading-[22px] text-[#61CD81] ${BOLD_INTER_TIGHT.className}`}>${initialInvestment.toLocaleString()}</span>
          <span className={`text-[14px] leading-[22px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>Monthly recurring investment</span>
          <input 
            type="range" 
            min="100" 
            max="5000" 
            value={monthlyInvestment} 
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))} 
            className="w-full max-w-[310px] accent-[#61CD81]"
          />
          <span className={`text-[18px] leading-[22px] text-[#61CD81] ${BOLD_INTER_TIGHT.className}`}>${monthlyInvestment.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-[20px] text-text-primary">
          <div className='flex flex-col items-center'>
            <p className="text-[12px] leading-[22px]">Annual rent return</p>
            <p className={`text-[18px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}>14.4%</p>
          </div>
          <div className='flex flex-col items-center'>
            <p className="text-[12px] leading-[22px]">Annual value growth</p>
            <p className={`text-[18px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}>7.6%</p>
          </div>
          <div className='flex flex-col items-center'>
            <p className="text-[12px] leading-[22px]">Total annual return</p>
            <p className={`text-[18px] leading-[22px] ${BOLD_INTER_TIGHT.className}`}>{totalAnnualReturn}%</p>
          </div>
        </div>
      </div>

      <div className='flex flex-col bg-[#61CD81] max-w-[400px] overflow-hidden py-[24px] h-[238px] px-[20px] gap-[10px] justify-center items-center'>
        <Logo logoClassName='!w-[32px] !h-[32px]' />
        <div>
          <p className={`text-[22px] leading-[32px] text-[#fff] text-center mb-[5px] ${BOLD_INTER_TIGHT.className}`}>Projected returns in 5 years</p>
          <p className={`text-[40px] leading-[22px] text-[#fff] text-center ${BOLD_INTER_TIGHT.className}`}>${projectedReturns.toLocaleString()}</p>
        </div>
        <Button className='!bg-[#fff] w-full mt-[5px] rounded-[100px] py-[10px]' textClassName={`text-[16px] leading-[24px] ${BOLD_INTER_TIGHT.className}`}>Invest Now   →</Button>
        <p className="text-[14px] leading-[22px] font-medium text-[#FFFFFFCC]">*Estimated annual returns, using yield statistics from all properties on the platform.</p>
      </div>
    </div>
  );
};
