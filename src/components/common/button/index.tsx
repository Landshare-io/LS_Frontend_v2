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
      className={`flex justify-center items-center disabled:cursor-not-allowed disabled:bg-[#d9dce7] text-text-primary enabled:hover:text-black ${outlined ? ' bg-transparent border-[1px] hover:bg-white ' : ' border-0 ' } ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={`text-[14px] leading-[22px] font-bold ${BOLD_INTER_TIGHT.className} ${textClassName}`}>
        {children}
      </span>
    </button>
  );
};
