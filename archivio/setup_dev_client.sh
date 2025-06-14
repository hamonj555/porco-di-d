#!/bin/bash

echo "===== Installazione Expo Development Client per MOCKED ====="
echo

echo "1. Installazione di expo-dev-client..."
npm install expo-dev-client --save

echo
echo "2. Installazione di react-native-fs..."
npm install react-native-fs --save

echo
echo "3. Aggiornamento delle dipendenze native..."
npx expo install expo-build-properties

echo
echo "4. Installazione completata!"
echo
echo "Per creare un development build, esegui:"
echo "npx expo run:android"
echo
echo "Per iOS:"
echo "npx expo run:ios"
echo
echo "Premi un tasto per continuare..."
read -n 1 -s
