
import { DASHBOARD_FEATURE } from "../../utils/type";
import IconCoinStacked from "../../../public/icons/coin-stacked.svg";
import IconHome from "../../../public/icons/home.svg";
import IconDashboard from "../../../public/icons/dashboard.svg";
import IconCube from "../../../public/icons/cube.svg";
import IconRotate from "../../../public/icons/rotate.svg";
import IconListing from "../../../public/icons/listing.svg";
import RotateDark from "../../../public/icons/rotate-dark.svg"

export const FEATURES: DASHBOARD_FEATURE[] = [
  {
    icon: IconCoinStacked,
    darkIcon: IconCoinStacked,
    title: "Vaults",
    description:
      "Earn rewards for staking LAND in Auto, Manual, and LP Vaults",
    routeName: "/vaults"
  },
  {
    icon: IconHome,
    darkIcon: IconHome,
    title: "RWA Portal",
    description:
      "View properties, trade tokens, and view financial projections",
    routeName: "/rwa"
  },
  {
    icon: IconDashboard,
    darkIcon: IconDashboard,
    title: "Dashboard",
    description:
      "Complete KYC and manage your personal identity information",
    externalLink: "https://dashboard.landshare.io"
  },
  {
    icon: IconCube,
    darkIcon: IconCube,
    title: "NFTs",
    description:
      "Stake RWA Tokens and upgrade your NFTs to earn LAND rewards",
    routeName: "/nft/inventory"
  },
  {
    icon: IconRotate,
    darkIcon: RotateDark,
    title: "DS Swap",
    description: "Seamlessly trade RWA Tokens against LAND and USDC pairs",
    externalLink: "https://app.dsswap.io/info",
  },
  {
    icon: IconListing,
    darkIcon: IconListing,
    title: "Landshare DAO",
    description: "View the latest community proposals in the Landshare DAO",
    routeName: "/dao"
  },
];
