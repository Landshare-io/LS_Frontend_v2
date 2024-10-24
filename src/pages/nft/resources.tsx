import React from "react";
import type { NextPage } from 'next';
import Head from "next/head";
import { useChainId } from "wagmi";
import NftResource from "../../components/nft-resource";
import { MAJOR_WORK_CHAIN } from "../../config/constants/environments";

const NftResources: NextPage = () => {
  const chainId = useChainId();

  return (
    <div>
      <Head>
        <title>Landshare - NFT Resources</title>
      </Head>
      {chainId === MAJOR_WORK_CHAIN.id ? (
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
