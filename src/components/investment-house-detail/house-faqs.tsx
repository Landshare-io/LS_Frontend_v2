import React from "react";
import Faq from "../common/faq";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import { MdQuestionMark } from "react-icons/md";
import { useTheme } from "next-themes";

const data = {
  title: "FAQ",
  rows: [
    {
      title: "What does RWA mean?",
      content:
        "RWA stands for real world assets. It is used to refer to physical assets tokenized on the blockchain.",
    },
    {
      title: "What is asset tokenization?",
      content:
        "Asset tokenization is the process by which the ownership of a real estate asset is represented by tokens.",
    },
    {
      title: "How does asset tokenization work?",
      content:
        "The real estate assets are held by a company whose ownership shares are represented by tokens on the blockchain. By holding RWA Tokens, you become a co-owner of the holding company and by extension the asset itself.",
    },
    {
      title: "How do I buy RWA Tokens?",
      content:
        "In order to be eligible to purchase RWA Tokens, you must first complete the KYC process at dashboard.landshare.io. After verification, you can purchase RWA Tokens on the Landshare App or dashboard.",
    },
    {
      title: "Are RWA Tokens considered securities?",
      content:
        "Yes, RWA Tokens are considered securities. KYC is required to purchase them and certain geographic restrictions apply.",
    },
    {
      title: "What is property appreciation?",
      content:
        "Property appreciation is an estimate of how much the property itself will increase in value over one year. Asset Token market value may not correlate with the appreciation of the asset.",
    },
    {
      title: "What is annual return?",
      content:
        "The annual return is the 1-year ROI when accounting for both Rental Yield and appreciation. All financial information is estimated for your information only, and is subject to change at any time.",
    },
    {
      title: "How do I sell my RWA Tokens?",
      content:
        "RWA Tokens can be sold on the RWA Portal page of the Landshare App or on DS Swap.",
    },
    {
      title:
        "Which countries are restricted from participating in the token sale?",
      content:
        "United States, Afghanistan, Albania , Barbados , Balkans, Botswana , Burkina Faso , Burma, Cambodia , Central African Republic, China, Cote D’Ivoire, Crimean Peninsula, Cuba, Democratic Republic of Congo, Eritrea, Guinea-Bissau, Iran, Iraq, Jamaica, LNR (Luhansk Republic), Lebanon, Libya, Liberia, Mauritius, Mali, Morocco, Myanmar, Nicaragua, North Korea, Pakistan , Panama , Senegal , Somalia, Sudan , Syria , Uganda , Yemen , Venezuela, Zimbabwe, Anguilla, Dominica, Fiji, Palau, Samoa, Seychelles, Trinidad and Tobago, Vanuatu. This list is not all inclusive. Additional restrictions may apply. Token lock periods may also apply to certain jurisdictions. Additional information will be provided in follow up documentation such as PPMs and Token Purchase Agreements.",
    },
    {
      title: "What happens if Landshare goes out of business?",
      content:
        "The entity which owns the asset is separate from Landshare and wholly owned by the token holders. The tokens will always represent the principle value of the underlying asset.",
    },
    {
      title: "What is the Landshare Token?",
      content:
        "The Landshare Token is the native utility token of the Landshare platform and does not represent the value of real estate assets. Each asset token purchase is paid partially in Landshare Tokens.",
    },
  ],
};

export default function HouseFaqs() {
  const { theme } = useTheme();
  const styles = {
    bgColor: "light-gray",
    rowTitleTextSize: "18px",
    rowContentTextSize: "15px",
    rowContentPaddingTop: "10px",
    rowContentPaddingBottom: "10px",

    // rowContentColor: 'grey',
    arrowColor: theme == "dark" ? "#f1f1f1" : "#0a0a0a",
  };
  return (
    <div className="max-w-[1200px] m-auto py-[50px] space-y-2 px-[10px]">
      <div className="flex items-center w-fit py-[6px] pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-secondary ">
        <div className="flex items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-primary">
          <MdQuestionMark className="w-[24px] h-[24px] text-[#61CD81]" />
        </div>
        <span className="text-[14px] capitalize leading-[22px] tracking-[0.02em] font-semibold text-text-primary">
          FAQs
        </span>
      </div>
      <h2
        className={`text-text-primary leading-normal text-[18px] md:text-[32px] ${BOLD_INTER_TIGHT.className}`}
      >
        House FAQs{" "}
      </h2>
      <div className="flex flex-col gap-6">
        {data.rows.map((faqData: any, index: number) => (
          <Faq answer={faqData.content} question={faqData.title} key={index} />
        ))}
      </div>
    </div>
  );
}
