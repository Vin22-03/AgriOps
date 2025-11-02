"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Farm {
  id: number;
  name: string;
  location: string;
}

export default function Dashboard() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyFarms: Farm[] = [
      { id: 1, name: "Green Valley Farm", location: "Mysuru, Karnataka" },
      { id: 2, name: "Sunrise Agro Fields", location: "Nagpur, Maharashtra" },
      { id: 3, name: "EcoHarvest Plantation", location: "Coimbatore, Tamil Nadu" },
    ];
    setTimeout(() => {
      setFarms(dummyFarms);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center flex-grow py-10 overflow-hidden">
      {/* 🌾 Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-200 via-green-100 to-amber-100 animate-gradient-x"></div>
      <div className="absolute inset-0 opacity-30 bg-[url('/grain-texture.png')] mix-blend-overlay"></div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-green-900 mb-4 tracking-tight drop-shadow-md">
          🌾 AgroSphere Dashboard
        </h1>

        {/* 🌍 About Project */}
        <Link
          href="/about"
          className="mb-10 bg-green-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-800 transition font-medium animate-pulse-slow"
        >
          🌍 Learn More About This Project
        </Link>

        {loading ? (
          <p className="text-gray-700 text-lg">Loading farms...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            {farms.map((farm) => (
              <div
                key={farm.id}
                className="p-6 bg-white/90 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all border-l-4 border-green-500 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-green-700 mb-2">
                    {farm.name}
                  </h2>
                  <p className="text-gray-700 mb-1">📍 {farm.location}</p>
                  <p className="text-sm text-gray-500 mb-4">Farm ID: {farm.id}</p>
                </div>

                {/* 👁️ Individual Farm Detail Button */}
                <Link
                  href={`/farm/${farm.id}`}
                  className="mt-2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition w-fit"
                >
                  🔍 View Farm Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
