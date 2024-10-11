import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import "./ProposalContent.css";
import BurnTokens from "./burn-token";
import ChangeVaultAllocation from "./proposals/ChangeVaultAllocation";
import ChangeAutoLANDFee from "./proposals/ChangeAutoLANDFee";
import FundBounty from "./proposals/FundBounty";
import RequestGrant from "./proposals/RequestGrant";
import NextButton from "./components/NextButton";
import CustomProposal from "./proposals/CustomProposal";
import ChangeLandRequirement from "./proposals/ChangeLandRequirement";
import ChangeQuorum from "./proposals/ChangeQuorum";
import CreateBounty from "./proposals/CreateBounty";
import ChangeVotingPeriod from "./proposals/ChangeVotingPeriod";

import { useLandshareFunctions } from "../../contexts/LandshareFunctionsProvider";

export default function DaoProposalContent(props) {
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
  const { notifyError } = useLandshareFunctions();

  // Hardcoded because it won't be changed, which is from totalAllocPoint of MasterChef contract
  const totalAllocPoint = 3000;

  const handlNext = () => {
    switch (props.proposal) {
      case "Burn Tokens":
        if (amountToBurn == "") {
          setError("Required field");
        } else if (amountToBurn == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          props.setProposalValues({ amountToBurn });
          props.onNext();
        }
        break;

      case "Change Auto LAND Fee":
        if (autoLandFee == "") {
          setError("Required field");
        } else if (autoLandFee == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          props.setProposalValues({ autoLandFee });
          props.onNext();
        }
        break;

      case "Add to Marketing Fund":
        if (amountToMarketing == "") {
          setError("Required field");
        } else if (amountToMarketing == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          props.setProposalValues({ amountToMarketing });
          props.onNext();
        }
        break;

      case "Request Grant":
        if (grantAmount == "") {
          setError("Required field");
        } else if (grantAmount == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          props.setProposalValues({ grantAmount });
          props.onNext();
        }
        break;

      case "Create Bounty":
        props.onNext();

        break;

      case "Change Voting Period":
        if (numberHolder == "") {
          setError("Required field");
        } else if (numberHolder == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          props.onNext();
        }

        break;

      case "Change LAND Requirement":
        if (numberHolder == "") {
          setError("Required field");
        } else if (numberHolder == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          props.onNext();
        }

        break;

      case "Change Quorum":
        if (numberHolder == "") {
          setError("Required field");
        } else if (numberHolder == 0) {
          setError("Input number greater than 0");
        } else if (error == "") {
          props.onNext();
        }

        break;

      case "Custom Proposal":
        props.onNext();

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

          props.setProposalValues({
            allocPointsBurn,
            allocPointsStake,
            allocPointsLP,
            allocLSRWA
          });
          props.onNext();
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setError("");
    setIsLoading(false);
  }, [props.proposal]);

  return isLoading ? (
    <div className="col-12 d-flex justify-content-center my-auto">
      <ReactLoading type="cylon" color="#61cd81" />
    </div>
  ) : (
    <>
      <div className="proposal-content-container">
        {props.proposal === "Burn Tokens" && (
          <BurnTokens
            error={error}
            setError={setError}
            amountToBurn={amountToBurn}
            setAmountToBurn={setAmountToBurn}
            balance={props.balance}
          />
        )}
        {props.proposal === "Change Vault Allocation" && (
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
        {props.proposal === "Change Auto LAND Fee" && (
          <ChangeAutoLANDFee
            error={error}
            setError={setError}
            autoLandFee={autoLandFee}
            setAutoLandFee={setAutoLandFee}
          />
        )}

        {props.proposal === "Add to Marketing Fund" && (
          <FundBounty
            amountToMarketing={amountToMarketing}
            setAmountToMarketing={setAmountToMarketing}
            error={error}
            setError={setError}
            balance={props.balance}
          />
        )}

        {props.proposal === "Request Grant" && (
          <RequestGrant
            grantAmount={grantAmount}
            setGrantAmount={setGrantAmount}
            error={error}
            setError={setError}
            balance={props.balance}
          />
        )}

        {props.proposal === "Create Bounty" && <CreateBounty />}

        {props.proposal === "Change LAND Requirement" && (
          <ChangeLandRequirement
            numberHolder={numberHolder}
            setNumberHolder={setNumberHolder}
            error={error}
            setError={setError}
          />
        )}
        {props.proposal === "Change Quorum" && (
          <ChangeQuorum
            numberHolder={numberHolder}
            setNumberHolder={setNumberHolder}
            error={error}
            setError={setError}
          />
        )}
        {props.proposal === "Change Voting Period" && (
          <ChangeVotingPeriod
            numberHolder={numberHolder}
            setNumberHolder={setNumberHolder}
            error={error}
            setError={setError}
          />
        )}

        {props.proposal === "Custom Proposal" && <CustomProposal />}
      </div>
      <div className="proposal-content-container-btn">
        <NextButton onClick={handlNext} />
      </div>
    </>
  );
};
