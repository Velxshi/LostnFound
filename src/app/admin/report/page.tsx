import CardItem from "@/components/admin/cardItem";
import Kategori from "@/components/admin/reports/kategori";
import SearchInput from "@/components/admin/reports/Search";
import Urutstatus from "@/components/admin/reports/urutstatus";
export default function reports() {

return (
   <div className="w-full min-h-screen p-6">
    <div>
        <SearchInput />
    </div>
    <div className="pt-5">
        <Urutstatus />
    </div>
    <div className="pt-5">
        <Kategori />
    </div>
    <CardItem />
    </div>
  );
}