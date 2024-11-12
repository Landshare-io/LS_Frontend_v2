import ReactModal from 'react-modal';
import { IoCloseCircle } from "react-icons/io5";
import { useGlobalContext } from '../../context/GlobalContext';

interface ReferralCustomizeModalProps {
    showModal : boolean;
    setShowModal : (showModal : boolean) => void
}

export default function ReferralCustomizeModal({showModal, setShowModal} : ReferralCustomizeModalProps) {
    const { theme } = useGlobalContext();

    const customModalStyles = {
        content: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          maxWidth: "450px",
          width: "90%",
          height: "fit-content",
          borderRadius: "6px",
          padding: 0,
          border: 0
        },
        overlay: {
          background: '#00000080'
        }
      };

    return(
        <ReactModal
            isOpen={showModal}
            onRequestClose={() => {setShowModal(true)}}
            style={customModalStyles}
        >
            <div className='text-text-primary bg-third py-4 px-6'>
                <div className='w-full flex justify-between items-center text-xl font-bold'>
                    <p>Customize Your Link</p>
                    <IoCloseCircle className={`w-6 h-6 cursor-pointer ${theme === `dark` ? "text-white" : ""}`} onClick={() => {setShowModal(false)}}/>
                </div>

                <hr className='bg-white h-[1px] my-4'/>

                <input className={`w-full py-1 px-2 text-text-primary text-lg rounded-md bg-third outline-none border ${theme === `dark` ? "border-white" : "border-black"}`}/>

                <button className={`w-full mt-4 py-1 px-2 text-text-primary text-lg rounded-md bg-third border  ${theme === `dark` ? "border-white" : "border-black"}`}>
                    Enter a code
                </button>
            </div>
        </ReactModal>
    )
}