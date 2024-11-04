import { useNetwork } from 'wagmi'
import MarketplacePage from './Marketplace'

export default function Nft() {
  const { chain } = useNetwork()

  return (
    <div>
      {chain.unsupported ? (
        <div className="min-h-[600px] flex flex-col justify-center items-center text-center mt-10 text-red-400 text-xl font-medium animate-[sparkling-anim_3s_linear_infinite]">
          Chain not Supported / Switch to BSC
        </div>
      ) : (
        <MarketplacePage />
      )}
    </div>
  )
}
