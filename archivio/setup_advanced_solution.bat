@echo off
echo ====================================================
echo    MOCKED - Setup Soluzione Avanzata Salvataggio
echo ====================================================
echo.

echo [1/6] Installazione dipendenze necessarie...
call npm install --save expo-file-system@~16.0.5 expo-media-library@~16.0.0 expo-dev-client

echo.
echo [2/6] Creazione delle directory necessarie...
if not exist "plugins\withMediaLibraryPermissions" mkdir plugins\withMediaLibraryPermissions
if not exist "utils\mediaServices" mkdir utils\mediaServices

echo.
echo [3/6] Copiando il componente CameraRecorder migliorato...
copy /Y CameraRecorder_advanced.tsx components\CameraRecorder.tsx

echo.
echo [4/6] Aggiornando app.json con i plugin necessari...
rem Nota: Questa operazione è già stata effettuata manualmente

echo.
echo [5/6] Configurando il progetto per il build...
call npx expo install --check

echo.
echo [6/6] Pulizia cache e preparazione per il build...
call npx expo prebuild --clean

echo.
echo ====================================================
echo         INSTALLAZIONE COMPLETATA CON SUCCESSO
echo ====================================================
echo.
echo Per testare la soluzione:
echo 1. npx expo run:android    (per Android)
echo 2. npx expo run:ios        (per iOS)
echo.
echo Se hai bisogno di un development client:
echo - npx expo start --dev-client
echo.
echo Assicurati di avere tutte le autorizzazioni necessarie configurate
echo sul dispositivo per fotocamera, microfono e accesso alla galleria.
echo.
pause
