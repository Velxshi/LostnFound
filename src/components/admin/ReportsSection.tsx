"use client";
import { useEffect, useState } from "react";
import { BlurFade } from "../ui/blur-fade";
import SearchInput from "@/components/common/button/Search";
import Urutstatus from "@/components/common/button/urutStatus";
import Kategori from "@/components/common/button/kategori";
import { CardItemProps, ItemsResponse } from "@/types/reportItems.types";
import CardItem from "../common/CardItem";
import DetailItem from "./detail/detailitem";

export default function ReportSection() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectCategory, setSelectCategory] = useState("");
  const [items, setItems] = useState<ItemsResponse | null>(null);

  useEffect(() => {
    fetch(`/api/items?page=${currentPage}&search=${search}&categoryId=${selectCategory}&sort=${sort}&statusId=${status}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Gagal load reports: ", err));
  }, [currentPage, search, selectCategory, sort, status]);

  const [selectedItem, setSelectedItem] = useState<CardItemProps | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  function openDetail(item: CardItemProps) {
    setSelectedItem(item);
    setPopupOpen(true);
  }

  function closeDetail() {
    setPopupOpen(false);
    setSelectedItem(null);
  }
  return (
    <div className="w-full">
      <div className="flex flex-col w-full mx-auto">
        <BlurFade delay={0.15} inView>
          <SearchInput onSearch={(value: string) => setSearch(value)} />
        </BlurFade>
        <div className="pt-5 relative z-20">
          <BlurFade delay={0.45} inView>
            <Urutstatus
              sortItem={(val) => {
                setSort(val.toLowerCase());
                setCurrentPage(1);
              }}
              statusItem={(id) => {
                setStatus(id);
                setCurrentPage(1);
              }}
            />
          </BlurFade>
        </div>
        <div className="pt-5 relative z-10">
          <BlurFade delay={0.45} inView>
            <Kategori
              onCategoryChange={(cat: string) => {
                setSelectCategory(cat);
                setCurrentPage(1);
              }}
            />
          </BlurFade>
        </div>

        <BlurFade delay={0.55} inView>
          <div className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {items?.data.map((item) => (
              <CardItem data={item} key={item.id} openDetail={openDetail} />
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={0.55} inView>
          {items?.pagination && (
            <div className="flex justify-center items-center gap-2 mt-12 pb-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: items.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer scale-105  ${
                      currentPage === page ? "bg-[#2848b7] text-white shadow-md shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-[#2848b7] hover:text-[#2848b7] hover:shadow-sm"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, items.pagination.totalPages))}
                disabled={currentPage === items.pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </BlurFade>
      </div>
      <DetailItem isOpen={popupOpen} onClose={closeDetail} item={selectedItem} />
    </div>
  );
}
