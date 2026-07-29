#!/bin/bash

echo "Iniciando Aurix Admin..."
echo

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verifica se o npm está disponível
if ! command -v npm &> /dev/null; then
    echo "ERRO: npm não encontrado. Instale o npm primeiro."
    exit 1
fi

# Instala as dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERRO: Falha ao instalar dependências."
        exit 1
    fi
fi

# Define a URL da API
export REACT_APP_API_URL=http://localhost:8080

echo
echo "Iniciando servidor de desenvolvimento..."
echo "URL da API: $REACT_APP_API_URL"
echo

# Inicia o servidor de desenvolvimento
npm start
