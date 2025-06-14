import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { Audio, AVPlaybackStatus } from 'expo-av';

interface AudioPlayerProps {
  style?: any;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ style }) => {
  const { audioUri, isPlaying, setCurrentTime, setDuration, togglePlay, volume, speed } = usePlayerStore();
  const [loaded, setLoaded] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri || '' },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );

        if (isMounted) {
          soundRef.current = sound;
          setLoaded(true);
        }
      } catch (error) {
        console.error('Errore nel caricamento audio:', error);
      }
    };

    if (audioUri) {
      loadAudio();
    }

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [audioUri]);

  useEffect(() => {
    if (soundRef.current && loaded) {
      if (isPlaying) {
        soundRef.current.playAsync();
      } else {
        soundRef.current.pauseAsync();
      }
    }
  }, [isPlaying, loaded]);

  useEffect(() => {
    if (soundRef.current && loaded) {
      const volumeValue = volume / 100;
      soundRef.current.setVolumeAsync(volumeValue);
    }
  }, [volume, loaded]);

  useEffect(() => {
    if (soundRef.current && loaded) {
      const rateValue = speed / 100;
      soundRef.current.setRateAsync(rateValue, true);
    }
  }, [speed, loaded]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 30);
      setCurrentTime(status.positionMillis / 1000);
    }
  };

  const handlePlayPause = () => {
    togglePlay();
  };

  if (!audioUri) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.placeholderText}>Seleziona un audio</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.waveformContainer}>
        {Array.from({ length: 30 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: Math.random() * 30 + 10,
                backgroundColor: isPlaying ? colors.primary : '#666666',
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.playButtonOverlay}
        onPress={handlePlayPause}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={40}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
    position: 'relative',
  },
  placeholderText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: '80%',
    justifyContent: 'space-between',
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#666666',
  },
  playButtonOverlay: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaControlBar: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 20,
  },
});

export default AudioPlayer;