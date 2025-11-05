# 🌾 AgroSphere – Smart Irrigation & Krishi AI Chatbot  

---

## 🧩 Project Summary  
**AgroSphere** is an intelligent, AI-powered irrigation and advisory system designed for modern agriculture.  
It uses a **Machine Learning model deployed on AWS SageMaker** to predict whether farmland **needs irrigation 💧** or is in an **optimal state 🌿**, while the integrated **Krishi AI Chatbot** (built with AWS Titan) provides personalized farming assistance, soil insights, and crop care suggestions — all through a unified, easy-to-use web interface.  

This project represents the convergence of **MLOps + Cloud + AI**, showcasing automation, intelligence, and real-world agricultural impact — making it a perfect demonstration of applied cloud engineering and sustainable tech innovation.

---

## 🎯 Core Purpose  
- Help farmers make **data-driven irrigation decisions**.  
- Provide **real-time predictions** via an AWS SageMaker endpoint.  
- Enable **AI-powered agricultural consultation** through Krishi AI chatbot.  
- Demonstrate end-to-end **MLOps workflow** integrating ML, Cloud, and Frontend.  

---

## 🧠 Key Features  
- 🌦️ **Smart Irrigation Prediction:** ML model analyzes temperature, humidity, soil moisture, and pH to decide irrigation needs.  
- 🧠 **Krishi AI Chatbot:** Conversational assistant trained via AWS Titan for crop and soil-related queries.  
- ☁️ **Cloud-Native Deployment:** Fully built and hosted on AWS — SageMaker, S3, and Flask backend.  
- 🔁 **Scalable Architecture:** Modular design allowing retraining, CI/CD integration, and multi-language support.  
- 🌍 **User-Friendly Web Dashboard:** Farmers can input data or chat directly for quick decisions.  

---

## 🏗️ System Architecture  

```text
                      🌾 AGROSPHERE – SMART IRRIGATION PLATFORM
┌──────────────────────────────┐
│        User / Farmer         │
│ Web & Mobile Interface (UI)  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Flask Backend         │
│ (Prediction + Krishi AI Chat)│
└──────────────┬───────────────┘
               │
     ┌─────────┴─────────┐
     ▼                   ▼
┌────────────────┐   ┌────────────────────┐
│AWS SageMaker   │   │AWS Titan (Bedrock) │
│ML Endpoint💧🌿 │   │Krishi AI Chat🤖   │
└──────┬─────────┘   └────────┬──────────┘
       │                      │
       ▼                      ▼
┌─────────────┐        ┌──────────────┐
│ AWS S3      │        │ AWS Logs / DB│
│ Model Files │        │ Conversations│
└─────────────┘        └──────────────┘
```

---

## ⚙️ Technology Stack  

| Layer | Technologies Used |
|-------|-------------------|
| **Frontend** | HTML, CSS (Tailwind), Flask Templates |
| **Backend** | Python (Flask), Boto3 SDK |
| **Machine Learning** | scikit-learn (RandomForestClassifier) |
| **Cloud Deployment** | AWS SageMaker, S3, Lambda, Bedrock (Titan Model) |
| **Integration** | REST API + Real-Time Inference |
| **DevOps Tools** | GitHub, Docker (optional), AWS CLI |
| **AI Component** | Krishi AI (Powered by Amazon Titan Text Model) |

---
## 📸 Project Screenshots

### AgroSphere Dashboard
![AgroSphere Dashboard](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Dashboard.png)

### 🌾 KrishiAI Dashboard
![KrishiAI Dashboard](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/krishiAI.png)

### 🤖 AI Prediction Page
![AI Prediction](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/predict.png)

### 🌱 AI Prediction Result (Variant)
![AI Prediction Variant](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/predictt.png)

### Analytics Page
![Analytics Page](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Analytics.png)

### About Page
![About Page](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/About.png)

### ☁️ Amazon SageMaker Console
![SageMaker Console](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Sagemaker.png)

### 🧠 SageMaker AI Model Output
![SageMaker AI Model](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/SagemakerAI.png)

### 📦 Amazon ECR Repositories
![ECR Repositories](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/ECR.png)

### ⚙️ AWS Fargate Services
![Fargate Services](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Fargate_services.png)

### 🚀 Jenkins Build Success
![Jenkins Success](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Jenkins_success.png)

### 🧩 Jenkins Pipeline View
![Jenkins Pipeline](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Jenkinss.png)

### 🌍 Application Load Balancer (ALB)
![ALB](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/ALB.png)

### 🧪 SageMaker Model Deployment Details
![SageMaker Models](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/sagemaker_models.png)

### 🌿 Farm 1 View
![Farm 1](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Farm1.png)

### 🌾 Farm 2 View
![Farm 2](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Farm2.png)

### 🍃 Farm 3 View
![Farm 3](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/Farm3.png)

---

🎥 **Demo Video:**
[Watch Full Workflow (AgriVisionOps)](https://github.com/Vin22-03/AgriOps/blob/main/Screenshots/04.11.2025_19.46.09_REC.mp4)

---

💡 *All screenshots are captured from the live AWS ECS deployment and Jenkins pipeline demonstrating end-to-end CI/CD with SageMaker integration.*

## 💡 Use Cases  

| Use Case | Description |
|-----------|-------------|
| **Irrigation Forecasting** | Helps determine if a farm section needs water based on live environmental readings. |
| **AI Crop Advisory** | Farmers can chat with Krishi AI to get advice on pest control, fertilizers, or weather changes. |
| **Agri-Analytics Dashboard** | Visual interface for tracking soil conditions and irrigation history. |
| **Sustainable Resource Use** | Prevents over-irrigation, optimizing water use in drought-prone regions. |
| **Demonstration of MLOps** | Showcases a fully cloud-deployed ML model with automation and monitoring potential. |

---


## 🏆 Achievements  

- 🧠 Built and deployed a custom **RandomForest irrigation model** with ~95% accuracy.  
- ☁️ Successfully deployed a live **AWS SageMaker endpoint** with real-time predictions.  
- 💬 Integrated **Krishi AI chatbot** using Titan model for agricultural queries.  
- 🌾 Delivered a **clean, responsive web interface** powered by Flask.  
- 🔁 Demonstrated **MLOps readiness** with potential CI/CD and retraining workflows.  

---

## 📊 Impact  

- 💧 Reduces over-irrigation and promotes efficient water usage.  
- 🌱 Empowers farmers with real-time, data-driven decisions.  
- 🤝 Bridges technology with grassroots needs through conversational AI.  
- 🚀 Ideal showcase of how AI and Cloud can directly transform agriculture.  

---

## 👨‍💻 About the Creator  

**Vinay Bhajantri**  
DevOps & Cloud Engineer | AWS | MLOps | AI-Driven Innovator  
- 🌐 [Portfolio](www.vincloudops.tech)
- 🌐 [LinkedIn](https://linkedin.com/in/vinayvbhajantri)  
- 💻 [GitHub](https://github.com/Vin22-03)  
- 📩 *“Building the bridge between DevOps and Sustainable Tech.”*

---

### 🌾 *“Where Data Meets Soil — Intelligence Grows.”* 🌿  
