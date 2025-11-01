############################################
# 🌾 AgriVisionOps Unified Terraform Infra
# Phase-1: Core AWS + SageMaker Role
# Phase-2: VPC + EKS Cluster (free-tier friendly)
############################################

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.15.0"
    }
    random = {
      source = "hashicorp/random"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 🔹 Random suffix for unique names
resource "random_id" "suffix" {
  byte_length = 4
}

# 1️⃣ S3 bucket — data & Terraform state
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

# 3️⃣ IAM Role — for SageMaker
#    (avoid EntityAlreadyExists by using name_prefix)
resource "aws_iam_role" "sagemaker_role" {
  name_prefix = "sagemaker_execution_role-"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = { Service = "sagemaker.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project = "AgriVisionOps"
  }
}

resource "aws_iam_role_policy_attachment" "sagemaker_full" {
  role       = aws_iam_role.sagemaker_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
}

############################################
# 🌐 Phase-2: VPC + EKS Setup
############################################

# 4️⃣ VPC module
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "agrivisionops-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Project = "AgriVisionOps"
  }
}

# 5️⃣ EKS cluster module
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.8.0"

  name               = "agrivisionops-cluster"
  kubernetes_version = "1.30"

  # networking
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # good to have from docs
  endpoint_public_access                   = true
  enable_cluster_creator_admin_permissions = true

  # we are NOT enabling KMS / encryption here,
  # because last time the module asked for key_arn
  # when we partially set the options.

  # ✅ free-tier friendly node group
  eks_managed_node_groups = {
    default = {
      min_size       = 1
      max_size       = 1
      desired_size   = 1
      instance_types = ["t3.micro"] # <— your account complained about t3.medium
      ami_type       = "AL2023_x86_64_STANDARD"
      capacity_type  = "ON_DEMAND"
      disk_size      = 20
    }
  }

  tags = {
    Project = "AgriVisionOps"
  }
}

############################################
# 📤 Outputs (for Jenkins & later CD stage)
############################################

output "s3_bucket_name" {
  value = aws_s3_bucket.agri_data.bucket
}

output "sns_topic_arn" {
  value = aws_sns_topic.irrigation_alerts.arn
}

output "sagemaker_role_arn" {
  value = aws_iam_role.sagemaker_role.arn
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "private_subnets" {
  value = module.vpc.private_subnets
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "eks_cluster_version" {
  value = module.eks.cluster_version
}
