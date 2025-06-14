import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

export interface MediaModifications {
  volume?: number; // 0-200 (percentuale)
  speed?: number;  // 25-200 (percentuale)
}

/**
 * Applica modifiche permanenti a un file audio/video usando FFmpeg
 */
export const applyMediaModifications = async (
  inputUri: string,
  modifications: MediaModifications,
  mediaType: 'AUDIO' | 'VIDEO'
): Promise<string> => {
  try {
    // Genera nome file output
    const timestamp = Date.now();
    const extension = inputUri.split('.').pop() || (mediaType === 'AUDIO' ? 'mp3' : 'mp4');
    const outputPath = `${FileSystem.documentDirectory}mocked_${mediaType.toLowerCase()}_modified_${timestamp}.${extension}`;

    // Costruisci comando ffmpeg base
    let command = `-i "${inputUri}"`;
    
    // Filtri audio
    const audioFilters: string[] = [];
    
    // Modifica volume (solo se diverso da 100%)
    if (modifications.volume && modifications.volume !== 100) {
      const volumeMultiplier = modifications.volume / 100;
      audioFilters.push(`volume=${volumeMultiplier}`);
    }
    
    // Modifica velocità audio con gestione limitazioni atempo
    if (modifications.speed && modifications.speed !== 100) {
      const speedMultiplier = modifications.speed / 100;
      
      // atempo ha limitazioni: [0.5 - 100]
      // Per valori fuori range, concatenare più filtri atempo
      if (speedMultiplier < 0.5) {
        // Per velocità molto lente, usa più filtri in catena
        // Esempio: 0.25 = 0.5 * 0.5
        let currentMultiplier = speedMultiplier;
        while (currentMultiplier < 0.5) {
          audioFilters.push('atempo=0.5');
          currentMultiplier = currentMultiplier / 0.5;
        }
        if (currentMultiplier !== 1.0) {
          audioFilters.push(`atempo=${currentMultiplier}`);
        }
      } else if (speedMultiplier > 2.0) {
        // Per velocità molto veloci, usa più filtri in catena
        // Esempio: 4.0 = 2.0 * 2.0
        let currentMultiplier = speedMultiplier;
        while (currentMultiplier > 2.0) {
          audioFilters.push('atempo=2.0');
          currentMultiplier = currentMultiplier / 2.0;
        }
        if (currentMultiplier !== 1.0) {
          audioFilters.push(`atempo=${currentMultiplier}`);
        }
      } else {
        // Valore nel range normale
        audioFilters.push(`atempo=${speedMultiplier}`);
      }
    }
    
    // Aggiungi filtri audio se presenti
    if (audioFilters.length > 0) {
      command += ` -af "${audioFilters.join(',')}"`;
    }
    
    // Per video, aggiungi anche filtro velocità video
    if (mediaType === 'VIDEO' && modifications.speed && modifications.speed !== 100) {
      const speedMultiplier = modifications.speed / 100;
      command += ` -vf "setpts=PTS/${speedMultiplier}"`;
    }
    
    // Parametri di output minimali per massima compatibilità
    if (mediaType === 'VIDEO') {
      // Non specificare codec video, lascia che ffmpeg scelga automaticamente
      command += ` -c:a aac`;
    } else {
      command += ` -f mp3`;
    }
    
    command += ` -y "${outputPath}"`;
    
    console.log('🎬 Comando FFmpeg:', command);
    
    // Esegui comando
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();
    
    if (ReturnCode.isSuccess(returnCode)) {
      console.log('✅ FFmpeg successo');
      
      // Verifica che il file sia stato creato
      const fileInfo = await FileSystem.getInfoAsync(outputPath);
      if (fileInfo.exists) {
        return outputPath;
      } else {
        throw new Error('File output non creato');
      }
    } else {
      const logs = await session.getAllLogs();
      const errorLogs = logs.map(log => log.getMessage()).join('\n');
      console.error('❌ FFmpeg fallito:', errorLogs);
      throw new Error(`Elaborazione fallita: ${errorLogs}`);
    }
    
  } catch (error) {
    console.error('🚨 Errore in applyMediaModifications:', error);
    throw error;
  }
};

/**
 * Verifica se un file è un audio o video
 */
export const detectMediaType = (uri: string): 'AUDIO' | 'VIDEO' => {
  const extension = uri.split('.').pop()?.toLowerCase();
  const audioExtensions = ['mp3', 'wav', 'm4a', 'aac', 'ogg'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv'];
  
  if (audioExtensions.includes(extension || '')) {
    return 'AUDIO';
  } else if (videoExtensions.includes(extension || '')) {
    return 'VIDEO';
  } else {
    // Default basato su modalità (fallback)
    return 'VIDEO';
  }
};
