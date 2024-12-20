import ReactModal from 'react-modal';
import Image from 'next/image';
import { useGlobalContext } from '../../../../context/GlobalContext';
import Vector from '../../../../../public/icons/vector.svg';
import Ok from '../../../../../public/icons/ok.svg';
import Button from '../../button';


export default function AlertModal() {
  const { alertModal, setAlertModal } = useGlobalContext()
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "300px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0,
      background: 'transparent'
    },
    overlay: {
      background: '#00000080',
      zIndex: 99999
    }
  };

  return (
    <ReactModal
      isOpen={alertModal.show}
      onRequestClose={() => { setAlertModal({ ...alertModal, show: !alertModal.show }), document.body.classList.remove('modal-open'); }}
      style={customModalStyles}
    >
      <div className={`py-[10px] relative flex justify-center items-center gap-[20px] w-100 ${alertModal.type == 'success' ? 'bg-[#61CD81]' : (alertModal.type == 'info' ? 'bg-[#447CB0]' : 'bg-[#B43f37]')}`}>
        <Image 
          className="absolute left-[0.75rem]"
          src={alertModal.type == 'error' ? Vector : (alertModal.type == 'success' ? Ok : (alertModal.type == 'info' ? Ok : null))} 
          alt="Status" 
        />
        <span className='text-[#fff] text-[1.7rem] font-semibold'>{alertModal.type == 'error' ? 'ERROR' : (alertModal.type == 'success' ? 'SUCCESS' : (alertModal.type == 'info' ? 'INFO' : ''))}</span>
      </div>
      <div className='bg-primary'>
        <div className='font-semibold flex justify-center py-[1.5rem] px-[0.5rem] text-center text-text-primary'>
          {alertModal.message}
        </div>
        <div className="modal-footer-content pb-4 flex justify-center">
          <Button 
            className={`
              text-[#fff] min-w-[100px] py-[0.375rem] px-[0.75rem] rounded-[20px] 
              ${alertModal.type == 'success' ? 'bg-[#61CD81]' : (alertModal.type == 'info' ? 'bg-[#447CB0]' : 'bg-[#B43f37]')}
            `} 
            onClick={() => setAlertModal({ ...alertModal, show: !alertModal.show })}
            textClassName='!text-white'
          >
            OK
          </Button>
        </div>
      </div>
    </ReactModal>
  )
}
