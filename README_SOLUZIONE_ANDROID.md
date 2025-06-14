# MOCKED - Soluzione per Salvataggio Video su Android 11+

Questa documentazione descrive la soluzione implementata per il salvataggio di video nella galleria su dispositivi Android con versione 11 o superiore, che utilizzano "Scoped Storage".

## Il problema

Android 11+ ha introdotto restrizioni significative sull'accesso diretto al filesystem tramite lo "Scoped Storage", rendendo impossibile il salvataggio diretto di file nella cartella DCIM/Camera utilizzando i metodi tradizionali.

## La soluzione implementata

La soluzione adotta un approccio multi-livello, specifico per Android:

1. **Plugin Android personalizzato**
   - Configurazione avanzata per il manifest Android
   - Aggiunta di intent-filter specifici per i file media
   - Configurazione completa dei permessi necessari

2. **Utility Android dedicata**
   - Un servizio specializzato che utilizza tre diverse strategie in cascata:
     1. MediaLibrary API (metodo principale)
     2. Intent Android per visualizzare/salvare il video
     3. Tentativi di copia diretta in multiple directory di sistema

3. **Interfaccia utente migliorata**
   - Tre pulsanti distinti per azioni chiare:
     - "Scarta" - elimina il video
     - "Salva" - tenta di salvare nella galleria
     - "Condividi" - apre il video con un'app esterna

## Componenti modificati

- **app.json**: Aggiunta del plugin personalizzato
- **plugins/withAndroidMediaIntent.js**: Plugin per configurare intents Android
- **utils/androidMediaUtils.ts**: Utility specifiche per Android
- **components/CameraRecorder.tsx**: UI migliorata e logica di salvataggio

## Come funziona il salvataggio

1. **Prima strategia**: L'app tenta di utilizzare `MediaLibrary.createAssetAsync` (funziona in molti casi)
2. **Seconda strategia**: Se la prima fallisce, l'app tenta di aprire il file con un intent Android, permettendo di visualizzarlo e salvarlo tramite un'app esterna
3. **Terza strategia**: Come ultima risorsa, l'app tenta di copiare direttamente il file in varie directory accessibili del sistema

## Build e installazione

Per testare questa soluzione:

1. Esegui lo script `build_android.bat`
2. Lo script configurerà e costruirà l'app per Android
3. Installerà l'app sul dispositivo connesso

Nota: È necessario un build completo perché abbiamo aggiunto plugin che modificano il manifest nativo di Android.

## Limitazioni

- La soluzione funziona meglio su dispositivi fisici rispetto agli emulatori
- La terza strategia (copia diretta) ha una bassa probabilità di successo su Android 11+, ma è inclusa come ultima risorsa
- Il salvataggio tramite app esterna (seconda strategia) richiede un'azione manuale da parte dell'utente

## Risultati attesi

Quando l'utente registra un video e preme "Salva", l'app tenterà di salvarlo nella galleria usando multiple strategie. Se tutte falliscono, offrirà la possibilità di aprire il video con un'app esterna che potrebbe avere i permessi necessari per salvarlo nella galleria.

Quando l'utente preme "Condividi", l'app aprirà il video con un'app esterna per la visualizzazione o condivisione.

## Troubleshooting

Se il salvataggio continua a fallire:
1. Verifica che l'app abbia tutti i permessi necessari nelle impostazioni del dispositivo
2. Prova a utilizzare l'opzione "Condividi" e poi a salvare il video dall'app esterna
3. Assicurati che il dispositivo abbia spazio di archiviazione sufficiente
