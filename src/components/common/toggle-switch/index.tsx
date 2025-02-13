import { useTheme } from "next-themes";

interface ToggleSwitchProps {
  isSale: boolean
  className?: string
  onClick: Function
  disabled?: boolean
}


export default function ToggleSwitch({ isSale, className, onClick, disabled }: ToggleSwitchProps) {
  const { theme } = useTheme()

  return (
    <button
      className={`toggle-switch flex gap-[2px] ${isSale ? 'sale' : 'off-sale'} ${isSale ? "bg-[#808080]" : "bg-[#808080]"} ml-4 ${className}`}
      type="button"
      aria-pressed="false"
      onClick={() => onClick()}
      disabled={disabled}
    >
      <span className="text-white text-[11px]">
        ON
      </span>
      <span className="text-white text-[11px]">
        OFF
      </span>
    </button>
  )
}
