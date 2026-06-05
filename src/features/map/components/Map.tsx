"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useState, useEffect, useRef } from "react";
import MapClickHandler from "./MapClickHandler";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
import { MarkerProps } from "@/types/marker.types";
import { Loading } from "@/components/admin/loading";
import DetailItem from "@/components/admin/detail/detailitem";

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
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  function openDetail(id: number) {
    setSelectedItem(id);
    setPopupOpen(true);
  }

  function closeDetail() {
    setPopupOpen(false);
    setSelectedItem(null);
  }

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

  if (!userPosition) return <Loading />;

  const lostIcon = new L.Icon({
    iconUrl: "/assets/icons/marker-lost.svg",
    shadowUrl: "/assets/icons/marker-shadow.svg",
    iconSize: [42, 49],
    iconAnchor: [21, 49],
    popupAnchor: [1, -40],
    shadowSize: [60, 60],
    shadowAnchor: [15, 60],
  });

  const foundIcon = new L.Icon({
    iconUrl: "/assets/icons/marker-found.svg",
    shadowUrl: "/assets/icons/marker-shadow.svg",
    iconSize: [42, 49],
    iconAnchor: [21, 49],
    popupAnchor: [1, -40],
    shadowSize: [60, 60],
    shadowAnchor: [15, 60],
  });
  const selfIcon = new L.Icon({
    iconUrl: "/assets/icons/marker-self.svg",
    shadowUrl: "/assets/icons/marker-shadow.svg",
    iconSize: [42, 49],
    iconAnchor: [21, 49],
    popupAnchor: [1, -40],
    shadowSize: [60, 60],
    shadowAnchor: [15, 60],
  });

  function getMarkerIcon(status: string, isMe: boolean) {
    if (isMe) return selfIcon;
    if (status === "LOST") return lostIcon;
    if (status === "FOUND") return foundIcon;
    return lostIcon;
  }

  return (
    <MapContainer center={userPosition} zoom={17} style={{ height: "100vh", width: "100%" }} zoomControl={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data?.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={getMarkerIcon(report.status.name, report.isMe)}
          eventHandlers={{
            click: () => openDetail(report.id),
          }}
        ></Marker>
      ))}

      <MapClickHandler draft={draft} setDraft={setDraft} />
      <DetailItem isOpen={popupOpen} onClose={closeDetail} id={selectedItem} />
    </MapContainer>
  );
}
