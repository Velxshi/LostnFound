import CardItem from "@/components/admin/cardItem";
import Kategori from "@/components/admin/reports/kategori";
import SearchInput from "@/components/admin/reports/Search";
import Urutstatus from "@/components/admin/reports/urutstatus";
import { BlurFade } from "@/components/ui/blur-fade";
export default function reports() {

return (
    <div className="w-full min-h-screen p-6">
    <BlurFade delay={0.15} inView>
    <div>
        <SearchInput />
    </div>
    </BlurFade>
    <BlurFade delay={0.35} inView>
    <div className="pt-5">
        <Urutstatus />
    </div>
    </BlurFade>
    <BlurFade delay={0.45} inView>
    <div className="pt-5">
        <Kategori />
    </div>
    </BlurFade>
    <BlurFade delay={0.55} inView>      
    <CardItem />
    </BlurFade>
    </div>
);
}