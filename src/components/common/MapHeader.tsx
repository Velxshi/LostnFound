import { usePathname, useRouter } from "next/navigation";
import { ProfilePicture } from "../ui/profile-picture";

type MapHeaderProps = {
  activeFilter: string | null;
  onFilterChange: (filter: string) => void;
};
type FilterButtonProps = {
  title: string;
  active: boolean;
  onClick: () => void;
};

function FilterButton({ title, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-fit p-2.5 rounded-2xl  font-jakarta text-caption shadow h-fit cursor-pointer hover:scale-105 transition-all duration-300 ${active ? "bg-[#DAF3FF] border border-[#2196F3] text-[#2196F3]" : "bg-cream-light"}`}
    >
      <p>{title}</p>
    </button>
  );
}

export default function MapHeader({ activeFilter, onFilterChange }: MapHeaderProps) {
  const router = useRouter();
  const pathName = usePathname();

  function goToProfile() {
    router.push("/profile");
  }

  return (
    <div className=" flex justify-between absolute h-fit top-6 left-6 right-6 z-1000 items-center md:top-9 md:left-9 md:right-9">
      <div className="flex gap-2 text-cream-darker">
        <FilterButton title="Laporan Saya" onClick={() => onFilterChange("laporan-saya")} active={activeFilter === "laporan-saya"} />
        <FilterButton title="Hilang" onClick={() => onFilterChange("hilang")} active={activeFilter === "hilang"} />
        <FilterButton title="Temuan" onClick={() => onFilterChange("temuan")} active={activeFilter === "temuan"} />
      </div>

      {pathName === "/" && (
        <div className="flex hover:ring-4 hover:ring-(--royale) transition-all duration-300 rounded-full ">
          <div onClick={goToProfile}>
            <ProfilePicture />
          </div>
        </div>
      )}
    </div>
  );
}
