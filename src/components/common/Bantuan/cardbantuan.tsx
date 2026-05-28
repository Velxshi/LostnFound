import { Icon } from '@iconify/react';
import React from 'react';
interface CardBantuanProps {
    title: string;
    description: string;
    icon?: string; 
}
export default function CardBantuan({ title, description, icon }: CardBantuanProps) {  
    return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col items-start gap-4 hover:shadow-md transition-shadow duration-300">
      <div className="w-12 h-12 rounded-xl bg-[#e8edff] flex items-center justify-center text-[#2848B7] shrink-0">
       <Icon icon={icon || "material-symbols:help-outline-rounded"} className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-gray-900 tracking-tight font-sora">
          {title || "Judul Bantuan"}
        </h3>
        <p className="text-xs sm:text-[13px] font-normal text-gray-500 leading-relaxed">
          {description || "Deskripsi penjelasan panduan bantuan mengenai sistem Lost and Found."}
        </p>
      </div>

    </div>
  );
}