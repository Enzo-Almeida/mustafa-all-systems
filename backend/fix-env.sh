#!/bin/bash

# Script para corrigir o arquivo .env

echo "🔧 Corrigindo arquivo .env..."
echo ""

# Verificar usuário atual do PostgreSQL
DB_USER=$(psql -d postgres -t -c "SELECT current_user;" 2>/dev/null | xargs)

if [ -z "$DB_USER" ]; then
  DB_USER="ozen"
fi

echo "✅ Usuário PostgreSQL detectado: $DB_USER"
echo ""

# Criar backup do .env se existir
if [ -f .env ]; then
  cp .env .env.backup
  echo "✅ Backup criado: .env.backup"
fi

# Criar novo .env
cat > .env << EOF
# Server
PORT=3000
NODE_ENV=development

# Database - Usuário: $DB_USER
DATABASE_URL="postgresql://$DB_USER@localhost:5432/promo_gestao?schema=public"

# JWT
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3 (opcional para testes iniciais)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=promo-gestao-photos

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:19006
EOF

echo "✅ Arquivo .env criado/atualizado!"
echo ""
echo "📝 Configuração:"
echo "   DATABASE_URL: postgresql://$DB_USER@localhost:5432/promo_gestao?schema=public"
echo "   JWT_SECRET: Gerado automaticamente"
echo "   JWT_REFRESH_SECRET: Gerado automaticamente"
echo ""
echo "🚀 Agora você pode executar:"
echo "   npm run prisma:migrate"
echo "   npm run seed"

