#!/bin/bash

echo "🚀 Configurando o App Mobile - Promo Gestão"
echo ""

# Verificar se está na pasta mobile
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta 'mobile'"
    exit 1
fi

# Verificar se o .env já existe
if [ -f ".env" ]; then
    echo "⚠️  Arquivo .env já existe. Deseja sobrescrever? (s/N)"
    read -r response
    if [[ ! "$response" =~ ^[Ss]$ ]]; then
        echo "✅ Mantendo arquivo .env existente"
        exit 0
    fi
fi

# Detectar IP local
echo "🔍 Detectando seu IP local..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}')
else
    # Windows (Git Bash)
    IP=$(ipconfig | grep "IPv4" | head -1 | awk '{print $14}')
fi

if [ -z "$IP" ]; then
    echo "⚠️  Não foi possível detectar o IP automaticamente"
    echo "Por favor, digite seu IP local:"
    read -r IP
fi

echo "✅ IP detectado: $IP"
echo ""

# Criar arquivo .env
cat > .env << EOF
# API URL Configuration
# URL da API do backend
EXPO_PUBLIC_API_URL=http://${IP}:3000/api
EOF

echo "✅ Arquivo .env criado com sucesso!"
echo ""
echo "📝 Configuração:"
echo "   EXPO_PUBLIC_API_URL=http://${IP}:3000/api"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Certifique-se de que o backend está rodando em http://localhost:3000"
echo "   2. Seu celular e computador devem estar na mesma rede Wi-Fi"
echo "   3. Se o IP mudar, edite o arquivo .env manualmente"
echo ""
echo "🚀 Próximos passos:"
echo "   1. npm install (se ainda não instalou as dependências)"
echo "   2. npm start (para iniciar o Expo)"
echo "   3. Escaneie o QR code com o Expo Go no seu celular"
echo ""

