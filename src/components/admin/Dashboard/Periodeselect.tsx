"use client";
import { useState } from "react";

interface PeriodeselectProps {
  value: string;
  onChange: (val: string) => void;
}

const Periodeselect = ({ value, onChange }: PeriodeselectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "7 Hari", value: "7" },
    { label: "30 Hari", value: "30" },
  ];
  const currentLabel = options.find((opt) => opt.value === value)?.label || "Periode";

  return (
    <div className="relative inline-block w-29 lg:w-59 lg:h-12 cursor-pointer">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-95">
        <span>{currentLabel}</span>
        <svg className={`h-5 w-5 transisi  ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-lg  animate-in duration-200 fade-in zoom-in  cursor-pointer">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="block w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors font-poppins"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Periodeselect;
