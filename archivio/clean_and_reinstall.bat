@echo off
echo PULIZIA E REINSTALLAZIONE COMPLETA DEL PROGETTO MOCKED
echo ======================================================
echo.

echo 1. Chiusura di eventuali processi VS Code in esecuzione...
taskkill /f /im code.exe >nul 2>&1
timeout /t 2 >nul

echo 2. Eliminazione cartella node_modules...
rmdir /s /q "node_modules"
echo Cartella node_modules eliminata.
echo.

echo 3. Eliminazione package-lock.json...
del /f /q package-lock.json
echo File package-lock.json eliminato.
echo.

echo 4. Pulizia cache npm...
call npm cache clean --force
echo Cache npm pulita.
echo.

echo 5. Reinstallazione pacchetti...
call npm install
echo.

echo 6. Reinstallazione pacchetti Expo specifici...
call npx expo install expo-camera expo-file-system expo-media-library
echo.

echo OPERAZIONE COMPLETATA!
echo =====================
echo.
echo Ora puoi riavviare VS Code e lanciare l'app.
echo Per avviare l'app usa: npm run start
echo.
pause
