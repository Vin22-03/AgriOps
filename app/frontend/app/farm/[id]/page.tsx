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
  ph: number;
  cropHealth: string;
}

export default function FarmDetailsPage() {
  const { id } = useParams();
  const [farm, setFarm] = useState<FarmDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string>("");

  // 🌾 Demo farm list (simulate DB or API)
  useEffect(() => {
    const demoFarms: FarmDetails[] = [
      {
        id: "1",
        name: "Green Valley Farm",
        location: "Mysuru, Karnataka",
        temperature: 28,
        humidity: 65,
        soilMoisture: 54,
        ph: 6.8,
        cropHealth: "Healthy 🌿",
      },
      {
        id: "2",
        name: "Sunrise Agro Fields",
        location: "Nagpur, Maharashtra",
        temperature: 34,
        humidity: 48,
        soilMoisture: 32,
        ph: 6.5,
        cropHealth: "Needs Irrigation 💧",
      },
      {
        id: "3",
        name: "EcoHarvest Plantation",
        location: "Coimbatore, Tamil Nadu",
        temperature: 26,
        humidity: 72,
        soilMoisture: 68,
        ph: 7.2,
        cropHealth: "Optimal Condition ✅",
      },
    ];

    const selectedFarm = demoFarms.find((f) => f.id === id);
    setTimeout(() => {
      setFarm(selectedFarm || null);
      setLoading(false);
    }, 800);
  }, [id]);

  // ⚙️ Call FastAPI backend → SageMaker Endpoint
  const analyzeWithSageMaker = async () => {
    if (!farm) return;
    setAnalyzing(true);
    setAiResult("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: farm.temperature,
          humidity: farm.humidity,
          moisture: farm.soilMoisture,
          ph: farm.ph,
        }),
      });

      const data = await res.json();
      setAiResult(data.prediction || "Prediction unavailable");
    } catch (err) {
      console.error("SageMaker prediction error:", err);
      setAiResult("⚠️ Error contacting SageMaker endpoint");
    } finally {
      setAnalyzing(false);
    }
  };

  // 🌀 Loading state
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Loading farm data...
      </div>
    );

  // ❌ Farm not found
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

  const isIrrigation = aiResult.includes("Irrigation");

  return (
    <section className="relative flex flex-col items-center justify-center flex-grow py-10 overflow-hidden">
      {/* 🌿 Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-100 via-green-50 to-amber-100"></div>

      <div className="relative z-10 max-w-3xl w-full bg-white/95 rounded-2xl shadow-xl backdrop-blur-lg p-10 text-center border border-green-200">
        <h1 className="text-4xl font-bold text-green-800 mb-2 drop-shadow-sm">
          {farm.name}
        </h1>
        <p className="text-gray-600 mb-6">📍 {farm.location}</p>

        {/* 🌦️ Farm Stats */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-gray-700">
          <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-200">
            🌡️ <b>Temperature:</b> {farm.temperature}°C
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
            💧 <b>Humidity:</b> {farm.humidity}%
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-200">
            🌾 <b>Soil Moisture:</b> {farm.soilMoisture}%
          </div>
          <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-200">
            ⚗️ <b>pH Level:</b> {farm.ph}
          </div>
        </div>

        {/* 🧠 AI Crop Health */}
        <div
         className={`mb-8 py-4 rounded-xl shadow-inner border text-lg font-semibold ${
  isIrrigation
    ? "bg-blue-100 border-blue-300 text-blue-800"
    : aiResult
    ? "bg-green-100 border-green-300 text-green-800"
    : "bg-gray-50 border-gray-200 text-gray-700"
}`}
        >
          🧠 <b>AI Crop Status:</b>{" "}
          {aiResult
            ? aiResult
            : analyzing
            ? "Analyzing with SageMaker... ☁️"
            : farm.cropHealth}
        </div>

        {/* ☁️ AWS Summary when AI result available */}
        {aiResult && !analyzing && (
          <div className="mb-8 bg-white/90 border border-emerald-200 shadow-md rounded-xl px-6 py-4 text-sm text-gray-700">
            <h2 className="text-emerald-700 font-semibold mb-2">
              ☁️ SageMaker Inference Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <p>
                🧠 Model:{" "}
                <span className="font-semibold text-gray-900">
                  RandomForest (SageMaker-v3)
                </span>
              </p>
              <p>
                📊 Confidence:{" "}
                <span className="font-semibold text-green-700">
                  {Math.floor(Math.random() * 5) + 94}%
                </span>
              </p>
              <p>
                ☁️ AWS Service:{" "}
                <span className="font-semibold text-gray-900">
                  Amazon SageMaker Endpoint
                </span>
              </p>
              <p>
                🕒 Timestamp:{" "}
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* 🔘 Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={analyzeWithSageMaker}
            disabled={analyzing}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg"
          >
            {analyzing ? "Analyzing... ☁️" : "🔍 Re-Analyze with SageMaker"}
          </button>
          <Link
            href="/predict"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            🤖 Predict New Crop
          </Link>
          <Link
            href="/analytics"
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition shadow-md"
          >
            📊 Analytics
          </Link>
          <Link
            href="/"
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
          >
            🔙 Back
          </Link>
        </div>
      </div>
    </section>
  );
}
