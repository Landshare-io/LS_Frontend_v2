import React from 'react'
import './SelectProposal.css'
import ArrowDownIcon from '../../assets/img/icons/arrow-down.svg'

interface DaoSelectProposalProps {
  value: string
  setValue: Function
}

export default function DaoSelectProposal({ value, setValue }: DaoSelectProposalProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const onChangeValue = (updatedValue: string) => {
    setValue(updatedValue)
    setIsOpen(false)
  }

  return (
    <>
      <div className="w-full bg-[#ffffff] border-[1px] border-[#ffffff] rounded-[20px] py-[5px] pr-[5px] pl-[10px] flex justify-between items-center cursor-pointer md:w-[300px] hover:border-[#cdcdcd] hover:border-[#f2f4f5b3] duration-300" onClick={() => setIsOpen(!isOpen)}>
        <div className="font-semibold text-[16px] leading-[20px] md:text-[18px] text-[#323232]">{value}</div>
        <img src={ArrowDownIcon} alt="arrow-down" className='w-[30px] pr-[10px]' />
        <div className={`bg-[#ffffff] shadow-lg shadow-[#0003] rounded-[12px] absolute z-[2] top-[38px] left-0 w-full ${!isOpen && 'hide'}`}>
          <div 
            className='text-[16px] leading-[20px] pt-[10px] pb-[5px] px-[20px] cursor-pointer sm:text-[18px] sm:leading-[27px] text-[#000]'
            onClick={() => onChangeValue('Change Vault Allocation')}
          >
            Change Vault Allocation
          </div>
          <div 
            className='text-[16px] leading-[20px] pt-[5px] pb-[10px] px-[20px] cursor-pointer sm:text-[18px] sm:leading-[27px] text-[#000]'
            onClick={() => onChangeValue('Burn Tokens')}
          >
            Burn Tokens
          </div>
          <div 
            className='text-[16px] leading-[20px] py-[5px] px-[20px] cursor-pointer sm:text-[18px] sm:leading-[27px] text-[#000]'
            onClick={() => onChangeValue('Change Auto LAND Fee')}
          >
            Change Auto LAND fee
          </div>
          <div 
            className='text-[16px] leading-[20px] py-[5px] px-[20px] cursor-pointer sm:text-[18px] sm:leading-[27px] text-[#000]'
            onClick={() => onChangeValue('Add to Marketing Fund')}
          >
            Add to Marketing Fund
          </div>
          <div 
            className='text-[16px] leading-[20px] py-[5px] px-[20px] cursor-pointer sm:text-[18px] sm:leading-[27px] text-[#000]'
            onClick={() => onChangeValue('Create Bounty')}
          >
            Create Bounty
          </div>
          <div 
            className='text-[16px] leading-[20px] py-[5px] px-[20px] cursor-pointer sm:text-[18px] sm:leading-[27px] text-[#000]'
            onClick={() => onChangeValue('Request Grant')}
          >
            Request Grant
          </div>
          <div 
            className='text-[16px] leading-[20px] py-[5px] px-[20px] cursor-pointer sm:text-[18px] sm:leading-[27px] text-[#000]'
            onClick={() => onChangeValue('Custom Proposal')}
          >
           Custom Proposal
          </div>
        </div>
      </div>
    </>
  )
}
