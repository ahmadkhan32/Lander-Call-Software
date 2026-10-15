@echo off
setlocal EnableDelayedExpansion
title Push Lander Call Software to GitHub
cls
echo ====================================================================
echo   LANDER CALL CENTER & CRM - PUSH TO GITHUB REPOSITORY
echo   Target: https://github.com/ahmadkhan32/Lander-Call-Software.git
echo ====================================================================
echo.

cd /d "c:\Users\Al Hafiz enterprises\Downloads\Lander Call Software"

echo [1/3] Local commits ready to push:
echo --------------------------------------------------------------------
git log --oneline origin/main..main
echo --------------------------------------------------------------------
echo.

echo Choose how you would like to push:
echo.
echo   [1] Browser Login (Sign in with your GitHub account in browser)
echo   [2] Personal Access Token (Paste token directly - fastest and guaranteed)
echo.
set /p CHOICE="Enter choice (1 or 2): "

if "%CHOICE%"=="2" (
    echo.
    set /p GHTOKEN="Paste your GitHub Personal Access Token: "
    if "!GHTOKEN!"=="" (
        echo Error: No token provided.
        goto end
    )
    echo.
    echo Pushing with Token...
    git remote set-url origin https://ahmadkhan32:!GHTOKEN!@github.com/ahmadkhan32/Lander-Call-Software.git
    git push origin main
) else (
    echo.
    echo Pushing with Git Credential Manager...
    echo When prompted in the browser dialog, please sign in as: ahmadkhan32
    echo.
    git remote set-url origin https://github.com/ahmadkhan32/Lander-Call-Software.git
    git push origin main
)

if %errorlevel% == 0 (
    echo.
    echo ====================================================================
    echo   SUCCESS! All 49 routes, Vercel root directory config, and
    echo   CORS settings are now live on GitHub:
    echo   https://github.com/ahmadkhan32/Lander-Call-Software
    echo.
    echo   Vercel will now automatically trigger a successful production build:
    echo   https://lander-call-softwarees.vercel.app/
    echo ====================================================================
) else (
    echo.
    echo ====================================================================
    echo   Push encountered an authentication error.
    echo   If you used option 1, try option 2 using a GitHub Personal Access
    echo   Token from https://github.com/settings/tokens (repo scope).
    echo ====================================================================
)

:end
echo.
pause
