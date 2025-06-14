@echo off
echo ====================================================
echo    MOCKED - Build Android con Plugin Personalizzati
echo ====================================================
echo.

echo [1/5] Verifica prerequisiti...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRORE: npm non trovato. Assicurati che Node.js sia installato.
    exit /b 1
)

echo [2/5] Pulizia della cache...
echo Pulizia cache metro...
call npx expo start --clear
echo Pulizia cache npm...
call npm cache clean --force

echo [3/5] Installazione/aggiornamento dipendenze...
call npm install

echo [4/5] Configurazione dell'ambiente build per Android...
echo Configurazione plugin per MediaLibrary e Intent...
call npx expo prebuild --platform android --clean

echo [5/5] Build dell'app Android...
echo Build in corso, potrebbe richiedere alcuni minuti...
call npx expo run:android

echo.
echo ====================================================
echo         BUILD COMPLETATO
echo ====================================================
echo.
echo Se l'app è stata installata correttamente sul tuo dispositivo,
echo puoi ora testare la nuova funzionalità di salvataggio video.
echo.
echo NOTA: Questa versione include:
echo - Interfaccia utente migliorata per il salvataggio
echo - Plugin specifici per Android per la gestione dei media
echo - Metodi multipli di salvataggio con fallback automatico
echo.
pause
