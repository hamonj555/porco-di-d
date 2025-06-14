import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MediaControlBar from '@/components/MediaControlBar';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { Video, ResizeMode, AVPlaybackStatus, VideoFullscreenUpdate } from 'expo-av';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { applyVideoEffect, generateTempVideoPath } from '@/utils/videoEffects';

interface VideoPlayerProps {
  onToggleFullscreen?: (isFullscreen: boolean) => void;
  activeEffects?: string[];
}

const { width, height } = Dimensions.get('window');

const VideoPlayer: React.FC<VideoPlayerProps> = ({ onToggleFullscreen, activeEffects = [] }) => {
  const { videoUri, originalVideoUri, isPlaying, setCurrentTime, setDuration, togglePlay, currentTime, volume, speed, setMediaLoaded, setVideoUri } = usePlayerStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenControls, setShowFullscreenControls] = useState(false);
  const [showMediaControls, setShowMediaControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isProcessingEffect, setIsProcessingEffect] = useState(false);
  const [processedEffects, setProcessedEffects] = useState<string[]>([]);
  const videoRef = useRef<Video>(null);

  // Screen Shake effect
  const shakeX = useSharedValue(0);
  const isScreenShakeActive = activeEffects.includes('screen-shake');

  // Fire Overlay effect
  const fireOpacity = useSharedValue(0);
  const fireScale = useSharedValue(0.8);
  const isFireOverlayActive = activeEffects.includes('fire-overlay');

  // Hero Zoom effect
  const heroZoom = useSharedValue(1);
  const isHeroZoomActive = activeEffects.includes('hero-zoom');

  // Explosion effect
  const explosionOpacity = useSharedValue(0);
  const explosionScale = useSharedValue(0.5);
  const isExplosionActive = activeEffects.includes('explosion');

  // Comic Pop-up effect
  const comicOpacity = useSharedValue(0);
  const comicScale = useSharedValue(0.3);
  const comicRotation = useSharedValue(0);
  const isComicPopupActive = activeEffects.includes('comic-popup');

  // Emoji Rain effect
  const emojiRainOpacity = useSharedValue(0);
  const emojiRainY = useSharedValue(-50);
  const isEmojiRainActive = activeEffects.includes('emoji-rain');

  // Cartoon Bounce effect
  const bounceScale = useSharedValue(1);
  const isCartoonBounceActive = activeEffects.includes('cartoon-bounce');

  // Speed Lines effect
  const speedLinesOpacity = useSharedValue(0);
  const speedLinesRotation = useSharedValue(0);
  const isSpeedLinesActive = activeEffects.includes('speed-lines');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: shakeX.value },
        { scale: heroZoom.value * bounceScale.value }
      ]
    };
  });

  const fireAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fireOpacity.value,
      transform: [{ scale: fireScale.value }]
    };
  });

  const explosionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: explosionOpacity.value,
      transform: [{ scale: explosionScale.value }]
    };
  });

  const comicAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: comicOpacity.value,
      transform: [
        { scale: comicScale.value },
        { rotate: `${comicRotation.value}deg` }
      ]
    };
  });

  const emojiRainAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: emojiRainOpacity.value,
      transform: [{ translateY: emojiRainY.value }]
    };
  });

  const speedLinesAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: speedLinesOpacity.value,
      transform: [{ rotate: `${speedLinesRotation.value}deg` }]
    };
  });

  // Trigger screen shake when effect is active
  useEffect(() => {
    if (isScreenShakeActive && isPlaying) {
      shakeX.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-5, { duration: 50 }),
          withTiming(5, { duration: 50 }),
          withTiming(0, { duration: 50 })
        ),
        -1,
        false
      );
    } else {
      shakeX.value = withTiming(0, { duration: 100 });
    }
  }, [isScreenShakeActive, isPlaying]);

  // Trigger fire overlay when effect is active
  useEffect(() => {
    if (isFireOverlayActive && isPlaying) {
      fireOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 200 }),
          withTiming(0.3, { duration: 150 }),
          withTiming(0.8, { duration: 180 }),
          withTiming(0.4, { duration: 120 })
        ),
        -1,
        false
      );
      fireScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 300 }),
          withTiming(0.9, { duration: 250 }),
          withTiming(1.05, { duration: 200 })
        ),
        -1,
        false
      );
    } else {
      fireOpacity.value = withTiming(0, { duration: 200 });
      fireScale.value = withTiming(0.8, { duration: 200 });
    }
  }, [isFireOverlayActive, isPlaying]);

  // Trigger hero zoom when effect is active
  useEffect(() => {
    if (isHeroZoomActive && isPlaying) {
      heroZoom.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1.0, { duration: 600 }),
          withTiming(1.4, { duration: 1000 }),
          withTiming(1.1, { duration: 700 })
        ),
        -1,
        false
      );
    } else {
      heroZoom.value = withTiming(1, { duration: 300 });
    }
  }, [isHeroZoomActive, isPlaying]);

  // Trigger explosion when effect is active
  useEffect(() => {
    if (isExplosionActive && isPlaying) {
      explosionOpacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 150 }),
          withTiming(0.1, { duration: 100 }),
          withTiming(0.8, { duration: 200 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      );
      explosionScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 150 }),
          withTiming(0.8, { duration: 100 }),
          withTiming(2.0, { duration: 200 }),
          withTiming(0.5, { duration: 300 })
        ),
        -1,
        false
      );
    } else {
      explosionOpacity.value = withTiming(0, { duration: 200 });
      explosionScale.value = withTiming(0.5, { duration: 200 });
    }
  }, [isExplosionActive, isPlaying]);

  // Trigger comic popup when effect is active
  useEffect(() => {
    if (isComicPopupActive && isPlaying) {
      comicOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.8, { duration: 200 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      );
      comicScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 300 }),
          withTiming(1.0, { duration: 200 }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        false
      );
      comicRotation.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 300 }),
          withTiming(-3, { duration: 200 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      comicOpacity.value = withTiming(0, { duration: 200 });
      comicScale.value = withTiming(0.3, { duration: 200 });
      comicRotation.value = withTiming(0, { duration: 200 });
    }
  }, [isComicPopupActive, isPlaying]);

  // Trigger emoji rain when effect is active
  useEffect(() => {
    if (isEmojiRainActive && isPlaying) {
      emojiRainOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(0.8, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
      emojiRainY.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(300, { duration: 1500 })
        ),
        -1,
        false
      );
    } else {
      emojiRainOpacity.value = withTiming(0, { duration: 200 });
      emojiRainY.value = withTiming(0, { duration: 200 });
    }
  }, [isEmojiRainActive, isPlaying]);

  // Trigger cartoon bounce when effect is active
  useEffect(() => {
    if (isCartoonBounceActive && isPlaying) {
      bounceScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 300 }),
          withTiming(0.9, { duration: 200 }),
          withTiming(1.1, { duration: 250 }),
          withTiming(0.95, { duration: 150 }),
          withTiming(1.0, { duration: 100 })
        ),
        -1,
        false
      );
    } else {
      bounceScale.value = withTiming(1, { duration: 300 });
    }
  }, [isCartoonBounceActive, isPlaying]);

  // Trigger speed lines when effect is active
  useEffect(() => {
    if (isSpeedLinesActive && isPlaying) {
      speedLinesOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 150 }),
          withTiming(0.4, { duration: 100 }),
          withTiming(0.9, { duration: 200 }),
          withTiming(0.3, { duration: 150 })
        ),
        -1,
        false
      );
      speedLinesRotation.value = withRepeat(
        withSequence(
          withTiming(360, { duration: 2000 })
        ),
        -1,
        false
      );
    } else {
      speedLinesOpacity.value = withTiming(0, { duration: 200 });
      speedLinesRotation.value = withTiming(0, { duration: 200 });
    }
  }, [isSpeedLinesActive, isPlaying]);

  // Funzione per applicare effetti ffmpeg (sempre al video originale)
  const applyFFmpegEffect = async (effectType: string) => {
    if (!originalVideoUri) {
      Alert.alert('Errore', 'Nessun video originale disponibile');
      return;
    }

    try {
      setIsProcessingEffect(true);
      
      const outputPath = generateTempVideoPath(effectType);
      const success = await applyVideoEffect({
        inputPath: originalVideoUri, // Usa sempre il video originale
        outputPath,
        effectType
      });

      if (success) {
        // Sostituisce il video corrente con quello processato
        setVideoUri(outputPath);
        // Aggiunge l'effetto alla lista dei processati
        setProcessedEffects(prev => [...prev, effectType]);
        Alert.alert('Successo', `Effetto ${effectType} applicato!`);
      } else {
        Alert.alert('Errore', 'Impossibile applicare l\'effetto');
      }
    } catch (error) {
      console.error('Error applying ffmpeg effect:', error);
      Alert.alert('Errore', 'Errore durante l\'elaborazione');
    } finally {
      setIsProcessingEffect(false);
    }
  };

  // Rileva quando vengono attivati effetti EPIC che usano ffmpeg
  useEffect(() => {
    const ffmpegEffects = ['explosion-behind', 'lightning-strike', 'hero-zoom'];
    const activeFFmpegEffects = activeEffects.filter(effect => ffmpegEffects.includes(effect));
    
    if (activeFFmpegEffects.length > 0 && !isProcessingEffect) {
      const effectToApply = activeFFmpegEffects[0];
      if (!processedEffects.includes(effectToApply)) {
        applyFFmpegEffect(effectToApply);
      }
    }
  }, [activeEffects, isProcessingEffect, processedEffects]);

  // Aggiorna mediaLoaded quando cambia videoUri
  useEffect(() => {
    if (videoUri) {
      // Il video è in fase di caricamento
      setIsLoading(true);
      setVideoError(false);
      // Resetta mediaLoaded fino a quando il video non è pronto
      setMediaLoaded(false);
      // Reset effetti processati solo quando cambia il video originale
      if (videoUri === originalVideoUri) {
        setProcessedEffects([]);
      }
    } else {
      // Nessun video caricato
      setMediaLoaded(false);
      setProcessedEffects([]);
    }
  }, [videoUri, originalVideoUri, setMediaLoaded]);

  // Questo effetto gestisce il riposizionamento all'inizio quando necessario
  useEffect(() => {
    const handlePositionUpdate = async () => {
      if (videoRef.current && currentTime === 0 && !isPlaying) {
        try {
          await videoRef.current.setPositionAsync(0);
        } catch (error) {
          console.error('Errore nel riposizionamento video:', error);
        }
      }
    };
    
    handlePositionUpdate();
  }, [currentTime, isPlaying]);

  // Gestisce il toggle dello schermo intero manualmente
  const toggleFullscreen = async () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        await videoRef.current.presentFullscreenPlayer();
        setIsFullscreen(true);
        setShowFullscreenControls(true);
        if (onToggleFullscreen) {
          onToggleFullscreen(true);
        }
      } else {
        // Non dovrebbe mai essere chiamato, poiché nella vista fullscreen
        // usiamo il pulsante di chiusura nativo
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync().catch(error => {
          console.error('Errore durante play:', error);
        });
      } else {
        videoRef.current.pauseAsync().catch(error => {
          console.error('Errore durante pause:', error);
        });
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      try {
        const volumeValue = volume / 100;
        videoRef.current.setVolumeAsync(volumeValue).catch(error => {
          console.error('Errore impostazione volume:', error);
        });
      } catch (error) {
        console.error('Errore generale volume:', error);
      }
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      try {
        const rateValue = speed / 100;
        videoRef.current.setRateAsync(rateValue, true).catch(error => {
          console.error('Errore impostazione velocità:', error);
        });
      } catch (error) {
        console.error('Errore generale velocità:', error);
      }
    }
  }, [speed]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 20);
      setCurrentTime(status.positionMillis / 1000);
      setIsLoading(false);
      setMediaLoaded(true); // Imposta il flag che il media è caricato
    }
  };

  const handleVideoError = (error: string) => {
    console.error('Errore video:', error);
    setVideoError(true);
    setIsLoading(false);
    setMediaLoaded(false); // Disabilita i controlli in caso di errore
  };

  // Gestisce il tocco sul video (play/pause)
  const handlePlayPause = () => {
    togglePlay();
  };

  // Toggle dei controlli media
  const toggleMediaControls = () => {
    setShowMediaControls(!showMediaControls);
  };

  if (!videoUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholderText}>Seleziona un video</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.videoThumbnail}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={isPlaying}
          isLooping
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={(error) => handleVideoError(error)}
          useNativeControls={false}
          onFullscreenUpdate={({ fullscreenUpdate }) => {
            if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_PRESENT) {
              setIsFullscreen(true);
              setShowFullscreenControls(true);
              if (onToggleFullscreen) {
                onToggleFullscreen(true);
              }
            } else if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS) {
              setIsFullscreen(false);
              setShowFullscreenControls(false);
              if (onToggleFullscreen) {
                onToggleFullscreen(false);
              }
            }
          }}
        />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {isProcessingEffect && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Applicando effetto...</Text>
          </View>
        )}

        {videoError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>Errore di caricamento video</Text>
          </View>
        )}

        {!isPlaying && !isLoading && !videoError && (
          <TouchableOpacity style={styles.playIconOverlay} onPress={handlePlayPause}>
            <Ionicons name="play" size={40} color="white" />
          </TouchableOpacity>
        )}

        {/* Fire Overlay Effect */}
        {isFireOverlayActive && (
          <Animated.View style={[styles.fireOverlay, fireAnimatedStyle]}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.fireEmoji}>🔥</Text>
          </Animated.View>
        )}

        {/* Explosion Effect */}
        {isExplosionActive && (
          <Animated.View style={[styles.explosionOverlay, explosionAnimatedStyle]}>
            <Text style={styles.explosionEmoji}>💥</Text>
          </Animated.View>
        )}

        {/* Comic Pop-up Effect */}
        {isComicPopupActive && (
          <Animated.View style={[styles.comicOverlay, comicAnimatedStyle]}>
            <View style={styles.comicBubble}>
              <Text style={styles.comicText}>POW!</Text>
            </View>
          </Animated.View>
        )}

        {/* Emoji Rain Effect */}
        {isEmojiRainActive && (
          <Animated.View style={[styles.emojiRainOverlay, emojiRainAnimatedStyle]}>
            <Text style={styles.rainEmoji}>😂</Text>
            <Text style={styles.rainEmoji}>🥰</Text>
            <Text style={styles.rainEmoji}>😍</Text>
            <Text style={styles.rainEmoji}>🤩</Text>
            <Text style={styles.rainEmoji}>😆</Text>
          </Animated.View>
        )}

        {/* Speed Lines Effect */}
        {isSpeedLinesActive && (
          <Animated.View style={[styles.speedLinesOverlay, speedLinesAnimatedStyle]}>
            <Text style={styles.speedLine}>⚡</Text>
            <Text style={styles.speedLine}>⚡</Text>
            <Text style={styles.speedLine}>⚡</Text>
            <Text style={styles.speedLine}>⚡</Text>
            <Text style={styles.speedLine}>⚡</Text>
            <Text style={styles.speedLine}>⚡</Text>
            <Text style={styles.speedLine}>⚡</Text>
            <Text style={styles.speedLine}>⚡</Text>
          </Animated.View>
        )}
      </View>

      <TouchableOpacity style={styles.maximizeButton} onPress={toggleFullscreen}>
        <Ionicons name="expand-outline" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
    position: 'relative',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#111111',
  },
  videoThumbnail: {
    width: 350,
    height: 197,
    backgroundColor: '#111111',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  placeholderText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  maximizeButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  mediaToggleButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  mediaControlsContainer: {
    position: 'absolute',
    top: 60,
    right: 15,
    zIndex: 19,
  },
  mediaControlBar: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 20,
  },
  fullscreenMediaControlBar: {
    position: 'relative',
    top: 0,
    left: 0,
    zIndex: 30,
  },
  fullscreenControlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 15,
    zIndex: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  processingText: {
    color: colors.text,
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fireOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    pointerEvents: 'none',
    zIndex: 15,
  },
  fireEmoji: {
    fontSize: 40,
    textShadowColor: '#FF6B35',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  explosionOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 15,
  },
  explosionEmoji: {
    fontSize: 100,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  comicOverlay: {
    position: 'absolute',
    top: 30,
    left: 30,
    pointerEvents: 'none',
    zIndex: 15,
  },
  comicBubble: {
    backgroundColor: '#FFFF00',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 6,
  },
  comicText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  emojiRainOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    pointerEvents: 'none',
    zIndex: 15,
  },
  rainEmoji: {
    fontSize: 40,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  speedLinesOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginTop: -100,
    marginLeft: -100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 15,
  },
  speedLine: {
    fontSize: 25,
    color: '#FFFF00',
    textShadowColor: '#FF6B35',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});

export default VideoPlayer;
