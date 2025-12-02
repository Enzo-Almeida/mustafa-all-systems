#!/bin/bash

# Script para extrair credenciais do Firebase e configurar no Render

set -e

echo "🔥 Configuração do Firebase Storage"
echo ""

# Verificar se o arquivo JSON foi fornecido
if [ -z "$1" ]; then
  echo "Uso: ./scripts/setup-firebase.sh <caminho-do-json-do-firebase>"
  echo ""
  echo "Exemplo:"
  echo "  ./scripts/setup-firebase.sh ~/Downloads/seu-projeto-firebase-adminsdk.json"
  exit 1
fi

FIREBASE_JSON="$1"

if [ ! -f "$FIREBASE_JSON" ]; then
  echo "❌ Arquivo não encontrado: $FIREBASE_JSON"
  exit 1
fi

# Verificar se jq está instalado
if ! command -v jq &> /dev/null; then
  echo "⚠️  jq não está instalado. Instalando..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install jq
  else
    echo "Por favor, instale jq manualmente: https://stedolan.github.io/jq/download/"
    exit 1
  fi
fi

# Extrair valores do JSON
PROJECT_ID=$(jq -r '.project_id' "$FIREBASE_JSON")
CLIENT_EMAIL=$(jq -r '.client_email' "$FIREBASE_JSON")
PRIVATE_KEY=$(jq -r '.private_key' "$FIREBASE_JSON")
STORAGE_BUCKET="${PROJECT_ID}.appspot.com"

echo "✅ Credenciais extraídas:"
echo ""
echo "FIREBASE_PROJECT_ID=$PROJECT_ID"
echo "FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL"
echo "FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET"
echo ""
echo "FIREBASE_PRIVATE_KEY=\"$PRIVATE_KEY\""
echo ""

echo "📋 Copie e cole essas variáveis no Render Dashboard:"
echo "   Render > Seu Serviço > Environment > Add Environment Variable"
echo ""
echo "⚠️  IMPORTANTE: Para FIREBASE_PRIVATE_KEY, mantenha as aspas e os \\n"
echo ""

# Salvar em arquivo para referência
OUTPUT_FILE=".firebase-env.txt"
cat > "$OUTPUT_FILE" << EOF
# Firebase Storage Environment Variables
# Copie essas variáveis para o Render Dashboard

FIREBASE_PROJECT_ID=$PROJECT_ID
FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL
FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
FIREBASE_PRIVATE_KEY="$PRIVATE_KEY"
EOF

echo "✅ Variáveis salvas em: $OUTPUT_FILE"
echo ""

