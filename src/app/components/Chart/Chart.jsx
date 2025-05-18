"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Line } from "react-chartjs-2";
import axios from "axios";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const api = axios.create({
  baseURL: "http://localhost:8000/api/climate",
});

export const ClimateChart = ({ filePath, lat, lon, variable }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/chart-data", {
        params: { file_path: filePath, lat, lon, variable },
      })
      .then((res) => setData(res.data));
  }, [filePath, lat, lon, variable]);

  if (data.length < 2) {
    return (
      <div className="text-yellow-600 p-4">
        Not enough data points to plot a time-series chart.
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => new Date(d.time).toLocaleDateString()),
    datasets: [
      {
        label: `${variable} over time`,
        data: data.map((d) => d.value),
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
};
