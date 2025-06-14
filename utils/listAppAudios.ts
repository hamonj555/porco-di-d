import * as FileSystem from 'expo-file-system';

export async function listAppAudios(): Promise<string[]> {
  const audioDir = FileSystem.documentDirectory + 'audio/';
  
  try {
    // Assicurati che la directory esista
    await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
    
    // Leggi i file nella directory
    const files = await FileSystem.readDirectoryAsync(audioDir);
    
    // Filtra solo i file audio (opzionale)
    const audioFiles = files.filter(file => 
      file.endsWith('.mp3') || 
      file.endsWith('.m4a') || 
      file.endsWith('.aac') || 
      file.endsWith('.wav')
    );
    
    // Restituisci i percorsi completi
    return audioFiles.map(file => audioDir + file);
  } catch (error) {
    console.error('Errore nella lettura della directory audio:', error);
    return [];
  }
}