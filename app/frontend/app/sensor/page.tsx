"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
  moisture: number;
  ph: number;
}

export default function SensorPage() {
  const [data, setData] = useState<SensorData[]>([]);

  // Fetch or simulate IoT data
  const fetchSensorData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sensors`);
      if (!res.ok) throw new Error("Backend not ready, using simulated data");
      const json = await res.json();
      setData(json.data || []);
    } catch {
      // Simulated Data (for demo if backend not ready)
      const now = new Date().toLocaleTimeString();
      setData((prev) => [
        ...prev.slice(-10),
        {
          timestamp: now,
          temperature: 25 + Math.random() * 5,
          humidity: 55 + Math.random() * 10,
          moisture: 40 + Math.random() * 20,
          ph: 6 + Math.random() * 1,
        },
      ]);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col items-center min-h-[calc(100vh-8rem)] py-10 bg-gradient-to-b from-green-100 via-emerald-50 to-amber-100">
      <h1 className="text-4xl font-bold text-green-800 mb-8">
        💧 Live Sensor Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-[90%] md:w-[80%]">
        {/* 🌡️ Temperature Chart */}
        <div className="bg-white/90 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-green-700">
            🌡️ Temperature (°C)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[20, 40]} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 💦 Humidity Chart */}
        <div className="bg-white/90 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-green-700">
            💦 Humidity (%)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[40, 80]} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🌾 Soil Moisture */}
        <div className="bg-white/90 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-green-700">
            🌾 Soil Moisture (%)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="moisture" stroke="#22c55e" strokeWidth={2} />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[20, 80]} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ⚗️ pH Levels */}
        <div className="bg-white/90 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-green-700">
            ⚗️ Soil pH
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="ph" stroke="#a855f7" strokeWidth={2} />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[5, 8]} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-600 italic">
        ⏱️ Auto-refreshes every 5 seconds | Powered by VinCloudOps 🚀
      </p>
    </section>
  );
}
