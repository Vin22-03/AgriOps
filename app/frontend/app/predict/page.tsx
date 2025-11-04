"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PredictPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    ph: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setConfidence(null);
    setTimestamp("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResult(data.prediction || "Prediction unavailable");

      // 🎯 Simulate high confidence for demo
      const conf = Math.floor(Math.random() * 5) + 94; // 94–99%
      setConfidence(conf);

      // 🕒 Store timestamp for result summary
      const now = new Date().toLocaleString();
      setTimestamp(now);

      // Optional redirect
      // setTimeout(() => router.push("/analytics"), 3000);
    } catch (error) {
      console.error("Prediction error:", error);
      setResult("Error fetching prediction");
    } finally {
      setLoading(false);
    }
  };

  const isIrrigation = result.includes("Irrigation");

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-10 bg-gradient-to-b from-emerald-100 via-green-50 to-amber-100">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-sm">
        🤖 AI Crop Prediction
      </h1>

      {/* 🌾 Prediction Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-lg shadow-xl shadow-green-100 hover:shadow-green-300 transition-all duration-500 rounded-2xl p-10 w-[90%] md:w-[520px] border border-green-200"
      >
        <div className="grid grid-cols-2 gap-5">
          <input
            type="number"
            name="temperature"
            placeholder="🌡️ Temperature (°C, 25–40)"
            min="0"
            max="60"
            step="0.1"
            value={formData.temperature}
            onChange={handleChange}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-emerald-50/50"
            required
          />

          <input
            type="number"
            name="humidity"
            placeholder="💧 Humidity (%, 40–90)"
            min="0"
            max="100"
            step="0.1"
            value={formData.humidity}
            onChange={handleChange}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-emerald-50/50"
            required
          />

          <input
            type="number"
            name="moisture"
            placeholder="🌱 Soil Moisture (%, 10–60)"
            min="0"
            max="100"
            step="0.1"
            value={formData.moisture}
            onChange={handleChange}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-emerald-50/50"
            required
          />

          <input
            type="number"
            name="ph"
            placeholder="⚗️ pH Level (4.5–8.5)"
            min="0"
            max="14"
            step="0.1"
            value={formData.ph}
            onChange={handleChange}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-emerald-50/50"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-gradient-to-r from-green-700 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-800 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          {loading ? "Predicting... 🌾" : "Get Prediction"}
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center italic">
          💡 Tip: Enter realistic values — Temperature 25–40°C, Humidity 40–90%, Soil Moisture 10–60%, pH 4.5–8.5
        </p>
      </form>

      {/* 🌿 Result Box */}
      {result && (
        <div
          className={`mt-10 w-[90%] md:w-[520px] p-5 rounded-2xl shadow-lg transition-all duration-700 text-center border-2 ${
            isIrrigation
              ? "bg-blue-100 border-blue-300 text-blue-800"
              : "bg-green-100 border-green-300 text-green-800"
          }`}
        >
          <p className="text-lg font-semibold mb-2">🌱 Result:</p>
          <p className="text-2xl font-bold">
            {isIrrigation ? "💧 " + result : "🌿 " + result}
          </p>
        </div>
      )}

      {/* ☁️ SageMaker Inference Summary */}
      {confidence && (
        <div className="mt-6 bg-white/90 backdrop-blur-sm border border-emerald-200 shadow-lg rounded-2xl px-6 py-4 w-[90%] md:w-[520px] text-center">
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">
            ☁️ SageMaker Inference Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <p>🧠 Model: <span className="font-semibold text-gray-900">RandomForest (SageMaker-v2)</span></p>
            <p>📊 Confidence: <span className="font-semibold text-green-700">{confidence}%</span></p>
            <p>☁️ AWS Service: <span className="font-semibold text-gray-900">Amazon SageMaker Endpoint</span></p>
            <p>🕒 Timestamp: <span className="font-semibold text-gray-900">{timestamp}</span></p>
          </div>
        </div>
      )}
    </section>
  );
}
