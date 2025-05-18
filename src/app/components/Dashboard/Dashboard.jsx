"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { ClimateChart } from "../Chart/Chart";
const ClimateHeatmap = dynamic(() => import("../Heatmap/Heatmap"), {
  ssr: false,
});

const availableVariables = [
  { label: "2m Temperature", value: "t2m" },
  { label: "Total Precipitation", value: "tp" },
  // { label: "10m Wind U Component", value: "u10" },
  // { label: "10m Wind V Component", value: "v10" },
];

const variableToFilePath = {
  t2m: "output/era5_2m_temperature_2020.nc",
  tp: "output/era5_total_precipitation_2020.grib",
  u10: "output/era5_10m_u_component_of_wind_2020.grib",
  v10: "output/era5_10m_v_component_of_wind_2020.grib",
};

export const Dashboard = () => {
  const [variable, setVariable] = useState("t2m");
  const [time, setTime] = useState("2023-01-01T12:00:00");
  const [lat, setLat] = useState(51.5);
  const [lon, setLon] = useState(5.0);

  const filePath = variableToFilePath[variable];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        ERA5 Climate Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-caps-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Variable
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={variable}
            onChange={(e) => setVariable(e.target.value)}
          >
            {availableVariables.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="datetime-local"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={lat}
            step="0.1"
            onChange={(e) => setLat(parseFloat(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={lon}
            step="0.1"
            onChange={(e) => setLon(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <ClimateHeatmap filePath={filePath} time={time} variable={variable} />
      <ClimateChart
        filePath={filePath}
        lat={lat}
        lon={lon}
        variable={variable}
      />
    </div>
  );
};
