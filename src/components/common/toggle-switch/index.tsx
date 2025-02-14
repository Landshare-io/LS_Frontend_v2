import { useGlobalContext } from "../../../context/GlobalContext";

interface ToggleSwitchProps {
  isSale: boolean
  className?: string
  onClick: Function
  disabled?: boolean
}


export default function ToggleSwitch({ isSale, className, onClick, disabled }: ToggleSwitchProps) {
  const { theme } = useGlobalContext();

  return (
    <div
      className={`ml-4 w-[60px] h-[28px] flex items-center px-1 rounded-full cursor-pointer transition-all duration-300 border-2 border-solid
        border-[#61cd81]`}
      onClick={()=>onClick()}
    >
      {
        isSale ?
        <span className={`text-[16px] text-text-primary transition-all duration-300`}>
          ON
        </span> : ""
      }

      <div
        className={`w-[20px] h-[20px] bg-[#61cd81] rounded-full shadow-md transition-all duration-300 
          ${isSale ? "translate-x-[5px]" : "-translate-x-[2px]"}`}
      ></div>
      {
        !isSale ?
        <span className={`text-[16px] text-text-primary transition-all duration-300`}>
          OFF
        </span> : ""
      }
      
    </div>
  )
}
