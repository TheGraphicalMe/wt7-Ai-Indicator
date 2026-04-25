@echo off
echo ================================================
echo  WizardTrader Chatbot Backend - Setup
echo ================================================
echo.

:: Check Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please download it from https://nodejs.org/ and install it first.
    echo Make sure to tick "Add to PATH" during installation.
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version

:: Check npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not available. Reinstall Node.js.
    pause
    exit /b 1
)

echo [OK] npm found:
npm --version
echo.

:: Install all dependencies
echo [STEP 1] Installing dependencies from package.json...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed. Check your internet connection.
    pause
    exit /b 1
)
echo [OK] Dependencies installed.
echo.

:: Check if .env exists
if not exist .env (
    echo [STEP 2] Creating .env from .env.example...
    copy .env.example .env
    echo [OK] .env created.
    echo.
    echo ================================================
    echo  ACTION REQUIRED
    echo ================================================
    echo  Open .env in VS Code and fill in:
    echo  - ANTHROPIC_API_KEY  (from console.anthropic.com)
    echo  - ALLOWED_ORIGINS    (your website URL)
    echo ================================================
) else (
    echo [STEP 2] .env already exists. Skipping.
)

:: Create logs folder if missing
if not exist logs mkdir logs
echo [OK] logs/ folder ready.
echo.

echo ================================================
echo  Setup complete!
echo ================================================
echo.
echo  To start the development server, run:
echo    npm run dev
echo.
echo  To start the production server, run:
echo    npm start
echo.
echo  Health check (after starting):
echo    http://localhost:8000/health
echo.
pause
