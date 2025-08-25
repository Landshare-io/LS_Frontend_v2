import StatusCard from "../status-card";
import HomeRwaHeroSection from "./hero-section";
import HomeRwaAssetsSummary from "./assets-summary";
import EffortlessStepsSection from "./effortless-steps";

export default function HomeRwaSection() {
  return (
    <div className="bg-primary">
      <HomeRwaHeroSection />
      <StatusCard />
      <EffortlessStepsSection />
      <HomeRwaAssetsSummary />
    </div>
  );
}
