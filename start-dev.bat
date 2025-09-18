@echo off
echo Starting CBT Platform in Development Mode...
echo.
echo Starting MongoDB (make sure MongoDB is installed)...
start "MongoDB" cmd /k "mongod"

echo.
echo Waiting for MongoDB to start...
timeout /t 5 /nobreak >nul

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Client...
start "Frontend Client" cmd /k "cd client && npm start"

echo.
echo CBT Platform is starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause