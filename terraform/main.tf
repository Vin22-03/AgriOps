############################################
# 🌾 AgriVisionOps — Unified Terraform Infra (ECS Version)
# ✅ Single source of truth for production
# ✅ Remote backend with S3 + DynamoDB
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
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "sagemaker.amazonaws.com" },
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

  map_public_ip_on_launch = true

  tags = { Project = "AgriVisionOps" }
}

############################################
# 3️⃣ ECS Cluster + Execution Role
############################################

resource "aws_ecs_cluster" "agri_cluster" {
  name = "agrivisionops-ecs-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  tags = { Project = "AgriVisionOps" }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole-agrivisionops"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "ecs-tasks.amazonaws.com" },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

############################################
# 4️⃣ ECS Task Definition + Service (Fargate)
############################################

resource "aws_ecs_task_definition" "agri_task" {
  family                   = "agrivisionops-task"
  network_mode              = "awsvpc"
  requires_compatibilities  = ["FARGATE"]
  cpu                       = "512"
  memory                    = "1024"
  execution_role_arn        = aws_iam_role.ecs_task_execution_role.arn
  container_definitions     = jsonencode([
    {
      name      = "agrivisionops-app",
      image     = "987686462469.dkr.ecr.us-east-1.amazonaws.com/agrivisionops:latest",
      essential = true,
      portMappings = [{
        containerPort = 8080,
        hostPort      = 8080,
        protocol      = "tcp"
      }]
    }
  ])
}

resource "aws_ecs_service" "agri_service" {
  name            = "agrivisionops-service"
  cluster         = aws_ecs_cluster.agri_cluster.id
  task_definition = aws_ecs_task_definition.agri_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = module.vpc.private_subnets
    assign_public_ip = false
    security_groups  = [aws_security_group.ecs_service_sg.id]
  }

  tags = { Project = "AgriVisionOps" }
}

############################################
# 5️⃣ Security Group — ECS Service
############################################

resource "aws_security_group" "ecs_service_sg" {
  name        = "ecs-service-sg"
  description = "Allow inbound access for ECS Service"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Project = "AgriVisionOps" }
}

############################################
# 📤 Outputs
############################################

output "ecs_cluster_name"      { value = aws_ecs_cluster.agri_cluster.name }
output "ecs_service_name"      { value = aws_ecs_service.agri_service.name }
output "ecs_task_family"       { value = aws_ecs_task_definition.agri_task.family }
output "s3_bucket"             { value = aws_s3_bucket.agri_data.bucket }
output "sns_topic_arn"         { value = aws_sns_topic.irrigation_alerts.arn }
output "vpc_id"                { value = module.vpc.vpc_id }
output "ecs_security_group"    { value = aws_security_group.ecs_service_sg.id }
