"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MapHeaderAdmin from "@/components/admin/map/MapHeaderadmin";

export default function Map() {

const Map = dynamic(() => import("../../../features/map/components/Map"), { ssr: false });
const [reports, setReports] = useState([]);

useEffect(() => {
    fetch("/api/reports")
    .then((res) => res.json())
    .then((data) => setReports(data));
}, []);
    return (
    <div className="w-full min-h-screen inset-0 z-10">
    <MapHeaderAdmin />
    <Map data={reports} />
    </div>
    );
}