import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

/**
 * Modulo di condivisione per semplificare l'uso di expo-sharing
 */
export const SharingModule = {
  /**
   * Verifica se la condivisione è disponibile sul dispositivo
   * @returns Promise<boolean>
   */
  isAvailable: async (): Promise<boolean> => {
    return await Sharing.isAvailableAsync();
  },

  /**
   * Condivide un file tramite l'intent di condivisione del sistema
   * @param uri URI del file da condividere
   * @param options Opzioni di condivisione
   * @returns Promise<void>
   */
  shareFile: async (
    uri: string, 
    options?: { 
      mimeType?: string; 
      dialogTitle?: string;
      UTI?: string; // Solo per iOS
    }
  ): Promise<void> => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        console.error('Sharing is not available on this device');
        return;
      }
      
      await Sharing.shareAsync(uri, {
        mimeType: options?.mimeType,
        dialogTitle: options?.dialogTitle,
        UTI: options?.UTI
      });
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  },

  /**
   * Condivide un contenuto sui social media
   * @param uri URI del contenuto da condividere
   * @param mimeType MIME type del contenuto
   * @returns Promise<void>
   */
  shareMedia: async (uri: string, mimeType: string): Promise<void> => {
    try {
      await Sharing.shareAsync(uri, { mimeType });
    } catch (error) {
      console.error('Error sharing media:', error);
      throw error;
    }
  }
};

/**
 * Altri moduli Expo di utilità
 */
export const ExpoModules = {
  Sharing: SharingModule,
  
  // Potrebbe essere esteso con altri moduli in futuro
  FileSystem: {
    delete: FileSystem.deleteAsync,
    exists: async (uri: string): Promise<boolean> => {
      const info = await FileSystem.getInfoAsync(uri);
      return info.exists;
    }
  }
};
