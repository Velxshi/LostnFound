"use client";
import CardItem from "@/components/admin/cardItem";
import Kategori from "@/components/admin/reports/kategori";
import SearchInput from "@/components/admin/reports/Search";
import Urutstatus from "@/components/admin/reports/urutstatus";
import { BlurFade } from "@/components/ui/blur-fade";
import { useEffect, useState } from "react";
export default function reports() {


const [items, setItems] = useState<any>(null);
const [currentPage, setCurrentPage] = useState(1);
const [search, setSearch] = useState("");
const [selectCategory, setselectCategory] = useState("");
const [sort, setSort] = useState("");
const [status, setStatus] = useState("");
   useEffect(() => { 
   const fetchItems = async () => {
    console.log("Fetching Page:", currentPage);
    const res = await fetch(`/api/items?page=${currentPage}&search=${search}&categoryId=${selectCategory}&sort=${sort}&statusId=${status}`);
    const data = await res.json();
    console.log("kontol :",data.data);
    setItems(data.data);
  };
    fetchItems();
  }, [currentPage, search,selectCategory,sort,status]);

return (
  <div className="w-full min-h-screen p-9 flex justify-center">
    <BlurFade delay={0.15} inView>
    <div className="container flex flex-col">
    <div>
        <SearchInput onSearch={(value: string) => setSearch(value)} />
    </div>
    <div className="pt-5 relative z-20">
        <Urutstatus sortItem={(val) => {
    setSort(val.toLowerCase());
    setCurrentPage(1);
  }}
  statusItem={(id) => {
    setStatus(id);
    setCurrentPage(1);
  }}/>
    </div>
    <div className="pt-5 relative z-10">
        <Kategori onCategoryChange={(cat: string) => {
        setselectCategory(cat);
        setCurrentPage(1);
      }} />
    </div>

    <CardItem data={items} />

 {items?.pagination && (
  <div className="flex justify-center items-center gap-2 mt-12 pb-10">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    </button>

    <div className="flex items-center gap-1">
      {Array.from({ length: items.pagination.totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
            currentPage === page
              ? "bg-[#2848b7] text-white shadow-md shadow-blue-200"
              : "bg-white border border-gray-200 text-gray-600 hover:border-[#2848b7] hover:text-[#2848b7] hover:shadow-sm"
          }`}
        >
          {page}
        </button>
      ))}
    </div>

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, items.pagination.totalPages))}
      disabled={currentPage === items.pagination.totalPages}
      className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  </div>
)}
    </div>
    </BlurFade>
</div>
);
}