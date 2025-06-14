# Implementazione della Fotocamera in MOCKED App

## Requisiti

Prima di utilizzare la funzionalità di registrazione video, è necessario installare i seguenti pacchetti:

```
npx expo install expo-camera expo-file-system
```

In alternativa, puoi eseguire il file `install_packages.bat` incluso nel progetto.

## Funzionalità

L'implementazione della fotocamera consente di:

- Registrare video direttamente dall'app (massimo 20 secondi)
- Scegliere tra fotocamera anteriore e posteriore
- Controllare il tempo rimanente durante la registrazione
- Interrompere la registrazione manualmente o automaticamente al termine del tempo

## Come funziona

1. Quando l'utente preme il tasto di registrazione in modalità VIDEO, viene aperta la schermata della fotocamera
2. L'utente può registrare un video toccando il tasto centrale
3. È possibile cambiare la fotocamera con il pulsante in basso a destra
4. Quando la registrazione è completata, il video viene automaticamente aggiunto al player
5. L'utente può applicare effetti al video registrato

## Struttura del codice

- `CameraRecorder.tsx`: Gestisce l'interfaccia della fotocamera e la registrazione
- `PlayerContainer.tsx`: Alterna tra la visualizzazione della fotocamera e del player normale
- `RecordButton.tsx`: Gestisce il pulsante di registrazione centrale
- `player-store.ts`: Include la logica per gestire lo stato della fotocamera

## Permessi necessari

Nel file `app.json` sono stati aggiunti i permessi necessari per:
- Fotocamera
- Microfono
- Lettura e scrittura dei file nel dispositivo

Questi permessi verranno richiesti all'utente al primo utilizzo della funzionalità.