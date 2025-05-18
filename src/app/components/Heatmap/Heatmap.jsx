"use client";

import { useMap } from "react-leaflet";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const api = axios.create({
  baseURL: "http://localhost:8000/api/climate",
});

export const HeatmapLayer = ({ filePath, time, variable }) => {
  const map = useMap();
  const [heatLayerRef, setHeatLayerRef] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activeLayer;

    async function load() {
      try {
        const leaflet = await import("leaflet");
        const L = leaflet.default || leaflet;
        window.L = L;

        await import("leaflet.heat");

        const res = await api.get("/map", {
          params: { file_path: filePath, time, variable },
        });

        const heatData = res.data.map((d) => [d.lat, d.lon, d.value]);
        const max = Math.max(...heatData.map((h) => h[2])) || 1;
        const normalized = heatData.map(([lat, lon, val]) => [
          lat,
          lon,
          val / max,
        ]);

        activeLayer = L.heatLayer(normalized, {
          radius: 15,
          blur: 20,
          maxZoom: 8,
          minOpacity: 0.2,
        });

        activeLayer.addTo(map);
        setHeatLayerRef(activeLayer);
      } catch (err) {
        console.error("Error loading heatmap:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load heatmap data"
        );
      }
    }

    load();

    return () => {
      if (activeLayer) {
        map.removeLayer(activeLayer);
      }
    };
  }, [filePath, time, variable]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  return null;
};

export const ClimateHeatmap = ({ filePath, time, variable }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6 h-96">
      <MapContainer
        center={[51.5, 5.0]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <HeatmapLayer filePath={filePath} time={time} variable={variable} />
      </MapContainer>
    </div>
  );
};

export default ClimateHeatmap;
