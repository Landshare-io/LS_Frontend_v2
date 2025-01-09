import { useChainId } from 'wagmi'
import type { NextPage } from 'next';
import NftPage from '../../components/nft-game/detail'
import { MAJOR_WORK_CHAINS } from "../../config/constants/environments";

const NFT_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/nft']

const Nft: NextPage = () => {
  const chainId = useChainId() as 56 | 137 | 42161 | 97 | 11155111 | 80002

  return (
    <div className='bg-primary'>
      {!(NFT_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? (
        <div className="min-h-[600px] flex flex-col justify-center items-center text-center mt-10 text-red-400 text-xl font-medium animate-[sparkling_3s_linear_infinite]">
          {`Please switch your chain to ${NFT_MAJOR_WORK_CHAIN.map(chain => chain.name).join(', ')}`}
        </div>
      ) : (
        <NftPage />
      )}
    </div>
  )
}

export default Nft
