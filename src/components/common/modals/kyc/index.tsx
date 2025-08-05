import Modal from "react-modal";
import { MdCancel } from "react-icons/md";
import { bsc } from "viem/chains";
import { useAccount, useChainId } from "wagmi";
import Button from "../../button";
import useIsWhitelistedAddress from "../../../../hooks/contract/RWAContract/useIsWhitelistedAddress";
import { BOLD_INTER_TIGHT, MAJOR_WORK_CHAINS } from "../../../../config/constants/environments";
import ZeroIDWidget from "../../../zero-id-widget";
import KYCWidget from "../../../sumsub-widget";


const RWA_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/rwa']

interface KYCModalProps {
  iskycmodal: boolean,
  setKycopen: (iskycmodal: boolean) => void,
  isZeroIDModal: boolean,
  setZeroIDModalOpen: (isZeroIDModal: boolean) => void
}



export default function KYCModal({ iskycmodal, setKycopen, isZeroIDModal, setZeroIDModalOpen }: KYCModalProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { theme } = useTheme();
  const { data: isWhitelisted, refetch } = useIsWhitelistedAddress((RWA_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? chainId : 56, address);

  const handleclosemodal = () => {
    setKycopen(false);
    document.body.style.overflow = "auto";
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
      zIndex: 99999,
      background: bgColor,
    },
  };
  const handleLinkClick = (event: any) => {
    console.log("isWhitelisted", isWhitelisted);
    event.preventDefault(); // Prevent the default link behavior
    setKycopen(false);
    setZeroIDModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <>
      <Modal
        isOpen={iskycmodal}
        onRequestClose={() => {
          setKycopen(false), document.body.classList.remove("modal-open");
        }}
        style={customModalStyles}
        contentLabel="Modal"
        className="bg-secondary"
      >
        <MdCancel
          onClick={handleclosemodal}
          className="float-right text-[#000] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
        />
        <div className="w-full">
          <h5
            className={`text-center text-[1.5rem] leading-[1.334] ${BOLD_INTER_TIGHT.className}`}
          >
            KYC Verification1111
          </h5>
          <p
            className={`text-[16px] pt-[10px] leading-[28px] text-center tracking-[2%] ${BOLD_INTER_TIGHT.className} !font-normal`}
          >
            Complete the KYC process to access RWA Tokens
          </p>
        </div>
        <div className="w-full mt-3">
          <a href="https://dashboard.landshare.io">
            <Button
              className="flex flex-col justify-center items-center w-full pb-[10px] bg-[#0ed145] text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors"
              disabled={chainId != bsc.id}
            >
              <p className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}>
                Manual Verification
              </p>
            </Button>
          </a>
          <div onClick={handleLinkClick}>
            <Button
              className="flex flex-col disabled:bg-[#c2c5c3] justify-center items-center w-full pb-[10px] bg-[#0ed145] text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors mt-4"
              disabled
            >
              <p className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}>
                Sumsub Verification
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
        contentLabel="Sumsub Modal"
        className="sumsub-modal"
      >
        <MdCancel
          onClick={() => {
            setZeroIDModalOpen(false);
            document.body.style.overflow = "auto";
          }}
          className="float-right text-[#000] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
        />
        <KYCWidget />
      </Modal>
    </>
  )
}
