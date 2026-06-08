"use client";
import MapHeader from "@/components/common/map/MapHeader";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import MapLegend from "./MapLegend";

import { type MapHandle } from "@/components/common/map/Map";
import { type SuggestionItem } from "../button/Search";
const Map = dynamic(() => import("@/components/common/map/Map"), {
  ssr: false,
});

export default function MapSection() {
  const [items, setItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const mapRef = useRef<MapHandle>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  function handleFilter(filter: string) {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  }

  function handleSelectSuggestion(item: SuggestionItem) {
    if (item.lat && item.lng) {
      mapRef.current?.flyTo(item.lat, item.lng, 17);
    }
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
      <MapHeader onFilterChange={handleFilter} activeFilter={activeFilter} onSearch={setSearch} onSelectSuggestion={handleSelectSuggestion} />

      <Map data={items} ref={mapRef} />

      <MapLegend />
    </div>
  );
}
