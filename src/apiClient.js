import { API_BASE_URL } from './config';

export async function pingServer() {
  try {
    console.log('🔄 Tentativo ping:', `${API_BASE_URL}/ping`);
    const response = await fetch(`${API_BASE_URL}/ping`);
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Ping response:', data);
    return data;
  } catch (error) {
    console.error('❌ Ping error:', error);
    throw error;
  }
}

export async function cinematicZoom(videoUrl, strength) {
  try {
    const response = await fetch(`${API_BASE_URL}/effects/cinematic-zoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_url: videoUrl,
        strength: strength
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cinematic zoom error:', error);
    throw error;
  }
}
