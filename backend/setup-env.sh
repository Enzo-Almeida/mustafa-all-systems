#!/bin/bash

# Script para configurar o arquivo .env

echo "🔧 Configurando arquivo .env..."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Arquivo .env criado a partir do .env.example"
else
  echo "⚠️  Arquivo .env já existe"
fi

echo ""
echo "📝 Por favor, edite o arquivo .env e configure:"
echo "   - DATABASE_URL (ex: postgresql://usuario:senha@localhost:5432/promo_gestao?schema=public)"
echo "   - JWT_SECRET (qualquer string secreta)"
echo "   - JWT_REFRESH_SECRET (outra string secreta)"
echo ""
echo "Depois execute:"
echo "   npm run prisma:migrate"
echo "   npm run seed"

