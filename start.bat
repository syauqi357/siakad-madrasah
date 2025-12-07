@echo off
title Dev Servers
echo Starting servers...
echo.

start npm start

timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:5173