import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export async function saveMediaToGallery(uri: string): Promise<string | null> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') throw new Error('Permessi negati');

    const asset = await MediaLibrary.createAssetAsync(uri);

    if (isCacheFile(uri)) {
      setTimeout(async () => {
        try {
          await FileSystem.deleteAsync(uri, { idempotent: true });
          const info = await FileSystem.getInfoAsync(uri);
          if (!info.exists) {
            console.log('✅ Cache cancellata:', uri);
          } else {
            console.warn('❌ Cache NON cancellata:', uri);
          }
        } catch (e) {
          console.warn('Errore cancellazione cache:', e);
        }
      }, 500); // mezzo secondo di ritardo
    }

    return asset.uri;
  } catch (err) {
    console.error('Errore salvataggio MediaLibrary:', err);
    return null;
  }
}

function isCacheFile(uri: string): boolean {
  return (
    (FileSystem.cacheDirectory && uri.startsWith(FileSystem.cacheDirectory)) ||
    uri.includes('/cache/') ||
    uri.includes('/tmp/')
  );
}
