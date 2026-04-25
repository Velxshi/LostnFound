"use client";
import CardItem from "@/components/admin/cardItem";
import Kategori from "@/components/admin/reports/kategori";
import SearchInput from "@/components/admin/reports/Search";
import Urutstatus from "@/components/admin/reports/urutstatus";
import { BlurFade } from "@/components/ui/blur-fade";
import { useEffect, useState } from "react";
export default function reports() {


    const [items, setItems] = useState<any>(null);

   useEffect(() => { 
   const fetchItems = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  };
    fetchItems();
  }, []);

return (
  <div className="w-full min-h-screen p-9 flex justify-center">
    <BlurFade delay={0.15} inView>
    <div className="container flex flex-col">
    <div>
        <SearchInput />
    </div>
    <div className="pt-5 relative z-20">
        <Urutstatus />
    </div>
    <div className="pt-5 relative z-10">
        <Kategori />
    </div>

    <CardItem data={items} />
    </div>
    </BlurFade>
</div>
);
}