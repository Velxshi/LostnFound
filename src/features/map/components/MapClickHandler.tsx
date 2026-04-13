"use client";

import { useMapEvents } from "react-leaflet";

import React from "react";

export default function MapClickHandler({ onClick }: any) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    },
  });

  return null;
}
