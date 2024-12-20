import { formatEther } from "viem";
import Input from "../common/input";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

interface RequestGrantProps {
  balance: string;
  grantAmount: string;
  setGrantAmount: Function;
  error: string;
  setError: Function;
}

export default function RequestGrant({
  balance,
  grantAmount,
  setGrantAmount,
  error,
  setError
}: RequestGrantProps) {
  const balanceValue = formatEther(BigInt(balance)).match(/^-?\d+(?:\.\d{0,4})?/)

  function labelInput() {
    const getLink = ({ href, name }: { href: string, name: string }) => {
      return (
        <a
          href={href}
          target="_blank"
          style={{ fontWeight: "600", color: "inherit" }}
        >
          {name}
        </a>
      );
    };

    return (
      <label htmlFor="my-input">
        Request grant from the treasury. Grant funds will be sent to an escrow
        and cleared when approved. For more details on grants, please refer to
        the{" "}
        {getLink({ href: "https://docs.landshare.io", name: "Landshare docs" })}
        .
      </label>
    );
  }

  return (
    <div className="my-[25px] text-[16px] shadow-lg shadow-[#0003] bg-third">
      <div className={`p-[10px] text-[18px] bg-[#61CD81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Request LAND Grant</div>
      <div className="my-[10px] mx-[7px]">
        <Input
          proposal={"Request Grant"}
          label={labelInput()}
          max={formatEther(BigInt(balance))}
          labelClassName="w-full"
          value={grantAmount}
          setValue={setGrantAmount}
          error={error}
          setError={setError}
          containerClassName="my-3 text-text-secondary"
        />

        <div className="text-[13px] text-right mt-[10px] mb-[2px] mx-[5px] text-text-secondary">
          Available Balance: <b>{balanceValue ? balanceValue[0] : balance} LAND</b>
        </div>
      </div>
    </div>
  );
};
