############################################
# ☁️ Terraform Remote Backend Setup (One-Time)
# Creates S3 bucket + DynamoDB table for locking
############################################

terraform {
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

locals {
  bucket_name = "vin-terraform-state-agriops"
  table_name  = "vin-terraform-locks"
}

# 🪣 S3 bucket for storing Terraform state
resource "aws_s3_bucket" "tf_state" {
  bucket        = local.bucket_name
  force_destroy = true

  tags = {
    Name    = "Terraform State Bucket"
    Project = "AgriVisionOps"
  }
}

# Enable versioning (so old states are retained)
resource "aws_s3_bucket_versioning" "tf_state_versioning" {
  bucket = aws_s3_bucket.tf_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Block public access (security best practice)
resource "aws_s3_bucket_public_access_block" "tf_state" {
  bucket                  = aws_s3_bucket.tf_state.id
  block_public_acls        = true
  block_public_policy      = true
  ignore_public_acls       = true
  restrict_public_buckets  = true
}

# 🔒 DynamoDB table for Terraform state locking
resource "aws_dynamodb_table" "tf_lock" {
  name         = local.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name    = "Terraform Lock Table"
    Project = "AgriVisionOps"
  }
}

output "backend_bucket_name" {
  value = aws_s3_bucket.tf_state.bucket
}

output "backend_table_name" {
  value = aws_dynamodb_table.tf_lock.name
}
