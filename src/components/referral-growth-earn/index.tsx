import { IoTrendingUp } from "react-icons/io5";

export default function GrowthEarning() {
  return (
    <div className="flex items-center w-fit py-[6px] pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-secondary ">
      <div className="flex items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-primary">
        <IoTrendingUp className="w-[24px] h-[24px] text-[#61CD81]" />
      </div>
      <span className="text-[14px] leading-[22px] tracking-[0.02em] font-semibold text-text-primary">
        Assets of the future
      </span>
    </div>
  );
}
