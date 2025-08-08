import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface ButtonProps {
  children: React.ReactNode;
  outlined?: boolean;
  className?: string;
  textClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  smallBtn?: boolean;
  fontWeight?: string;
}

export default function Button({
  children,
  outlined,
  className,
  textClassName,
  onClick,
  disabled,
  fontWeight,
}: ButtonProps) {
  return (
    <button
      className={`flex justify-center items-center disabled:cursor-not-allowed disabled:bg-[#c2c5c3] ${
        outlined
          ? " bg-transparent border-[1px] hover:text-white hover:bg-primary-green"
          : "text-primary border-0"
      } ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span
        className={`text-[16px] leading-[22px] font-bold ${
          fontWeight ? fontWeight : BOLD_INTER_TIGHT.className
        } ${textClassName}`}
      >
        {children}
      </span>
    </button>
  );
}
