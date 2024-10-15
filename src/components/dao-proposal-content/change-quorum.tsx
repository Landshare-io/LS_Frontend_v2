import Input from "../common/input";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import "./BurnTokens.css";

interface ChangeQuorumProps {
  error: string;
  setError: Function;
  numberHolder: string;
  setNumberHolder: Function;
  balance: string;
}

export default function ChangeQuorum({
  error,
  setError,
  numberHolder,
  setNumberHolder,
  balance
}: ChangeQuorumProps) {
  return (
    <>
      <div className="text-[16px] shadow-lg shadow-[#0003] bg-[#01130605]">
        <div className={`p-[10px] text-[18px] bg-[#61CD81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Change Quorum</div>
        <Input
          proposal={"Change Quorum"}
          error={error}
          setError={setError}
          value={numberHolder}
          setValue={setNumberHolder}
          labelClassName="my-3"
          label="  A quorum is the minimum amount of voting power 
          (in LAND) that is required for a proposal to be considered valid. 
          If the quorum is not met, the proposal is invalid regardless of outcome."
          containerClassName="w-full"
          max={balance}
        />
      </div>
    </>
  );
};
