"use client";
import MapHeader from "@/components/common/map/MapHeader";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import MapLegend from "./MapLegend";

const Map = dynamic(() => import("@/components/common/map/Map"), {
  ssr: false,
});

export default function MapSection() {
  const [items, setItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  function handleFilter(filter: string) {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  }

  useEffect(() => {
    fetch(`/api/reports/map?filter=${activeFilter ?? ""}&search=${debouncedSearch}`)
      .then((res) => res.json())
      .then((data) => setItems(data.data))
      .catch((err) =>
        toast.error("Gagal mengambil data barang, silakan memuat ulang", {
          className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
          position: "top-right",
        }),
      );
  }, [activeFilter, debouncedSearch]);
  return (
    <div className="w-full h-screen relative">
      <MapHeader onFilterChange={handleFilter} activeFilter={activeFilter} onSearch={setSearch} />

      <Map data={items} />

      <MapLegend />
    </div>
  );
}
