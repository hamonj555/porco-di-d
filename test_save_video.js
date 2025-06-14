/**
 * Script di test per verificare il corretto funzionamento del salvataggio video nella galleria
 * Questo script può essere eseguito direttamente nell'app per testare la funzionalità
 * senza dover registrare un nuovo video.
 *
 * Come utilizzarlo:
 * 1. Importa questa funzione in un componente temporaneo di test
 * 2. Chiamala con un URI di video esistente nell'app
 * 3. Verifica che il video appaia nella galleria
 */

import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';

/**
 * Testa il salvataggio di un video nella galleria
 * @param {string} sourceUri URI del video da salvare (es. un video già registrato)
 */
export async function testSaveVideoToGallery(sourceUri) {
  try {
    // Verifica che il file esista
    const fileInfo = await FileSystem.getInfoAsync(sourceUri);
    if (!fileInfo.exists) {
      Alert.alert("Errore", "File video non trovato.");
      return;
    }

    // Genera un nome file univoco
    const timestamp = new Date().getTime();
    const newFilename = `mocked_video_test_${timestamp}.mp4`;
    
    // Crea un percorso nella directory DCIM/Camera
    let destinationUri;
    try {
      destinationUri = `${FileSystem.documentDirectory}../DCIM/Camera/${newFilename}`;
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}../DCIM/Camera`, { 
        intermediates: true 
      });
    } catch (error) {
      console.log('Non è possibile accedere a DCIM, uso Documents:', error);
      destinationUri = `${FileSystem.documentDirectory}${newFilename}`;
    }
    
    // Copia il file
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri
    });
    
    // Notifica il sistema Android (solo Android)
    if (Platform.OS === 'android') {
      // In un'app reale, qui ci sarebbe un codice nativo che chiama MediaScannerConnection.scanFile
      console.log(`MediaScanner: Richiesta scansione per ${destinationUri}`);
    }
    
    console.log('Test completato: Video salvato con successo in:', destinationUri);
    Alert.alert(
      'Test completato',
      `Video salvato con successo in: ${destinationUri}\n\nSe non appare nella galleria, riavvia l'app della galleria.`
    );
    
    return destinationUri;
  } catch (error) {
    console.error('Errore nel test di salvataggio video:', error);
    Alert.alert("Errore", "Si è verificato un errore durante il test.");
    return null;
  }
}

/**
 * Funzione principale per eseguire un test completo
 * @param {string} existingVideoUri URI opzionale di un video esistente
 */
export async function runVideoSaveTest(existingVideoUri = null) {
  // Se non viene fornito un URI, usa un URI esempio (che non funzionerà)
  const testUri = existingVideoUri || 'file:///data/user/0/com.mocked.app/cache/Camera/example.mp4';
  
  Alert.alert(
    "Test salvataggio video",
    "Vuoi eseguire un test di salvataggio video nella galleria?",
    [
      {
        text: "Annulla",
        style: "cancel"
      },
      { 
        text: "Esegui test", 
        onPress: () => testSaveVideoToGallery(testUri)
      }
    ]
  );
}

// Esporta le funzioni per l'uso in altri componenti
export default { testSaveVideoToGallery, runVideoSaveTest };