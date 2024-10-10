import { useState } from 'react';

export default function RwaCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(5500);
  const [monthlyInvestment, setMonthlyInvestment] = useState(2400);

  const totalAnnualReturn = 21.0; // Sample percentage for total annual return
  const projectedReturns = initialInvestment + monthlyInvestment * 5; // Just an example calculation

  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md p-8">
      {/* Left Section */}
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-4">Calculate returns effortlessly and make informed financial decisions for a brighter future.</h2>
        
        {/* Investment Sliders */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>Initial investment</span>
            <span className="text-green-500">${initialInvestment}</span>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="10000" 
            value={initialInvestment} 
            onChange={(e) => setInitialInvestment(Number(e.target.value))} 
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>Monthly recurring investment</span>
            <span className="text-green-500">${monthlyInvestment}</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="5000" 
            value={monthlyInvestment} 
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))} 
            className="w-full"
          />
        </div>

        {/* Return Values */}
        <div className="flex justify-between items-center text-center border-t pt-4 mt-4">
          <div>
            <p className="text-sm">Annual rent return</p>
            <p className="text-lg font-bold">14.4%</p>
          </div>
          <div>
            <p className="text-sm">Annual value growth</p>
            <p className="text-lg font-bold">7.6%</p>
          </div>
          <div>
            <p className="text-sm">Total annual return</p>
            <p className="text-lg font-bold">{totalAnnualReturn}%</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-green-100 rounded-lg p-8 mt-6 md:mt-0 md:ml-8 text-center">
        <p className="text-md mb-4">Projected returns in 5 years</p>
        <p className="text-3xl font-bold text-green-600">${projectedReturns.toLocaleString()}</p>
        <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg">Invest Now →</button>
        <p className="mt-4 text-xs text-gray-500">*Estimated annual returns, using yield statistics from all properties on the platform.</p>
      </div>
    </div>
  );
};
