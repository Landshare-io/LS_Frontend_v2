import StatusCard from "../status-card"
import HomeRwaHeroSection from "./hero-section"
import HomeRwaAssetsSummary from "./assets-summary"

export default function HomeRwaSection() {
  

  return (
    <div className="bg-primary">
      <HomeRwaHeroSection />
      <StatusCard />
      <HomeRwaAssetsSummary />
    </div>
  )
}
