@echo off
echo Tentativo avanzato di installazione di expo-media-library...
echo.
echo 1. Rimozione di qualsiasi installazione precedente...
call npm uninstall expo-media-library

echo.
echo 2. Pulizia della cache npm...
call npm cache clean --force

echo.
echo 3. Tentativo di installazione forzata con --legacy-peer-deps...
call npm install expo-media-library@15.4.1 --legacy-peer-deps --no-save

echo.
echo 4. Aggiunta manuale al package.json...
echo Questa parte è già stata completata.

echo.
echo 5. Reinstallazione di tutte le dipendenze con --legacy-peer-deps...
call npm install --legacy-peer-deps

echo.
echo Installazione completata! Riavvia l'app con: expo start --tunnel
pause