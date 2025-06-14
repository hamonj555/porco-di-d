# MOCKED: Soluzione Completa per il Salvataggio Video

Questa documentazione descrive l'implementazione completa della soluzione per il salvataggio dei video nella galleria dell'app MOCKED utilizzando Expo Development Client.

## Architettura della Soluzione

La soluzione utilizza un approccio a strati con strategia adattiva in base al dispositivo e alle librerie disponibili:

1. **Livello di servizio** - `mediaServices.ts`
   * Gestisce le richieste di salvataggio video
   * Adatta la strategia in base al dispositivo
   * Include metodi di fallback

2. **Rilevamento dispositivo** - `deviceUtils.ts`
   * Determina la versione Android
   * Seleziona la strategia ottimale
   * Gestisce disponibilità di react-native-fs

3. **Plugin nativi** - Cartella `plugins/`
   * Configurazione avanzata per Android
   * Configurazione avanzata per iOS
   * Gestione permessi specifici per piattaforma

4. **Componente UI** - `CameraRecorder.tsx`
   * Interfaccia utente ottimizzata
   * Gestione permessi e feedback
   * Integrazione con i servizi

## File implementati

1. **components/CameraRecorder.tsx**
   * Componente principale per la registrazione video
   * Interfaccia utente migliorata con stato di salvataggio

2. **utils/mediaServices.ts**
   * Servizio principale per il salvataggio media
   * Implementa strategia a tre livelli (RNFS → MediaLibrary → FileSystem)

3. **utils/deviceUtils.ts**
   * Rileva versione Android e iOS
   * Determina la strategia migliore in base al dispositivo

4. **plugins/withAndroidMediaStorage.js**
   * Plugin per configurare il manifest Android
   * Gestione permessi per Android 10+

5. **plugins/withIosMediaStorage.js**
   * Plugin per configurare Info.plist su iOS
   * Gestione messaggi di permesso personalizzati

6. **plugins/withMediaScannerModule.js**
   * Plugin per aggiungere un modulo MediaScanner nativo

7. **Script di installazione**
   * setup_dev_client.bat (Windows)
   * setup_dev_client.sh (macOS/Linux)

## Strategie di salvataggio

La soluzione implementa tre strategie di salvataggio in ordine di preferenza:

### 1. react-native-fs (Android)
* Salvataggio diretto nella cartella DCIM/Camera
* Notifica al sistema con scanFile
* Compatibilità massima con gallerie di terze parti

### 2. MediaLibrary (iOS + Android)
* Utilizzo di expo-media-library
* Creazione di album dedicato "MOCKED"
* Perfetto per iOS, buono per Android recenti

### 3. FileSystem (fallback)
* Copia in più directory potenziali
* Tentativi multipli per massima compatibilità
* Ultima risorsa se gli altri metodi falliscono

## Come testare

1. Esegui uno script di installazione:
   ```
   setup_dev_client.bat   # Windows
   ./setup_dev_client.sh  # macOS/Linux
   ```

2. Crea un development build:
   ```
   npx expo run:android  # Per Android
   npx expo run:ios      # Per iOS
   ```

3. Registra un video e verifica che appaia nella galleria

## Debug e risoluzione problemi

La soluzione include estesi log di debug. In caso di problemi, controlla il log della console per identificare quale strategia di salvataggio è fallita e perché.

### Controlli principali:

1. **Verifica permessi**
   * Fotocamera, microfono e accesso alla galleria devono essere concessi

2. **Verifica cartelle di destinazione**
   * DCIM/Camera
   * Pictures
   * Movies
   * Download

3. **Verifica qualità video**
   * Abbiamo configurato la qualità video a 480p per ridurre la dimensione dei file
   * Per file molto grandi, potrebbe essere necessario ridurre ulteriormente la qualità

## Compatibilità Android

La soluzione è stata progettata per essere compatibile con diverse versioni di Android:

### Android 9 e precedenti
* Metodo preferito: react-native-fs direttamente in DCIM/Camera
* Nessun permesso speciale necessario oltre a quelli di storage standard

### Android 10 (API 29)
* Configurazione `requestLegacyExternalStorage: true` necessaria
* Utilizzo di react-native-fs con permessi estesi
* Fallback a MediaLibrary se necessario

### Android 11+ (API 30+)
* Accesso diretto al filesystem limitato
* Utilizzo di MediaLibrary preferito
* Configurazione avanzata con il plugin withAndroidMediaStorage

## Compatibilità iOS

iOS ha restrizioni più rigide sull'accesso al filesystem:

* Metodo preferito: MediaLibrary
* Creazione automatica dell'album "MOCKED"
* Messaggi di richiesta permessi personalizzati

## Consigli per lo sviluppo futuro

1. **Ottimizzazione video**
   * Implementare compressione video prima del salvataggio
   * Ridurre la risoluzione per file più compatibili

2. **Miglioramenti UI**
   * Aggiungere barra di progresso durante il salvataggio
   * Pulsante per salvare/condividere dopo la registrazione

3. **Gestione video multipli**
   * Implementare una galleria interna nell'app
   * Migliorare la gestione della libreria di contenuti creati

## Conclusione

Questa soluzione rappresenta un approccio robusto e multipiattaforma al problema del salvataggio video nelle gallerie dei dispositivi. Utilizza un sistema a cascata che garantisce la massima compatibilità possibile mantenendo i vantaggi dell'ecosistema Expo.

Per qualsiasi problema o domanda sulla soluzione, consultare la documentazione completa o contattare il team di sviluppo.
