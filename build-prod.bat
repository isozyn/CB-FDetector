@echo off
REM CB-FDetector Production Build Script for Windows

echo 🚀 Building CB-FDetector for production...

REM Navigate to frontend directory
cd frontend

REM Install dependencies
echo 📦 Installing frontend dependencies...
npm ci

REM Build the frontend
echo 🔨 Building frontend...
npm run build

echo ✅ Build complete!
echo 📁 Built files are in frontend/build/
echo.
echo Next steps:
echo 1. Deploy backend to Railway/Heroku/Render
echo 2. Deploy frontend to Netlify
echo 3. Update REACT_APP_API_URL environment variable
echo 4. Update CORS origins in backend
echo.
echo For detailed instructions, see NETLIFY_DEPLOY.md

pause
