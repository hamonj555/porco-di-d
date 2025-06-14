@echo off
echo ====================================================
echo    MOCKED - Setup Soluzione Condivisione Video
echo ====================================================
echo.

echo [1/4] Installazione di expo-sharing...
call npx expo install expo-sharing

echo.
echo [2/4] Creazione backup del componente CameraRecorder originale...
if exist "components\CameraRecorder.tsx.backup" (
  echo Backup già esistente, nessuna operazione necessaria.
) else (
  copy /Y "components\CameraRecorder.tsx" "components\CameraRecorder.tsx.backup"
  echo Backup creato.
)

echo.
echo [3/4] Applicazione della nuova soluzione basata su condivisione...
copy /Y "components\CameraRecorder_sharing.tsx" "components\CameraRecorder.tsx"
echo Componente CameraRecorder aggiornato.

echo.
echo [4/4] Aggiornamento dipendenze e pulizia cache...
call npx expo install --check

echo.
echo ====================================================
echo         INSTALLAZIONE COMPLETATA CON SUCCESSO
echo ====================================================
echo.
echo Per testare la soluzione:
echo 1. expo start    (per la modalità development)
echo.
echo IMPORTANTE:
echo Questa soluzione utilizza il meccanismo di condivisione del sistema
echo operativo invece del salvataggio diretto. L'utente dovrà selezionare
echo "Salva nella galleria" dal menu di condivisione che appare.
echo.
echo Per tornare alla versione precedente:
echo copy /Y "components\CameraRecorder.tsx.backup" "components\CameraRecorder.tsx"
echo.
pause