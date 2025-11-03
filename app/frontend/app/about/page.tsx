export default function AboutPage() {
  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-emerald-50 via-green-50 to-amber-100 text-gray-800 flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-6xl w-full bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-10 flex flex-col md:flex-row gap-10">

        {/* 🌿 Left Panel – Overview */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-extrabold text-green-900 drop-shadow-sm">
            ☁️ <span className="text-amber-700">AgroSphere</span>
          </h1>
          <p className="italic text-gray-600">
            “Where AI, Cloud & DevOps Speak the Same Language”
          </p>

          {/* 🎯 Objectives */}
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">
              🎯 Core Objective
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Showcase AWS Cloud + DevOps + MLOps integration end-to-end.</li>
              <li>Automate CI/CD with Jenkins → Terraform → ECS Fargate.</li>
              <li>Demonstrate SageMaker inference via FastAPI backend.</li>
              <li>Provide a themed, data-driven dashboard built with Next.js.</li>
            </ul>
          </div>

          {/* ⚙️ Tech Stack */}
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">
              ⚙️ Tech & Cloud Stack
            </h2>
            <div className="grid grid-cols-2 gap-x-4 text-sm">
              <p>🐍 FastAPI (Backend API)</p>
              <p>🌿 Next.js + Tailwind (Frontend)</p>
              <p>🐳 Docker + ECR (Container Registry)</p>
              <p>☁️ AWS ECS Fargate (Serverless Compute)</p>
              <p>🤖 SageMaker (AI Model Inference)</p>
              <p>🧱 Terraform + Jenkins (CI/CD Pipeline)</p>
              <p>🔔 SNS + CloudWatch (Alerts & Monitoring)</p>
              <p>📊 Recharts / Grafana (Visualization)</p>
            </div>
          </div>

          {/* 💚 Footer */}
          <div className="pt-6">
            <p className="text-sm text-gray-600 italic">
              Built with 💚 by <b>VinCloudOps</b> · 2025
            </p>
          </div>
        </div>

        {/* 📊 Right Panel – Infographic */}
        <div className="md:w-1/2 flex flex-col justify-between space-y-6">
          {/* Architecture Box */}
          <div className="bg-green-100/70 border-l-4 border-green-500 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-green-700 mb-2">
              ☁️ Cloud Architecture Flow
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              GitHub → Jenkins → Terraform → ECS Fargate → FastAPI Backend ↔ Next.js Frontend ↔ SageMaker AI Endpoint → CloudWatch/Grafana Monitoring
            </p>
            <p className="mt-2 text-xs text-gray-500">
              *Infrastructure fully automated with Terraform & Jenkins*
            </p>
          </div>

          {/* MLOps Simulation */}
          <div className="bg-amber-100/70 border-l-4 border-amber-500 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-amber-700 mb-2">🧠 MLOps Integration</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Inputs : temperature, humidity, soil-moisture.</li>
              <li>Model : SageMaker XGBoost (simulated for demo).</li>
              <li>Outputs : crop health, irrigation advice, confidence score.</li>
              <li>API served via FastAPI → consumed by Next.js.</li>
            </ul>
          </div>

          {/* KPI Summary */}
          <div className="bg-emerald-100/70 border-l-4 border-emerald-600 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-emerald-700 mb-2">📈 Automation Impact</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>🚀 Deploy time ↓ to 2 min (vs 15 min manual)</li>
              <li>💰 Infra cost ↓ 60% with Fargate</li>
              <li>⚙️ CI/CD success rate ↑ 99.5%</li>
              <li>📦 Zero-downtime updates via rolling tasks</li>
            </ul>
          </div>

          {/* Tagline Box */}
          <div className="bg-green-700 text-white text-center py-4 rounded-xl shadow-md">
            <p className="font-semibold text-sm">
              Bridging Cloud, DevOps & AI — One Pipeline at a Time 🌱
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
