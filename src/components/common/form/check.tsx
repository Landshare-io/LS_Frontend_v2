import React from 'react';
import { useTheme } from "next-themes";

interface FormCheckProps {
  id: string;
  label?: string;
  type?: 'checkbox' | 'radio';
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export default function FormCheck({
  id,
  label,
  type = 'checkbox', // Accepts 'checkbox' or 'radio'
  checked = false,
  onChange,
  disabled = false,
  className = '',
}: FormCheckProps) {
  const { theme } = useTheme()

  return (
    <div className={`flex items-center gap-[10px] ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`w-4 h-4 border-gray-300 focus:ring-2 ${
          type === 'radio'
            ? 'rounded-full focus:ring-blue-500'
            : 'rounded-md focus:ring-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {label && (
        <label
          htmlFor={id}
          className={`text-[16px] font-semibold ${theme == "dark" ? "text-gray-300" : "text-black-700"} cursor-pointer ${disabled && 'opacity-50'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};
