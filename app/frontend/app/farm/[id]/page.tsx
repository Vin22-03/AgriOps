"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface FarmDetails {
  id: string;
  name: string;
  location: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  cropHealth: string;
}

export default function FarmDetailsPage() {
  const { id } = useParams();
  const [farm, setFarm] = useState<FarmDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🧠 Simulated data for demo
    const demoFarms: FarmDetails[] = [
      {
        id: "1",
        name: "Green Valley Farm",
        location: "Mysuru, Karnataka",
        temperature: 28,
        humidity: 65,
        soilMoisture: 54,
        cropHealth: "Healthy 🌿",
      },
      {
        id: "2",
        name: "Sunrise Agro Fields",
        location: "Nagpur, Maharashtra",
        temperature: 32,
        humidity: 52,
        soilMoisture: 40,
        cropHealth: "Needs Irrigation 💧",
      },
      {
        id: "3",
        name: "EcoHarvest Plantation",
        location: "Coimbatore, Tamil Nadu",
        temperature: 26,
        humidity: 72,
        soilMoisture: 68,
        cropHealth: "Optimal Condition ✅",
      },
    ];

    const selectedFarm = demoFarms.find((f) => f.id === id);
    setTimeout(() => {
      setFarm(selectedFarm || null);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Loading farm data...
      </div>
    );

  if (!farm)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-red-600 text-xl mb-4">❌ Farm not found!</p>
        <Link
          href="/"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          🔙 Back to Dashboard
        </Link>
      </div>
    );

  return (
    <section className="relative flex flex-col items-center justify-center flex-grow py-10 overflow-hidden">
      {/* 🌾 Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-100 via-emerald-100 to-amber-100 animate-gradient-x"></div>

      <div className="relative z-10 max-w-3xl w-full bg-white/90 rounded-2xl shadow-xl backdrop-blur p-10 text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-2">{farm.name}</h1>
        <p className="text-gray-600 mb-6">📍 {farm.location}</p>

        <div className="grid grid-cols-2 gap-6 mb-6 text-gray-700">
          <div className="bg-emerald-100 rounded-xl p-4 shadow-sm">
            🌡️ <b>Temperature:</b> {farm.temperature}°C
          </div>
          <div className="bg-blue-100 rounded-xl p-4 shadow-sm">
            💧 <b>Humidity:</b> {farm.humidity}%
          </div>
          <div className="bg-yellow-100 rounded-xl p-4 shadow-sm">
            🌾 <b>Soil Moisture:</b> {farm.soilMoisture}%
          </div>
          <div className="bg-amber-100 rounded-xl p-4 shadow-sm">
            🧠 <b>AI Crop Status:</b> {farm.cropHealth}
          </div>
        </div>

        {/* 🧭 Navigation */}
        <div className="flex justify-center gap-4">
          <Link
            href="/sensor"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            💧 Sensor Data
          </Link>
          <Link
            href="/predict"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            🤖 Predict Yield
          </Link>
          <Link
            href="/analytics"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            📊 Analytics
          </Link>
          <Link
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            🔙 Back
          </Link>
        </div>
      </div>
    </section>
  );
}
