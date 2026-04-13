"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useState } from "react";
import MapClickHandler from "../MapClickHandler";
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
export default function Map({ data }: any) {
  const [reports, setReports] = useState(data);
  const [draft, setDraft] = useState(null);

  function handleMapClick(lat: number, lng: number) {
    setDraft({
      latitude: lat,
      longitude: lng,
      title: "",
    });
  }

  async function submitReport() {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...draft,
        status: "lost",
      }),
    });

    const saved = await res.json();

    setReports((prev) => [...prev, saved]);
    setDraft(null);
  }

  return (
    <MapContainer center={[-6.873, 107.664]} zoom={17} style={{ height: "100vh", width: "100%" }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapClickHandler onClick={handleMapClick} />
      {data?.map((report: any) => (
        <Marker key={report.id} position={[report.latitude, report.longitude]}>
          <Popup>
            <p>{report.title}</p>
            <p>{report.status}</p>
          </Popup>
        </Marker>
      ))}

      {draft && (
        <Marker position={[draft.latitude, draft.longitude]}>
          <Popup>
            <div>
              <input placeholder="Judul laporan" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />

              <button onClick={submitReport}>Simpan laporan</button>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
