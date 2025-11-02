from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import Dict

# ---------------------------------------------
# 🌾 AgriVisionOps Backend API
# Phase 1 – Mock + Structure Setup
# ---------------------------------------------

app = FastAPI(
    title="AgriVisionOps API",
    version="0.1.0",
    description="AI-powered predictive agriculture platform (FastAPI backend)"
)

# ----------- MODELS -----------

class SensorData(BaseModel):
    field_id: str
    temperature: float
    humidity: float
    soil_moisture: float


# ----------- ROUTES -----------

@app.get("/")
def root():
    return {
        "message": "Welcome to AgriVisionOps 🌱",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "agri-vision-ops-api",
        "version": "0.1.0"
    }


@app.post("/api/v1/predict")
async def predict(file: UploadFile = File(...)) -> Dict:
    """
    Simulates sending image to SageMaker model.
    Later this will call the actual SageMaker endpoint.
    """
    contents = await file.read()
    size_kb = round(len(contents) / 1024, 2)
    # Mock inference
    return {
        "prediction": "Healthy Crop 🌿",
        "confidence": 0.93,
        "model_used": "sagemaker-agri-v1 (mock)",
        "file_size_kb": size_kb
    }


@app.post("/api/v1/sensor-ingest")
async def sensor_ingest(data: SensorData):
    """
    Simulates sensor data ingestion.
    Later: store to S3, RDS, or stream via Kinesis.
    """
    return {
        "message": "Sensor data ingested successfully 🌦️",
        "data": data
    }


@app.get("/api/v1/farms")
def get_farms():
    """
    Mock endpoint for listing registered farms.
    Later this can connect to a real DB.
    """
    farms = [
        {"id": "farm001", "name": "Green Valley", "location": "Karnataka"},
        {"id": "farm002", "name": "Sunrise Fields", "location": "Maharashtra"},
        {"id": "farm003", "name": "EcoHarvest Farm", "location": "Tamil Nadu"},
    ]
    return {"count": len(farms), "farms": farms}


# ----------- OPTIONAL: TEST METRICS -----------

@app.get("/metrics")
def metrics():
    """
    Mock metrics endpoint (for Prometheus later).
    """
    return {
        "total_requests": 42,
        "avg_latency_ms": 12,
        "uptime_percent": 99.8
    }
