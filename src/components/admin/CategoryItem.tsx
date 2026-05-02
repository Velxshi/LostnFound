import { CategoryItemProps } from "@/types/categoryItems.types";
import { Icon } from "@iconify/react";

interface categoryProps {
  data: CategoryItemProps;
  onEdit: (item: CategoryItemProps) => void;
  onDelete: (item: CategoryItemProps) => void;
}

export default function CategoryItem({ data, onEdit, onDelete }: categoryProps) {
  return (
    <div className="flex h-20 w-full justify-between items-center bg-cream-light rounded-3xl px-6 shadow-sm border border-(--cream-active)">
      <div className="flex flex-col gap-4">
        <h3 className="text-dark font-poppins">{data.name}</h3>
        <span className="text-(--cream-active) text-sm font-poppins font-light">{data.totalItems} Barang</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:bg-(--royale-light-hover) p-2 rounded-full transition-colors group cursor-pointer active:scale-95" onClick={() => onEdit(data)}>
          <Icon icon="tabler:pencil" className="text-primary" width="20" height="20" />
        </button>
        <button className="hover:bg-red-50 p-2 rounded-full transition-colors group cursor-pointer active:scale-95" onClick={() => onDelete(data)}>
          <Icon icon="tabler:trash" className="text-[#C10007]" width="20" height="20" />
        </button>
      </div>
    </div>
  );
}
