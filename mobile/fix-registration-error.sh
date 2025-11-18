#!/bin/bash

echo "🔧 Corrigindo erro 'main has not been registered'"
echo ""

# Verificar se está na pasta mobile
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta 'mobile'"
    exit 1
fi

echo "1️⃣ Parando processos do Metro/Expo..."
pkill -f "expo start" || true
pkill -f "metro" || true
sleep 2

echo "2️⃣ Limpando cache do Expo..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf .metro

echo "3️⃣ Limpando cache do npm..."
npm cache clean --force

echo "4️⃣ Verificando arquivos importantes..."
if [ ! -f "index.js" ]; then
    echo "❌ Erro: index.js não encontrado!"
    exit 1
fi

if [ ! -f "App.tsx" ]; then
    echo "❌ Erro: App.tsx não encontrado!"
    exit 1
fi

echo "✅ Arquivos encontrados"
echo ""
echo "5️⃣ Reiniciando o Metro com cache limpo..."
echo ""
echo "🚀 Execute agora: npm start -- --clear"
echo ""
echo "📱 Ou execute diretamente:"
echo "   expo start -c"

