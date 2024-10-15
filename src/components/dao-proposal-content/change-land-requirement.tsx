import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function ChangeLandRequirement() {
  return (
    <>
      <div className="text-[16px] shadow-lg shadow-[#0003] bg-adder">
        <div className={`p-[10px] text-[18px] bg-[#61CD81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Change LAND Requirement to Create Proposal</div>
        <div className="text-[15px] my-[10px] mx-[7px]">
          Change the minimum amount of LAND require to create a new proposal.
          <br></br>
          Current minimum:<b>100 LAND</b>
        </div>
      </div>
    </>
  );
};
