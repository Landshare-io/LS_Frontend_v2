import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import BurnTokens from "./burn-token";
import ChangeVaultAllocation from "./change-vault-allocation";
import ChangeAutoLANDFee from "./change-autoland-fee";
import FundBounty from "./fund-bounty";
import RequestGrant from "./request-grant";
import NextButton from "./next-button";
import CustomProposal from "./custom-proposal";
import ChangeLandRequirement from "./change-land-requirement";
import ChangeQuorum from "./change-quorum";
import CreateBounty from "./create-bounty";
import ChangeVotingPeriod from "./change-voting-period";
import { useTheme } from "next-themes";

interface DaoProposalContentProps {
  setProposalValues: Function;
  onNext: Function;
  proposal: any;
  balance: string
}

export default function DaoProposalContent({
  setProposalValues,
  onNext,
  proposal,
  balance
}: DaoProposalContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [amountToBurn, setAmountToBurn] = useState("");
  const [autoLandFee, setAutoLandFee] = useState("");
  const [amountToMarketing, setAmountToMarketing] = useState("");
  const [grantAmount, setGrantAmount] = useState("");
  const [allocPointsBurn, setAllocPointsBurn] = useState("");
  const [allocPointsStake, setAllocPointsStake] = useState("");
  const [allocPointsLP, setAllocPointsLP] = useState("");
  const [allocLSRWA, setAllocLSRWA] = useState("");
  const [error, setError] = useState("");
  const [errorAPBurn, setErrorAPBurn] = useState("");
  const [errorAPStake, setErrorAPStake] = useState("");
  const [errorAPLp, setErrorAPLp] = useState("");
  const [errorLSRWA, setErrorLSRWA] = useState("");
  const [numberHolder, setNumberHolder] = useState("");
  const { notifyError } = useGlobalContext();

  // Hardcoded because it won't be changed, which is from totalAllocPoint of MasterChef contract
  const totalAllocPoint = 3000;

  const handlNext = () => {
    switch (proposal) {
      case "Burn Tokens":
        if (amountToBurn == "") {
          setError("Required field");
        } else if (Number(amountToBurn) == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          setProposalValues({ amountToBurn });
          onNext();
        }
        break;

      case "Change Auto LAND Fee":
        if (autoLandFee == "") {
          setError("Required field");
        } else if (Number(autoLandFee) == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          setProposalValues({ autoLandFee });
          onNext();
        }
        break;

      case "Add to Marketing Fund":
        if (amountToMarketing == "") {
          setError("Required field");
        } else if (Number(amountToMarketing) == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          setProposalValues({ amountToMarketing });
          onNext();
        }
        break;

      case "Request Grant":
        if (grantAmount == "") {
          setError("Required field");
        } else if (Number(grantAmount) == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          setProposalValues({ grantAmount });
          onNext();
        }
        break;

      case "Create Bounty":
        onNext();

        break;

      case "Change Voting Period":
        if (numberHolder == "") {
          setError("Required field");
        } else if (Number(numberHolder) == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          onNext();
        }

        break;

      case "Change LAND Requirement":
        if (numberHolder == "") {
          setError("Required field");
        } else if (Number(numberHolder) == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          onNext();
        }

        break;

      case "Change Quorum":
        if (numberHolder == "") {
          setError("Required field");
        } else if (Number(numberHolder) == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          onNext();
        }

        break;

      case "Custom Proposal":
        onNext();

        break;

      case "Change Vault Allocation":
        if (errorAPBurn === "" && errorAPStake === "" && errorAPLp === "") {
          if (
            parseInt(allocPointsBurn) +
            parseInt(allocPointsStake) +
            parseInt(allocPointsLP) +
            parseInt(allocLSRWA) !==
            totalAllocPoint
          ) {
            notifyError(`Total points should be ${totalAllocPoint}`);
            break;
          }

          setProposalValues({
            allocPointsBurn,
            allocPointsStake,
            allocPointsLP,
            allocLSRWA
          });
          onNext();
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setError("");
    setIsLoading(false);
  }, [proposal]);

  return isLoading ? (
    <div className="flex w-full justify-center my-auto">
      <ReactLoading type="cylon" color="#61cd81" />
    </div>
  ) : (
    <>
      <div className="relative rounded-[10px] flex flex-col justify-center my-auto">
        {proposal === "Burn Tokens" && (
          <BurnTokens
            error={error}
            setError={setError}
            amountToBurn={amountToBurn}
            setAmountToBurn={setAmountToBurn}
            balance={balance}
          />
        )}
        {proposal === "Change Vault Allocation" && (
          <ChangeVaultAllocation
            errorBurn={errorAPBurn}
            setErrorBurn={setErrorAPBurn}
            errorStake={errorAPStake}
            setErrorStake={setErrorAPStake}
            errorLp={errorAPLp}
            setErrorLp={setErrorAPLp}
            errorLSRWA={errorLSRWA}
            setErrorLSRWA={setErrorLSRWA}
            allocPointsBurn={allocPointsBurn}
            setAllocPointsBurn={setAllocPointsBurn}
            allocPointsStake={allocPointsStake}
            setAllocPointsStake={setAllocPointsStake}
            allocPointsLP={allocPointsLP}
            setAllocPointsLP={setAllocPointsLP}
            allocLSRWA={allocLSRWA}
            setAllocLSRWA={setAllocLSRWA}
          />
        )}
        {proposal === "Change Auto LAND Fee" && (
          <ChangeAutoLANDFee
            error={error}
            setError={setError}
            autoLandFee={autoLandFee}
            setAutoLandFee={setAutoLandFee}
          />
        )}

        {proposal === "Add to Marketing Fund" && (
          <FundBounty
            amountToMarketing={amountToMarketing}
            setAmountToMarketing={setAmountToMarketing}
            error={error}
            setError={setError}
            balance={balance}
          />
        )}

        {proposal === "Request Grant" && (
          <RequestGrant
            grantAmount={grantAmount}
            setGrantAmount={setGrantAmount}
            error={error}
            setError={setError}
            balance={balance}
          />
        )}

        {proposal === "Create Bounty" && <CreateBounty />}

        {proposal === "Change LAND Requirement" && (
          <ChangeLandRequirement />
        )}
        {proposal === "Change Quorum" && (
          <ChangeQuorum
            numberHolder={numberHolder}
            setNumberHolder={setNumberHolder}
            error={error}
            setError={setError}
            balance={balance}
          />
        )}
        {proposal === "Change Voting Period" && (
          <ChangeVotingPeriod />
        )}

        {proposal === "Custom Proposal" && <CustomProposal />}
      </div>
      <div className="relative min-h-[40px] flex flex-col">
        <NextButton onClick={handlNext} />
      </div>
    </>
  );
};
