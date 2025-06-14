# MOCKED: Soluzione Avanzata per il Salvataggio Video

Questa documentazione descrive la soluzione ottimizzata per il problema del salvataggio dei video nella galleria del dispositivo per l'app MOCKED.

## Panoramica della Soluzione

La soluzione utilizza un approccio ibrido che combina:

1. **Plugins Expo personalizzati** per configurare i permessi e le impostazioni native
2. **Servizio MediaSaveService** per la gestione centralizzata del salvataggio con strategie multiple
3. **UI migliorata** con feedback visivo durante il salvataggio
4. **Qualità video ottimizzata** per massimizzare la compatibilità

Questo approccio risolve il problema mantenendo i vantaggi dell'ecosistema Expo e minimizzando la necessità di codice nativo diretto.

## Componenti della Soluzione

### 1. Plugin Expo Personalizzato

Il plugin `withMediaLibraryPermissions` configura automaticamente:

- Permessi Android estesi per l'accesso allo storage
- Attributo `requestLegacyExternalStorage` per Android 10
- Messaggi di richiesta permessi personalizzati per iOS
- Configurazioni necessarie nei file di manifest nativi

### 2. Servizio MediaSaveService

Un servizio TypeScript che implementa:

- Strategia a cascata per il salvataggio (MediaLibrary → FileSystem)
- Gestione automatica degli errori con fallback
- Tentativo di salvataggio in diverse directory del dispositivo
- Feedback dettagliato sul processo di salvataggio

### 3. CameraRecorder Migliorato

Il componente UI ora include:

- Schermata di anteprima dopo la registrazione
- Indicatore di caricamento durante il salvataggio
- Pulsanti chiari per salvare o scartare il video
- Feedback migliorato sullo stato dell'operazione

## Come Funziona

1. **Registrazione del Video**:
   - L'utente registra un video con qualità 480p per massimizzare la compatibilità
   - Al termine della registrazione appare la schermata di anteprima

2. **Salvataggio del Video**:
   - L'utente tocca il pulsante "Salva"
   - Il servizio MediaSaveService tenta prima di salvare con MediaLibrary
   - Se fallisce, tenta di copiare il file in varie directory del dispositivo
   - L'utente riceve feedback sul risultato dell'operazione

3. **Integrazione nello Store**:
   - Il video viene automaticamente caricato nel player centrale
   - L'app passa alla modalità VIDEO
   - Il video è pronto per l'applicazione di effetti

## Istruzioni di Installazione

1. Esegui lo script `setup_advanced_solution.bat` per configurare il progetto.

2. Crea un development build con uno dei seguenti comandi:
   ```
   npx expo run:android    # Per Android
   npx expo run:ios        # Per iOS
   ```

3. Per testare con il development client:
   ```
   npx expo start --dev-client
   ```

## Considerazioni su Android

### Android 9 e precedenti
- Funzionamento ottimale con salvataggio diretto MediaLibrary

### Android 10 (API 29)
- Utilizza la configurazione `requestLegacyExternalStorage: true`
- La combinazione di MediaLibrary e FileSystem garantisce compatibilità

### Android 11+ (API 30+)
- Utilizzo esclusivo di MediaLibrary con creazione dell'album MOCKED
- Aggiornamento dell'URI per mantenere l'accesso al file salvato

## Considerazioni su iOS

- Utilizzo esclusivo di MediaLibrary
- Creazione automatica dell'album MOCKED
- Richiesta e gestione dei permessi ottimizzata

## Risoluzione Problemi

Se il video non appare nella galleria:

1. **Verifica Permessi**:
   - Assicurati che tutti i permessi siano stati concessi
   - Ricontrolla le impostazioni dell'app nel dispositivo

2. **Riavvia la Galleria**:
   - Alcuni dispositivi richiedono il riavvio dell'app della galleria
   - In rari casi, potrebbe essere necessario riavviare il dispositivo

3. **Verifica la Dimensione**:
   - File molto grandi potrebbero richiedere più tempo per apparire
   - La qualità 480p dovrebbe garantire file di dimensioni gestibili

4. **Controlla i Log**:
   - Il servizio MediaSaveService fornisce log dettagliati per il debug
   - Controlla quali strategie di salvataggio sono state tentate

## Conclusione

Questa soluzione offre un approccio robusto al problema del salvataggio video nelle gallerie dei dispositivi mobili, mantenendo i vantaggi dell'ecosistema Expo e garantendo la massima compatibilità possibile su diverse versioni di Android e iOS.

---

*Nota: Per qualsiasi problema durante l'implementazione, consulta il team di sviluppo o verifica i log dettagliati generati dal servizio MediaSaveService.*