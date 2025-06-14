# Dipendenze del Progetto MOCKED

Questo documento elenca tutte le dipendenze necessarie per il corretto funzionamento dell'app MOCKED.

## Dipendenze Principali

Per installare tutte le dipendenze principali, eseguire:

```bash
npm install
```

## Dipendenze Specifiche

Alcune funzionalità richiedono pacchetti specifici che potrebbero non essere inclusi nell'installazione predefinita:

### Condivisione dei Media

La funzionalità di condivisione richiede il pacchetto expo-sharing:

```bash
npx expo install expo-sharing
```

### Accesso alla Libreria Media

Per accedere alla galleria di foto e video:

```bash
npx expo install expo-media-library
npx expo install expo-image-picker
```

### Registrazione Audio/Video

Per registrare audio e video:

```bash
npx expo install expo-camera
npx expo install expo-av
```

### Salvataggio File

Per il salvataggio locale dei file:

```bash
npx expo install expo-file-system
```

## Procedura di installazione completa

Se stai configurando il progetto per la prima volta, segui questi passaggi:

1. Clona il repository
2. Esegui `npm install` per installare le dipendenze base
3. Esegui questi comandi per installare le dipendenze specifiche:

```bash
npx expo install expo-sharing expo-media-library expo-image-picker expo-camera expo-av expo-file-system
```

4. Avvia l'app con `npx expo start`

## Risoluzione dei problemi

Se riscontri errori relativi a moduli mancanti, assicurati di aver installato tutte le dipendenze elencate sopra.

Per errori specifici:

- **"Unable to resolve module 'expo-sharing'"**: Esegui `npx expo install expo-sharing`
- **"Unable to resolve module 'expo-media-library'"**: Esegui `npx expo install expo-media-library`
- **"Unable to resolve module 'expo-image-picker'"**: Esegui `npx expo install expo-image-picker`

In caso di problemi persistenti, prova a:

1. Cancellare la cartella node_modules: `rm -rf node_modules`
2. Cancellare la cache npm: `npm cache clean --force`
3. Reinstallare tutte le dipendenze: `npm install`
4. Reinstallare le dipendenze specifiche come elencato sopra
