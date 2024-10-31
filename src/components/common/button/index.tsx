import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface ButtonProps {
  children: React.ReactNode;
  outlined?: boolean;
  className?: string;
  textClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  smallBtn?: boolean;
}

export default function Button ({
  children,
  outlined,
  className,
  textClassName,
  onClick,
  disabled
}: ButtonProps) {
  return (
    <button
      className={`flex justify-center text-[14px] leading-[22px] font-bold dark:text-[#3c3c3c]  items-center disabled:cursor-not-allowed ${outlined ? ' bg-transparent border-[1px] border-[#61cd81] hover:bg-[#61cd81] hover:text-white ' : ' bg-[#61cd81] border-0 ' } ${BOLD_INTER_TIGHT.className} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
        {children}
    </button>
  );
};
