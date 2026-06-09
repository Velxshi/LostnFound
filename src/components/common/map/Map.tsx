"use client";

import { MapContainer, TileLayer, Marker, ZoomControl, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import MapClickHandler from "./MapClickHandler";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
import { MarkerProps } from "@/types/marker.types";
import { Loading } from "@/components/admin/loading";
import DetailItem from "@/components/admin/detail/detailitem";
import { Icon } from "@iconify/react";

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
}

interface DraftReport {
  latitude: number;
  longitude: number;
}

interface MarkerItems {
  data: MarkerProps[];
}

function MapController({ controlRef }: { controlRef: React.MutableRefObject<MapHandle | null> }) {
  const map = useMap();

  useEffect(() => {
    controlRef.current = {
      flyTo(lat, lng, zoom = 17) {
        map.flyTo([lat, lng], zoom, { animate: true, duration: 1.2 });
      },
    };
    return () => {
      controlRef.current = null;
    };
  }, [map, controlRef]);

  return null;
}

function CenterButton() {
  const map = useMap();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      L.DomEvent.disableClickPropagation(buttonRef.current);
    }
  }, []);

  function handleCenter() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.flyTo([latitude, longitude], 18);
    });
  }

  return (
    <div ref={buttonRef} className="leaflet-bottom leaflet-right" style={{ marginBottom: "90px" }}>
      <div className="leaflet-control">
        <button className="bg-white p-2 rounded-sm cursor-pointer shadow" onClick={handleCenter}>
          <Icon icon="streamline:target-3-remix" height={20} />
        </button>
      </div>
    </div>
  );
}

const Map = forwardRef<MapHandle, MarkerItems>(({ data }, ref) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const controlRef = useRef<MapHandle | null>(null);

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, zoom = 17) {
      controlRef.current?.flyTo(lat, lng, zoom);
    },
  }));

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

  const currIcon = new L.Icon({
    iconUrl: "/assets/icons/marker-position.svg",
    iconSize: [50, 50],
    iconAnchor: [21, 50],
  });

  function getMarkerIcon(status: string, isMe: boolean) {
    if (isMe) return selfIcon;
    if (status === "HILANG") return lostIcon;
    if (status === "TEMUAN") return foundIcon;
    return lostIcon;
  }

  function getRadiusColor(status: string, isMe: boolean) {
    if (isMe) return "purple";
    if (status === "HILANG") return "red";
    if (status === "TEMUAN") return "yellow";
    return "red";
  }

  return (
    <MapContainer center={userPosition} zoom={18} style={{ height: "100vh", width: "100%" }} minZoom={10} zoomControl={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController controlRef={controlRef} />
      <Marker position={userPosition} icon={currIcon} />
      {data?.map((report) => (
        <div key={report.id}>
          <Marker position={[report.latitude, report.longitude]} icon={getMarkerIcon(report.status.name, report.isMe)} eventHandlers={{ click: () => openDetail(report.id) }} />
          <Circle center={[report.latitude, report.longitude]} radius={50} pathOptions={{ color: getRadiusColor(report.status.name, report.isMe) }} />
        </div>
      ))}
      <CenterButton />
      <ZoomControl position="bottomright" />
      <MapClickHandler draft={draft} setDraft={setDraft} disabled={popupOpen} />
      <DetailItem isOpen={popupOpen} onClose={closeDetail} id={selectedItem} />
    </MapContainer>
  );
});

Map.displayName = "Map";
export default Map;
