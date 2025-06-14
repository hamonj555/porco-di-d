import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export async function importAudioFile() {
  try {
    // Apre il DocumentPicker per selezionare un file audio
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*'
    });
    
    // Controlla se l'utente ha annullato la selezione
    if (result.canceled) {
      console.log('Selezione file annullata');
      return null;
    }
    
    // Ottieni le informazioni sul file dal primo asset selezionato
    const selectedFile = result.assets[0];
    const originalUri = selectedFile.uri;
    const name = selectedFile.name || 'audio.m4a';
    
    // Crea la directory audio se non esiste
    const targetDir = FileSystem.documentDirectory + 'audio/';
    await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
    
    // Genera un nome file univoco
    const fileName = 'imported_' + Date.now() + '_' + name;
    const destUri = targetDir + fileName;
    
    // Copia il file nella directory dell'app
    await FileSystem.copyAsync({ from: originalUri, to: destUri });
    console.log(`File audio importato in: ${destUri}`);
    
    return destUri;
  } catch (error) {
    console.error('Errore nell\'importazione del file audio:', error);
    return null;
  }
}