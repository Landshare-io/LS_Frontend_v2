import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function CustomProposal() {
  return (
    <>
      <div className="text-[16px] shadow-lg shadow-[#0003] bg-third">
        <div className={`p-[10px] text-[18px] bg-[#61CD81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Custom proposal</div>

        <div className="my-[10px] mx-[7px] text-[15px] text-text-secondary">
          Create a proposal that does not fit into the presets.
          Custom proposals that do not meet the guidelines will be removed. To read the custom proposal guidelines,{" "}
          <a
            href="https://docs.landshare.io/landshare-dao/custom-proposals"
            target="_blank"
          >
            click here
          </a>
          .
        </div>
      </div>
    </>
  );
};
