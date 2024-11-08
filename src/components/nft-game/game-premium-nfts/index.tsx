import { useState } from "react";
import { useChainId, useAccount } from "wagmi";
import { useRouter } from "next/router";
import PremiumNft from "./premium-nft";
import Button from "../../common/button";
import useHandlePremiumNft from "../../../hooks/nft-game/axios/useHandlePremiumNft";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface GamePremiumNftsProps {
  house: any
}

export default function GamePremiumNfts({
  house
}: GamePremiumNftsProps) {
  const chainId = useChainId()
  const { address } = useAccount()
  const router = useRouter()
  const [loader, setLoader] = useState("");
  const { premiumNfts, detachPremiumNftHandler, attachePremiumNftHandler } = useHandlePremiumNft(chainId, address, setLoader, house)

  return (
    <>
      {premiumNfts.length > 0 ? (
        <div className="flex pb-[20px] flex-row overflow-x-scroll mlg:grid mlg:grid-cols-[minmax(257px,max-content),minmax(257px,max-content)] lg:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] justigy-between gap-[4rem] my-5">
          {premiumNfts.map((item, index) => (
            <PremiumNft
              key={`premium-item-${index}`}
              premiumNft={item}
              loader={loader}
              onSubmit={() => item.hasNft ? detachPremiumNftHandler(item) : attachePremiumNftHandler(item)}
            />
          ))}
          <div className="w-[257px] h-[380px] text-center">
            <h2 className="text-text-primary">Need More Upgrades?</h2>
            <p className="text-text-secondary">Check Our Marketplace</p>
            <Button
              className={`w-auto px-4 py-2 rounded-md text-[16px] ${BOLD_INTER_TIGHT.className}`}
              onClick={() => router.push("/marketplace")}
            >
              GO TO MARKETPLACE
            </Button>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="w-[257px] h-[380px] text-center">
            <h2>Need More Upgrades?</h2>
            <p>Check Our Marketplace</p>
            <Button
              className={`w-auto px-4 py-2 rounded-md text-[16px] ${BOLD_INTER_TIGHT.className}`}
              onClick={() => router.push("/marketplace")}
            >
              GO TO MARKETPLACE
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
