import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

export interface VideoEffectParams {
  inputPath: string;
  outputPath: string;
  effectType: string;
}

/**
 * Ottieni info sul video (width, height, fps)
 */
async function getVideoInfo(inputPath: string) {
  // Attenzione: alcuni build Android non stampano su stdout, ma in logs. Quindi si parseggia tutto!
  const probeCmd = `-v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 "${inputPath}"`;
  const session = await FFmpegKit.execute(probeCmd);
  const logs = await session.getAllLogs();
  const out = logs.map(l => l.getMessage()).join('\n');
  // esempio out: 1920,1080,30/1
  const match = out.match(/(\d+),(\d+),(\d+)\/?(\d*)/);
  if (!match) throw new Error("Video info parse error");
  const width = parseInt(match[1]);
  const height = parseInt(match[2]);
  const fps = match[4] ? Math.round(parseInt(match[3]) / parseInt(match[4])) : parseInt(match[3]);
  return { width, height, fps };
}

/**
 * Effetto Cinematic Zoom - Zoom progressivo dal frame iniziale al volto
 */
export async function applyCinematicZoom(params: VideoEffectParams): Promise<boolean> {
  try {
    const { inputPath, outputPath } = params;

    // 1. Rileva risoluzione reale, fps e durata
    const { width: W, height: H, fps: FPS } = await getVideoInfo(inputPath);
    
    // Ottieni durata del video
    const durationCmd = `-v error -show_entries format=duration -of csv=p=0 "${inputPath}"`;
    const durationSession = await FFmpegKit.execute(durationCmd);
    const durationLogs = await durationSession.getAllLogs();
    const durationOut = durationLogs.map(l => l.getMessage()).join('\n');
    const duration = parseFloat(durationOut.match(/\d+\.?\d*/)?.[0] || '5');

    // 2. Parametri zoom progressivo
    const Z = 2.5;          // Zoom finale (2.5x = da figura intera a primo piano)
    const totalFrames = Math.floor(FPS * duration);

    console.log(`🎬 Video Info - Width: ${W}, Height: ${H}, FPS: ${FPS}, Duration: ${duration}s`);
    console.log(`🎬 Progressive Zoom: da 1x a ${Z}x in ${duration}s (${totalFrames} frame)`);

    // 3. Filtro zoompan progressivo: zoom lineare dall'inizio alla fine
    // Formula: z='1+(${Z}-1)*on/${totalFrames}'
    const command =
      `-i "${inputPath}" -vf "zoompan=z='min(1+(${Z}-1)*on/${totalFrames}\\,${Z})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS}" -c:a copy "${outputPath}"`;

    console.log('🎬 Executing Progressive Zoom command:', command);

    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();
    const logs = await session.getLogsAsString();

    console.log('🎬 FFmpeg logs:', logs);

    if (ReturnCode.isSuccess(returnCode)) {
      console.log('✅ Progressive Zoom applied successfully');
      console.log('✅ Output file:', outputPath);

      // Verifica che il file sia stato creato
      const fileInfo = await FileSystem.getInfoAsync(outputPath);
      console.log('📁 Output file info:', fileInfo);

      return true;
    } else {
      console.error('❌ Progressive Zoom failed with return code:', returnCode);
      return false;
    }
  } catch (error) {
    console.error('❌ Error applying Progressive Zoom:', error);
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
      return applyCinematicZoom(params);
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
