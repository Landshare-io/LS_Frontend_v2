import React from 'react'
import Image from 'next/image'
import { useTheme } from "next-themes";
import ArrowDownIcon from '../../../public/icons/arrow-down.svg'
import ArrowDownIconDark from '../../../public/icons/arrow-down-dark.svg'

interface SelectVaultProps {
  value: string
  setValue: Function
}

export default function SelectVault({ value, setValue }: SelectVaultProps) {
  const { theme } = useTheme();
  function useOutsideAlerter(ref: any) {
    React.useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }
  const wrapperRef = React.useRef(null)
  useOutsideAlerter(wrapperRef)

  const [isOpen, setIsOpen] = React.useState(false)

  const onChangeValue = (v: string) => {
    setValue(v)
    setIsOpen(false)
  }
  return (
    <>
      <div ref={wrapperRef} className="rounded-[12px] py-[10px] pr-[10px] pl-[20px] flex justify-between items-center relative max-w-[719.48px] bg-primary">
        <div className="font-semibold text-[18px] leading-[27px] text-text-primary">{value}</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-center items-center outline-0 border-0 rounded-[12px] w-[60px] h-[60px] bg-secondary"
        >
          <Image src={theme == 'dark' ? ArrowDownIconDark : ArrowDownIcon} alt="arrow-down" />
        </button>
        <div className={`shadow shadow-lg rounded-[12px] absolute z-[2] top-[80px] left-0 w-full bg-secondary text-text-primary ${!isOpen && 'hidden'}`}>
          <div 
            onClick={() => onChangeValue('V3 Staking Vault')} 
            className="pt-[10px] pb-[5px] px-[20px] cursor-pointer font-normal text-[18px] leading-[27px] hover:bg-primary hover:rounded-[12px]"
          >
            V3 Staking Vault
          </div>
          <div 
            onClick={() => onChangeValue('V3 Auto Staking Vault')} 
            className="py-[5px] px-[20px] cursor-pointer font-normal text-[18px] leading-[27px] hover:bg-primary hover:rounded-[12px]"
          >
            V3 Auto Staking Vault
          </div>
          <div 
            onClick={() => onChangeValue('LP Farm')} 
            className="py-[5px] px-[20px] cursor-pointer font-normal text-[18px] leading-[27px] hover:bg-primary hover:rounded-[12px]"
          >
            LP Farm
          </div>
          <div 
            onClick={() => onChangeValue('V2 Staking Vault')} 
            className="py-[5px] px-[20px] cursor-pointer font-normal text-[18px] leading-[27px] hover:bg-primary hover:rounded-[12px]"
          >
            V2 Staking Vault
          </div>
          <div 
            onClick={() => onChangeValue('V2 Auto Staking Vault')} 
            className="pt-[5px] pb-[10px] px-[20px] cursor-pointer font-normal text-[18px] leading-[27px] hover:bg-primary hover:rounded-[12px]"
          >
            V2 Auto Staking Vault
          </div>
        </div>
      </div>
    </>
  )
}
