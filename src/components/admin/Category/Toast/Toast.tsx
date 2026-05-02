import React, { useEffect, useState } from 'react';

export default function Toast({ message,warna, onClose }: { message: string; warna: string; onClose: () => void }) {
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
    
    const entryTimer = setTimeout(() => setIsVisible(true), 10);

    const exitTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div 
      className={`fixed top-5 right-5 z-9999 transition-all duration-500 ease-in-out transform ${
        isVisible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`bg-[${warna}] text-[#0F5132] px-6 py-3 rounded-lg shadow-lg font-semibold flex items-center justify-between min-w-50 border border-[#D1E7DD]`}>
        <div className="flex items-center ">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};
