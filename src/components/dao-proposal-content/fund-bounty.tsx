import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import Input from "../common/input";

interface FundBountyProps {
  balance: string;
  amountToMarketing: string;
  setAmountToMarketing: Function;
  error: string;
  setError: Function;
}

export default function FundBounty({
  balance,
  amountToMarketing,
  setAmountToMarketing,
  error,
  setError
}: FundBountyProps) {
  return (
    <div className="text-[16px] shadow-lg shadow-[#0003] bg-third">
      <div className={`p-[10px] text-[18px] bg-[#61cd81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Add LAND to Marketing Fund</div>
      <div className="my-[10px] mx-[7px]">
        <Input
          proposal={"Add to Marketing Fund"}
          label="Allocate treasury balance to the marketing bounty program. LAND in the marketing fund is used for bounty proposals."
          max={balance}
          containerClassName="w-full"
          value={amountToMarketing}
          setValue={setAmountToMarketing}
          error={error}
          setError={setError}
          labelClassName="my-3 text-text-secondary"
        />

        <div className="text-[13px] text-right mt-[2px] mb-[2px] mr-[5px] text-text-secondary">
          Available Balance: <b>{balance} LAND</b>
        </div>
      </div>
    </div>
  );
};
