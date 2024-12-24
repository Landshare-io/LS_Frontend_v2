import { useState } from "react";
import { FaFileLines, FaUser } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { HiIdentification } from "react-icons/hi2";
import { IoLink, IoPersonAdd } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import KYCModal from "../common/modals/kyc";
import Button from "../common/button";

export default function ReferralParticipate() {
  const router = useRouter();
  const [iskycmodal, setKycopen] = useState<boolean>(false);
  const [isZeroIDModal, setZeroIDModalOpen] = useState<boolean>(false);

  return (
    <div className="w-full grid lg:grid-cols-[62%_38%] grid-cols-1 h-fit gap-6">
      <div className="w-full md:flex bg-third rounded-[32px] p-8 lg:p-10 gap-6 shadow-lg min-h-[260px]">
        {/* user diagram */}
        <div className="flex gap-4 h-20 md:h-auto items-start">
          <div className="h-20 md:h-full aspect-square shrink-0  bg-[#24BC481A] rounded-lg md:rounded-[32px] ">
            <div className="relative w-full h-full p-5">
              <div className="absolute md:top-5 md:left-5 top-2 left-2 md:size-10 size-2 bg-none border-[#239942] border-l-[1.5px] border-t-[1.5px] rounded-tl-2xl" />
              <div className="absolute md:top-5 md:right-5 top-2 right-2 md:size-10 size-2 bg-none border-[#239942] border-r-[1.5px] border-t-[1.5px] rounded-tr-2xl" />
              <div className="absolute md:bottom-5 md:left-5 bottom-2 left-2 md:size-10 size-2 bg-none border-[#239942] border-l-[1.5px] border-b-[1.5px] rounded-bl-2xl" />
              <div className="absolute md:bottom-5 md:right-5 bottom-2 right-2 md:size-10 size-2 bg-none border-[#239942] border-r-[1.5px] border-b-[1.5px] rounded-br-2xl" />

              <FaUser className="absolute size-4 md:size-16 text-[#61CD81] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-col h-full w-full justify-between">
            <p className="text-text-primary font-bold block md:hidden text-lg">
              KYC Verification
            </p>
            <div className="justify-start items-center flex md:hidden">
              <FaFileLines className="w-6 h-6 text-[#61CD81]" />
              <div className="flex justify-between items-center grow w-8 md:w-auto px-1">
                {Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={index}
                    className={`${
                      index === 0 || index === 9 ? "w-2" : "w-4"
                    } h-[1px] bg-[#B5B5B5] rounded-full`}
                  />
                ))}
              </div>
              <FaUserCircle className="w-5 h-5 text-[#0000004D] flex-none" />
            </div>
          </div>
        </div>
        <div className="h-[150px] flex md:hidden flex-col justify-between pt-6">
          <p className="text-text-secondary text-sm">
            Identity verification is required for referee
            to participate in Landshare's Referral Program and engage with the
            LSRWA security tokens.
          </p>

          <Button
            className={`w-fit h-[44px] px-8 text-[#fff] rounded-[100px] bg-[#61cd81]`}
            textClassName="hover:dark:text-[#61CD81] text-[100%]"
            onClick={() => {
              setKycopen(true);
            }}
          >
            Verify now
          </Button>
        </div>

        {/*md+ right section */}
        <div className="hidden flex-col justify-between md:flex h-0 md:h-auto flex-grow">
          <p className="max-md:mt-6 text-text-primary font-bold  text-lg">
            KYC Verification
          </p>
          <div className="justify-start items-center flex ">
            <FaFileLines className="w-6 h-6 text-[#61CD81]" />

            <div className="flex justify-between items-center grow px-1">
              {Array.from({ length: 10 }, (_, index) => (
                <div
                  key={index}
                  className={`${
                    index === 0 || index === 9 ? "w-2" : "w-4"
                  } h-[1px] bg-[#B5B5B5] rounded-full`}
                />
              ))}
            </div>
            <FaUserCircle className="w-5 h-5 text-[#0000004D] flex-none" />
          </div>

          <p className="text-text-secondary text-sm">
            Identity verification is required for referee
            to participate in Landshare's Referral Program and engage with the
            LSRWA security tokens.
          </p>

          <Button
            className={`w-fit h-[44px] px-8 text-[#fff] rounded-[100px] bg-[#61cd81]`}
            textClassName="hover:dark:text-[#61CD81] text-[100%]"
            onClick={() => {
              setKycopen(true);
            }}
          >
            Verify now
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-between bg-third rounded-[32px] p-8 lg:p-10 gap-6 shadow-lg">
        <div>
          <p className="text-text-primary font-bold text-lg">
            How To Get Started
          </p>

          <p className="text-text-secondary text-sm mt-[29px]">
            The verification process is fast and simple. Once your referees complete the
            KYC process, share you unique affiliate link with them. After they purchase and hold LSRWA, you'll both earn USDC.
          </p>

          <div className="w-full flex justify-start items-center mt-[29px]">
            <div className="flex justify-center items-center w-10 h-10 rounded-full border-[2px] border-[#61CD81]">
              <HiIdentification className="flex-none w-6 h-6 text-[#61CD81]" />
            </div>
            <hr className="grow h-[2px] bg-[#61CD81]" />
            <div className="flex justify-center items-center w-10 h-10 rounded-full border-[2px] border-[#61CD81]">
              <IoLink className="flex-none w-6 h-6 text-[#61CD81]" />
            </div>
            <hr className="grow h-[2px] bg-[#61CD81]" />
            <div className="flex justify-center items-center w-10 h-10 rounded-full border-[2px] border-[#61CD81]">
              <IoPersonAdd className="flex-none w-6 h-6 text-[#61CD81]" />
            </div>
          </div>

          <div className="flex justify-between text-sm text-text-primary py-[10px] font-medium">
            <p className="flex-1 text-start">Pass KYC</p>
            <p>Share Link</p>
            <p className="flex-1 text-end">Refer & Earn</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
         

          <a
            href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa"
            className="flex justify-start items-center text-[#61CD81] font-bold text-sm"
          >
            <p>Learn more about LSRWA</p>
            <MdArrowOutward className="w-4 h-4 text-[#61CD81]" />
          </a>
        </div>
      </div>

      <KYCModal
        iskycmodal={iskycmodal}
        setKycopen={setKycopen}
        isZeroIDModal={isZeroIDModal}
        setZeroIDModalOpen={setZeroIDModalOpen}
      />
    </div>
  );
}
