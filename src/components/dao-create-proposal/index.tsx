import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatEther } from "ethers";
import DaoSelectProposal from "../dao-select-proposal";
import DaoProposalContent from "../dao-proposal-content";
import ProposalBuilder from "./proposal-builder";
import useSnapshot from "../../hooks/contract/useSnapshot";
import { useGlobalContext } from "../../context/GlobalContext";
import txHashBuilder from "./tx-hash-builder";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import closeIcon from "../../../public/icons/close.svg";

interface DaoCreateProposalProps {
  refreshProposalList: Function
  balance: string
  close: Function
}

export default function DaoCreateProposal({
  refreshProposalList,
  balance,
  close
}: DaoCreateProposalProps) {
  const { notifySuccess, notifyError } = useGlobalContext();
  const [proposal, setProposal] = useState("Select Proposal");
  const [submit, setSubmit] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [proposalJSON, setProposalJSON] = useState("");
  const [proposalValues, setProposalValues] = useState<any>("");
  const [batchData, setBatchData] = useState("");
  const [hash, setHash] = useState("");
  const [completeHash, setCompleteHash] = useState("");
  const [isRequired, setIsRequired] = useState(true);
  const balanceData = formatEther(balance)?.match(/^-?\d+(?:\.\d{0,4})?/);

  const { snapshot } = useSnapshot({
    title,
    body,
    proposalJSON,
    proposal,
  });

  useEffect(() => {
    document.body.style.overflow = "inherit";

    return () => {
      document.body.style.overflow = "unset"
    };
  }, []);

  useEffect(() => {
    txHashBuilder(
      { setHash, setCompleteHash, setBatchData },
      proposalValues,
      proposal
    );
  }, [proposalValues]);

  useEffect(() => {
    setProposalJSON(
      ProposalBuilder(proposal, proposalValues, hash, completeHash, batchData) as string
    );
  }, [hash]);

  const handleClickNext = () => {
    setSubmit(true);
  };

  const handleClickCancel = () => {
    setSubmit(false);
  };

  const handleClickSubmit = () => {
    if (title != "" && body != "") {
      snapshot(
        () => {
          notifySuccess("Proposal created successfully");
          refreshProposalList();
        },
        (err: Error) => {
          notifyError("Transaction Failed.");
        }
      );

      close();
    } else {
      setIsRequired(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col mlg:flex-row w-full h-full fixed z-[101] top-0 left-0 overflow-hidden bg-[#00000080] backdrop-blur-sm">
        <div className="fixed z-[3] top-[50%] left-[50%] w-[calc(100vw-20px)] h-[85vh] md:w-[400px] md:h-[515px] border-[1px] border-[#fff] rounded-[10px] p-[20px] flex-col translate-x-[-50%] translate-y-[-50%] bg-secondary">
          <Image src={closeIcon} alt="close icon" onClick={() => close()} className="absolute top-[10px] right-[10px] w-[20px] hover:scale-x-110 hover:scale-y-110 hover:duration-300 hover:cursor-pointer" />
          <h1 className={`text-[28px] leading-[42px] mb-[2px] tracking-normal capitalize text-text-primary ${BOLD_INTER_TIGHT.className}`}>Create Proposal</h1>
          {submit ? (
            <>
              <div className="mt-1 text-text-secondary">
                <p>
                  Enter the details of your proposal here. Proposals without a
                  clear description will be removed. For formatting tips,{" "}
                  <a
                    href="https://docs.landshare.io/landshare-dao/proposal-formatting"
                    target="_blank"
                  >
                    click here
                  </a>
                  .
                </p>
                <div className="tracking-[0.02em] relative mb-[10px] mt-3">
                  <h2 className="text-[16px] mb-[5px]">Title</h2>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className={`w-full border-[1px] border-[#969696] rounded-[5px] p-[5px] outline-0 mb-[7px] ${title == "" && !isRequired ? "border-[#d45050]" : ""}`}
                  />
                  {!isRequired && title == "" && (
                    <div className="absolute left-0 botton-[-10px] text-[11px] text-[#d45050]">Required field</div>
                  )}
                </div>
                <div className="tracking-[0.02em] relative mb-[10px]">
                  <h2 className="text-[16px] mb-[5px]">Description</h2>
                  <textarea
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    className={`w-full border-[1px] border-[#969696] rounded-[5px] p-[5px] outline-0 min-h-[170px] ${body == "" && !isRequired ? "border-[#d45050]" : ""}`}
                  />
                  {!isRequired && body == "" && (
                    <div className="absolute left-0 botton-[-10px] text-[11px] text-[#d45050]">Required field</div>
                  )}
                </div>
                <div className="flex gap-[10px] mt-3">
                  <button className="w-[110px] h-[40px] border-0 rounded-[12px] font-semibold text-[18px] leading-[22px] text-[#fff] duration-500 bg-[#61CD81] hover:bg-[#87D99F] active:bg-[#06B844] btn-submit" onClick={handleClickSubmit}>
                    Submit
                  </button>
                  <button className="w-[110px] h-[40px] border-0 rounded-[12px] font-semibold text-[18px] leading-[22px] text-[#fff] duration-500 bg-[#7F0E0C] hover:bg-[#aa1614] active:bg-[#5f1614] btn-cancel" onClick={handleClickCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mr-[15%] mb-[15px] text-[16px] tracking-[0.02em] text-text-secondary">
                Select your proposal from the dropdown menu below.
              </div>
              <DaoSelectProposal value={proposal} setValue={setProposal} />

              {proposal === "Select Proposal" ? (
                <>
                  <div className="flex flex-col mt-[70px] justify-center items-center">
                    <div className="w-full text-center pr-[10px] text-[18px] text-text-secondary">Available Balance:</div>
                    <div className="w-full text-center pr-[10px] mt-[5px] text-[28px] mt-1 text-text-secondary">
                      <b>
                        {balanceData ? balanceData[0] : ''} LAND
                      </b>
                    </div>
                  </div>
                </>
              ) : (
                <DaoProposalContent
                  proposal={proposal}
                  setProposalValues={setProposalValues}
                  onNext={handleClickNext}
                  balance={balance}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
