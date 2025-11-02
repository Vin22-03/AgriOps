############################################
# 🌾 AgriVisionOps — Unified Terraform Infra
# ✅ Single source of truth for production
# ✅ Remote backend with S3 + DynamoDB
# ✅ No random suffix (stable names)
############################################

terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket         = "vin-terraform-state-agriops"
    key            = "agrivisionops/infra/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "vin-terraform-locks"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.15.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

############################################
# 1️⃣ Core AWS Resources — S3, SNS, IAM
############################################

resource "aws_s3_bucket" "agri_data" {
  bucket        = "agrivisionops-data"
  force_destroy = true
  tags = { Project = "AgriVisionOps" }
}

resource "aws_sns_topic" "irrigation_alerts" {
  name = "agri-vision-alerts"
  tags = { Project = "AgriVisionOps" }
}

resource "aws_iam_role" "sagemaker_role" {
  name = "sagemaker_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "sagemaker.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
  tags = { Project = "AgriVisionOps" }
}

resource "aws_iam_role_policy_attachment" "sagemaker_full" {
  role       = aws_iam_role.sagemaker_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
}

############################################
# 2️⃣ Networking — VPC, Subnets, IGW, NAT
############################################

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "agrivisionops-vpc"
  cidr = "10.0.0.0/16"
  azs  = ["us-east-1a", "us-east-1b"]

  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Project = "AgriVisionOps" }
}

############################################
# 3️⃣ Compute — EKS Cluster
############################################

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.8.0"

  name               = "agrivisionops-cluster"
  kubernetes_version = "1.30"
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnets

  endpoint_public_access                   = true
  enable_cluster_creator_admin_permissions = true

  eks_managed_node_groups = {
    default = {
      desired_size   = 1
      max_size       = 2
      min_size       = 1
      instance_types = ["t3.medium"]
      subnet_ids     = module.vpc.public_subnets
    }
  }

  tags = { Project = "AgriVisionOps" }
}

############################################
# 📤 Outputs
############################################

output "s3_bucket"          { value = aws_s3_bucket.agri_data.bucket }
output "sns_topic_arn"      { value = aws_sns_topic.irrigation_alerts.arn }
output "sagemaker_role_arn" { value = aws_iam_role.sagemaker_role.arn }
output "vpc_id"             { value = module.vpc.vpc_id }
output "eks_cluster_name"   { value = module.eks.cluster_name }
output "eks_cluster_endpoint" { value = module.eks.cluster_endpoint }
