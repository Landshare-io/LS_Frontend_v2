import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function ChangeVotingPeriod() {

  return (
    <>
      <div className="text-[16px] shadow-lg shadow-[#0003] bg-[#01130605]">
        <div className={`p-[10px] text-[18px] bg-[#61CD81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Change Voting Period</div>
        <div className="text-[15px] my-[10px] mx-[7px]">
          The voting period is the length of time in which DAO members can vote on the outcome of a proposal.
        </div>
      </div>
    </>
  );
};
