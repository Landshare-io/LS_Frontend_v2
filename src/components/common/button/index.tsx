import { useGlobalContext } from "../../../context/GlobalContext";

interface ButtonProps {
  children: React.ReactNode;
  outlined?: boolean;
  color?: string;
  className?: string;
  textClassName?: string;
  isTiny?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  smallBtn?: boolean;
}

export default function Button ({
  children,
  outlined,
  className,
  textClassName,
  isTiny,
  onClick,
  disabled
}: ButtonProps) {
  return (
    <button
      className={`flex justify-center items-center rounded-[20px] bg-[#61cd81] border-0 dark:text-[#3c3c3c] disabled:cursor-not-allowed px-[20px] py-[5px] 
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={`text-[14px] leading-[22px] font-bold ${textClassName}`}>
        {children}
      </span>
    </button>
  );
};
