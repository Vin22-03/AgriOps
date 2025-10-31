# random suffix to keep bucket names unique
resource "random_id" "suffix" {
  byte_length = 4
}

# 1️⃣  S3 bucket  – for data & Terraform state
resource "aws_s3_bucket" "agri_data" {
  bucket        = "agrivisionops-data-${random_id.suffix.hex}"
  force_destroy = true
  tags = {
    Project = "AgriVisionOps"
    Owner   = "Vin"
  }
}

# 2️⃣  SNS topic  – for alerts (we’ll link to Jenkins later)
resource "aws_sns_topic" "irrigation_alerts" {
  name = "agri-vision-alerts"
  tags = {
    Project = "AgriVisionOps"
  }
}

# 3️⃣  IAM role for SageMaker
resource "aws_iam_role" "sagemaker_role" {
  name = "sagemaker_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "sagemaker.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
  tags = {
    Project = "AgriVisionOps"
  }
}

resource "aws_iam_role_policy_attachment" "sagemaker_full" {
  role       = aws_iam_role.sagemaker_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
}

# 4️⃣  (Placeholder)  EKS cluster skeleton
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "agrivisionops-cluster"
  cluster_version = "1.30"
  vpc_id          = ""       # will fill once VPC is created
  subnet_ids      = []       # same here
  manage_aws_auth = true
  tags = {
    Project = "AgriVisionOps"
  }
}
