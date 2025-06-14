# MOCKED - Soluzione con Condivisione Video

Questa documentazione descrive la soluzione implementata per consentire agli utenti di salvare i video registrati nella galleria tramite il meccanismo di condivisione del sistema operativo.

## Panoramica

Invece di tentare di salvare direttamente i video nella galleria (che può essere problematico su Android a causa delle restrizioni dello Scoped Storage), questa soluzione utilizza le API di condivisione native del sistema operativo. Questo approccio è più robusto e funziona in modo coerente su tutte le versioni di Android e iOS.

## Come funziona

1. Dopo la registrazione di un video, l'utente vede una schermata di anteprima con due opzioni:
   - **Scarta**: elimina il video registrato
   - **Condividi**: apre il pannello di condivisione nativo del sistema operativo

2. Quando l'utente tocca "Condividi", vede le opzioni standard di condivisione del dispositivo, tra cui:
   - **Salva nella galleria/Salva video** (l'utente può selezionare questa opzione per salvare il video)
   - Condividi su WhatsApp, Instagram, ecc.
   - Altre app che possono gestire i file video

3. In caso di problemi con la condivisione, il sistema tenta comunque di salvare il video direttamente nella galleria come fallback.

## Vantaggi di questa soluzione

1. **Maggiore affidabilità**: Sfrutta le API di sistema ben collaudate invece di tentare l'accesso diretto allo storage.
2. **Opzioni aggiuntive**: Permette agli utenti di condividere direttamente i video su altre app senza passaggi intermedi.
3. **Compatibilità**: Funziona su tutte le versioni di Android, comprese quelle con Scoped Storage.
4. **Esperienza utente coerente**: Utilizza l'interfaccia di condivisione con cui gli utenti sono già familiari.

## Installazione

Per implementare questa soluzione, esegui lo script `setup_sharing_solution.bat`. Lo script:
1. Installa expo-sharing
2. Crea un backup del componente CameraRecorder esistente
3. Sostituisce il componente con la nuova versione basata sulla condivisione

## Ripristino

Se desideri tornare alla versione precedente, esegui:
```
copy /Y "components\CameraRecorder.tsx.backup" "components\CameraRecorder.tsx"
```

## Considerazioni per l'utente finale

Quando presenti questa funzionalità agli utenti, potresti voler spiegare che:

1. Per salvare un video nella galleria, devono toccare il pulsante "Condividi" e poi selezionare "Salva nella galleria/Salva video".
2. Questo approccio offre loro maggiore flessibilità, poiché possono anche condividere direttamente il video su altre app.

## Dettagli tecnici

La soluzione utilizza:
- **expo-sharing**: Per accedere alle API di condivisione native del dispositivo
- **expo-file-system**: Per la gestione dei file temporanei
- **expo-media-library**: Come metodo di fallback se la condivisione non è disponibile

I permessi necessari sono gli stessi della soluzione precedente, quindi non sono richieste modifiche al file app.json o ai plugin.

## Note di compatibilità

- Su iOS, funziona senza problemi su tutte le versioni supportate.
- Su Android, funziona su Android 10+ con Scoped Storage.
- Su alcuni dispositivi Android, il menu di condivisione potrebbe avere un aspetto leggermente diverso, ma la funzionalità rimane la stessa.
