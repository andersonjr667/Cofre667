#!/bin/bash

echo "🔍 VERIFICAÇÃO DO PROJETO MEUCONTROLE"
echo "======================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar estrutura de pastas
echo "📁 Verificando estrutura de pastas..."
pastas=("backend/config" "backend/controllers" "backend/middleware" "backend/models" "backend/routes" "backend/tools" "frontend/css" "frontend/js" "frontend/pages" "database")

for pasta in "${pastas[@]}"; do
    if [ -d "$pasta" ]; then
        echo -e "${GREEN}✓${NC} $pasta"
    else
        echo -e "${RED}✗${NC} $pasta (FALTANDO)"
    fi
done

echo ""
echo "📄 Verificando arquivos principais..."

arquivos=(
    "backend/server.js"
    "backend/package.json"
    "backend/.env.example"
    "backend/check_db.js"
    "backend/test_login.js"
    "backend/test_register.js"
    "frontend/index.html"
    "frontend/header.html"
    "database/store.json"
    "README.md"
)

for arquivo in "${arquivos[@]}"; do
    if [ -f "$arquivo" ]; then
        echo -e "${GREEN}✓${NC} $arquivo"
    else
        echo -e "${RED}✗${NC} $arquivo (FALTANDO)"
    fi
done

echo ""
echo "🔧 Verificando configuração..."

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Arquivo .env encontrado"
else
    echo -e "${RED}✗${NC} Arquivo .env não encontrado - copie o .env.example"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependências instaladas"
else
    echo -e "${RED}✗${NC} Dependências não instaladas - execute 'npm install'"
fi

echo ""
echo "📊 Contagem de arquivos:"
echo "Backend JS: $(find backend -name "*.js" | wc -l)"
echo "Frontend HTML: $(find frontend -name "*.html" | wc -l)"
echo "Frontend CSS: $(find frontend/css -name "*.css" | wc -l)"
echo "Frontend JS: $(find frontend/js -name "*.js" | wc -l)"

echo ""
echo "======================================"
echo "✅ Verificação concluída!"
echo ""
echo "Para iniciar o projeto:"
echo "1. cd backend"
echo "2. npm install (se ainda não fez)"
echo "3. npm start"
echo "4. Abra http://localhost:3000"
echo ""
