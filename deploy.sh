#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
AWS_REGION=${AWS_REGION:-sa-east-1}
PROJECT_NAME="promo-gestao"
ENVIRONMENT=${ENVIRONMENT:-prod}
DOMAIN_NAME=${DOMAIN_NAME:-mustafa.ozentech}

# Functions
print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_step() {
  echo -e "${GREEN}▶ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

check_command() {
  if ! command -v $1 &> /dev/null; then
    print_error "$1 não está instalado. Por favor, instale primeiro."
    exit 1
  fi
}

# Check prerequisites
print_header "Verificando Pré-requisitos"

check_command "aws"
check_command "docker"
check_command "terraform"
check_command "node"
check_command "npm"

# Check AWS credentials
if ! aws sts get-caller-identity &>/dev/null; then
  print_error "AWS CLI não está configurado. Execute 'aws configure' primeiro."
  exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
print_step "AWS Account ID: $AWS_ACCOUNT_ID"

# Get deployment options
print_header "Opções de Deploy"

echo "O que você deseja fazer?"
echo "1) Deploy completo (Infra + Backend + Web)"
echo "2) Apenas Backend"
echo "3) Apenas Web"
echo "4) Apenas Infraestrutura"
echo "5) Executar migrações do banco"
read -p "Escolha uma opção (1-5): " DEPLOY_OPTION

case $DEPLOY_OPTION in
  1)
    DEPLOY_INFRA=true
    DEPLOY_BACKEND=true
    DEPLOY_WEB=true
    RUN_MIGRATIONS=true
    ;;
  2)
    DEPLOY_INFRA=false
    DEPLOY_BACKEND=true
    DEPLOY_WEB=false
    RUN_MIGRATIONS=false
    ;;
  3)
    DEPLOY_INFRA=false
    DEPLOY_BACKEND=false
    DEPLOY_WEB=true
    RUN_MIGRATIONS=false
    ;;
  4)
    DEPLOY_INFRA=true
    DEPLOY_BACKEND=false
    DEPLOY_WEB=false
    RUN_MIGRATIONS=false
    ;;
  5)
    DEPLOY_INFRA=false
    DEPLOY_BACKEND=false
    DEPLOY_WEB=false
    RUN_MIGRATIONS=true
    ;;
  *)
    print_error "Opção inválida"
    exit 1
    ;;
esac

# Deploy Infrastructure
if [ "$DEPLOY_INFRA" = true ]; then
  print_header "Deploy da Infraestrutura (Terraform)"
  
  cd infra/terraform
  
  # Check if terraform.tfvars exists
  if [ ! -f "terraform.tfvars" ]; then
    print_warning "terraform.tfvars não encontrado. Criando a partir do exemplo..."
    cp terraform.tfvars.example terraform.tfvars
    print_error "Por favor, edite infra/terraform/terraform.tfvars com seus valores antes de continuar!"
    exit 1
  fi
  
  print_step "Inicializando Terraform..."
  terraform init
  
  print_step "Validando configuração..."
  terraform validate
  
  print_step "Criando plano de execução..."
  terraform plan -out=tfplan
  
  read -p "Deseja aplicar essas mudanças? (yes/no): " CONFIRM
  if [[ $CONFIRM =~ ^[Yy][Ee][Ss]$ ]]; then
    print_step "Aplicando mudanças..."
    terraform apply tfplan
    rm -f tfplan
    
    print_step "Configurando secrets..."
    cd ../../infra/scripts
    ./setup-secrets.sh
    cd ../../..
  else
    print_warning "Deploy da infraestrutura cancelado."
    rm -f tfplan
  fi
fi

# Get Terraform outputs
if [ "$DEPLOY_BACKEND" = true ] || [ "$DEPLOY_WEB" = true ] || [ "$RUN_MIGRATIONS" = true ]; then
  print_step "Obtendo outputs do Terraform..."
  cd infra/terraform
  
  ECR_REPO_URL=$(terraform output -raw ecr_repository_url 2>/dev/null || echo "")
  S3_WEB_BUCKET=$(terraform output -raw s3_web_bucket 2>/dev/null || echo "")
  CLOUDFRONT_DIST_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null || echo "")
  RDS_ENDPOINT=$(terraform output -raw rds_endpoint 2>/dev/null || echo "")
  API_URL=$(terraform output -raw api_url 2>/dev/null || echo "https://api.${DOMAIN_NAME}")
  
  cd ../../..
  
  if [ -z "$ECR_REPO_URL" ] && [ "$DEPLOY_BACKEND" = true ]; then
    print_error "Não foi possível obter ECR repository URL. Execute o deploy da infraestrutura primeiro."
    exit 1
  fi
fi

