import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Mappa degli audio disponibili nell'app
// Per ora usiamo placeholder, poi saranno sostituiti con file reali

export interface AudioAsset {
  name: string;
  path: string;
  category: 'SOUND FX' | 'SOUNDTRACK';
  duration?: number;
}

// Base path per audio locali
const LOCAL_AUDIO_PATH = '../assets/audio/';
// Placeholder per audio non ancora disponibili
const AUDIO_BASE_PATH = 'https://www.soundjay.com/misc/';

export const audioAssets: AudioAsset[] = [
  // Sound FX
  { name: 'Big Applause', path: AUDIO_BASE_PATH + 'applause-01.mp3', category: 'SOUND FX' },
  { name: 'Huge Laughter', path: AUDIO_BASE_PATH + 'laughter-01.mp3', category: 'SOUND FX' },
  { name: 'Sad Trombone', path: AUDIO_BASE_PATH + 'fail-trombone-01.mp3', category: 'SOUND FX' },
  { name: 'Cartoon Slip', path: AUDIO_BASE_PATH + 'cartoon-slip.mp3', category: 'SOUND FX' },
  { name: 'Digital Glitch', path: AUDIO_BASE_PATH + 'digital-glitch.mp3', category: 'SOUND FX' },
  { name: 'Explosion', path: AUDIO_BASE_PATH + 'explosion.mp3', category: 'SOUND FX' },
  { name: 'Dramatic Zoom', path: AUDIO_BASE_PATH + 'whoosh.mp3', category: 'SOUND FX' },
  { name: 'Burp', path: AUDIO_BASE_PATH + 'burp.mp3', category: 'SOUND FX' },
  { name: 'Fart', path: AUDIO_BASE_PATH + 'fart.mp3', category: 'SOUND FX' },
  { name: 'Siren', path: AUDIO_BASE_PATH + 'siren.mp3', category: 'SOUND FX' },
  { name: 'Door Open', path: AUDIO_BASE_PATH + 'door-open.mp3', category: 'SOUND FX' },
  { name: 'Glass Breaking', path: AUDIO_BASE_PATH + 'glass-break.mp3', category: 'SOUND FX' },
  { name: 'Pop Bubble', path: AUDIO_BASE_PATH + 'pop.mp3', category: 'SOUND FX' },
  { name: 'Whistle', path: AUDIO_BASE_PATH + 'whistle.mp3', category: 'SOUND FX' },
  { name: 'Slurp', path: AUDIO_BASE_PATH + 'slurp.mp3', category: 'SOUND FX' },
  { name: 'Swoosh', path: AUDIO_BASE_PATH + 'swoosh.mp3', category: 'SOUND FX' },
  { name: 'Boing', path: AUDIO_BASE_PATH + 'boing.mp3', category: 'SOUND FX' },
  { name: 'Drum Roll', path: AUDIO_BASE_PATH + 'drum-roll.mp3', category: 'SOUND FX' },
  { name: 'Fail Buzzer', path: AUDIO_BASE_PATH + 'buzzer.mp3', category: 'SOUND FX' },
  { name: 'Animal Scream', path: AUDIO_BASE_PATH + 'goat.mp3', category: 'SOUND FX' },
  { name: 'Record Scratch', path: AUDIO_BASE_PATH + 'record-scratch.mp3', category: 'SOUND FX' },
  { name: 'Horn Honk', path: AUDIO_BASE_PATH + 'horn.mp3', category: 'SOUND FX' },
  { name: 'Cartoon Blink', path: AUDIO_BASE_PATH + 'blink.mp3', category: 'SOUND FX' },
  { name: 'Magic Sparkle', path: AUDIO_BASE_PATH + 'sparkle.mp3', category: 'SOUND FX' },
  { name: 'Emoji Pop', path: AUDIO_BASE_PATH + 'pop-2.mp3', category: 'SOUND FX' },
  { name: 'Cough Sneeze', path: AUDIO_BASE_PATH + 'cough.mp3', category: 'SOUND FX' },
  { name: 'Scream', path: AUDIO_BASE_PATH + 'scream.mp3', category: 'SOUND FX' },
  { name: 'Punch', path: AUDIO_BASE_PATH + 'punch.mp3', category: 'SOUND FX' },
  { name: 'Evil Laugh', path: AUDIO_BASE_PATH + 'evil-laugh.mp3', category: 'SOUND FX' },
  { name: 'Fire Crackle', path: AUDIO_BASE_PATH + 'fire.mp3', category: 'SOUND FX' },
  { name: 'Bubble Burst', path: AUDIO_BASE_PATH + 'bubble-burst.mp3', category: 'SOUND FX' },
  { name: 'Phone Vibration', path: AUDIO_BASE_PATH + 'vibration.mp3', category: 'SOUND FX' },
  { name: 'Camera Click', path: AUDIO_BASE_PATH + 'camera.mp3', category: 'SOUND FX' },
  { name: 'Bell Ding', path: AUDIO_BASE_PATH + 'bell.mp3', category: 'SOUND FX' },
  { name: 'Crowd Boo', path: AUDIO_BASE_PATH + 'crowd-boo.mp3', category: 'SOUND FX' },
  
  // Soundtracks
  { name: 'Epic Cinematic', path: '../assets/audio/1.mp3', category: 'SOUNDTRACK' },
  { name: 'Horror Suspense', path: AUDIO_BASE_PATH + 'horror-suspense.mp3', category: 'SOUNDTRACK' },
  { name: 'Comedy Cartoon', path: AUDIO_BASE_PATH + 'comedy-cartoon.mp3', category: 'SOUNDTRACK' },
  { name: 'Trap Meme Beat', path: AUDIO_BASE_PATH + 'trap-beat.mp3', category: 'SOUNDTRACK' },
  { name: 'Drama Reality', path: AUDIO_BASE_PATH + 'drama-reality.mp3', category: 'SOUNDTRACK' },
  { name: 'Synthwave Retro', path: AUDIO_BASE_PATH + 'synthwave.mp3', category: 'SOUNDTRACK' },
  { name: 'Pop Happy', path: AUDIO_BASE_PATH + 'pop-happy.mp3', category: 'SOUNDTRACK' },
  { name: 'Jazz Comedy', path: AUDIO_BASE_PATH + 'jazz-comedy.mp3', category: 'SOUNDTRACK' },
  { name: 'Chill Lo-fi', path: AUDIO_BASE_PATH + 'lofi.mp3', category: 'SOUNDTRACK' },
  { name: 'Action Movie', path: AUDIO_BASE_PATH + 'action.mp3', category: 'SOUNDTRACK' },
  { name: 'Techno Matrix', path: AUDIO_BASE_PATH + 'techno.mp3', category: 'SOUNDTRACK' },
  { name: 'Kids Fun Loop', path: AUDIO_BASE_PATH + 'kids-fun.mp3', category: 'SOUNDTRACK' },
  { name: 'Victory Anthem', path: AUDIO_BASE_PATH + 'victory.mp3', category: 'SOUNDTRACK' },
  { name: 'Cringe Anthem', path: AUDIO_BASE_PATH + 'cringe.mp3', category: 'SOUNDTRACK' },
  { name: 'News Satire', path: AUDIO_BASE_PATH + 'news.mp3', category: 'SOUNDTRACK' },
];

