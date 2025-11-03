from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
import boto3
import json
import os
from dotenv import load_dotenv

# ---------------------------------------------
# 🌾 AgriVisionOps Backend API
# Phase 4 – Real SageMaker Integration
# ---------------------------------------------

load_dotenv()

app = FastAPI(
    title="AgriVisionOps API",
    version="1.0.0",
    description="AI-powered predictive agriculture platform (FastAPI backend + SageMaker)",
)

# ✅ Allow frontend (Next.js) to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # add your domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------- MODELS -----------

class SensorData(BaseModel):
    field_id: str
    temperature: float
    humidity: float
    soil_moisture: float


class InputData(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    ph: float


# ----------- ROUTES -----------

@app.get("/")
def root():
    return {
        "message": "Welcome to AgriVisionOps 🌱",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "agri-vision-ops-api",
        "version": "1.0.0",
    }


# ✅ Real AI Prediction Route
@app.post("/api/v1/predict")
async def predict(data: InputData) -> Dict:
    """
    Sends sensor data to SageMaker endpoint for real-time irrigation prediction.
    """
    try:
        client = boto3.client("sagemaker-runtime", region_name="us-east-1")

        # Prepare payload for SageMaker
        payload = json.dumps({
            "temperature": data.temperature,
            "humidity": data.humidity,
            "moisture": data.moisture,
            "ph": data.ph
        })

        # Invoke SageMaker endpoint
        response = client.invoke_endpoint(
            EndpointName=os.getenv("SAGEMAKER_ENDPOINT_NAME", "agrosphere-irrigation-endpoint-v2"),
            ContentType="application/json",
            Body=payload
        )

        result = response["Body"].read().decode("utf-8")

        # Try parsing JSON, else fallback to string
        try:
            result_json = json.loads(result)
            prediction = result_json.get("prediction", result)
        except:
            prediction = result

        return {
            "prediction": prediction,
            "model_used": os.getenv("SAGEMAKER_ENDPOINT_NAME"),
            "status": "success"
        }

    except Exception as e:
        print("❌ SageMaker Error:", e)
        return {
            "error": str(e),
            "prediction": "AI model currently unavailable",
            "status": "failed"
        }


# ✅ File Upload (kept from mock version for future image models)
@app.post("/api/v1/predict-file")
async def predict_file(file: UploadFile = File(...)) -> Dict:
    contents = await file.read()
    size_kb = round(len(contents) / 1024, 2)
    return {
        "prediction": "Healthy Crop 🌿 (mock)",
        "confidence": 0.93,
        "file_size_kb": size_kb,
    }


# ✅ Sensor ingestion
@app.post("/api/v1/sensor-ingest")
async def sensor_ingest(data: SensorData):
    return {
        "message": "Sensor data ingested successfully 🌦️",
        "data": data,
    }


# ✅ Mock farms list
@app.get("/api/v1/farms")
def get_farms():
    farms = [
        {"id": "farm001", "name": "Green Valley", "location": "Karnataka"},
        {"id": "farm002", "name": "Sunrise Fields", "location": "Maharashtra"},
        {"id": "farm003", "name": "EcoHarvest Farm", "location": "Tamil Nadu"},
    ]
    return {"count": len(farms), "farms": farms}


# ✅ Mock metrics endpoint (for Prometheus later)
@app.get("/metrics")
def metrics():
    return {
        "total_requests": 42,
        "avg_latency_ms": 12,
        "uptime_percent": 99.8,
    }
