export default function AboutPage() {
  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-emerald-50 via-green-50 to-amber-100 text-gray-800 flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-6xl w-full bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-10 flex flex-col md:flex-row gap-10">

        {/* 🌿 Left Panel – Text Overview */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-extrabold text-green-900 drop-shadow-sm">
            🌾 <span className="text-amber-700">AgroSphere</span>
          </h1>
          <p className="italic text-gray-600">
            “Where AI & Soil Speak the Same Language”
          </p>

          {/* 🎯 Objectives */}
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">🎯 Objectives</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>AI-powered precision agriculture dashboard.</li>
              <li>Simulated ML predictions & IoT sensors.</li>
              <li>Cloud-native CI/CD & GitOps demo.</li>
              <li>Recruiter-ready end-to-end DevOps showcase.</li>
            </ul>
          </div>

          {/* ⚙️ Tech Stack */}
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">⚙️ Tech Stack</h2>
            <div className="grid grid-cols-2 gap-x-4 text-sm">
              <p>🐍 FastAPI (Backend)</p>
              <p>🌿 Next.js + Tailwind</p>
              <p>🐳 Docker / Jenkins</p>
              <p>☁️ AWS EKS / S3 / SageMaker</p>
              <p>📊 Recharts / Grafana</p>
              <p>🧱 Terraform / ArgoCD</p>
            </div>
          </div>

          {/* 💚 Footer */}
          <div className="pt-6">
            <p className="text-sm text-gray-600 italic">
              Built with 💚 by <b>VinCloudOps</b>
            </p>
          </div>
        </div>

        {/* 📊 Right Panel – Infographic Style */}
        <div className="md:w-1/2 flex flex-col justify-between space-y-6">
          {/* Architecture Box */}
          <div className="bg-green-100/70 border-l-4 border-green-500 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-green-700 mb-2">☁️ Architecture Flow</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Frontend (Next.js) → Backend (FastAPI) → 
              SageMaker (AI Model) → EKS (Deployment) → Grafana (Monitoring)
            </p>
            <p className="mt-2 text-xs text-gray-500">
              *All simulated for demo with dummy data*
            </p>
          </div>

          {/* AI Simulation */}
          <div className="bg-amber-100/70 border-l-4 border-amber-500 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-amber-700 mb-2">🧠 AI Simulation</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Inputs: soil moisture, pH, humidity, temperature</li>
              <li>Outputs: “Healthy 🌿” / “Needs Irrigation 💧”</li>
              <li>Auto-refresh IoT charts (Recharts)</li>
            </ul>
          </div>

          {/* KPI Summary */}
          <div className="bg-emerald-100/70 border-l-4 border-emerald-600 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-emerald-700 mb-2">📈 Simulated Impact</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>🚀 Deployment time ↓ 87%</li>
              <li>💰 Cost optimized ↓ 60%</li>
              <li>⚙️ Uptime ↑ 99.5%</li>
              <li>💧 Water saved ~18 L/day</li>
            </ul>
          </div>

          {/* Tagline Box */}
          <div className="bg-green-700 text-white text-center py-4 rounded-xl shadow-md">
            <p className="font-semibold text-sm">
              Bridging DevOps, AI & Sustainability — <br /> One Project at a Time 🌱
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