// Funzione per copiare asset locale nel file system
const ensureLocalCopy = async (
  moduleAsset: number,
  filename: string
): Promise<string> => {
  // 1. Converti l'asset Expo
  const asset = Asset.fromModule(moduleAsset);
  await asset.downloadAsync();
  
  // 2. Percorso definitivo: documentDirectory/audio/
  const dir = FileSystem.documentDirectory + 'audio/';
  const dest = dir + filename;
  
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  
  // 3. Copia se non esiste già
  const fileInfo = await FileSystem.getInfoAsync(dest);
  if (!fileInfo.exists) {
    await FileSystem.copyAsync({ from: asset.localUri!, to: dest });
  }
  
  return dest;
};

// Funzione helper per ottenere il path di un audio dal nome
export const getAudioPath = async (name: string): Promise<any> => {
  const audio = audioAssets.find(a => a.name === name);
  if (!audio) return null;
  
  // Per Epic Cinematic, usa la copia locale
  if (name === 'Epic Cinematic') {
    try {
      const localUri = await ensureLocalCopy(require('../assets/audio/1.mp3'), '1.mp3');
      return { uri: localUri };
    } catch (error) {
      console.error('Errore copia locale:', error);
      return null;
    }
  }
  
  // Per URL esterni, restituisci come oggetto URI
  return { uri: audio.path };
};

// Funzione per ottenere audio per categoria
export const getAudioByCategory = (category: 'SOUND FX' | 'SOUNDTRACK'): AudioAsset[] => {
  return audioAssets.filter(a => a.category === category);
};
