import { useState } from "react"
import { FaChevronDown } from "react-icons/fa";

interface FaqProps {
  question: string
  answer: string
}

export default function Faq({
  question,
  answer
}: FaqProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-300 py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center py-2 text-lg font-medium text-text-secondary focus:outline-none"
      >
        <span>{question}</span>
        <div className={`${isOpen ? 'transform rotate-180' : ''} transition-transform duration-200`}>
          <FaChevronDown />
        </div>
      </button>
      <div
        className={`mt-2 text-text-third text-sm transition-max-height duration-300 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'
        }`}
      >
        {answer}
      </div>
    </div>
  )
}