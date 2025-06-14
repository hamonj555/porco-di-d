import React, { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { usePlayerStore } from '@/store/player-store';

const AudioPreviewPlayer = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const { previewAudioUri, isPreviewPlaying, setPreviewPlaying } = usePlayerStore();

  useEffect(() => {
    const setupAudio = async () => {
      if (previewAudioUri && isPreviewPlaying) {
        try {
          // Configura audio mode
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });

          // Carica e riproduci
          const { sound } = await Audio.Sound.createAsync(
            { uri: previewAudioUri! },
            { shouldPlay: true, isLooping: false }
          );
          
          soundRef.current = sound;

          // Listener per quando finisce
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPreviewPlaying(false);
            }
          });

        } catch (error) {
          console.error('Errore preview audio:', error);
          setPreviewPlaying(false);
        }
      }
    };

    setupAudio();

    // Cleanup
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [previewAudioUri, isPreviewPlaying]);

  // Stop preview quando cambia URI o si ferma
  useEffect(() => {
    if (!isPreviewPlaying && soundRef.current) {
      soundRef.current.stopAsync();
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, [isPreviewPlaying]);

  return null;
};

export default AudioPreviewPlayer;