# Deploy Backend
if [ "$DEPLOY_BACKEND" = true ]; then
  print_header "Deploy do Backend"
  
  if [ -z "$ECR_REPO_URL" ]; then
    print_error "ECR repository URL não encontrado. Execute o deploy da infraestrutura primeiro."
    exit 1
  fi
  
  cd backend
  
  print_step "Login no Amazon ECR..."
  aws ecr get-login-password --region $AWS_REGION | \
    docker login --username AWS --password-stdin ${ECR_REPO_URL%/*}
  
  print_step "Building Docker image..."
  docker build -t ${PROJECT_NAME}-backend:latest .
  
  print_step "Tagging image..."
  docker tag ${PROJECT_NAME}-backend:latest ${ECR_REPO_URL}:latest
  docker tag ${PROJECT_NAME}-backend:latest ${ECR_REPO_URL}:$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
  
  print_step "Pushing image to ECR..."
  docker push ${ECR_REPO_URL}:latest
  docker push ${ECR_REPO_URL}:$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
  
  print_step "Atualizando ECS service..."
  aws ecs update-service \
    --cluster ${PROJECT_NAME}-cluster \
    --service ${PROJECT_NAME}-backend-service \
    --force-new-deployment \
    --region $AWS_REGION \
    --query 'service.{ServiceName:serviceName,Status:status,DesiredCount:desiredCount}' \
    --output table
  
  print_step "Aguardando estabilização do serviço..."
  aws ecs wait services-stable \
    --cluster ${PROJECT_NAME}-cluster \
    --services ${PROJECT_NAME}-backend-service \
    --region $AWS_REGION
  
  cd ..
  
  print_step "Backend deployado com sucesso!"
  echo -e "  API URL: ${GREEN}${API_URL}${NC}"
fi

# Run Migrations
if [ "$RUN_MIGRATIONS" = true ]; then
  print_header "Executando Migrações do Banco"
  
  if [ -z "$RDS_ENDPOINT" ]; then
    print_error "RDS endpoint não encontrado. Execute o deploy da infraestrutura primeiro."
    exit 1
  fi
  
  # Get DB password from Secrets Manager
  print_step "Obtendo credenciais do banco..."
  DB_SECRET=$(aws secretsmanager get-secret-value \
    --secret-id ${PROJECT_NAME}-db-credentials-${ENVIRONMENT} \
    --region $AWS_REGION \
    --query SecretString --output text)
  
  # Extract values using Python (more reliable than jq)
  DB_USER=$(python3 -c "import sys, json; print(json.loads('$DB_SECRET')['username'])" 2>/dev/null || echo "postgres")
  DB_PASS=$(python3 -c "import sys, json; print(json.loads('$DB_SECRET')['password'])" 2>/dev/null || echo "")
  DB_NAME=$(python3 -c "import sys, json; print(json.loads('$DB_SECRET')['dbname'])" 2>/dev/null || echo "promo_gestao")
  
  if [ -z "$DB_PASS" ]; then
    print_error "Não foi possível obter a senha do banco. Verifique o Secrets Manager."
    exit 1
  fi
  
  DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${RDS_ENDPOINT}:5432/${DB_NAME}?schema=public"
  
  cd backend
  
  print_step "Executando migrações..."
  docker run --rm \
    -e DATABASE_URL="$DATABASE_URL" \
    -v $(pwd):/app \
    -w /app \
    node:18-alpine \
    sh -c "npm install && npx prisma migrate deploy"
  
  cd ..
  
  print_step "Migrações executadas com sucesso!"
fi

# Deploy Web
if [ "$DEPLOY_WEB" = true ]; then
  print_header "Deploy do Frontend Web"
  
  if [ -z "$S3_WEB_BUCKET" ]; then
    print_error "S3 bucket não encontrado. Execute o deploy da infraestrutura primeiro."
    exit 1
  fi
  
  cd web
  
  print_step "Instalando dependências..."
  npm ci
  
  print_step "Building application..."
  export VITE_API_URL="${API_URL}/api"
  npm run build
  
  print_step "Deploying to S3..."
  # Deploy static assets with long cache
  aws s3 sync dist/ s3://${S3_WEB_BUCKET}/ \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html" \
    --exclude "*.html" \
    --region $AWS_REGION
  
  # Deploy HTML files with short cache
  aws s3 sync dist/ s3://${S3_WEB_BUCKET}/ \
    --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "index.html" \
    --include "*.html" \
    --region $AWS_REGION
  
  if [ ! -z "$CLOUDFRONT_DIST_ID" ]; then
    print_step "Invalidando cache do CloudFront..."
    aws cloudfront create-invalidation \
      --distribution-id $CLOUDFRONT_DIST_ID \
      --paths "/*" \
      --region $AWS_REGION > /dev/null
  fi
  
  cd ..
  
  WEB_URL=$(cd infra/terraform && terraform output -raw web_url 2>/dev/null || echo "https://${DOMAIN_NAME}")
  print_step "Frontend deployado com sucesso!"
  echo -e "  Web URL: ${GREEN}${WEB_URL}${NC}"
fi

# Summary
print_header "Deploy Concluído!"

echo -e "${GREEN}✅ Resumo:${NC}"
if [ "$DEPLOY_INFRA" = true ]; then
  echo -e "  ✓ Infraestrutura"
fi
if [ "$DEPLOY_BACKEND" = true ]; then
  echo -e "  ✓ Backend"
  echo -e "    API: ${API_URL}"
fi
if [ "$RUN_MIGRATIONS" = true ]; then
  echo -e "  ✓ Migrações do banco"
fi
if [ "$DEPLOY_WEB" = true ]; then
  echo -e "  ✓ Frontend Web"
  echo -e "    Web: ${WEB_URL}"
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Deploy finalizado com sucesso!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

