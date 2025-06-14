import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

export interface VideoEffectParams {
  inputPath: string;
  outputPath: string;
  effectType: string;
}

/**
 * Effetto Cinematic Zoom SEMPLIFICATO - Zoom progressivo senza info video
 */
export async function applyCinematicZoomSimple(params: VideoEffectParams): Promise<boolean> {
  try {
    const { inputPath, outputPath } = params;
    
    console.log('🎬 Starting Simple Progressive Zoom...');
    
    // Usa il filtro scale2ref per zoom progressivo senza bisogno di dimensioni
    // Zoom da 1x a 2.5x in modo progressivo
    const command = `-i "${inputPath}" -vf "scale=iw*2.5:ih*2.5,zoompan=z='min(zoom+0.0015,2.5)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=hd720" -c:a copy "${outputPath}"`;
    
    console.log('🎬 Executing command:', command);
    
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();
    
    if (ReturnCode.isSuccess(returnCode)) {
      console.log('✅ Zoom applied successfully!');
      const fileInfo = await FileSystem.getInfoAsync(outputPath);
      console.log('📁 Output file:', fileInfo);
      return true;
    } else {
      const logs = await session.getLogsAsString();
      console.error('❌ Zoom failed:', logs);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

/**
 * Applica l'effetto appropriato basato sul tipo
 */
export async function applyVideoEffect(params: VideoEffectParams): Promise<boolean> {
  const { effectType } = params;

  switch (effectType) {
    case 'cinematic-zoom':
      return applyCinematicZoomSimple(params);
    default:
      console.warn(`Effect type ${effectType} not implemented yet`);
      return false;
  }
}

/**
 * Genera percorso temporaneo per il video processato
 */
export function generateTempVideoPath(effectType: string): string {
  const timestamp = Date.now();
  return `${FileSystem.cacheDirectory}video_${effectType}_${timestamp}.mp4`;
}
