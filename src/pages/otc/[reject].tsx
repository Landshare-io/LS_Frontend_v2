import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import type { NextPage } from 'next';
import Button from "../../components/common/button";
import otcCheck from "../assets/img/icons/OTC_check.svg";

const OtcRejectOffer: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <div className="text-center flex flex-col justify-center h-[calc(100vh-103px)]">
        <span className="inline-block mx-auto mb-5 w-[130px] h-[130px]">
          <Image src={otcCheck} alt="otc-check" />
        </span>
        <h2 className="text-[22px] md:text-[25px] text-[#000] mb-3">Offer Rejected Successfully</h2>

        <div className="mt-3">
          <Button
            className="w-auto"
            onClick={() => router.push("/property-details")}
          >
            Request new offer
          </Button>
        </div>
      </div>
    </>
  );
};

export default OtcRejectOffer
