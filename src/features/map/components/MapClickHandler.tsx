"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useRouter } from "next/navigation";

interface DraftReport {
  latitude: number;
  longitude: number;
}

interface MapClickHandlerProps {
  draft: DraftReport | null;
  setDraft: (draft: DraftReport | null) => void;
}
export default function MapClickHandler({ draft, setDraft }: MapClickHandlerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  useMapEvents({
    click(e) {
      if (isPopupOpen) {
        markerRef.current?.closePopup();
        setIsPopupOpen(false);
        return;
      }

      const { lat, lng } = e.latlng;
      setDraft({
        latitude: lat,
        longitude: lng,
      });
    },
  });

  useEffect(() => {
    if (draft && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [draft]);

  if (!draft) return null;

  function goToForm(type: "hilang" | "temuan") {
    if (!draft) return;

    const { latitude, longitude } = draft;

    router.push(`/form/${type}?lat=${latitude}&lng=${longitude}`);
  }
  return (
    <Marker
      position={[draft.latitude, draft.longitude]}
      ref={markerRef}
      eventHandlers={{
        add: () => {
          markerRef.current?.openPopup();
          setIsPopupOpen(true);
        },
        popupopen: () => setIsPopupOpen(true),
        popupclose: () => setIsPopupOpen(false),
      }}
    >
      <Popup closeButton={false}>
        <div className="w-full flex flex-col ">
          <div onClick={() => goToForm("hilang")} className="w-full flex p-6 items-center justify-center cursor-pointer group">
            <p className="font-poppins font-semibold text-body text-dark group-hover:scale-105 transition-all duration-300">Laporkan Kehilangan</p>
          </div>
          <hr />
          <div onClick={() => goToForm("temuan")} className="w-full flex p-6  items-center justify-center cursor-pointer group">
            <p className="font-poppins font-semibold text-body text-dark group-hover:scale-105 transition-all duration-300">Laporkan Temuan</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
