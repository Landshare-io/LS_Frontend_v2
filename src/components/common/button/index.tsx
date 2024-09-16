import { Inter_Tight } from "next/font/google";

const boldInterTight = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});

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
      className={`flex justify-center items-center disabled:cursor-not-allowed 
        ${outlined ? ' bg-transparent border-[1px] border-[#61cd81] hover:bg-[#61cd81] hover:text-white ' : ' bg-[#61cd81] border-0 ' }
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={`text-[14px] leading-[22px] font-bold dark:text-[#3c3c3c] ${boldInterTight.className} ${textClassName}`}>
        {children}
      </span>
    </button>
  );
};
