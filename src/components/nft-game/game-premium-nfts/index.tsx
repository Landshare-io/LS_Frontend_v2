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
        <div className="flex mb-[40px] pb-[50px] flex-row overflow-x-auto md:grid md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content)] mlg:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] lg:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] justify-between w-full gap-[4rem] mlg:gap-0 my-12">
          {premiumNfts.map((item, index) => (
            <PremiumNft
              key={`premium-item-${index}`}
              premiumNft={item}
              loader={loader}
              onSubmit={() => item.hasNft ? detachPremiumNftHandler(item) : attachePremiumNftHandler(item)}
            />
          ))}
          <div className="flex flex-col items-center min-w-[257px] h-[380px] text-center">
            <h2 className="text-[1.4rem] mt-[35%] text-text-primary">Need More Upgrades?</h2>
            <p className="text-[0.875rem] mt-[10px] text-text-secondary">Check Our Marketplace</p>
            <Button
              className={`w-auto px-4 py-2 mt-[8px] rounded-[20px] text-[16px] bg-[#6c757d] text-white ${BOLD_INTER_TIGHT.className}`}
              onClick={() => router.push("/marketplace")}
            >
              GO TO MARKETPLACE
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center my-12">
          <div className="flex flex-col items-center min-w-[257px] h-[380px] text-center">
            <h2 className="text-[1.4rem] mt-[35%] text-text-primary">Need More Upgrades?</h2>
            <p className="text-[0.875rem] mt-[10px] text-text-secondary">Check Our Marketplace</p>
            <Button
              className={`w-auto px-4 py-2 mt-[8px] rounded-[20px] text-[16px] bg-[#6c757d] text-white ${BOLD_INTER_TIGHT.className}`}
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
