"use client";
import { useState } from "react";


const CustomSelect = () => {
const [isOpen, setIsOpen] = useState(false);
const [selected, setSelected] = useState('Periode');

const options = ['7 Hari', '30 Hari' ];

return (
    <div className="relative inline-block w-29 lg:w-59 lg:h-12 cursor-pointer">
    <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
    >
        <span>{selected}</span>
        <svg
        className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    {isOpen && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-lg  animate-in fade-in zoom-in duration-100 cursor-pointer">
        <div className="py-1">
            {options.map((option) => (
            <button
                key={option}
                onClick={() => {
                setSelected(option);
                setIsOpen(false);
                }}
                className="block w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors font-poppins"
            >
                {option}
            </button>
            ))}
        </div>
        </div>
    )}
    </div>
);
};

export default CustomSelect;