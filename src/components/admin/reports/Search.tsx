import React from 'react';

export default function SearchComponent({ onSearch }: { onSearch: (value: string) => void }) {
return (
<div className="w-full h-13.25">
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.525 15.75L9.0125 10.2375C8.575 10.5875 8.07188 10.8646 7.50313 11.0687C6.93438 11.2729 6.32917 11.375 5.6875 11.375C4.09792 11.375 2.75275 10.8243 1.652 9.723C0.55125 8.62167 0.000583796 7.2765 4.62963e-07 5.6875C-0.00058287 4.0985 0.550084 2.75333 1.652 1.652C2.75392 0.550667 4.09908 0 5.6875 0C7.27592 0 8.62138 0.550667 9.72388 1.652C10.8264 2.75333 11.3768 4.0985 11.375 5.6875C11.375 6.32917 11.2729 6.93437 11.0688 7.50312C10.8646 8.07187 10.5875 8.575 10.2375 9.0125L15.75 14.525L14.525 15.75ZM5.6875 9.625C6.78125 9.625 7.71108 9.24233 8.477 8.477C9.24292 7.71167 9.62558 6.78183 9.625 5.6875C9.62442 4.59317 9.24175 3.66363 8.477 2.89888C7.71225 2.13413 6.78242 1.75117 5.6875 1.75C4.59258 1.74883 3.66304 2.13179 2.89888 2.89888C2.13471 3.66596 1.75175 4.5955 1.75 5.6875C1.74825 6.7795 2.13121 7.70933 2.89888 8.477C3.66654 9.24467 4.59608 9.62733 5.6875 9.625Z" fill="#B9B6B4"/>
            </svg>
        </div>
            <input onChange={(e) => onSearch(e.target.value)}
            type="text"
            className="text-[13px] font-extralight font-poppins w-full pl-12 pr-4 py-4 bg-white outline-none rounded-2xl shadow-sm text-gray-700 placeholder-gray-400 "
            placeholder="Cari laporan..."
            />
    </div>
</div>
);
};

