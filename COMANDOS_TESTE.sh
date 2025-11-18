#!/bin/bash

# Script para facilitar os testes
# Uso: ./COMANDOS_TESTE.sh [backend|web|mobile|all]

echo "🚀 Script de Teste - Promo Gestão"
echo ""

case "$1" in
  backend)
    echo "📦 Iniciando Backend..."
    cd backend
    if [ ! -d "node_modules" ]; then
      echo "Instalando dependências..."
      npm install
    fi
    npm run dev
    ;;
  
  web)
    echo "🌐 Iniciando Web..."
    cd web
    if [ ! -d "node_modules" ]; then
      echo "Instalando dependências..."
      npm install
    fi
    npm run dev
    ;;
  
  mobile)
    echo "📱 Iniciando Mobile..."
    cd mobile
    if [ ! -d "node_modules" ]; then
      echo "Instalando dependências..."
      npm install
    fi
    npx expo start
    ;;
  
  seed)
    echo "🌱 Populando banco de dados..."
    cd backend
    npm run seed
    ;;
  
  test-api)
    echo "🧪 Testando API..."
    echo ""
    echo "1. Health Check:"
    curl -s http://localhost:3000/health | jq .
    echo ""
    echo "2. Login (Supervisor):"
    curl -s -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"supervisor@teste.com","password":"senha123"}' | jq .
    echo ""
    echo "3. Login (Promotor):"
    curl -s -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"promotor1@teste.com","password":"senha123"}' | jq .
    ;;
  
  all)
    echo "🚀 Iniciando todos os serviços..."
    echo ""
    echo "⚠️  Abra 3 terminais e execute:"
    echo "   Terminal 1: ./COMANDOS_TESTE.sh backend"
    echo "   Terminal 2: ./COMANDOS_TESTE.sh web"
    echo "   Terminal 3: ./COMANDOS_TESTE.sh mobile"
    ;;
  
  *)
    echo "Uso: ./COMANDOS_TESTE.sh [backend|web|mobile|seed|test-api|all]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  backend   - Inicia o servidor backend"
    echo "  web       - Inicia o servidor web"
    echo "  mobile    - Inicia o Expo para mobile"
    echo "  seed      - Popula o banco de dados com dados de teste"
    echo "  test-api  - Testa os endpoints da API"
    echo "  all       - Mostra instruções para iniciar tudo"
    exit 1
    ;;
esac


