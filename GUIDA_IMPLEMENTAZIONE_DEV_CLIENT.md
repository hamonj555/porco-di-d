# Guida all'implementazione di Expo Development Client per MOCKED

Questa guida ti mostrerà come implementare Expo Development Client per risolvere il problema del salvataggio dei video nella galleria dell'app MOCKED. La soluzione utilizza un approccio ibrido che mantiene i vantaggi di Expo mentre aggiunge accesso nativo necessario per il salvataggio dei media.

## Panoramica della soluzione

Implementeremo:
1. Expo Development Client per accedere alle API native
2. Plugin personalizzati per configurare i permessi Android e iOS
3. react-native-fs per accesso diretto alla cartella DCIM su Android
4. Un servizio dedicato alla gestione dei media

## Prerequisiti

- Node.js 16+ installato
- Expo CLI installato globalmente (`npm install -g expo-cli`)
- Android Studio per build Android
- Xcode per build iOS (solo macOS)

## Passo 1: Installazione delle dipendenze

Esegui lo script di installazione `setup_dev_client.bat` che abbiamo preparato:

```bash
# Windows
setup_dev_client.bat

# Mac/Linux
chmod +x setup_dev_client.sh
./setup_dev_client.sh
```

Questo script installerà:
- expo-dev-client
- react-native-fs
- expo-build-properties

## Passo 2: Sostituzione del componente CameraRecorder

1. Sostituisci il file attuale `components/CameraRecorder.tsx` con la versione ottimizzata `CameraRecorder_dev.tsx`:

```bash
# Windows
copy components\CameraRecorder_dev.tsx components\CameraRecorder.tsx

# Mac/Linux
cp components/CameraRecorder_dev.tsx components/CameraRecorder.tsx
```

## Passo 3: Configurazione del build

Il file `app.json` è stato già aggiornato per includere:
- Plugin personalizzati per Android e iOS
- Configurazioni per expo-media-library
- Supporto per react-native-fs

## Passo 4: Creazione del Development Build

```bash
# Per Android
npx expo run:android

# Per iOS
npx expo run:ios
```

> **Nota**: La prima build richiederà più tempo poiché scarica tutte le dipendenze native.

## Passo 5: Test dell'applicazione

1. Apri l'app sul dispositivo
2. Registra un video
3. Verifica che il video appaia nella galleria

## Confronto con la versione precedente

**Vantaggi della nuova implementazione**:
- Accesso diretto alla cartella DCIM su Android
- Utilizzo di MediaScanner per notificare il sistema del nuovo media
- Supporto per Android 10+ e iOS
- Gestione degli errori più robusta con metodi alternativi
- Riduzione della qualità video per file più piccoli e compatibili

## Struttura dei file implementati

```
project/
├── components/
│   └── CameraRecorder.tsx
├── plugins/
│   ├── withAndroidMediaStorage.js
│   └── withIosMediaStorage.js
├── utils/
│   └── mediaServices.ts
├── app.json
└── setup_dev_client.bat
```

## Risoluzione problemi comuni

1. **Build Android fallita**:
   - Verifica che Android Studio sia aggiornato
   - Controlla di avere le SDK Android corrette installate
   - Pulisci la cache di Gradle (`cd android && ./gradlew clean`)

2. **Build iOS fallita**:
   - Verifica che Xcode sia aggiornato
   - Installa CocoaPods (`sudo gem install cocoapods`)
   - Pulisci la cache dei pod (`cd ios && pod deintegrate && pod install`)

3. **Video non visibili nella galleria**:
   - Verifica i log per identificare quale metodo di salvataggio sta fallendo
   - Controlla che tutti i permessi siano attivi nelle impostazioni del dispositivo
   - Prova a riavviare l'app della galleria

## Conclusione

Con questa implementazione, MOCKED dovrebbe essere in grado di salvare i video nella galleria del dispositivo in modo affidabile sia su Android che su iOS. La soluzione mantiene i vantaggi dello sviluppo con Expo mentre aggiunge le capacità native necessarie per la gestione dei media.
