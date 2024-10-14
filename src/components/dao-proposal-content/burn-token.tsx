import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import Input from "../common/input";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

interface BurnTokensProps {
  error: string;
  setError: Function;
  amountToBurn: string;
  setAmountToBurn: Function;
  balance: string;
}

export default function BurnTokens({
  error,
  setError,
  amountToBurn,
  setAmountToBurn,
  balance
}: BurnTokensProps) {
  const [isLoading, setIsLoading] = useState(true);
  const balanceValue = balance.match(/^-?\d+(?:\.\d{0,4})?/)

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <div className="flex w-full justify-center my-auto">
      <ReactLoading type="cylon" color="#61cd81" />
    </div>
  ) : (
    <div className="text-[16px] shadow-lg shadow-[#0003] bg-third">
      <div className={`p-[10px] text-[18px] bg-[#87D99F] text-white text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Burn DAO Treasury Tokens</div>
      <div className="my-[10px] mx-[7px]">
        <Input
          proposal="Burn Tokens"
          error={error}
          setError={setError}
          value={amountToBurn}
          setValue={setAmountToBurn}
          labelClassName="my-3 text-text-secondary"
          containerClassName="w-full"
          label="Enter the amount of tokens to burn. All token burns are sent to the null address and lower the total supply cap."
          max={balance}
        />
        <div className="text-[13px] text-right mr-[5px] mt-[2px] mb-[2px] text-text-secondary">
          Available Balance: <b>{
            balanceValue ? balanceValue[0] : balance
          } LAND</b>
        </div>
      </div>
    </div>
  );
};
