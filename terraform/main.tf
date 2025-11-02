############################################
# 🌾 AgriVisionOps Unified Terraform Infra
# Phase-1: Core AWS + SageMaker Role
# Phase-2: VPC + EKS Cluster (Jenkins-friendly)
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

# 🔹 single random suffix for ALL names in this run
resource "random_id" "suffix" {
  byte_length = 4
}

############################################
# 1️⃣ S3 bucket — data & (later) state
############################################
resource "aws_s3_bucket" "agri_data" {
  bucket        = "agrivisionops-data-${random_id.suffix.hex}"
  force_destroy = true

  tags = {
    Project = "AgriVisionOps"
    Owner   = "Vin"
  }
}

############################################
# 2️⃣ SNS topic — must also be unique
############################################
resource "aws_sns_topic" "irrigation_alerts" {
  # fixed name was causing "already exists" on 2nd run
  name = "agri-vision-alerts-${random_id.suffix.hex}"

  tags = {
    Project = "AgriVisionOps"
  }
}

############################################
# 3️⃣ IAM Role — SageMaker
#    use name_prefix to avoid EntityAlreadyExists
############################################
resource "aws_iam_role" "sagemaker_role" {
  name_prefix = "sagemaker-exec-${random_id.suffix.hex}-"

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
# 🌐 Phase-2: VPC (no NAT to avoid charges)
############################################
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "agrivisionops-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]

  # NAT was taking time + costs — disable
  enable_nat_gateway = false
  single_nat_gateway = false

  # we still want IGW for public subnets (module does this by default)

  tags = {
    Project = "AgriVisionOps"
  }
}

############################################
# 5️⃣ EKS cluster — names MUST be unique
#     to avoid:
#     - KMS alias already exists
#     - CloudWatch log group already exists
############################################
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.8.0"

  # 👇 random in the name = new KMS alias + new CW log group every run
  name               = "agrivisionops-${random_id.suffix.hex}"
  kubernetes_version = "1.30"

  # put worker nodes in PUBLIC subnets so we don't need NAT
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.public_subnets

  # good DX
  endpoint_public_access                   = true
  enable_cluster_creator_admin_permissions = true

  # ❗ important:
  # the module was creating KMS + CW log group with fixed names because
  # the cluster name was fixed. Randomizing cluster name solves that.
  # (we could also set create_cloudwatch_log_group = false, but this way
  # you still get logs.)

  eks_managed_node_groups = {
    default = {
      min_size       = 1
      max_size       = 1
      desired_size   = 1

      # previous error was:
      # "The specified instance type is not eligible for Free Tier."
      # so let's go with t2.micro
      instance_types = ["t2.micro"]
      capacity_type  = "ON_DEMAND"
      disk_size      = 20
    }
  }

  tags = {
    Project = "AgriVisionOps"
  }
}

############################################
# 📤 Outputs
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

output "public_subnets" {
  value = module.vpc.public_subnets
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
