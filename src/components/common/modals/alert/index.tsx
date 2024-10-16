import ReactModal from 'react-modal';
import Image from 'next/image';
import { useGlobalContext } from '../../../../context/GlobalContext';
import Vector from '../../../../../public/icons/vector.svg';
import Ok from '../../../../../public/icons/ok.svg';


export default function AlertModal() {
  const { alertModal, setAlertModal } = useGlobalContext()
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
      padding: 0,
      border: 0
    },
    overlay: {
      background: '#00000080'
    }
  };

  return (
    <ReactModal
      isOpen={alertModal.show}
      onRequestClose={() => { setAlertModal({ ...alertModal, show: !alertModal.show }), document.body.classList.remove('modal-open'); }}
      style={customModalStyles}
    >
      <div className={`py-[10px] flex justify-center items-center gap-[20px] w-100 ${alertModal.type == 'success' ? 'bg-[#61CD81]' : (alertModal.type == 'info' ? 'bg-[#447CB0]' : 'bg-[#B43f37]')}`}>
        <Image 
          className=""
          src={alertModal.type == 'error' ? Vector : (alertModal.type == 'success' ? Ok : (alertModal.type == 'info' ? Ok : null))} 
          alt="Status" 
        />
        <span className='text-[#fff] text-[1.7rem] font-semibold'>{alertModal.type == 'error' ? 'ERROR' : (alertModal.type == 'success' ? 'SUCCESS' : (alertModal.type == 'info' ? 'INFO' : ''))}</span>
      </div>
      <div>
        <div className='font-semibold d-flex justify-content-center py-[10px] px-[20px] text-center'>
          {alertModal.message}
        </div>
      </div>
      <div>
        <div className="modal-footer-content pb-4 flex justify-center">
          <button className={`text-[#fff] min-w-[100px] rounded-[20px]  ${alertModal.type == 'success' ? 'bg-[#61CD81]' : (alertModal.type == 'info' ? 'bg-[#447CB0]' : 'bg-[#B43f37]')}`} onClick={() => setAlertModal({ ...alertModal, show: !alertModal.show })}>OK</button>
        </div>
      </div>
    </ReactModal>
  )
}
