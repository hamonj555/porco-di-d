# Soluzione: Video non visibili nella galleria

Questo documento spiega come è stato risolto il problema dei video registrati che non appaiono nella galleria del dispositivo, nonostante venga mostrato il messaggio "Salvato con successo".

## Problema

I video registrati dall'app non venivano visualizzati nella galleria del dispositivo, anche se venivano salvati correttamente nel filesystem interno dell'app. Questo accadeva perché il file video non veniva salvato in una directory accessibile alla galleria del sistema.

## Soluzione Implementata

Invece di utilizzare `expo-media-library` (che richiedeva l'installazione di un pacchetto aggiuntivo e causava problemi di compatibilità), abbiamo implementato una soluzione che utilizza solo le librerie già presenti nel progetto:

1. **Utilizzo di expo-file-system**: Abbiamo sfruttato le funzionalità di copia file di `expo-file-system` per spostare il video in una directory accessibile alla galleria del dispositivo.

2. **Salvataggio in DCIM/Camera**: Abbiamo tentato di salvare il video nella directory standard DCIM/Camera, che è la posizione dove la maggior parte delle app fotocamera salvano i file su Android.

3. **Fallback su DocumentDirectory**: Se l'accesso a DCIM/Camera fallisce (per restrizioni di permessi su alcuni dispositivi), il video viene salvato nella directory Documents dell'app.

## Dettagli Tecnici

1. **Generazione di un nome file univoco**:
   ```javascript
   const timestamp = new Date().getTime();
   const newFilename = `mocked_video_${timestamp}.mp4`;
   ```

2. **Tentativo di accesso a DCIM/Camera**:
   ```javascript
   destinationUri = `${FileSystem.documentDirectory}../DCIM/Camera/${newFilename}`;
   await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}../DCIM/Camera`, { intermediates: true });
   ```

3. **Copia del file nella posizione finale**:
   ```javascript
   await FileSystem.copyAsync({
     from: uri,
     to: destinationUri
   });
   ```

## Limitazioni della Soluzione

1. **Compatibilità tra dispositivi**: L'accesso alla directory DCIM/Camera potrebbe non funzionare su tutti i dispositivi Android a causa delle restrizioni di sicurezza.

2. **Visibilità nella galleria**: Anche se il file viene salvato correttamente, potrebbe non apparire immediatamente nella galleria. L'utente potrebbe dover riavviare l'app della galleria.

3. **iOS**: Su iOS, questa soluzione potrebbe comportarsi diversamente a causa delle differenze nel sistema di file.

## Come Testare

1. Registra un video nell'app
2. Controlla se appare un messaggio di successo
3. Apri l'app della galleria del dispositivo per verificare se il video è visibile
4. Se il video non è visibile, riavvia l'app della galleria o usa un file manager per verificare la presenza del file in DCIM/Camera

## Miglioramenti Futuri

1. Utilizzo di API di scansione multimediale specifiche per Android per notificare il sistema della presenza di un nuovo file multimediale
2. Implementazione di una soluzione specifica per iOS che utilizzi l'API Photos
3. Aggiunta di un'opzione utente per abilitare/disabilitare il salvataggio automatico nella galleria