import { useEffect } from 'react';
import { useChainId, useAccount } from 'wagmi'
import type { NextPage } from 'next';
import InventoryPage from '../../components/nft-game/nft-inventory';
import useLogin from '../../hooks/nft-game/axios/useLogin';
import { MAJOR_WORK_CHAINS } from "../../config/constants/environments";

const NFT_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/nft']

const Inventory: NextPage = () => {
  const chainId = useChainId() as 56 | 137 | 42161 | 97 | 11155111 | 80002
  const { address } = useAccount()
  const { checkIsAuthenticated } = useLogin()


  return (
    <div>
      {!(NFT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? (
        <div className="min-h-[600px] flex flex-col justify-center items-center text-center mt-10 text-red-400 text-xl font-medium animate-[sparkling_3s_linear_infinite]">
          {`Please switch your chain to ${NFT_MAJOR_WORK_CHAIN.map(chain => chain.name).join(', ')}`}
        </div>
      ) : (
        <InventoryPage />
      )}
    </div>
  )
}

export default Inventory
