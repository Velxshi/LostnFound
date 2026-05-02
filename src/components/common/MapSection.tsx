"use client";
import MapHeader from "@/components/common/MapHeader";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";

const Map = dynamic(() => import("@/features/map/components/Map"), {
  ssr: false,
});

export default function MapSection() {
  const [items, setItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  function handleFilter(filter: string) {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  }

  useEffect(() => {
    fetch(`/api/reports/map?filter=${activeFilter}`)
      .then((res) => res.json())
      .then((data) => setItems(data.data))
      .catch((err) => console.error("Gagal load reports:", err));
  }, [activeFilter]);
  return (
    <>
      <MapHeader onFilterChange={handleFilter} activeFilter={activeFilter} />

      <Map data={items} />
    </>
  );
}
