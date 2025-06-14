@echo off
echo Installazione della versione corretta di expo-media-library (17.1.6)...
echo.
echo 1. Rimozione della versione precedente...
call npm uninstall expo-media-library

echo.
echo 2. Pulizia della cache npm...
call npm cache clean --force

echo.
echo 3. Installazione della versione corretta con --legacy-peer-deps...
call npx expo install expo-media-library@~17.1.6 --legacy-peer-deps

echo.
echo Installazione completata! Riavvia l'app con: npx expo start --tunnel
pause