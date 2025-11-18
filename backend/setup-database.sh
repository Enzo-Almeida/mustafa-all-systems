#!/bin/bash

# Script para configurar o banco de dados PostgreSQL

echo "🔧 Configurando banco de dados PostgreSQL..."
echo ""

# Verificar se PostgreSQL está rodando
if ! pg_isready > /dev/null 2>&1; then
  echo "❌ PostgreSQL não está rodando!"
  echo "   Inicie o PostgreSQL primeiro"
  exit 1
fi

echo "✅ PostgreSQL está rodando"
echo ""

# Tentar diferentes usuários
USERS=("postgres" "$USER" "ozen")

for DB_USER in "${USERS[@]}"; do
  echo "Tentando conectar como usuário: $DB_USER"
  
  # Tentar criar banco
  if psql -U "$DB_USER" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Conectado como: $DB_USER"
    
    # Criar banco se não existir
    psql -U "$DB_USER" -c "CREATE DATABASE promo_gestao;" 2>/dev/null && echo "✅ Banco 'promo_gestao' criado" || echo "ℹ️  Banco 'promo_gestao' já existe ou erro ao criar"
    
    echo ""
    echo "📝 Configure o arquivo .env com:"
    echo "   DATABASE_URL=\"postgresql://$DB_USER@localhost:5432/promo_gestao?schema=public\""
    echo ""
    echo "   OU se tiver senha:"
    echo "   DATABASE_URL=\"postgresql://$DB_USER:senha@localhost:5432/promo_gestao?schema=public\""
    echo ""
    exit 0
  fi
done

echo "❌ Não foi possível conectar ao PostgreSQL"
echo ""
echo "💡 Opções:"
echo "   1. Use o usuário 'postgres' (padrão):"
echo "      DATABASE_URL=\"postgresql://postgres:senha@localhost:5432/promo_gestao?schema=public\""
echo ""
echo "   2. Crie um usuário específico:"
echo "      psql -U postgres"
echo "      CREATE USER seu_usuario WITH PASSWORD 'sua_senha';"
echo "      CREATE DATABASE promo_gestao OWNER seu_usuario;"
echo "      GRANT ALL PRIVILEGES ON DATABASE promo_gestao TO seu_usuario;"
echo ""

