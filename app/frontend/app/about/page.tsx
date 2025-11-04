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
            “Where AI & Soil Speak the Same Language”
          </p>

          {/* 🎯 Objectives */}
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">
              🎯 Core Objective
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Demonstrate AWS Cloud + DevOps + MLOps integration end-to-end.</li>
              <li>Automate CI/CD pipeline via Jenkins → Terraform → ECS Fargate.</li>
              <li>Showcase SageMaker-based AI inference through FastAPI backend.</li>
              <li>Integrate an intelligent Bedrock-powered chatbot for farmers.</li>
              <li>Deliver a rich, analytics-driven dashboard built with Next.js.</li>
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
              <p>🐳 Docker + AWS ECR (Container Registry)</p>
              <p>☁️ AWS ECS Fargate (Serverless Compute)</p>
              <p>🤖 SageMaker (AI Model Inference)</p>
              <p>🧱 Terraform + Jenkins (CI/CD Pipeline)</p>
              <p>🔔 SNS + CloudWatch (Alerts & Monitoring)</p>
              <p>🧠 Bedrock + Titan (AI Chatbot Assistant)</p>
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

        {/* 📊 Right Panel – Architecture & AI */}
        <div className="md:w-1/2 flex flex-col justify-between space-y-6">

          {/* ☁️ Architecture */}
          <div className="bg-green-100/70 border-l-4 border-green-500 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-green-700 mb-2">
              ☁️ Cloud Architecture Flow
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              GitHub → Jenkins → Terraform → ECS Fargate → FastAPI Backend ↔ Next.js Frontend ↔ SageMaker AI Endpoint → CloudWatch/Grafana Monitoring
            </p>
            <p className="mt-2 text-xs text-gray-500">
              *Infrastructure fully automated with Terraform & Jenkins pipelines*
            </p>
          </div>

          {/* 🧠 MLOps */}
          <div className="bg-amber-100/70 border-l-4 border-amber-500 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-amber-700 mb-2">🧠 MLOps Integration</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Inputs: temperature, humidity, soil-moisture, pH.</li>
              <li>Model: RandomForest deployed via AWS SageMaker.</li>
              <li>Outputs: crop health, irrigation need, confidence score.</li>
              <li>Served through FastAPI backend → Consumed by Next.js UI.</li>
            </ul>
          </div>

          {/* 💬 Krishi AI Advisor */}
          <div className="bg-blue-100/70 border-l-4 border-blue-500 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-blue-700 mb-2">💬 Krishi — AI Agriculture Chatbot</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              <b>Krishi</b> is an intelligent virtual advisor built using <b>AWS Bedrock</b> and <b>Titan LLM</b>, capable of answering real-time queries about crop health, irrigation schedules, soil nutrients, and modern farming practices.
            </p>
            <p className="text-xs mt-2 text-gray-500 italic">
              *Integrates natural language AI with the agriculture data ecosystem — making AgroSphere interactive and intelligent.*
            </p>
          </div>

          {/* 📈 Impact */}
          <div className="bg-emerald-100/70 border-l-4 border-emerald-600 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-emerald-700 mb-2">📈 Automation Impact</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>🚀 Deployment time ↓ from 15 min → 2 min</li>
              <li>💰 Infrastructure cost ↓ 60% using Fargate</li>
              <li>⚙️ CI/CD success rate ↑ 99.5%</li>
              <li>📦 Zero-downtime rollouts & scalable AI inference</li>
            </ul>
          </div>

          {/* 🌱 Closing Tagline */}
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
