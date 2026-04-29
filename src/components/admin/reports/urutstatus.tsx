"use client";
import { useState } from "react";

interface UrutstatusProps {
  sortItem: (val: string) => void;
  statusItem: (val: string) => void;
}

export default function Urutstatus({ sortItem, statusItem }: UrutstatusProps) {
const [openUrut, setOpenUrut] = useState(false);
const [openStatus, setOpenStatus] = useState(false);
const [selectedUrut, setSelectedUrut] = useState('Urutkan');
const [selectedStatus, setSelectedStatus] = useState('Status');

const urutkan = [
    { label: 'Terbaru', value: 'terbaru' },
    { label: 'Terlama', value: 'terlama' }
  ];
const status = [
    { id: '', label: 'Semua' },
    { id: '1', label: 'Hilang' },      
    { id: '2', label: 'Ditemukan' },  
    { id: '3', label: 'Selesai' }     
  ];

return (
    <div className="flex w-full justify-between gap-4">
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
                key={u.value}
                onClick={() => {
                setSelectedUrut(u.label);
                setOpenUrut(false);
                sortItem(u.value);
                }}
                className="block w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 font-poppins"
            >
                {u.label}
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
                key={o.id}
                onClick={() => {
                setSelectedStatus(o.label);
                setOpenStatus(false);
                statusItem(o.id);
                }}
                className="block w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100  font-poppins"
            >
                {o.label}
            </button>
            ))}
        </div>
        </div>
    )}
    </div>
    </div>
);
};

