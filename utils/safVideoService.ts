import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

/**
 * Service per gestire i video con Storage Access Framework (SAF) su Android
 * Permette di salvare i video nella galleria con maggior controllo
 */
export const SafVideoService = {
  /**
   * Verifica se SAF è supportato sul dispositivo corrente
   * @returns true se SAF è supportato (Android 10+)
   */
  isSAFSupported: async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return false;
    }
    
    // SAF è disponibile da Android 10 (API 29) in poi
    return Platform.Version >= 29;
  },
  
  /**
   * Salva un video utilizzando SAF (Storage Access Framework)
   * Questo metodo è disponibile su Android 10+ e permette di selezionare 
   * la posizione di salvataggio
   * 
   * @param uri URI del video da salvare
   * @returns Promise<boolean> true se il salvataggio ha avuto successo
   */
  saveVideoWithSAF: async (uri: string): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      console.warn('SAF è supportato solo su Android');
      return false;
    }
    
    if (Platform.Version < 29) {
      console.warn('SAF richiede Android 10 o superiore');
      return false;
    }
    
    try {
      // Questo è solo un placeholder per la logica SAF
      // In un'implementazione reale, qui ci sarebbe il codice per
      // invocare l'intent di salvataggio SAF
      
      // Per ora, come fallback, utilizziamo il metodo tradizionale
      const asset = await MediaLibrary.createAssetAsync(uri);
      return asset !== null;
    } catch (error) {
      console.error('Errore nel salvataggio con SAF:', error);
      return false;
    }
  }
};

/**
 * Salva un media nella galleria
 * @param uri URI del media da salvare
 * @param type tipo di media ('video', 'image', 'audio')
 * @returns URI del media salvato o null in caso di errore
 */
export const saveMediaToGallery = async (
  uri: string, 
  type: 'video' | 'image' | 'audio'
): Promise<string | null> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      console.warn('Permesso di accesso alla libreria negato');
      return null;
    }
    
    const asset = await MediaLibrary.createAssetAsync(uri);
    return asset.uri;
  } catch (error) {
    console.error(`Errore nel salvataggio del ${type} nella galleria:`, error);
    return null;
  }
};
