import { Icon } from "@iconify/react";

export default function ListCategory({ data }: { data: any }) {

    const listItems = data?.categories || [];
    if (listItems.length === 0) {
    return <div className="text-center py-10 text-gray-500">Belum ada kategori yang tersedia.</div>;
    }

    return (
    <div className="flex flex-col gap-4 w-full">
        {listItems.map((item: any) => (
        <div 
            key={item.id} 
            className="flex h-20 w-full justify-between items-center bg-[#FEFEFE] rounded-[20px] px-6 shadow-sm border border-gray-100"
        >
            <div className="flex flex-col">
            <h3 className="text-[#1A1A1A] font-regular text-md font-poppins">
                {item.name}
            </h3>
            <span className="text-[#A1A1A1] text-sm font-poppins mt-1 font-light">
              {item.totalItems} Barang
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:bg-blue-50 p-2 rounded-full transition-colors group">
              <Icon icon="tabler:pencil" className="text-[#2848B7]" width="20" height="20"/>
            </button>

            <button className="hover:bg-red-50 p-2 rounded-full transition-colors group">
            <Icon icon="tabler:trash" className="text-[#C10007]" width="20" height="20"/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}