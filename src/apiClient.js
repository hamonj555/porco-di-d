import { API_BASE_URL, RUNPOD_API_KEY } from './config';
import * as FileSystem from 'expo-file-system';

// RunPod API helper function
async function callRunPodEffect(effectType, mediaUri, params = {}) {
  try {
    console.log('🎬 Calling RunPod effect:', effectType);
    
    // Convert media to base64
    const mediaData = await FileSystem.readAsStringAsync(mediaUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    const response = await fetch(`${API_BASE_URL}/runsync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNPOD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          effect_type: effectType,
          media_data: mediaData,
          params: params
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ RunPod response:', data);
    
    if (data.output?.success) {
      // Decode base64 result to file
      const outputPath = `${FileSystem.documentDirectory}result_${Date.now()}.mp4`;
      await FileSystem.writeAsStringAsync(outputPath, data.output.result, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      return outputPath;
    } else {
      throw new Error(data.output?.error || 'Processing failed');
    }
    
  } catch (error) {
    console.error('❌ RunPod effect error:', error);
    throw error;
  }
}

export async function pingServer() {
  try {
    console.log('🔄 Testing RunPod endpoint...');
    
    // Test with meme_fusion effect (simple test)
    const testData = "dGVzdA=="; // "test" in base64
    
    const response = await fetch(`${API_BASE_URL}/runsync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNPOD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          effect_type: 'meme_fusion',
          media_data: testData,
          params: {}
        }
      })
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ RunPod test response:', data);
    return { status: 'ok', message: 'RunPod endpoint working' };
  } catch (error) {
    console.error('❌ RunPod test error:', error);
    throw error;
  }
}

export async function cinematicZoom(videoUri, strength = 1.2) {
  return await callRunPodEffect('cinematic_zoom', videoUri, { zoom: strength });
}

export async function glitchTransition(videoUri, intensity = 0.5) {
  return await callRunPodEffect('glitch_transition', videoUri, { intensity });
}

export async function vhsEffect(videoUri) {
  return await callRunPodEffect('vhs_effect', videoUri, {});
}

export async function memeFusion(mediaUri) {
  return await callRunPodEffect('meme_fusion', mediaUri, {});
}

// AI Effects - placeholder implementations
export async function voiceCloning(audioUri) {
  return await callRunPodEffect('voice_cloning', audioUri, {});
}

export async function cartoonVoice(audioUri) {
  return await callRunPodEffect('cartoon_voice', audioUri, {});
}

export async function genderSwap(audioUri) {
  return await callRunPodEffect('gender_swap', audioUri, {});
}

export async function ageChanger(audioUri, targetAge = 'adult') {
  return await callRunPodEffect('age_changer', audioUri, { target_age: targetAge });
}

export async function vocalIsolation(audioUri) {
  return await callRunPodEffect('vocal_isolation', audioUri, {});
}

export async function autoTune(audioUri) {
  return await callRunPodEffect('autotune', audioUri, {});
}

export async function faceSwap(videoUri) {
  return await callRunPodEffect('face_swap', videoUri, {});
}

export async function beautyFilter(videoUri) {
  return await callRunPodEffect('beauty_filter', videoUri, {});
}

export async function captionMeme(videoUri) {
  return await callRunPodEffect('caption_meme', videoUri, {});
}

export async function lipSync(videoUri) {
  return await callRunPodEffect('lip_sync', videoUri, {});
}

export async function faceReenact(videoUri) {
  return await callRunPodEffect('face_reenact', videoUri, {});
}

export async function styleTransfer(videoUri, style = 'cartoon') {
  return await callRunPodEffect('style_transfer', videoUri, { style });
}

export async function backgroundRemove(videoUri) {
  return await callRunPodEffect('bg_remove', videoUri, {});
}

export async function skyReplace(videoUri) {
  return await callRunPodEffect('sky_replace', videoUri, {});
}
