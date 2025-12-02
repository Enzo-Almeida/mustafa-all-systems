#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 Configurando Secrets no AWS Secrets Manager...${NC}"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
  echo -e "${RED}❌ AWS CLI is not configured. Please run 'aws configure' first.${NC}"
  exit 1
fi

# Get AWS Account ID and Region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-sa-east-1}
PROJECT_NAME="promo-gestao"
ENVIRONMENT="prod"

# Generate random JWT secrets
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)

echo -e "${GREEN}✅ JWT secrets gerados${NC}"

# Update JWT Secret
SECRET_ARN="arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${PROJECT_NAME}-jwt-secret-${ENVIRONMENT}"

echo -e "${YELLOW}Atualizando JWT secret...${NC}"
aws secretsmanager update-secret \
  --secret-id "${PROJECT_NAME}-jwt-secret-${ENVIRONMENT}" \
  --secret-string "{\"jwt_secret\":\"${JWT_SECRET}\",\"jwt_refresh_secret\":\"${JWT_REFRESH_SECRET}\"}" \
  --region "${AWS_REGION}"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ JWT secret atualizado com sucesso${NC}"
else
  echo -e "${RED}❌ Erro ao atualizar JWT secret${NC}"
  echo -e "${YELLOW}Você pode criar manualmente no console AWS:${NC}"
  echo -e "  Nome: ${PROJECT_NAME}-jwt-secret-${ENVIRONMENT}"
  echo -e "  Conteúdo: {\"jwt_secret\":\"${JWT_SECRET}\",\"jwt_refresh_secret\":\"${JWT_REFRESH_SECRET}\"}"
fi

echo ""
echo -e "${GREEN}📝 Secrets configurados:${NC}"
echo -e "  JWT Secret: ${JWT_SECRET:0:20}..."
echo -e "  JWT Refresh Secret: ${JWT_REFRESH_SECRET:0:20}..."
echo ""
echo -e "${GREEN}✅ Configuração concluída!${NC}"



