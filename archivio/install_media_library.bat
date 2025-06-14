@echo off
echo Pulizia della cache e reinstallazione di expo-media-library...
npm uninstall expo-media-library
npm cache clean --force
npx expo install expo-media-library
echo Installazione completata! Riavvia l'app con: expo start --tunnel
pause