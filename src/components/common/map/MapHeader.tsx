import { usePathname, useRouter } from "next/navigation";
import { ProfilePicture } from "@/components/ui/profile-picture";
import SearchComponent, { type SuggestionItem } from "../button/Search";

type MapHeaderProps = {
  activeFilter: string | null;
  onFilterChange: (filter: string) => void;
  onSearch: (search: string) => void;
  onSelectSuggestion: (item: SuggestionItem) => void;
};
type FilterButtonProps = {
  title: string;
  active: boolean;
  onClick: () => void;
};

function FilterButton({ title, active, onClick }: FilterButtonProps) {
  return (
    <button onClick={onClick} className={`w-fit p-2.5 rounded-2xl  font-jakarta text-caption shadow h-fit cursor-pointer hover:scale-105 transisi ${active ? "bg-[#DAF3FF] border border-[#2196F3] text-[#2196F3]" : "bg-cream-light"}`}>
      <p>{title}</p>
    </button>
  );
}

export default function MapHeader({ activeFilter, onFilterChange, onSearch, onSelectSuggestion }: MapHeaderProps) {
  const router = useRouter();
  const pathName = usePathname();

  function goToProfile() {
    router.push("/profile");
  }

  return (
    <div className="flex flex-col gap-3 absolute h-fit top-6 left-6 right-6 z-1000 md:top-9 md:left-9 md:right-9">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchComponent onSearch={onSearch} onSelectSuggestion={onSelectSuggestion} />
        </div>

        {pathName === "/" && (
          <div className="shrink-0 hover:ring-4 hover:ring-(--royale) transisi rounded-full">
            <div onClick={goToProfile}>
              <ProfilePicture />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 text-cream-darker">
        <FilterButton title="Laporan Saya" onClick={() => onFilterChange("laporan-saya")} active={activeFilter === "laporan-saya"} />
        <FilterButton title="Hilang" onClick={() => onFilterChange("hilang")} active={activeFilter === "hilang"} />
        <FilterButton title="Temuan" onClick={() => onFilterChange("temuan")} active={activeFilter === "temuan"} />
      </div>
    </div>
  );
}
