"use client";
import { useState, useEffect, useRef } from "react";

interface UrutstatusProps {
  sortItem: (val: string) => void;
  statusItem: (val: string) => void;
}

export default function Urutstatus({ sortItem, statusItem }: UrutstatusProps) {
  const [openUrut, setOpenUrut] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedUrut, setSelectedUrut] = useState("Urutkan");
  const [selectedStatus, setSelectedStatus] = useState("Status");

  const urutRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (urutRef.current && !urutRef.current.contains(e.target as Node)) {
        setOpenUrut(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setOpenStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const urutkan = [
    { label: "Terbaru", value: "terbaru" },
    { label: "Terlama", value: "terlama" },
  ];
  const status = [
    { id: "", label: "Semua" },
    { id: "1", label: "Hilang" },
    { id: "2", label: "Ditemukan" },
    { id: "3", label: "Selesai" },
  ];

  return (
    <div className="flex w-full justify-between gap-4">
      <div ref={urutRef} className="relative w-full lg:h-12">
        <button
          onClick={() => setOpenUrut(!openUrut)}
          className="flex w-full items-center justify-between rounded-xl bg-cream-light px-5 py-3 text-body font-medium text-dark shadow-sm  hover:bg-[#f7f3f0] transisi active:scale-95 cursor-pointer"
        >
          <span className="font-poppins">{selectedUrut}</span>
          <svg className={`h-5 w-5  transisi ${openUrut ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openUrut && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-cream-light shadow-lg  animate-in fade-in zoom-in transisi">
            <div className="py-1">
              {urutkan.map((u) => (
                <button
                  key={u.value}
                  onClick={() => {
                    setSelectedUrut(u.label);
                    setOpenUrut(false);
                    sortItem(u.value);
                  }}
                  className="block w-full h-full px-5 py-3 text-left text-body text-cream-dark-active hover:bg-[#f7f3f0] font-jakarta cursor-pointer  transisi"
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div ref={statusRef} className="relative w-full lg:h-12 ">
        <button
          onClick={() => setOpenStatus(!openStatus)}
          className="flex w-full items-center justify-between rounded-xl bg-cream-light px-5 py-3 text-body font-medium text-dark shadow-sm  hover:bg-[#f7f3f0] transisi active:scale-95 cursor-pointer"
        >
          <span className="font-poppins">{selectedStatus}</span>
          <svg className={`h-5 w-5  transisi ${openStatus ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openStatus && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-cream-light shadow-lg  animate-in fade-in zoom-in transisi ">
            <div className="py-1">
              {status.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSelectedStatus(o.label);
                    setOpenStatus(false);
                    statusItem(o.id);
                  }}
                  className="block w-full h-full px-5 py-3 text-left text-body text-cream-dark-active hover:bg-[#f7f3f0]  transisi font-poppins cursor-pointer"
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
}
