from fastapi import APIRouter
from pydantic import BaseModel
import boto3
import json
import os

router = APIRouter()

class InputData(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    ph: float

@router.post("/predict")
def predict(data: InputData):
    try:
        # Initialize SageMaker client
        client = boto3.client("sagemaker-runtime", region_name="us-east-1")

        # Prepare JSON payload for SageMaker model
        payload = json.dumps({
            "temperature": data.temperature,
            "humidity": data.humidity,
            "moisture": data.moisture,
            "ph": data.ph
        })

        # Invoke the SageMaker endpoint
        response = client.invoke_endpoint(
            EndpointName=os.getenv("SAGEMAKER_ENDPOINT_NAME", "agrosphere-irrigation-model"),
            ContentType="application/json",
            Body=payload
        )

        # Parse the model output
        result = json.loads(response["Body"].read().decode())

        return {"prediction": result}
    except Exception as e:
        print("SageMaker Error:", e)
        return {"error": str(e), "prediction": "AI model currently unavailable"}
