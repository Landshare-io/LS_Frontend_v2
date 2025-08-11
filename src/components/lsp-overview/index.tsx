import React, { useState, useEffect } from "react";
import Button from "../common/button";

const LspOverView: React.FC = () => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const targetValue = 35;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setAnimatedValue(targetValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Calculate the stroke-dashoffset for 70% completion (35/50)
  const circumference = 2 * Math.PI * 45; // radius of 45
  const progress = 0.7; // 70% progress
  const offset = circumference - progress * circumference;

  return (
    <div className="bg-secondary border-text-third/40 dark:border-white/20 border-[1px] rounded-3xl shadow-md p-4 w-full flex flex-col gap-6 ">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center space-x-2 bg-primary rounded-full p-1">
          <div className="w-6 h-6 rounded-full bg-third-400 p-[0.7px] flex items-center justify-center">
            <img
              src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><g clip-path="url(%23a)"><path fill="%23F0B90B" fill-rule="evenodd" d="M14 0c7.733 0 14 6.267 14 14s-6.267 14-14 14S0 21.733 0 14 6.267 0 14 0Z" clip-rule="evenodd"/><path fill="%23fff" d="m7.694 14 .01 3.702 3.146 1.85v2.168l-4.986-2.924v-5.878L7.694 14Zm0-3.702v2.157l-1.832-1.083V9.214l1.832-1.083 1.841 1.083-1.84 1.084Zm4.47-1.084 1.832-1.083 1.84 1.083-1.84 1.084-1.832-1.084Z"/><path fill="%23fff" d="M9.018 16.935v-2.168l1.832 1.084v2.157l-1.832-1.073Zm3.146 3.394 1.832 1.084 1.84-1.084v2.157l-1.84 1.084-1.832-1.084V20.33Zm6.3-11.115 1.832-1.083 1.84 1.083v2.158l-1.84 1.083v-2.157l-1.832-1.084Zm1.832 8.488.01-3.702 1.831-1.084v5.879l-4.986 2.924v-2.167l3.145-1.85Z"/><path fill="%23fff" d="m18.982 16.935-1.832 1.073v-2.157l1.832-1.084v2.168Z"/><path fill="%23fff" d="m18.982 11.065.01 2.168-3.155 1.85v3.712l-1.831 1.073-1.832-1.073v-3.711l-3.155-1.851v-2.168l1.84-1.083 3.135 1.86 3.155-1.86 1.84 1.083h-.007Zm-9.964-3.7 4.977-2.935 4.987 2.935-1.832 1.083-3.154-1.86-3.146 1.86-1.832-1.083Z"/></g><defs><clipPath id="a"><path fill="%23fff" d="M0 0h28v28H0z"/></clipPath></defs></svg>'
              alt=""
            />
          </div>
          <span className="font-medium text-text-primary">0xb8...5AEf</span>
          <svg
            className="w-4 h-4 text-text-secondary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <Button
          outlined
          fontWeight="font-normal"
          className={`w-fit h-[32px] px-3 text-text-primary border-primary-green rounded-[100px]`}
          textClassName="text-xs"
        >
          Disconnect Wallet
        </Button>
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center ">
        <div className="relative">
          <svg
            className="size-48 transform stroke-black/20 dark:stroke-white/20 -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="10" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#61cd81"
              strokeWidth="10"
              strokeLinecap="square"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left pt-[4px] text-text-secondary">
                LSP COLLECTED
              </p>
              <div className="text-4xl font-bold text-text-primary">
                {animatedValue} LSP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 mx-auto gap-3">
        <Button
          fontWeight="font-normal"
          className={`md:w-fit w-full h-[32px]  px-3 text-[#fff] rounded-[100px] bg-[#61cd81]`}
          textClassName="hover:dark:text-[#61CD81]  text-xs font-light"
        >
          Stake Vaults
        </Button>
        <Button
          fontWeight="font-normal"
          className={`md:w-fit w-full h-[32px]  px-3 text-[#fff] rounded-[100px]  bg-[#61cd81]`}
          textClassName="hover:dark:text-[#61CD81]  text-xs font-light"
        >
          Buy LAND
        </Button>
        <Button
          fontWeight="font-normal"
          className={`md:w-fit w-full h-[32px]  px-3 text-[#fff] rounded-[100px] bg-[#61cd81]`}
          textClassName="hover:dark:text-[#61CD81] text-xs  font-light"
        >
          NFT Collection
        </Button>
        <Button
          fontWeight="font-normal"
          className={`md:w-fit w-full h-[32px]  px-3 text-[#fff] rounded-[100px] bg-[#61cd81]`}
          textClassName="hover:dark:text-[#61CD81] text-xs font-light"
        >
          Refer Others
        </Button>
      </div>
    </div>
  );
};

export default LspOverView;
