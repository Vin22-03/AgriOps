# ------------------------------
# 🌱 AgroSphere Backend (FastAPI)
# ------------------------------

# 1️⃣ Base Image
FROM python:3.12-slim

# 2️⃣ Working Directory
WORKDIR /app

# 3️⃣ Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4️⃣ Copy source code
COPY . .

# 5️⃣ Expose port
EXPOSE 8090

# 6️⃣ Environment variables
ENV PYTHONUNBUFFERED=1 \
    ENV=production \
    AWS_REGION=us-east-1

# 7️⃣ Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8090"]
