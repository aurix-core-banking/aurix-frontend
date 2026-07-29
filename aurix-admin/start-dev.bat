@echo off
echo Iniciando Aurix Admin...
echo.

REM Verifica se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js não encontrado. Instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Verifica se o npm está disponível
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: npm não encontrado. Instale o npm primeiro.
    pause
    exit /b 1
)

REM Instala as dependências se necessário
if not exist node_modules (
    echo Instalando dependências...
    npm install
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependências.
        pause
        exit /b 1
    )
)

REM Define a URL da API
set REACT_APP_API_URL=http://localhost:8080

echo.
echo Iniciando servidor de desenvolvimento...
echo URL da API: %REACT_APP_API_URL%
echo.

REM Inicia o servidor de desenvolvimento
npm start
