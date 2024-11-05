import { useChainId } from "wagmi";
import { supportChainIds } from "../../wagmi";
import InventoryPage from "../../components/nft-game/nft-inventory";

export default function Inventory() {
  const chainId = useChainId() as 56 | 137 | 42161 | 97 | 11155111 | 80002;

  return (
    <div>
      {!supportChainIds.includes(chainId) ? (
        <div className="min-h-[600px] flex flex-col justify-center items-center text-center mt-10 text-red-400 text-xl font-medium animate-[sparkling_3s_linear_infinite]">
          Chain not Supported / Switch to BSC
        </div>
      ) : (
        <InventoryPage />
      )}
    </div>
  );
}
