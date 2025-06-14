import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';

/**
 * Verifica se la condivisione è disponibile sul dispositivo
 * @returns Promise<boolean>
 */
export const isShareAvailable = async (): Promise<boolean> => {
  return await Sharing.isAvailableAsync();
};

/**
 * Condivide un file tramite l'intent di condivisione del sistema
 * @param uri URI del file da condividere
 * @param options Opzioni di condivisione
 * @returns Promise<void>
 */
export const shareFile = async (
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
  }
};

/**
 * Condivide un contenuto testuale
 * @param content Testo da condividere
 * @param title Titolo per la condivisione
 * @returns Promise<void>
 */
export const shareText = async (content: string, title?: string): Promise<void> => {
  try {
    // Crea un file temporaneo con il contenuto
    const fileUri = `${FileSystem.cacheDirectory}temp_share_text.txt`;
    await FileSystem.writeAsStringAsync(fileUri, content);
    
    // Condividi il file
    await shareFile(fileUri, {
      mimeType: 'text/plain',
      dialogTitle: title || 'Condividi testo'
    });
    
    // Pulisci il file temporaneo
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  } catch (error) {
    console.error('Error sharing text:', error);
  }
};

/**
 * Condivide un contenuto sui social media
 * @param uri URI del contenuto da condividere
 * @param socialType Tipo di social (instagram, facebook, twitter, ecc.)
 * @returns Promise<boolean> true se il contenuto è stato condiviso con successo
 */
export const shareToSocial = async (
  uri: string,
  socialType: 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'general'
): Promise<boolean> => {
  try {
    // Per ora usiamo la condivisione generica
    await shareFile(uri);
    return true;
  } catch (error) {
    console.error(`Error sharing to ${socialType}:`, error);
    return false;
  }
};

/**
 * Salva un media nel dispositivo
 * @param uri URI del media da salvare
 * @param type Tipo di media ('VIDEO', 'AUDIO', 'IMAGE', 'MEME')
 * @returns Promise<boolean> true se il salvataggio è avvenuto con successo
 */
export const saveMedia = async (uri: string, type: string): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      console.warn('Permesso di accesso alla libreria negato');
      return false;
    }
    
    const asset = await MediaLibrary.createAssetAsync(uri);
    return asset !== null;
  } catch (error) {
    console.error(`Errore nel salvataggio del media:`, error);
    return false;
  }
};

/**
 * Salva e condivide un media
 * @param uri URI del media da salvare e condividere
 * @param type Tipo di media ('VIDEO', 'AUDIO', 'MEME', etc.)
 */
export const saveAndShareMedia = async (uri: string, type: string): Promise<void> => {
  try {
    let localUri = uri;
    
    // Se è un URI di development (HTTP), dobbiamo scaricarlo
    if (uri.startsWith('http://192.168') || uri.startsWith('http://localhost')) {
      const timestamp = Date.now();
      const extension = type.toLowerCase() === 'video' ? 'mp4' : 
                       type.toLowerCase() === 'audio' ? 'mp3' : 'jpg';
      localUri = `${FileSystem.documentDirectory}shared_${timestamp}.${extension}`;
      
      // Scarica il file dall'URL di development
      const downloadResult = await FileSystem.downloadAsync(uri, localUri);
      localUri = downloadResult.uri;
    }
    // Se è un URL remoto, lo scarichiamo
    else if (uri.startsWith('http://') || uri.startsWith('https://')) {
      const timestamp = Date.now();
      const extension = type.toLowerCase() === 'video' ? 'mp4' : 
                       type.toLowerCase() === 'audio' ? 'mp3' : 'jpg';
      localUri = `${FileSystem.documentDirectory}shared_${timestamp}.${extension}`;
      
      const downloadResult = await FileSystem.downloadAsync(uri, localUri);
      localUri = downloadResult.uri;
    }
    
    await shareFile(localUri, {
      mimeType: type.toLowerCase() === 'video' ? 'video/mp4' : 
                type.toLowerCase() === 'audio' ? 'audio/mp3' : 
                'image/jpeg',
      dialogTitle: `Condividi ${type}`
    });
  } catch (error) {
    console.error(`Errore nel salvataggio e condivisione del media:`, error);
    throw error;
  }
};
