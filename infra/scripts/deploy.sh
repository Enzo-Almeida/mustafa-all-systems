#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform"

echo -e "${GREEN}🚀 Starting deployment process...${NC}"

# Check if terraform.tfvars exists
if [ ! -f "$TERRAFORM_DIR/terraform.tfvars" ]; then
  echo -e "${YELLOW}⚠️  terraform.tfvars not found. Creating from example...${NC}"
  cp "$TERRAFORM_DIR/terraform.tfvars.example" "$TERRAFORM_DIR/terraform.tfvars"
  echo -e "${RED}❌ Please edit terraform.tfvars with your values before continuing!${NC}"
  exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
  echo -e "${RED}❌ AWS CLI is not configured. Please run 'aws configure' first.${NC}"
  exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
  echo -e "${RED}❌ Terraform is not installed. Please install Terraform >= 1.5${NC}"
  exit 1
fi

cd "$TERRAFORM_DIR"

# Initialize Terraform
echo -e "${GREEN}📦 Initializing Terraform...${NC}"
terraform init

# Validate Terraform configuration
echo -e "${GREEN}✅ Validating Terraform configuration...${NC}"
terraform validate

# Plan
echo -e "${GREEN}📋 Creating Terraform plan...${NC}"
terraform plan -out=tfplan

# Ask for confirmation
read -p "Do you want to apply these changes? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo -e "${YELLOW}Deployment cancelled.${NC}"
  rm -f tfplan
  exit 0
fi

# Apply
echo -e "${GREEN}🚀 Applying Terraform changes...${NC}"
terraform apply tfplan

# Clean up
rm -f tfplan

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}📊 Getting outputs...${NC}"
terraform output



