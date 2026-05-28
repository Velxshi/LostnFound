'use client'

import { Icon } from '@iconify/react';

export default function ContactCard() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/628123456789', '_blank');
  };

  return (
    <div className="w-full  bg-linear-to-br from-[#0046c7] to-[#00319c] text-white rounded-3xl p-6 flex flex-col gap-5 shadow-lg">
    
      <div className="space-y-2">
        <h2 className="text-xl font-bold font-poppins tracking-tight">
          Hubungi Kami
        </h2>
        <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-normal">
          Masih butuh bantuan? Tim support kami tersedia untuk chat langsung setiap hari jam 08:00 - 20:00.
        </p>
      </div>
      <button
        onClick={handleWhatsAppClick}
        className="w-full py-3 bg-white text-[#0046c7] font-semibold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 shadow-md"
      >
        <Icon icon="lucide:message-square-text" className="w-5 h-5 text-[#0046c7]" />
        <span>WhatsApp Kami</span>
      </button>
      <div className="grid grid-cols-2 gap-3 mt-1">
        <div className="bg-white/10 border border-white/10 rounded-2xl p-3 flex flex-col justify-center gap-1.5">
          <span className="text-caption font-bold uppercase tracking-wider text-white/60">
            Status Tim
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#26e673] animate-pulse shrink-0" />
            <span>Online Sekarang</span>
          </div>
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl p-3 flex flex-col justify-center gap-1.5">
          <span className="text-caption font-bold uppercase tracking-wider text-white/60">
            Respon
          </span>
          <span className="text-xs font-semibold">
            ~ 5 Menit
          </span>
        </div>

      </div>

    </div>
  );
}