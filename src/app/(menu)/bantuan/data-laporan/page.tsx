'use client'

import { Icon } from '@iconify/react';
import Image from 'next/image';

interface StepItem {
  number: number;
  title: string;
  icon: string;
  description: string;
  imagePreview?: string;
}

export default function dataLaporan() {
  const steps: StepItem[] = [
    {
      number: 1,
      title: "Tanda di map",
      icon: "material-symbols:map-outline",
      description: "Terdapat tombol pada map untuk memfilter status barang berdasarkan tiga jenis: laporan saya, hilang (semua barang), temuan(semua barang)",
      imagePreview: "", 
    },
    {
      number: 2,
      title: "Laporan Saya",
      icon: "lucide:square-pen",
      description: "Terdapat halaman yang menampilkan seluruh barang yang Anda laporkan, klik profil dan klik laporan saya",
    },
 
  ];

  return (
    <div className="w-full   p-4 sm:p-6 md:p-9 flex justify-center">
    <div className="w-full max-w-md flex flex-col gap-5">
        
        {steps.map((step) => (
        <div 
            key={step.number} 
            className="w-full bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 border-l-4 border-l-[#00319c] p-6 flex flex-col gap-4"
        >

            <div className="w-9 h-9 rounded-full bg-[#00319c] text-white flex items-center justify-center text-sm font-bold font-sora">
            {step.number}
            </div>


            <div className="flex items-center gap-2 text-[#00319c] mt-1">
            <Icon icon={step.icon} className="w-5 h-5 shrink-0" />
            <h2 className="text-base font-bold text-gray-900 font-sora">
                {step.title}
            </h2>
            </div>

            <p className="text-xs sm:text-[13px] text-gray-500 font-normal leading-relaxed">
            {step.description}
            </p>

            {step.imagePreview && (
            <div className="w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 mt-1">
                <Image 
                src={step.imagePreview} 
                alt={`Pratinjau ${step.title}`}
                className="w-full h-auto object-cover"
                />
            </div>
            )}
        </div>
        ))}

      </div>
    </div>
  );
}