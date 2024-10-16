import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function CreateBounty() {
  return (
    <>
      <div className="my-[25px] text-[16px] shadow-lg shadow-[#0003] bg-third">
        <div className={`p-[10px] text-[18px] bg-[#61CD81] text-button-text-secondary ${BOLD_INTER_TIGHT.className}`}>Create New Marketing Bounty</div>

        <div className="my-[10px] mx-[7px] text-[15px] text-text-secondary">
          Your bounty proposal should include:
          <ul className="mt-2">
            <li>A clear description of the task</li>
            <li>The amount of LAND per participant</li>
            <li>The number of participant slots</li>
            <li>The duration of the bounty (if applicable)</li>
          </ul>
          To see an example,{" "}
          <a
            href="https://docs.landshare.io/landshare-dao/creating-marketing-bounties-and-contests"
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
