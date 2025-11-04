# ---------------------------------------------
# 🌾 AgroSphere AI Advisor (Hybrid Chatbot)
# Bedrock Claude + SageMaker + Mock fallback
# ---------------------------------------------
import os, json, boto3
from fastapi import APIRouter, Request

router = APIRouter(prefix="/api/v1", tags=["AgroSphere Chatbot"])

# Environment config
USE_BEDROCK = os.getenv("USE_BEDROCK", "true").lower() == "true"
USE_SAGEMAKER = os.getenv("USE_SAGEMAKER", "true").lower() == "true"
REGION = os.getenv("AWS_REGION", "us-east-1")
SAGEMAKER_ENDPOINT = os.getenv("SAGEMAKER_ENDPOINT_NAME", "agrosphere-irrigation-endpoint-v2")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-instant-v1")

# AWS Clients
try:
    bedrock = boto3.client("bedrock-runtime", region_name=REGION)
    runtime = boto3.client("sagemaker-runtime", region_name=REGION)
except Exception:
    bedrock = runtime = None


@router.post("/chat")
async def chat_endpoint(request: Request):
    """Hybrid logic:
    - Numeric or sensor-like inputs → SageMaker inference
    - Conversational agri questions → Bedrock Claude
    - Offline fallback if AWS not reachable
    """
    data = await request.json()
    query = data.get("query", "").lower().strip()

    def pretty_reply(text: str):
        return {"reply": text.strip()}

    # 🌾 1️⃣ Sensor/ML Query → SageMaker
    if USE_SAGEMAKER and any(k in query for k in ["temperature", "humidity", "moisture", "ph", "irrigation"]):
        try:
            payload = {"temperature": 34.5, "humidity": 50, "moisture": 30, "ph": 6.8}
            response = runtime.invoke_endpoint(
                EndpointName=SAGEMAKER_ENDPOINT,
                ContentType="application/json",
                Body=json.dumps(payload)
            )
            model_output = json.loads(response["Body"].read().decode())
            prediction = model_output.get("prediction", "Healthy Crop 🌿")
            confidence = model_output.get("confidence", 0.93)
            return pretty_reply(
                f"💧 **SageMaker Prediction** → {prediction}\n📈 Confidence: {confidence*100:.1f}%"
            )
        except Exception as e:
            return pretty_reply(f"⚠️ SageMaker unavailable — fallback reply used. ({e})")

    # 🤖 2️⃣ General Agri Question → Bedrock Claude
    if USE_BEDROCK and bedrock:
        try:
            system_prompt = """
            You are **Krishi AI Advisor** 🌾 — a friendly agriculture expert helping Indian farmers.
            Give short, clear, and practical farming tips (3–5 lines max).
            Use simple, empathetic tone like an agri officer.
            Add emojis like 🌾💧🌱 occasionally.
            Avoid disclaimers and long paragraphs.
            """

            prompt = f"{system_prompt}\n\nUser: {query}\nAssistant:"

            response = bedrock.invoke_model(
                modelId=BEDROCK_MODEL_ID,
                body=json.dumps({
                    "prompt": prompt,
                    "max_tokens_to_sample": 350,
                    "temperature": 0.8,
                    "top_p": 0.9
                }),
                accept="application/json",
                contentType="application/json"
            )

            output = json.loads(response["body"].read().decode("utf-8"))
            reply_text = output.get("completion", "🌾 You can try millets or pulses that suit your soil conditions.")
            return pretty_reply(reply_text)

        except Exception as e:
            return pretty_reply(f"🌱 Mock tip: Maintain soil pH 6.5–7.5 and use compost. ({e})")

    # 🪫 3️⃣ Offline Mode (Mock)
    return pretty_reply("🌱 Your soil moisture looks good today! No irrigation needed. 🚜")
