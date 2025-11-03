"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [yieldData, setYieldData] = useState<any[]>([]);
  const [costData, setCostData] = useState<any[]>([]);
  const [healthData, setHealthData] = useState<any[]>([]);
  const [latestPrediction, setLatestPrediction] = useState<string | null>(null);

  // 🧠 Load saved prediction from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("lastPrediction");
    if (stored) setLatestPrediction(stored);
  }, []);

  // 🌾 Generate dummy analytics for visualization
  useEffect(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const farms = ["Green Valley", "Sunrise Agro", "EcoHarvest"];

    const yieldArr = months.map((m) => ({
      month: m,
      "Green Valley": 25 + Math.random() * 10,
      "Sunrise Agro": 20 + Math.random() * 12,
      "EcoHarvest": 18 + Math.random() * 15,
    }));

    const costArr = farms.map((f) => ({
      name: f,
      operations: 4000 + Math.random() * 2000,
      maintenance: 2000 + Math.random() * 1500,
      water: 1000 + Math.random() * 500,
    }));

    const healthArr = farms.map((f) => ({
      name: f,
      health: 70 + Math.random() * 25,
    }));

    setYieldData(yieldArr);
    setCostData(costArr);
    setHealthData(healthArr);
  }, []);

  return (
    <section className="min-h-[calc(100vh-8rem)] py-10 flex flex-col items-center bg-gradient-to-b from-amber-50 via-green-50 to-emerald-100">
      <h1 className="text-4xl font-bold text-green-900 mb-8 drop-shadow-sm">
        📈 AgroSphere Analytics Dashboard
      </h1>

      {/* 🧠 Latest AI Prediction Summary */}
      {latestPrediction && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-5 rounded-2xl shadow-lg mb-10 w-[90%] md:w-[600px] text-center">
          <h2 className="text-xl font-bold mb-2">🌿 Latest AI Prediction</h2>
          <p className="text-lg">{latestPrediction}</p>
          <p className="text-sm text-gray-600 mt-2">
            (Generated from SageMaker via FastAPI)
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-[90%] md:w-[80%]">

        {/* 🌾 Farm Yield Trend */}
        <div className="bg-white/90 p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            🌾 Farm Yield Trends (tons / hectare)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldData}>
              <Line dataKey="Green Valley" stroke="#16a34a" strokeWidth={2} />
              <Line dataKey="Sunrise Agro" stroke="#f59e0b" strokeWidth={2} />
              <Line dataKey="EcoHarvest" stroke="#2563eb" strokeWidth={2} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 💰 Cost Efficiency */}
        <div className="bg-white/90 p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            💰 Cost Efficiency per Farm (₹)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="operations" stackId="a" fill="#22c55e" />
              <Bar dataKey="maintenance" stackId="a" fill="#16a34a" />
              <Bar dataKey="water" stackId="a" fill="#65a30d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🧠 Crop Health Index */}
        <div className="bg-white/90 p-6 rounded-2xl shadow-lg md:col-span-2">
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            🧠 AI Crop Health Index (%)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="health" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-600 italic">
        🌱 Insights powered by AI & Cloud — AgroSphere Demo by <b>VinCloudOps</b>
      </p>
    </section>
  );
}
