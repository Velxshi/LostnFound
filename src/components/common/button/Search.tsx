import { Icon } from "@iconify/react";

export default function SearchComponent({ onSearch }: { onSearch: (value: string) => void }) {
  return (
    <div className="relative rounded-2xl bg-cream-light w-full">
      <div className="absolute  inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon icon="material-symbols:search" className="w-4 h-4 text-cream-dark" width={16} height={16} />
      </div>
      <input
        onChange={(e) => onSearch(e.target.value)}
        type="text"
        name="search"
        className="text-[13px] font-extralight font-poppins w-full pl-12 pr-4 py-4 bg-white outline-none rounded-2xl shadow-sm text-dark placeholder-gray-400 "
        placeholder="Cari laporan..."
      />
    </div>
  );
}
