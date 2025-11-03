from fastapi import APIRouter
from pydantic import BaseModel
import boto3
import json
import os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

router = APIRouter()

# ✅ Input schema for frontend form
class InputData(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    ph: float


@router.post("/predict")
def predict(data: InputData):
    try:
        # ✅ Initialize SageMaker runtime client
        client = boto3.client("sagemaker-runtime", region_name="us-east-1")

        # ✅ Prepare payload (must match your SageMaker model input format)
        payload = json.dumps({
            "temperature": data.temperature,
            "humidity": data.humidity,
            "moisture": data.moisture,
            "ph": data.ph
        })

        # ✅ Invoke the SageMaker endpoint
        response = client.invoke_endpoint(
            EndpointName=os.getenv("SAGEMAKER_ENDPOINT_NAME", "agrosphere-irrigation-endpoint-v2"),
            ContentType="application/json",
            Body=payload
        )

        # ✅ Decode model output
        result = response["Body"].read().decode("utf-8")

        # Sometimes SageMaker returns a JSON string — handle both plain text & JSON
        try:
            result_json = json.loads(result)
            prediction = result_json.get("prediction", result)
        except:
            prediction = result

        return {"prediction": prediction}

    except Exception as e:
        print("❌ SageMaker Error:", e)
        return {"error": str(e), "prediction": "AI model currently unavailable"}
