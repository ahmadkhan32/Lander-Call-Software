@echo off
echo ========================================================
echo   Pushing Lander Call Software to GitHub
echo   Repository: https://github.com/ahmadkhan32/Lander-Call-Software.git
echo ========================================================
cd /d "%~dp0"
git branch -M main
git push -u origin main
echo.
echo If authentication was requested, complete the browser login.
pause
