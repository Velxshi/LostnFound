import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapItem({ lat, lng, status, isMe }: { lat: number; lng: number; status: string; isMe: boolean }) {
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
    if (status === "HILANG") return lostIcon;
    if (status === "TEMUAN") return foundIcon;
    return lostIcon;
  }

  return (
    <MapContainer center={[lat, lng]} zoom={17} style={{ height: "100%", width: "100%" }} zoomControl={false} attributionControl={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} icon={getMarkerIcon(status, isMe)} />
    </MapContainer>
  );
}
