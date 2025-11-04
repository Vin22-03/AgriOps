# -------------------------------------------
# 🌾 AgroSphere Backend (FastAPI + SageMaker)
# Optimized for AWS ECS / Local Docker Compose
# -------------------------------------------

# 1️⃣ Base Image (Slim for lightweight builds)
FROM python:3.12-slim AS base

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Install system dependencies (for ujson, boto3, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc curl && \
    rm -rf /var/lib/apt/lists/*

# 4️⃣ Copy and install Python dependencies with longer timeout & retry
COPY requirements.txt .

# Set timeout and retry if slow network
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --default-timeout=200 -r requirements.txt || \
    pip install --no-cache-dir -r requirements.txt

# 5️⃣ Copy all backend source code
COPY . .

# 6️⃣ Expose API port
EXPOSE 8090

# 7️⃣ Environment variables
ENV PYTHONUNBUFFERED=1 \
    ENV=production \
    AWS_REGION=us-east-1 \
    PIP_DEFAULT_TIMEOUT=300 \
    USE_SAGEMAKER=true \
    USE_BEDROCK=false

# 8️⃣ Healthcheck (optional for ECS)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:8090/health || exit 1

# 9️⃣ Run FastAPI using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8090", "--reload"]
