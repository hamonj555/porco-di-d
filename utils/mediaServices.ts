import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

/**
 * Service per il salvataggio dei media nella libreria del dispositivo
 */
export const MediaSaveService = {
  /**
   * Salva un file multimediale nella galleria del dispositivo
   * @param uri URI del file da salvare
   * @returns Promise con l'asset salvato
   */
  saveToLibrary: async (uri: string): Promise<MediaLibrary.Asset | null> => {
    try {
      // Richiedi permessi
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return null;
      }
      
      // Salva il file
      const asset = await MediaLibrary.createAssetAsync(uri);
      return asset;
    } catch (error) {
      console.error('Error saving media to library:', error);
      return null;
    }
  },
  
  /**
   * Salva un media alla galleria e restituisce un risultato strutturato
   * @param uri URI del media da salvare
   * @param type 'video' o 'audio' o 'image'
   * @returns Oggetto con risultato dell'operazione
   */
  saveMediaToGallery: async (uri: string, type: 'video' | 'audio' | 'image') => {
    try {
      // Richiedi permessi
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        return {
          success: false,
          message: 'Permission to access media library was denied',
          uri
        };
      }
      
      // Salva il file
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      return {
        success: true,
        message: `${type} salvato nella galleria`,
        uri: asset.uri,
        asset
      };
    } catch (error) {
      console.error(`Error saving ${type} to gallery:`, error);
      return {
        success: false,
        message: `Errore nel salvataggio del ${type}: ${error}`,
        uri
      };
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

/**
 * Service per la condivisione dei media
 */
export const MediaShareService = {
  /**
   * Condivide un file multimediale
   * @param uri URI del file da condividere
   * @returns Promise<void>
   */
  shareMedia: async (uri: string): Promise<void> => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        console.error('Sharing is not available on this device');
        return;
      }
      
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing media:', error);
    }
  }
};

/**
 * Utility per gestire le operazioni con i media
 */
export const mediaUtils = {
  /**
   * Ottiene l'estensione da un URI
   * @param uri URI del file
   * @returns Estensione del file
   */
  getExtension: (uri: string): string => {
    return uri.split('.').pop()?.toLowerCase() || '';
  },
  
  /**
   * Verifica se un URI è un audio
   * @param uri URI da verificare
   * @returns true se è un audio
   */
  isAudio: (uri: string): boolean => {
    const ext = uri.split('.').pop()?.toLowerCase() || '';
    return ['mp3', 'wav', 'm4a', 'aac'].includes(ext);
  },
  
  /**
   * Verifica se un URI è un video
   * @param uri URI da verificare
   * @returns true se è un video
   */
  isVideo: (uri: string): boolean => {
    const ext = uri.split('.').pop()?.toLowerCase() || '';
    return ['mp4', 'mov', 'avi', 'webm'].includes(ext);
  }
};
