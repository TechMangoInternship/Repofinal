@echo off
echo ===================================
echo  Installing dependencies for all Grid Projects
echo ===================================
echo.

echo [1/12] Installing projectGrid backend...
cd /d %~dp0projectGrid\backend && npm install
echo.

echo [2/12] Installing projectGrid frontend...
cd /d %~dp0projectGrid\frontend && npm install
echo.

echo [3/12] Installing technicalStack backend...
cd /d %~dp0technicalStack\backend && npm install
echo.

echo [4/12] Installing technicalStack frontend...
cd /d %~dp0technicalStack\frontend && npm install
echo.

echo [5/12] Installing QueriesResponsesGrid backend...
cd /d %~dp0QueriesResponsesGrid\backend && npm install
echo.

echo [6/12] Installing QueriesResponsesGrid frontend...
cd /d %~dp0QueriesResponsesGrid\frontend && npm install
echo.

echo [7/12] Installing resourceGrid backend...
cd /d %~dp0resourceGrid\backend && npm install
echo.

echo [8/12] Installing resourceGrid frontend...
cd /d %~dp0resourceGrid\frontend && npm install
echo.

echo [9/12] Installing assumption-grid backend...
cd /d %~dp0assumption-grid && npm install
echo.

echo [10/12] Installing assumption-grid frontend...
cd /d %~dp0assumption-grid\frontend && npm install
echo.

echo [11/12] Installing dependency-grid backend...
cd /d %~dp0dependency-grid && npm install
echo.

echo [12/12] Installing dependency-grid frontend...
cd /d %~dp0dependency-grid\frontend && npm install
echo.

echo [13/14] Installing features-grid backend...
cd /d %~dp0features-grid && npm install
echo.

echo [14/14] Installing features-grid frontend...
cd /d %~dp0features-grid\frontend && npm install
echo.

echo ===================================
echo  All dependencies installed!
echo  Now run start-all.bat to start the servers.
echo ===================================
pause
