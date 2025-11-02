"use client";
import { useState } from "react";

export default function PredictPage() {
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    ph: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8090/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data.prediction || "Prediction unavailable");
    } catch (error) {
      console.error("Prediction error:", error);
      setResult("Error fetching prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-10 bg-gradient-to-b from-emerald-100 via-green-50 to-amber-100">
      <h1 className="text-4xl font-bold text-green-900 mb-8">
        🤖 AI Crop Prediction
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-[90%] md:w-[500px]"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="temperature"
            placeholder="Temperature (°C)"
            value={formData.temperature}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="number"
            name="humidity"
            placeholder="Humidity (%)"
            value={formData.humidity}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="number"
            name="moisture"
            placeholder="Soil Moisture (%)"
            value={formData.moisture}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="number"
            name="ph"
            placeholder="pH Level"
            value={formData.ph}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
        >
          {loading ? "Predicting..." : "Get Prediction"}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl shadow-md">
          <p className="text-lg font-semibold">🌱 Result:</p>
          <p>{result}</p>
        </div>
      )}
    </section>
  );
}
