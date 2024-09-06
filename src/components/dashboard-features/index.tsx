import { Inter_Tight } from "next/font/google";
import { FEATURES } from "../../config/constants/page-data";
import { DASHBOARD_FEATURE } from "../../utils/type";
import FeatureCard from "./feature-card";

const boldInterTight = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});

export default function DashboardFeautre() {
  return (
    <div
        className="bg-primary px-[10px] py-[60px] mlg:px-[40px] mlg:py-[80px] xl:px-[120px]"
      >
        <div className="flex flex-col jusity-between items-center max-w-[1200px] m-auto our-features-section">
          <h1 className={`text-text-primary text-[32px] leading-[48px] md:text-[54px] md:leading-[68px] mb-[20px] md:mt-[40px] md:mb-[64px] text-center ${boldInterTight.className}`}>Our Features</h1>
          <div className="grid grid-col-1 gap-[24px] gap-y-[24px] md:gap-[50px] mlg:pr-0 mlg:gap-x-[100px] mlg:gap-y-[50px] md:grid-cols-2">
            {FEATURES.map((feature: DASHBOARD_FEATURE) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
  )
}