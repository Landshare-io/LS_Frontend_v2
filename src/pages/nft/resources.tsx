import { useEffect } from 'react';
import { useChainId, useAccount } from 'wagmi'
import type { NextPage } from 'next';
import Head from "next/head";
import NftResource from "../../components/nft-resource";
import useLogin from '../../hooks/nft-game/axios/useLogin';
import { MAJOR_WORK_CHAIN } from "../../config/constants/environments";

const NftResources: NextPage = () => {
  const chainId = useChainId();
  const { address } = useAccount()
  const { checkIsAuthenticated } = useLogin()

  useEffect(() => {
    if (typeof address != "undefined") checkIsAuthenticated(address)
  }, [address])

  return (
    <div>
      <Head>
        <title>Landshare - NFT Resources</title>
      </Head>
      {!(MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? (
        <div className="min-h-[600px] flex flex-col justify-center items-center text-center mt-10 text-red-400 text-xl font-medium animate-[sparkling_3s_linear_infinite]">
          Chain not Supported / Switch to BSC
        </div>
      ) : (
        <NftResource />
      )}
    </div>
  );
};

export default NftResources;
