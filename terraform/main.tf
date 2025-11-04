############################################
# 🌾 AgriVisionOps — Unified Terraform Infra (ECS + ALB + SageMaker)
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
# 4️⃣ CloudWatch Log Groups
############################################

resource "aws_cloudwatch_log_group" "ecs_backend_logs" {
  name              = "/ecs/agrivisionops-backend"
  retention_in_days = 14
  tags = { Project = "AgriVisionOps" }
}

resource "aws_cloudwatch_log_group" "ecs_frontend_logs" {
  name              = "/ecs/agrivisionops-frontend"
  retention_in_days = 14
  tags = { Project = "AgriVisionOps" }
}
############################################
# 🪣 4️⃣-A ECR Repositories (For Docker Images)
############################################

resource "aws_ecr_repository" "backend_repo" {
  name = "agrivisionops-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Project = "AgriVisionOps" }
}

resource "aws_ecr_repository" "frontend_repo" {
  name = "agrivisionops-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Project = "AgriVisionOps" }
}

############################################
# 5️⃣ ECS Task Definitions
############################################

# Backend Task
resource "aws_ecs_task_definition" "agri_task" {
  family                   = "agrivisionops-backend-task"
  network_mode              = "awsvpc"
  requires_compatibilities  = ["FARGATE"]
  cpu                       = "512"
  memory                    = "1024"
  execution_role_arn        = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "agrivisionops-backend",
      image = "${aws_ecr_repository.backend_repo.repository_url}:latest",
      essential = true,
      portMappings = [{
        containerPort = 8090,
        hostPort      = 8090,
        protocol      = "tcp"
      }],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_backend_logs.name,
          awslogs-region        = "us-east-1",
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

# Frontend Task
resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "agrivisionops-frontend-task"
  network_mode              = "awsvpc"
  requires_compatibilities  = ["FARGATE"]
  cpu                       = "512"
  memory                    = "1024"
  execution_role_arn        = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "agrivisionops-frontend",
      image = "${aws_ecr_repository.frontend_repo.repository_url}:latest",
      essential = true,
      portMappings = [{
        containerPort = 3000,
        hostPort      = 3000,
        protocol      = "tcp"
      }],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_frontend_logs.name,
          awslogs-region        = "us-east-1",
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

############################################
# 6️⃣ Security Groups
############################################

resource "aws_security_group" "ecs_service_sg" {
  name        = "ecs-service-sg"
  description = "Allow inbound access for ECS Services"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 0
    to_port     = 65535
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

resource "aws_security_group" "alb_sg" {
  name        = "agrivisionops-alb-sg"
  description = "Allow inbound HTTP access for ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
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
# 7️⃣ Application Load Balancer (Public)
############################################

resource "aws_lb" "ecs_alb" {
  name               = "agrivisionops-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = module.vpc.public_subnets
  enable_deletion_protection = false
  tags = { Project = "AgriVisionOps" }
}

resource "aws_lb_target_group" "backend_tg" {
  name        = "agrivisionops-backend-tg"
  port        = 8090
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = module.vpc.vpc_id

  health_check {
    path              = "/health"
    matcher           = "200"
  }

  tags = { Project = "AgriVisionOps" }
}

resource "aws_lb_target_group" "frontend_tg" {
  name        = "agrivisionops-frontend-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = module.vpc.vpc_id

  health_check {
    path              = "/"
    matcher           = "200-399"
  }

  tags = { Project = "AgriVisionOps" }
}

resource "aws_lb_listener" "ecs_listener" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}

############################################
# 8️⃣ Listener Rules (Path-based Routing)
############################################

resource "aws_lb_listener_rule" "frontend_rule" {
  listener_arn = aws_lb_listener.ecs_listener.arn
  priority     = 10
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
  condition {
    path_pattern { values = ["/", "/app*", "/frontend*"] }
  }
}

resource "aws_lb_listener_rule" "backend_rule" {
  listener_arn = aws_lb_listener.ecs_listener.arn
  priority     = 20
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
  condition {
    path_pattern { values = ["/api*", "/predict*", "/health"] }
  }
}

############################################
# 9️⃣ ECS Services (Attach to ALB)
############################################

resource "aws_ecs_service" "backend_service" {
  name            = "agrivisionops-backend-service"
  cluster         = aws_ecs_cluster.agri_cluster.id
  task_definition = aws_ecs_task_definition.agri_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    assign_public_ip = false
    security_groups  = [aws_security_group.ecs_service_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "agrivisionops-backend"
    container_port   = 8090
  }

  depends_on = [aws_lb_listener_rule.backend_rule]
  tags = { Project = "AgriVisionOps" }
}

resource "aws_ecs_service" "frontend_service" {
  name            = "agrivisionops-frontend-service"
  cluster         = aws_ecs_cluster.agri_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    assign_public_ip = false
    security_groups  = [aws_security_group.ecs_service_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "agrivisionops-frontend"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener_rule.frontend_rule]
  tags = { Project = "AgriVisionOps" }
}

############################################
# 🔟 SageMaker Notebook + Permissions
############################################

resource "aws_sagemaker_notebook_instance" "agrosphere_notebook" {
  name          = "agrosphere-notebook"
  instance_type = "ml.t3.medium"
  role_arn      = aws_iam_role.sagemaker_role.arn
  tags = { Project = "AgriVisionOps" }
}

resource "aws_iam_policy" "ecs_invoke_sagemaker" {
  name   = "ECSInvokeSageMakerPolicy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = ["sagemaker:InvokeEndpoint", "sagemaker:DescribeEndpoint"],
      Resource = "*"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_invoke_sagemaker_attach" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_invoke_sagemaker.arn
}

############################################
# 📤 Outputs
############################################

output "alb_dns_name" { value = aws_lb.ecs_alb.dns_name }
output "frontend_service_name" { value = aws_ecs_service.frontend_service.name }
output "backend_service_name" { value = aws_ecs_service.backend_service.name }
output "public_url" { value = "http://${aws_lb.ecs_alb.dns_name}" }
output "sagemaker_notebook_name" { value = aws_sagemaker_notebook_instance.agrosphere_notebook.name }
output "ecr_backend_repo_url" { value = aws_ecr_repository.backend_repo.repository_url }
output "ecr_frontend_repo_url" { value = aws_ecr_repository.frontend_repo.repository_url }
