############################################
# 🌾 AgriVisionOps Terraform Infrastructure
# Phase-1: Core AWS Resources + SageMaker Role
############################################

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.15.0"     # ✅ compatible with EKS module v21.8.0
    }
    random = {
      source = "hashicorp/random"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 🔹 random suffix to keep names globally unique
resource "random_id" "suffix" {
  byte_length = 4
}

# 1️⃣ S3 bucket — for data storage & Terraform state
resource "aws_s3_bucket" "agri_data" {
  bucket        = "agrivisionops-data-${random_id.suffix.hex}"
  force_destroy = true

  tags = {
    Project = "AgriVisionOps"
    Owner   = "Vin"
  }
}

# 2️⃣ SNS topic — for irrigation / alert notifications
resource "aws_sns_topic" "irrigation_alerts" {
  name = "agri-vision-alerts"

  tags = {
    Project = "AgriVisionOps"
  }
}

# 3️⃣ IAM Role for SageMaker execution
resource "aws_iam_role" "sagemaker_role" {
  name = "sagemaker_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "sagemaker.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project = "AgriVisionOps"
  }
}

# Attach managed policy for full SageMaker access
resource "aws_iam_role_policy_attachment" "sagemaker_full" {
  role       = aws_iam_role.sagemaker_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
}

# 4️⃣ Placeholder EKS cluster skeleton (to be expanded later)
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.8.0"

  # Correct argument names for v21.8.0
  name               = "agrivisionops-cluster"
  kubernetes_version = "1.30"
  endpoint_public_access = true 
  
  vpc_id           = ""      # will be filled in Phase 2
  subnet_ids       = []      # will be filled in Phase 2

  enable_irsa      = true
  create_kms_key   = false

  tags = {
    Project = "AgriVisionOps"
  }
}
# 5️⃣ Outputs for reference
output "s3_bucket_name" {
  value = aws_s3_bucket.agri_data.bucket
}

output "sns_topic_arn" {
  value = aws_sns_topic.irrigation_alerts.arn
}

output "sagemaker_role_arn" {
  value = aws_iam_role.sagemaker_role.arn
}
