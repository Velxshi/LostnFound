"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MapHeaderAdmin from "@/components/admin/map/MapHeaderadmin";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Map() {

const Map = dynamic(() => import("../../../features/map/components/Map"), { ssr: false });
const [reports, setReports] = useState([]);
const [user,setUser] = useState<any>(null);

useEffect(() => { 
    const fetchUser = async () => {
    try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();  
        setUser(data.user);
    } catch (error) {
        console.error("Gagal load user:", error);
    }
    }

    fetchUser();
    }, []);
useEffect(() => {
    fetch("/api/reports")
    .then((res) => res.json())
    .then((data) => setReports(data));
}, []);
    return (
    <div className="w-full min-h-screen inset-0 z-10">
        <BlurFade delay={0.35} inView>
    <MapHeaderAdmin data={user}/>
    <Map data={reports} />
        </BlurFade>
    </div>
    );
}