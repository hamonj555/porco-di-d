@echo off
echo Inizializzazione repository Git...
git init

echo Aggiungendo i file al repository...
git add .

echo Creando il primo commit...
git commit -m "Implementazione navigazione tra modalità (AUDIO, VIDEO, MEME, AI)"

echo Configurando il repository remoto...
git remote add origin https://github.com/hamonj555/mocked-v1.02.git

echo Pushando i cambiamenti su GitHub...
git push -u origin master

echo Fatto! Ora puoi importare il repository su Expo Snack.
pause