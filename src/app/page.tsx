"use client";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";

const Map = dynamic(() => import("../features/map/components/Map"), { ssr: false });

export default function Home() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data));
  }, []);
  return <Map data={reports} />;
}
