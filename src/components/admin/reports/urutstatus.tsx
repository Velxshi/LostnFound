"use client";
import { useState } from "react";


const Urutstatus = () => {
const [openUrut, setOpenUrut] = useState(false);
const [openStatus, setOpenStatus] = useState(false);
const [selectedUrut, setSelectedUrut] = useState('Urutkan');
const [selectedStatus, setSelectedStatus] = useState('Status');

const urutkan = ['Terbaru', 'Terlama' ];
const status = ['Semua', 'Ditemukan', 'Hilang', 'Selesai' ];

return (
    <div className="flex justify-between gap-4">
    <div className="relative w-full lg:h-12 cursor-pointer">
    <button
        onClick={() => setOpenUrut(!openUrut)}
        className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
    >
        <span className="font-poppins">{selectedUrut}</span>
        <svg
        className={`h-5 w-5 transition-transform duration-200 ${openUrut ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    {openUrut && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-lg  animate-in fade-in zoom-in duration-100 cursor-pointer">
        <div className="py-1">
            {urutkan.map((u) => (
            <button
                key={u}
                onClick={() => {
                setSelectedUrut(u);
                setOpenUrut(false);
                }}
                className="block w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 font-poppins"
            >
                {u}
            </button>
            ))}
        </div>
        </div>
    )}
    </div>

    <div className="relative w-full lg:h-12 cursor-pointer">
    <button
        onClick={() => setOpenStatus(!openStatus)}
        className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
    >
        <span className="font-poppins">{selectedStatus}</span>
        <svg
        className={`h-5 w-5 transition-transform duration-200 ${openStatus ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    {openStatus && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-lg  animate-in fade-in zoom-in duration-100 cursor-pointer">
        <div className="py-1">
            {status.map((o) => (
            <button
                key={o}
                onClick={() => {
                setSelectedStatus(o);
                setOpenStatus(false);
                }}
                className="block w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100  font-poppins"
            >
                {o}
            </button>
            ))}
        </div>
        </div>
    )}
    </div>
    </div>
);
};

export default Urutstatus;