interface ToggleButtonProps {
  children: JSX.Element;
  active: boolean;
  onClick?: () => void;
  type?: string;
  containerClassName?: string
}

export default function ToggleButton({ children, active, onClick, type, containerClassName }: ToggleButtonProps) {
  return (
    <button
      className={`outline-0 border-0 flex justify-center items-center gap-[10px] rounded-[50px] text-[14px] leading-[22px] font-medium ${active ? "bg-button-secondary text-button-text-secondary" : type == "pricegraph" ? "bg-button-third text-button-text-primary" : "bg-button-primary text-button-text-primary"} ${containerClassName}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
