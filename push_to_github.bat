@echo off
echo ============================================
echo   PUSH TO GITHUB - Lander Call Software
echo   2 Vercel fix commits waiting to be pushed
echo ============================================
echo.
cd /d "c:\Users\Al Hafiz enterprises\Downloads\Lander Call Software"

echo Commits to push:
git log --oneline origin/main..main
echo.
echo Starting push to: https://github.com/ahmadkhan32/Lander-Call-Software.git
echo.
echo When the browser opens, sign in as: ahmadkhan32
echo.
git push origin main

if %errorlevel% == 0 (
    echo.
    echo ============================================
    echo   SUCCESS! All commits pushed to GitHub.
    echo   Now go redeploy on Vercel.
    echo ============================================
) else (
    echo.
    echo Push failed. Error code: %errorlevel%
    echo Please check your GitHub authentication.
)
echo.
pause
