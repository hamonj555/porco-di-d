# Guida all'Installazione Passo-Passo per MOCKED

Questa guida ti guiderà attraverso il processo completo di installazione e configurazione della soluzione di salvataggio video per l'app MOCKED utilizzando Expo Development Client.

## Prerequisiti

- Node.js 16+ installato
- npm o yarn installato
- Android Studio (per build Android)
- Xcode (per build iOS, solo macOS)
- Dispositivo fisico Android o iOS per test

## Passo 1: Installazione delle Dipendenze

### Windows
```bash
# Esegui lo script di installazione
setup_dev_client.bat
```

### macOS/Linux
```bash
# Rendi lo script eseguibile
chmod +x setup_dev_client.sh

# Esegui lo script di installazione
./setup_dev_client.sh
```

In alternativa, puoi installare manualmente le dipendenze:

```bash
# Installa expo-dev-client
npm install expo-dev-client --save

# Installa react-native-fs
npm install react-native-fs --save

# Installa altre dipendenze necessarie
npx expo install expo-build-properties expo-sharing expo-device
```

## Passo 2: Verifica del file app.json

Assicurati che il file `app.json` contenga la configurazione corretta:

```json
{
  "expo": {
    // ... altre configurazioni
    "plugins": [
      "expo-router",
      "./plugins/withAndroidMediaStorage",
      "./plugins/withIosMediaStorage",
      ["expo-media-library", {
        "photosPermission": "MOCKED richiede accesso alle tue foto per i video.",
        "savePhotosPermission": "MOCKED richiede questo permesso per salvare i video nella galleria."
      }],
      ["react-native-fs", {}]
    ],
    // ... altre configurazioni
  }
}
```

## Passo 3: Configura i Plugin Personalizzati

Assicurati che le directory e i file dei plugin siano presenti:

```
plugins/
  ├── withAndroidMediaStorage.js
  ├── withIosMediaStorage.js
  └── withMediaScannerModule.js
```

## Passo 4: Verifica le Utilità di Supporto

Controlla che le utilità di supporto siano presenti:

```
utils/
  ├── mediaServices.ts
  ├── deviceUtils.ts
  └── playerStoreExtensions.ts
```

## Passo 5: Crea un Development Build per Android

```bash
# Crea un development build per Android
npx expo run:android
```

Questo processo:
1. Creerà un progetto nativo Android nella cartella `android/`
2. Installerà tutte le dipendenze native
3. Compilerà l'app per Android
4. Installerà l'app sul dispositivo collegato (se disponibile)

## Passo 6: Crea un Development Build per iOS (solo macOS)

```bash
# Crea un development build per iOS
npx expo run:ios
```

Questo processo:
1. Creerà un progetto nativo iOS nella cartella `ios/`
2. Installerà tutte le dipendenze native tramite CocoaPods
3. Compilerà l'app per iOS
4. Avvierà il simulatore iOS o installerà l'app sul dispositivo collegato

## Passo 7: Esegui l'App in Modalità Development Client

Una volta creato il build, puoi eseguire l'app in modalità development client:

```bash
# Avvia l'app in modalità development client
npx expo start --dev-client
```

## Passo 8: Test del Salvataggio Video

1. Apri l'app sul dispositivo
2. Vai alla schermata della fotocamera
3. Registra un video di prova
4. Verifica che il video venga salvato correttamente nella galleria

## Risoluzione dei Problemi

### Problema 1: Video non visibili nella galleria

- **Verifica permessi**: Assicurati che tutti i permessi necessari siano stati concessi nelle impostazioni dell'app
- **Verifica spazio di archiviazione**: Assicurati che ci sia spazio sufficiente sul dispositivo
- **Controlla i log**: Verifica i log nella console per identificare il punto di fallimento

### Problema 2: Errori durante la build

- **Pulizia della cache**:
  ```bash
  # Android
  cd android && ./gradlew clean && cd ..
  
  # iOS
  cd ios && pod deintegrate && pod install && cd ..
  ```

- **Reinstallazione delle dipendenze**:
  ```bash
  rm -rf node_modules
  npm install
  ```

### Problema 3: Crash dell'app

- **Verifica la compatibilità della versione**:
  Assicurati che tutte le dipendenze siano compatibili con la versione di Expo SDK in uso

- **Abilita modalità debug**:
  ```bash
  npx expo start --dev-client --localhost
  ```

## Note per Versioni Specifiche di Android

### Android 9 e precedenti
- Nessuna configurazione speciale necessaria
- Il salvataggio diretto in DCIM/Camera dovrebbe funzionare senza problemi

### Android 10 (API 29)
- Verifica che `requestLegacyExternalStorage` sia impostato su `true` in `app.json`
- Verifica che i permessi `READ_EXTERNAL_STORAGE` e `WRITE_EXTERNAL_STORAGE` siano concessi

### Android 11+ (API 30+)
- Il salvataggio diretto potrebbe richiedere configurazioni aggiuntive
- MediaLibrary è il metodo preferito per queste versioni

## Conclusione

Seguendo questa guida passo-passo, dovresti essere in grado di implementare con successo la soluzione per il salvataggio dei video nella galleria per l'app MOCKED. In caso di problemi, consulta la documentazione completa o contatta il team di sviluppo.

## Risorse Aggiuntive

- [Documentazione Expo Development Client](https://docs.expo.dev/development/development-builds/introduction/)
- [Documentazione expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/)
- [Documentazione react-native-fs](https://github.com/itinance/react-native-fs)
