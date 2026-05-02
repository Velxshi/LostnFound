"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useState, useEffect, useRef } from "react";
import MapClickHandler from "./MapClickHandler";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
import { MarkerProps } from "@/types/marker.types";

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface DraftReport {
  latitude: number;
  longitude: number;
}

interface MarkerItems {
  data: MarkerProps[];
}

export default function Map({ data }: MarkerItems) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserPosition([latitude, longitude]);
    });
  }, []);

  const [draft, setDraft] = useState<DraftReport | null>(null);
  const draftMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (draft && draftMarkerRef.current) {
      draftMarkerRef.current.openPopup();
    }
  }, [draft]);

  if (!userPosition) return <p>Loading...</p>;

  const lostIcon = new L.Icon({
    iconUrl: "/assets/icons/marker-red.svg",
    shadowUrl: "/assets/icons/marker-shadow.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const foundIcon = new L.Icon({
    iconUrl: "/assets/icons/marker-yellow.svg",
    shadowUrl: "/assets/icons/marker-shadow.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
  function getMarkerIcon(status: string) {
    if (status === "LOST") return lostIcon;
    if (status === "FOUND") return foundIcon;
    return lostIcon;
  }

  return (
    <MapContainer center={userPosition} zoom={17} style={{ height: "100vh", width: "100%" }} zoomControl={false} attributionControl={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data?.map((report) => (
        <Marker key={report.id} position={[report.latitude, report.longitude]} icon={getMarkerIcon(report.status.name)}>
          <Popup>
            <p>{report.status.name}</p>
          </Popup>
        </Marker>
      ))}

      <MapClickHandler draft={draft} setDraft={setDraft} />
    </MapContainer>
  );
}
