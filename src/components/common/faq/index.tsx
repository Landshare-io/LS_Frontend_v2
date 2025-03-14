import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface FaqProps {
  question: string;
  answer: string;
}

export default function Faq({ question, answer }: FaqProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-secondary rounded-2xl py-4 px-8 shadow-md ${
        isOpen && "border-[1px] border-primary-green transition-colors"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center py-2 text-lg font-medium text-text-secondary focus:outline-none"
      >
        <span className="font-bold text-text-primary text-[16px]">
          {question}
        </span>
        <div
          className={`${
            isOpen ? "transform rotate-180" : ""
          } transition-transform duration-200`}
        >
          <FaChevronDown />
        </div>
      </button>
      <div
        className={`text-text-secondary text-sm transition-max-height duration-200 ease-out ${
          isOpen ? "max-h-screen mt-1" : "max-h-0 overflow-hidden"
        }`}
      >
        {answer}
      </div>
    </div>
  );
}
