#!/bin/bash

# Script para testar a API rapidamente

API_URL="http://localhost:3000/api"

echo "🧪 Testando API..."
echo ""

# Test 1: Health check
echo "1. Health Check:"
curl -s "$API_URL/../health" | jq .
echo ""
echo "---"
echo ""

# Test 2: Login as Supervisor
echo "2. Login como Supervisor:"
SUPERVISOR_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supervisor@teste.com",
    "password": "senha123"
  }')

echo "$SUPERVISOR_RESPONSE" | jq .
SUPERVISOR_TOKEN=$(echo "$SUPERVISOR_RESPONSE" | jq -r '.accessToken')
echo ""
echo "Token: $SUPERVISOR_TOKEN"
echo ""
echo "---"
echo ""

# Test 3: Login as Promoter
echo "3. Login como Promotor:"
PROMOTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "promotor1@teste.com",
    "password": "senha123"
  }')

echo "$PROMOTER_RESPONSE" | jq .
PROMOTER_TOKEN=$(echo "$PROMOTER_RESPONSE" | jq -r '.accessToken')
echo ""
echo "Token: $PROMOTER_TOKEN"
echo ""
echo "---"
echo ""

# Test 4: Protected endpoint (Supervisor)
if [ "$SUPERVISOR_TOKEN" != "null" ]; then
  echo "4. Testando endpoint protegido (Supervisor Dashboard):"
  curl -s -X GET "$API_URL/supervisors/dashboard" \
    -H "Authorization: Bearer $SUPERVISOR_TOKEN" | jq .
  echo ""
  echo "---"
  echo ""
fi

# Test 5: Refresh token
if [ "$PROMOTER_TOKEN" != "null" ]; then
  REFRESH_TOKEN=$(echo "$PROMOTER_RESPONSE" | jq -r '.refreshToken')
  echo "5. Testando refresh token:"
  curl -s -X POST "$API_URL/auth/refresh" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}" | jq .
  echo ""
fi

echo "✅ Testes concluídos!"

