import ReactLoading from "react-loading";
import { bsc } from "viem/chains";
import "./ChangeAutoLANDFee.css";
import Input from "../common/input";
import usePerformanceFee from "../../hooks/contract/AutoVaultV2Contract/usePerformanceFee";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

interface ChangeAutoLANDFeeProps {
  error: string
  setError: Function
  autoLandFee: string
  setAutoLandFee: Function
}

export default function ChangeAutoLANDFee ({
  error,
  setError,
  autoLandFee,
  setAutoLandFee
}: ChangeAutoLANDFeeProps) {
  const { data: fee, isLoading } = usePerformanceFee(bsc.id) as { data: number, isLoading: boolean }
  const currentFee = Math.round(fee / 100.0 * 1000) / 1000

  return isLoading ? (
    <div className="flex w-full justify-center my-auto">
      <ReactLoading type="cylon" color="#61cd81" />
    </div>
  ) : (
    <div className="text-[16px] shadow-lg shadow-[#0003] bg-third">
      <div className={`p-[10px] text-[18px] bg-[#61CD81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Change Auto LAND Fee</div>
      <div className="my-[10px] mx-[7px]">
        <Input
          proposal={"Change Auto LAND Fee"}
          error={error}
          setError={setError}
          value={autoLandFee}
          setValue={setAutoLandFee}
          labelClassName="my-3 text-text-secondary"
          label="Enter the desired autocompounding fee percentage. Fees are applied on each compound and are sent to the DAO treasury."
          unit="%"
          containerClassName="w-full"
        />
        <div className="text-[13px] text-right mt-[10px] mb-[2px] mx-[5px] text-text-secondary">
          Current Fee: <b>{currentFee}%</b>
        </div>
      </div>
    </div>
  );
};
