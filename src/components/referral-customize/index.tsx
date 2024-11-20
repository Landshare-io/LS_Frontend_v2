import { useState } from "react";
import ReactModal from 'react-modal';
import { IoCloseCircle } from "react-icons/io5";
import { useGlobalContext } from '../../context/GlobalContext';
import { Fuul } from "@fuul/sdk";
import { config } from "../../wagmi";
import { signMessage } from '@wagmi/core';

interface ReferralCustomizeModalProps {
    showModal : boolean;
    setShowModal : (showModal : boolean) => void;
    setTrackingprettyCode : (trackingprettyCode : string) => void;
    address : string | undefined;
}

export default function ReferralCustomizeModal({showModal, setShowModal, setTrackingprettyCode, address} : ReferralCustomizeModalProps) {
    const { theme, notifySuccess, notifyError } = useGlobalContext();
    const [prettyCode, setPrettyCode] = useState<string>("")

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

    const handleEnterCode = async () => {
        try {
            setShowModal(false);
            const codeIsFree = await Fuul.isAffiliateCodeFree(prettyCode);

            if(codeIsFree && prettyCode){
                const signature = await signMessage(config, { message: `I confirm that I am updating my code to ${prettyCode} on Fuul` });

                await Fuul.updateAffiliateCode({
                    address: address ?? "",
                    code: prettyCode,
                    signature: signature,
                })

                setTrackingprettyCode(process.env.NEXT_PUBLIC_FUUL_API_URL + "?af=" + prettyCode);

                setPrettyCode("");
                notifySuccess("The code is successfully updated and prettyCode is defined");
            }else{
                console.error("The code is not free or prettyCode is not defined");
                notifyError("The code is not free or prettyCode is not defined");
            }
        } catch (error) {
            console.error("Error updating affiliate code:", error);
        }
    }

    return(
        <ReactModal
            isOpen={showModal}
            onRequestClose={() => {setShowModal(false)}}
            style={customModalStyles}
        >
            <div className='text-text-primary bg-third py-4 px-6'>
                <div className='w-full flex justify-between items-center text-xl font-bold'>
                    <p>Customize Your Link</p>
                    <IoCloseCircle className={`w-6 h-6 cursor-pointer ${theme === `dark` ? "text-white" : ""}`} onClick={() => {setShowModal(false)}}/>
                </div>

                <hr className='bg-white h-[1px] my-4'/>

                <input 
                    value={prettyCode}
                    onChange = {(e : any) => setPrettyCode(e.target.value)}
                    className={`w-full py-1 px-2 text-text-primary text-lg rounded-md bg-third outline-none border ${theme === `dark` ? "border-white" : "border-black"}`}/>

                <button 
                    className={`w-full mt-4 py-1 px-2 text-text-primary text-lg rounded-md bg-third border  ${theme === `dark` ? "border-white" : "border-black"}`} 
                    onClick={handleEnterCode}
                    >
                    Enter a code
                </button>
            </div>
        </ReactModal>
    )
}