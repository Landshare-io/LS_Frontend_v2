import Modal from "react-modal";
import { MdCancel } from "react-icons/md";
import { useAccount, useChainId } from "wagmi";
import Button from "../../button";
import useIsWhitelistedAddress from "../../../../hooks/contract/RWAContract/useIsWhitelistedAddress";
import { BOLD_INTER_TIGHT, MAJOR_WORK_CHAINS } from "../../../../config/constants/environments";
import ZeroIDWidget from "../../../zero-id-widget";

const RWA_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/rwa']

interface KYCModalProps {
  iskycmodal: boolean,
  setKycopen: (iskycmodal : boolean) => void,
  isZeroIDModal : boolean,
  setZeroIDModalOpen : ( isZeroIDModal : boolean) => void
}

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
    maxWidth: "400px",
    width: "90%",
    height: "fit-content",
    borderRadius: "20px",
  },
  overlay: {
    background: "#00000080",
  },
};

export default function KYCModal({iskycmodal, setKycopen, isZeroIDModal, setZeroIDModalOpen} : KYCModalProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const isWhitelisted = useIsWhitelistedAddress((RWA_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? chainId : 56, address);

  const handleclosemodal = () => {
    setKycopen(false);
    document.body.style.overflow = "auto";
  }

  const handleLinkClick = (event: any) => {
    console.log("isWhitelisted", isWhitelisted);
    event.preventDefault(); // Prevent the default link behavior
    setKycopen(false);
    setZeroIDModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  return(
      <>
        <Modal
          isOpen={iskycmodal}
          onRequestClose={() => {
          setKycopen(false), document.body.classList.remove("modal-open");
          }}
          style={customModalStyles}
          contentLabel="Modal"
        >
          <MdCancel
            onClick={handleclosemodal}
            className="float-right text-[#000] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
          />
          <div className="w-full">
            <h5
              className={`text-center text-[1.5rem] leading-[1.334] text-center ${BOLD_INTER_TIGHT.className}`}
            >
              KYC Verification
            </h5>
            <p
              className={`text-[16px] pt-[10px] leading-[28px] text-center tracking-[2%] ${BOLD_INTER_TIGHT.className} !font-normal`}
            >
              Complete the KYC process to access RWA Tokens
            </p>
          </div>
          <div className="w-full mt-3">
            <a href="https://dashboard.landshare.io">
              <Button className="flex flex-col justify-center items-center w-full pb-[10px] bg-[#0ed145] text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors">
                <p className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}>
                  Manual Verification
                </p>
              </Button>
            </a>
            <div onClick={handleLinkClick}>
              <Button
                className="flex flex-col disabled:bg-[#c2c5c3] justify-center items-center w-full pb-[10px] bg-[#0ed145] text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors mt-4"
              >
                <p className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}>
                  ZeroID Verification
                </p>
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={isZeroIDModal}
          onRequestClose={() => {
          setZeroIDModalOpen(true),
            document.body.classList.remove("modal-open");
          }}
          style={customModalStyles}
          contentLabel="ZeroID Modal"
          className="zeroid-modal"
        >
          <MdCancel
            onClick={() => {
              setZeroIDModalOpen(false);
              document.body.style.overflow = "auto";
            }}
            className="float-right text-[#000] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
          />
          <ZeroIDWidget />
        </Modal>
    </>
  )
}
