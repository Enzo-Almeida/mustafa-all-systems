terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Configurar após criar o bucket S3 para state
    # bucket = "promo-gestao-terraform-state"
    # key    = "terraform.tfstate"
    # region = "sa-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "promo-gestao"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "sa-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "promo-gestao"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "mustafa.ozentech"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.small"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS max allocated storage in GB"
  type        = number
  default     = 100
}

variable "db_master_username" {
  description = "RDS master username"
  type        = string
  default     = "postgres"
  sensitive   = true
}

variable "db_master_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "ecs_task_cpu" {
  description = "ECS task CPU units"
  type        = number
  default     = 512
}

variable "ecs_task_memory" {
  description = "ECS task memory in MB"
  type        = number
  default     = 1024
}

variable "ecs_desired_count" {
  description = "ECS service desired count"
  type        = number
  default     = 2
}

variable "ecs_min_capacity" {
  description = "ECS auto-scaling min capacity"
  type        = number
  default     = 2
}

variable "ecs_max_capacity" {
  description = "ECS auto-scaling max capacity"
  type        = number
  default     = 10
}
