import { useState, useEffect } from "react";
import ReactLoading from 'react-loading';
import { formatEther, BigNumberish } from "ethers";
import Button from "../common/button";
import useShowOffer from "../../hooks/contract/SwapCatContract/useShowoffer";
import useBuyOffer from "../../hooks/contract/otc/useBuyOffer";
import useApproveOffer from "../../hooks/contract/otc/useApproveOffer";

interface RequestsCardProps {
  requestData: any;
  completeRequest: Function;
  rejectRequest: any;
}

export default function RequestsCard({ requestData, completeRequest, rejectRequest }: RequestsCardProps) {
  const [isSwapping, setIsSwapping] = useState([false, false]);
  const [BUSDAmount, setBUSDAmount] = useState<BigNumberish>(0);
  const [LANDAmount, setLANDAmount] = useState<BigNumberish>(0);
  const [BUSDAmountAT, setBUSDAmountAT] = useState(0);
  const [LANDAmountAT, setLANDAmountAT] = useState(0);

  const getOfferAmounts = async () => {

    setBUSDAmount(busdOffer[4]);
    setLANDAmount(landOffer[4]);
    setBUSDAmountAT(busdOffer[3].toString());
    setLANDAmountAT(landOffer[3].toString());

    return parseInt(landOffer[5].toString()).toString() + parseInt(landOffer[5].toString()).toString();
  };

  useEffect(() => {
    getOfferAmounts();
  }, []);

  const { buyOffer } = useBuyOffer(setIsSwapping, getOfferAmounts, completeRequest)
  const { data: busdOffer } = useShowOffer(requestData.BUSDofferId) as { data: any[] }
  const { data: landOffer } = useShowOffer(requestData.LANDofferId) as { data: any[] }
  const { approveAsset } = useApproveOffer(buyOffer, setIsSwapping)

  if (requestData.status === "rejected") return null;
  if (requestData.status === "rejected_by_user") return null;


  const approveOffer = async (tokenType: string) => {
    const offerID = requestData[`${tokenType}offerId`]; // BUSDofferId or LANDofferId
    const offer = tokenType == "BUSD" ? busdOffer : landOffer
    const amountOfOffer = offer[4];
    const buyerPrice = offer[3];

    if (amountOfOffer === "0") {
      return;
    }

    if (tokenType === "BUSD") setIsSwapping([true, false]);
    else setIsSwapping([false, true]);

    approveAsset(offerID, tokenType, buyerPrice);
  };

  return (
    <div className="w-full lg:w-[50-%] pt-3">
      <div className="border-[1px] border-[#c2c1c1] shadow-md rounded-[8px] p-[15px] block h-full">
        <div className="grid grid-cols-4 justify-between">
          <div className="flex flex-col">
            <span className="text-[#00000080] text-[14px] w-[125px]">
              Token:&nbsp;
            </span>
            <span className="text-[#000] text-[20px] font-normal">{requestData.token}</span>
          </div>
          <div className="flex flex-col col-3">
            <span className="text-[#00000080] text-[14px] w-[125px]">
              Amount:&nbsp;
            </span>
            <span className="text-[#000] text-[20px] font-normal">{requestData.amount}</span>
          </div>
          <div className="flex flex-col text-capitalize">
            <span className="text-[#00000080] text-[14px] w-[125px]">
              Type:&nbsp;
            </span>
            <span className="text-[#000] text-[20px] font-normal">{requestData.type}</span>
          </div>
          {requestData.status === "approved" && (
            <Button
              className="bg-[#dc3545] rounded-[41px] text-white text-[20px] py-[5px] px-[20px] duration-300 border-[2px] border-[#dc3545] text-uppercase mt-3 h-[34px] w-[95px]"
              textClassName="text-[14px]"
              onClick={() => rejectRequest()}
            >
              Reject
            </Button>
          )}
        </div>
        {requestData.status === "new" && <p className="text-info">Pending</p>}
        {requestData.status === "rejected" && (
          <p className="text-danger">Rejected</p>
        )}
        {requestData.status === "completed" && (
          <p className="text-success">Completed</p>
        )}
        {requestData.status === "approved" && (
          <div className="flex mt-3 text-[14px]">
            <div className="bg-[#f1f1f1] rounded-[4px] flex-1 mr-1 mt-2 p-2 text-center">
              <p className="mb-0 font-normal">
                {BUSDAmountAT}&nbsp;{requestData.token}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="10"
                  viewBox="0 0 18 13"
                  fill="none"
                  className="mx-1"
                >
                  <path
                    d="M1.99319 5.5162C1.77597 5.51642 1.56458 5.4459 1.39099 5.31531C1.21741 5.18471 1.09107 5.00114 1.03108 4.79237C0.971087 4.58359 0.980711 4.36096 1.05849 4.15813C1.13628 3.95531 1.27798 3.78333 1.46219 3.6682L4.15019 0.980203C4.33783 0.792695 4.59228 0.687406 4.85755 0.6875C5.12282 0.687594 5.37718 0.793062 5.56469 0.980703C5.7522 1.16834 5.85749 1.42279 5.85739 1.68806C5.8573 1.95333 5.75183 2.20769 5.56419 2.3952L4.44319 3.5152H11.9932C12.2584 3.5152 12.5128 3.62056 12.7003 3.8081C12.8878 3.99563 12.9932 4.24999 12.9932 4.5152C12.9932 4.78042 12.8878 5.03477 12.7003 5.22231C12.5128 5.40985 12.2584 5.5152 11.9932 5.5152H1.99319V5.5162ZM16.0072 7.4842C16.2244 7.48398 16.4358 7.55451 16.6094 7.6851C16.783 7.81569 16.9093 7.99926 16.9693 8.20804C17.0293 8.41682 17.0197 8.63945 16.9419 8.84227C16.8641 9.04509 16.7224 9.21707 16.5382 9.3322L13.8502 12.0202C13.7573 12.113 13.647 12.1867 13.5256 12.2369C13.4043 12.2871 13.2742 12.313 13.1428 12.3129C13.0115 12.3129 12.8814 12.2869 12.7601 12.2366C12.6388 12.1863 12.5285 12.1126 12.4357 12.0197C12.3428 11.9268 12.2692 11.8165 12.219 11.6951C12.1688 11.5738 12.1429 11.4437 12.143 11.3124C12.143 11.181 12.169 11.0509 12.2193 10.9296C12.2696 10.8083 12.3433 10.698 12.4362 10.6052L13.5572 9.4852H6.00719C5.74198 9.4852 5.48762 9.37985 5.30009 9.19231C5.11255 9.00477 5.00719 8.75042 5.00719 8.4852C5.00719 8.21999 5.11255 7.96563 5.30009 7.7781C5.48762 7.59056 5.74198 7.4852 6.00719 7.4852H16.0072V7.4842Z"
                    fill="black"
                  />
                </svg>
                {Math.round(Number(formatEther(BUSDAmount)))} BUSD
              </p>
              <Button
                className={`bg-[#61cd91] rounded-[41px] text-white px-[20px] py-[5px] duration-300 border-[2px] border-[#61cd91] mt-3 m-auto h-[34px] w-[120px] ${isSwapping[0]
                  ? "flex justify-center items-center"
                  : ""
                  }`}
                textClassName="text-[14px]"
                onClick={() => approveOffer("BUSD")}
                disabled={isSwapping[0]}
              >
                {isSwapping[0] && (
                  <ReactLoading
                    type="spin"
                    className="mr-2 mb-[4px] mt-0"
                    width="24px"
                    height="24px"
                  />
                )}
                <span>SWAP</span>
              </Button>
            </div>
            <div className="bg-[#f1f1f1] rounded-[4px] flex-1 ml-1 mt-2 p-2 text-center">
              <p className="mb-0 font-normal">
                {LANDAmountAT}&nbsp;{requestData.token}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="10"
                  viewBox="0 0 18 13"
                  fill="none"
                  className="mx-1"
                >
                  <path
                    d="M1.99319 5.5162C1.77597 5.51642 1.56458 5.4459 1.39099 5.31531C1.21741 5.18471 1.09107 5.00114 1.03108 4.79237C0.971087 4.58359 0.980711 4.36096 1.05849 4.15813C1.13628 3.95531 1.27798 3.78333 1.46219 3.6682L4.15019 0.980203C4.33783 0.792695 4.59228 0.687406 4.85755 0.6875C5.12282 0.687594 5.37718 0.793062 5.56469 0.980703C5.7522 1.16834 5.85749 1.42279 5.85739 1.68806C5.8573 1.95333 5.75183 2.20769 5.56419 2.3952L4.44319 3.5152H11.9932C12.2584 3.5152 12.5128 3.62056 12.7003 3.8081C12.8878 3.99563 12.9932 4.24999 12.9932 4.5152C12.9932 4.78042 12.8878 5.03477 12.7003 5.22231C12.5128 5.40985 12.2584 5.5152 11.9932 5.5152H1.99319V5.5162ZM16.0072 7.4842C16.2244 7.48398 16.4358 7.55451 16.6094 7.6851C16.783 7.81569 16.9093 7.99926 16.9693 8.20804C17.0293 8.41682 17.0197 8.63945 16.9419 8.84227C16.8641 9.04509 16.7224 9.21707 16.5382 9.3322L13.8502 12.0202C13.7573 12.113 13.647 12.1867 13.5256 12.2369C13.4043 12.2871 13.2742 12.313 13.1428 12.3129C13.0115 12.3129 12.8814 12.2869 12.7601 12.2366C12.6388 12.1863 12.5285 12.1126 12.4357 12.0197C12.3428 11.9268 12.2692 11.8165 12.219 11.6951C12.1688 11.5738 12.1429 11.4437 12.143 11.3124C12.143 11.181 12.169 11.0509 12.2193 10.9296C12.2696 10.8083 12.3433 10.698 12.4362 10.6052L13.5572 9.4852H6.00719C5.74198 9.4852 5.48762 9.37985 5.30009 9.19231C5.11255 9.00477 5.00719 8.75042 5.00719 8.4852C5.00719 8.21999 5.11255 7.96563 5.30009 7.7781C5.48762 7.59056 5.74198 7.4852 6.00719 7.4852H16.0072V7.4842Z"
                    fill="black"
                  />
                </svg>
                {Math.round(Number(formatEther(LANDAmount)))} LAND
              </p>
              <button
                className={`bg-[#61cd91] rounded-[41px] text-white px-[20px] py-[5px] duration-300 border-[2px] border-[#61cd91] mt-3 m-auto h-[34px] w-[120px] ${isSwapping[1]
                  ? "flex justify-center items-center"
                  : ""
                  }`}
                onClick={() => approveOffer("LAND")}
                disabled={isSwapping[1]}
              >
                {isSwapping[1] && (
                  <ReactLoading
                    type="spin"
                    className="mr-2 mb-[4px]"
                    width="24px"
                    height="24px"
                  />
                )}
                <span>SWAP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
