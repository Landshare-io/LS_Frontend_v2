import { useEffect } from 'react';
import { useChainId, useAccount } from 'wagmi'
import type { NextPage } from 'next';
import NftMint from '../../components/nft-mint'
import useLogin from '../../hooks/nft-game/axios/useLogin';
import { supportChainIds } from '../../wagmi'

const Mint: NextPage = () => {
  const chainId = useChainId() as 56 | 137 | 42161 | 97 | 11155111 | 80002
  const { address } = useAccount()
  const { checkIsAuthenticated } = useLogin()

  useEffect(() => {
    if (typeof address != "undefined") checkIsAuthenticated(address)
  }, [address])

  return (
    <div>
      {!supportChainIds.includes(chainId) ? (
        <div className="min-h-[600px] flex flex-col justify-center items-center text-center mt-10 text-red-400 text-xl font-medium animate-[sparkling_3s_linear_infinite]">
          Chain not Supported / Switch to BSC
        </div>
      ) : (
        <NftMint />
      )}
    </div>
  )
}

export default Mint
